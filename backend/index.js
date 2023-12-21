const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const apiError = require('./Utils/apiError');
const errorStoreMiddleware = require('./Middlewares/errorStoreMiddleware');
const { default: mongoose } = require('mongoose');
const authRouter = require('./Routes/authenticationRoute');
const dotenv = require('dotenv').config()
const bodyParser = require('body-parser');
const chatRouter = require('./Routes/chatRoute');
const messageRouter = require('./Routes/messageRoute');
const userModel = require('./Models/userModel');
const colors = require('colors');
const messageModel = require('./Models/messageModel');
const notificationRouter = require('./Routes/notificationRoute');
const notificationModel = require('./Models/notificationModel');
const chatModel = require('./Models/chatModel');

const app = express();

// mongoDB connection
mongoose.connect(process.env.DB_URI).then((db) => {
  console.log('\x1b[36m%s\x1b[0m', `${"-".repeat(68)}\nDB Connection Successful: ${db.connection.host}\n${"-".repeat(68)}`)
})

// cors
app.use(cors())
// app.options('*', cors())

// requests logger
app.use(morgan("dev"))

app.use(express.json({limit: "10mb"}))

// Mount Routes
app.use("/api/v1/users", authRouter)
app.use("/api/v1/chats", chatRouter)
app.use("/api/v1/messages", messageRouter)
app.use("/api/v1/notifications", notificationRouter)

// not found routes
app.use("*", (req, res, next) => {
  next(new apiError(`there is no such route for ${req.originalUrl}`, 404))
})

// error store
app.use(errorStoreMiddleware)

const port = process.env.PORT || 5000
const server = app.listen(port, () => {
  console.log('\x1b[33m%s\x1b[0m', `App listening on port: ${port}`)
  console.log('\x1b[35m%s\x1b[0m', `Mode: ${process.env.ENVIRONMENT ? process.env.ENVIRONMENT : "Not Specified"}`)
})

// Unhandled Rejection Error
process.on("unhandledRejection", (err) => {
  console.error('\x1b[41m%s\x1b[0m', `Unhandled Rejection Error --> ${err.name} : ${err.message}`)
  server.close(() => { 
      console.error('\x1b[35m%s\x1b[0m', "Shutting down App ...")
      process.exit(1)
  })
})

// socket.io

const connectedUsers = new Map()

const connectedUsersFullData = new Map()

let connectedRoomUsers = []
let currentRoomId = ""

const io = require('socket.io')(server, {
  cors: {
    origin: "*"
  }
})
io.on("connection", async (socket) => {
  const userId = socket.handshake.query.userId 
  const name = socket.handshake.query.name
  const email = socket.handshake.query.email
  const profilePic = socket.handshake.query.profilePic

  const userFullData = {_id: userId, name, email, profilePic}

  connectedUsers.set(userId, socket.id) 

  connectedUsersFullData.set(userId, {_id: userId, name, email, profilePic})

  io.emit('new-online-user', userFullData)

  io.emit("online-users", getOnlineUsers())

  try {

    const beforeUpdatedDocuments = await messageModel.find({ 
      receiver: {$in: [userId]},
      seenStatus: "stored",
    })

    if (beforeUpdatedDocuments.length) { 
      const messagesBelongingChats = [...new Set(beforeUpdatedDocuments.map(item => item.belongingChat.toString()))]

      const documents = await messageModel.updateMany(
      {
        receiver: {$in: userId},
        seenStatus: "stored"
      },
      {
        seenStatus: "delivered"
      },
      {
        new: true
      }
      )
  

      messagesBelongingChats.forEach(async (belongingChatId) => { 
        const allChatMessages = await messageModel.find({belongingChat: belongingChatId}) 
        .populate("sender", "-password") 
        .sort({ createdAt: 1 }) 

        const chatDocument = await chatModel.findById(belongingChatId)
        .populate("users", "-password")
        .populate({
          path: "latestMessage",
          populate: {
            path: "sender",
            select: "-password"
          }
        })
    
        socket.to(belongingChatId).emit("realtime-seen-messages", allChatMessages, chatDocument.isGroupChat )

            socket.to(connectedUsers.get(chatDocument.latestMessage.sender._id.toString())).emit("realtime-chat-data-latest-message-and-counter", chatDocument)
            
      })

    }

  } catch (error) {
    console.log(colors.bgRed(error))
  }


  socket.on("join-chat-room", async (roomId, isGroupChat, latestMessage) => {
    if (socket.data.currentRoom) { 
      socket.leave(socket.data.currentRoom); 
      console.log(`user ${userId} leaved room ${socket.data.currentRoom}`.bgMagenta)

      if (connectedRoomUsers.length) {
        connectedRoomUsers = getOnlineUsersInRoom(socket.data.currentRoom)
        const connectedRoomUsersFullData = getOnlineUsersFullData(connectedRoomUsers)
        io.to(socket.data.currentRoom).emit("room-online-users", connectedRoomUsersFullData)
      }

    }

    socket.join(roomId)

    // previous room
    socket.data.currentRoom = roomId;

    // current room
    currentRoomId = roomId 

    

    if (isGroupChat) {
      connectedRoomUsers = getOnlineUsersInRoom(roomId)

      const connectedRoomUsersFullData = getOnlineUsersFullData(connectedRoomUsers)
      
      io.to(roomId).emit("room-online-users", connectedRoomUsersFullData)
    }


    socket.on("wait", async () => { 
      if (!isGroupChat) {

        try {
          const documents = await messageModel.updateMany( 
            {
            belongingChat: roomId,
            sender: {$ne: userId}, 
            seenStatus: {$ne: "seen"}
          },
          {
            seenStatus: "seen" 
          },
          {
            new: true
          }
          )
  
        if (documents.modifiedCount > 0) {
          const allChatMessages = await messageModel.find({belongingChat: roomId})
        .populate("sender", "-password") 
        .sort({ createdAt: 1 })

          socket.to(roomId).emit("realtime-seen-messages", allChatMessages, isGroupChat) 

          const chatDocument = await chatModel.findById(roomId)
          .populate("users", "-password")
          .populate({
            path: "latestMessage",
            populate: {
              path: "sender",
              select: "-password"
            }
          })

          // update latest message and new messages counter in frontend
            socket.to(connectedUsers.get(chatDocument.latestMessage.sender._id.toString())).emit("realtime-chat-data-latest-message-and-counter", chatDocument) 
            
        }

        // new messages Counter
        const latestMessageDocument = await messageModel.findById(latestMessage)

        if (latestMessageDocument.sender.toString() !== userId) {

          const chatDocument = await chatModel.findByIdAndUpdate(
            roomId, 
            {
              newMessagesCounter: []
            }, {new: true}
          )
          .populate("users", "-password")
          .populate({
            path: "latestMessage",
            populate: {
              path: "sender",
              select: "-password"
            }
          })

          io.to(connectedUsers.get(userId)).emit("realtime-chat-data-latest-message-and-counter", chatDocument)

        }

        } catch (error) {
          console.log(colors.bgRed(error))
        }

      } else if (isGroupChat) {

        try {
          const documents = await messageModel.updateMany(
            {
            belongingChat: roomId,
            sender: {$ne: userId}, 
            "seenBy._id": {$nin: [userId]}, 
          },
          {
            seenStatus: "seen",
            $push: {seenBy: userFullData}
          },
          {
            new: true
          }
          )


        if (documents.modifiedCount > 0) {
          const allChatMessages = await messageModel.find({belongingChat: roomId})
        .populate("sender", "-password")
        .sort({ createdAt: 1 })

          socket.to(roomId).emit("realtime-seen-messages", allChatMessages, isGroupChat) 

          // update latest message and new messages counter in frontend
          const newChatDocument = await chatModel.findById(roomId)
          .populate("users", "-password")
          .populate({
            path: "latestMessage",
            populate: {
              path: "sender",
              select: "-password"
            }
          })

          const groupUsersSocketsIds = newChatDocument.users.map(item => {
            const socketId = connectedUsers.get(item._id.toString())
            return socketId
          })

          io.to(groupUsersSocketsIds).emit("realtime-chat-data-latest-message-and-counter", newChatDocument)

        }

        // new messages Counter

        const chatDocument = await chatModel.findByIdAndUpdate(
          roomId, 
          {
            $pull: {"newMessagesCounter.$[].receiver": userId} 
          },
          {new: true}
        )
        .populate("users", "-password")
        .populate({
          path: "latestMessage",
          populate: {
            path: "sender",
            select: "-password"
          }
        })

        io.to(connectedUsers.get(userId)).emit("realtime-chat-data-latest-message-and-counter", chatDocument)

        await chatModel.findOneAndUpdate(
          {
            _id: roomId,
            "newMessagesCounter.receiver": {$size: 0}
          }, 
          {
            $pull: {newMessagesCounter: {receiver: {$size: 0}}} 
          },
          {new: true}
        )

        } catch (error) {
          console.log(colors.bgRed(error))
        }

      }
    })

  })

  socket.on("new-message", async (message, room, toUser, isGroupChat) => {

    const currentUsers = Array.from(connectedUsers.keys()) 
    const currentRoomUsers = getOnlineUsersInRoom(room)

    if (!isGroupChat) { 

      if (!currentUsers.includes(toUser._id)) {
        console.log(`${toUser.name} offline`.bgMagenta)

        // message
        io.to(room).emit("received-new-message", message)

        // update latest message in db
        // update new messages counter in db -- new messages Counter
        // update latest message and new messages counter in frontend
        try {

          const newChatDocument = await chatModel.findByIdAndUpdate(
            room, 
            {
              latestMessage: message,
              $push: {newMessagesCounter: message}
            }, {new: true}
          )
          .populate("users", "-password")
          .populate({
            path: "latestMessage",
            populate: {
              path: "sender",
              select: "-password"
            }
          })

          // update latest message and new messages counter in frontend
            io.to(connectedUsers.get(userId)).emit("realtime-chat-data-latest-message-and-counter", newChatDocument)
            

        } catch (error) {
          console.log(colors.bgRed(error))
        }

        // notification
        // store notification in db
        try {
          
          await notificationModel.create({
            notificationType: "new-message",
            messageContent: message.message,
            fromUser: userId,
            toUser: toUser._id,
            belongingChat: room,
          })

        } catch (error) {
          console.log(colors.bgRed(error))
        }

      } else
  
      if (currentRoomUsers.includes(toUser._id)) {
        console.log(`${toUser.name} online and in room`.bgGreen)

        // message
        try {
          const document = await messageModel.findByIdAndUpdate(
            message._id,
            {
              seenStatus: "seen"
            },
            {
              new: true,
            }
          )
          .populate("sender", "-password")

          io.to(room).emit("received-new-message", document)

          // update latest message in db
          // update latest message and new messages counter in frontend
          try {

            const newChatDocument = await chatModel.findByIdAndUpdate(
              room, 
              {
                latestMessage: document // update latest message
              }, {new: true}
            )
            .populate("users", "-password")
            .populate({
              path: "latestMessage",
              populate: {
                path: "sender",
                select: "-password"
              }
            })

            // update latest message and new messages counter in frontend
            io.to(room).emit("realtime-chat-data-latest-message-and-counter", newChatDocument)
            
          } catch (error) {
            console.log(colors.bgRed(error))
          }

        } catch (error) {
          console.log(colors.bgRed(error))
        }
        

        // notification
        // nothing

      } else
      
      if (currentUsers.includes(toUser._id) && !currentRoomUsers.includes(toUser._id)) { 
        console.log(`${toUser.name} online but not in room`.bgYellow)

        // message
        try {
          const document = await messageModel.findByIdAndUpdate(
            message._id,
            {
              seenStatus: "delivered"
            },
            {
              new: true,
            }
          )
          .populate("sender", "-password")

          io.to(room).emit("received-new-message", document)

          // update latest message in db
          // update new messages counter in db -- new messages Counter
          // update latest message and new messages counter in frontend
          try {

            const newChatDocument = await chatModel.findByIdAndUpdate(
              room, 
              {
                latestMessage: document, // update latest message
                $push: {newMessagesCounter: message} // update new messages counter
              }, {new: true}
            )
            .populate("users", "-password")
            .populate({
              path: "latestMessage",
              populate: {
                path: "sender",
                select: "-password"
              }
            })


            // update latest message and new messages counter in frontend
            io.to(connectedUsers.get(userId)).to(connectedUsers.get(toUser._id)).emit("realtime-chat-data-latest-message-and-counter", newChatDocument)
            
          } catch (error) {
            console.log(colors.bgRed(error))
          }

        } catch (error) {
          console.log(colors.bgRed(error))
        }

        // notification
        // store in db and send notification across socket
        try {
          
          const document = await notificationModel.create({
            notificationType: "new-message",
            messageContent: message.message,
            fromUser: userId,
            toUser: toUser._id,
            belongingChat: room,
          })
          
          const populatedDocument = await notificationModel.findById(document._id)
            .populate("fromUser", "-password")
          .populate("belongingChat")
          .populate("fromUser", "-password")

          socket.to(connectedUsers.get(toUser._id)).emit("message-notification", populatedDocument)

        } catch (error) {
          console.log(colors.bgRed(error))
        }
      }

    } else if (isGroupChat) { 

      const otherFriends = toUser.filter(user => user._id !== message.sender._id)
      let offlineUsers = [] 
      let onlineUsers = [] 
      let activeUsers = [] 

      otherFriends.forEach(async (user) => { 
        if (!currentUsers.includes(user._id)) {
          console.log(`${user.name} offline`.bgMagenta)

          offlineUsers.push(user)

          // notification
          // store notification in db
          try {
          
            await notificationModel.create({ 
              notificationType: "new-message",
              messageContent: message.message,
              fromUser: userId,
              toUser: user._id,
              belongingChat: room,
            })
            
          } catch (error) {
            console.log(colors.bgRed(error))
          }

        }

        if (currentRoomUsers.includes(user._id)) {
          console.log(`${user.name} online and in room`.bgGreen)

          activeUsers.push(user)
        }
        
        if (currentUsers.includes(user._id) && !currentRoomUsers.includes(user._id)) {
          console.log(`${user.name} online but not in room`.bgYellow)

          onlineUsers.push(user)

          try {
          
            const document = await notificationModel.create({
              notificationType: "new-message",
              messageContent: message.message,
              fromUser: userId,
              toUser: user._id,
              belongingChat: room,
            })

            const populatedDocument = await notificationModel.findById(document._id)
            .populate("fromUser", "-password")
          .populate("belongingChat")
  
            socket.to(connectedUsers.get(user._id)).emit("message-notification", populatedDocument)
            
          } catch (error) {
            console.log(colors.bgRed(error))
          }
        }

      })

      // all users offline
      if (offlineUsers.length === otherFriends.length) {

      // message
      io.to(room).emit("received-new-message", message)

      // update latest message in db
      // update new messages counter in db -- new messages Counter
      // update latest message and new messages counter in frontend
      try {
        const newChatDocument = await chatModel.findByIdAndUpdate(
          room, 
          {
            latestMessage: message,
            $push: {newMessagesCounter: message}
          }, {new: true}
        ) 
        .populate("users", "-password")
        .populate({
          path: "latestMessage",
          populate: {
            path: "sender",
            select: "-password"
          }
        })

        // update latest message and new messages counter in frontend
            io.to(connectedUsers.get(userId)).emit("realtime-chat-data-latest-message-and-counter", newChatDocument) 
        
      } catch (error) {
        console.log(colors.bgRed(error))
      }


      //----------------------------------------------------------------------------------------------------------

      // some offline or some online or some active
      } else if (offlineUsers.length){
        
        try {
          
          // message

          let document
          if (activeUsers.length) {
            document = await messageModel.findByIdAndUpdate(
              message._id,
              {
                seenStatus: "seen",
                seenBy: activeUsers
              },
              {
                new: true,
              }
              )
              .populate("sender", "-password")

          } else {
            document = await messageModel.findByIdAndUpdate(
              message._id,
              {
                seenStatus: "delivered",
              },
              {
                new: true,
              }
              )
              .populate("sender", "-password")

          }
            
            io.to(room).emit("received-new-message", document)
            
            // update latest message in db
            // update new messages counter in db -- new messages Counter
            // update latest message and new messages counter in frontend

          const editedDocument = message
          const onlineUsersIds = onlineUsers.map(user => user._id)
          const offlineUsersIds = offlineUsers.map(user => user._id)
          editedDocument.receiver = [...onlineUsersIds, ...offlineUsersIds]
          
          const newChatDocument = await chatModel.findByIdAndUpdate(
            room, 
            {
              latestMessage: document, // update latest message
              $push: {newMessagesCounter: editedDocument} // update new messages counter
            }, {new: true}
          ) 
          .populate("users", "-password")
          .populate({
            path: "latestMessage",
            populate: {
              path: "sender",
              select: "-password"
            }
          })

          // update latest message and new messages counter in frontend

            const onlineUsersSocketsIds = onlineUsersIds.map(id => { 
              const socketId = connectedUsers.get(id)
              return socketId 
            })

            const activeUsersIds = activeUsers.map(user => user._id)

            const activeUsersSocketsIds = activeUsersIds.map(id => { 
              const socketId = connectedUsers.get(id)
              return socketId
            })

            const activeAndOnlineUsersSocketsIds = [...onlineUsersSocketsIds, ...activeUsersSocketsIds]

            io.to(connectedUsers.get(userId)).to(activeAndOnlineUsersSocketsIds).emit("realtime-chat-data-latest-message-and-counter", newChatDocument)
          
        } catch (error) {
          console.log(colors.bgRed(error))
        }

        //----------------------------------------------------------------------------------------------------------




        // all users online but not active
      } else if (!activeUsers.length) {

        // message
        try {
          const document = await messageModel.findByIdAndUpdate(
            message._id,
            {
              seenStatus: "delivered" 
            },
            {
              new: true,
            }
          )
          .populate("sender", "-password")

          io.to(room).emit("received-new-message", document)

          // update latest message in db
          // update new messages counter in db -- new messages Counter
          // update latest message and new messages counter in frontend
          try {

            const editedDocument = message 
            const onlineUsersIds = onlineUsers.map(user => user._id)
            editedDocument.receiver = onlineUsersIds
            
            const newChatDocument = await chatModel.findByIdAndUpdate(
              room, 
              {
                latestMessage: document, // update latest message
                $push: {newMessagesCounter: editedDocument} // update new message counter
              }, {new: true}
            )
          .populate("users", "-password")
          .populate({
            path: "latestMessage",
            populate: {
              path: "sender",
              select: "-password"
            }
          })

          // update latest message and new messages counter in frontend

          const onlineUsersSocketsIds = onlineUsersIds.map(id => { 
            const socketId = connectedUsers.get(id)
            return socketId 
          })

          io.to(connectedUsers.get(userId)).to(onlineUsersSocketsIds).emit("realtime-chat-data-latest-message-and-counter", newChatDocument)
            
          } catch (error) {
            console.log(colors.bgRed(error))
          }

        } catch (error) {
          console.log(colors.bgRed(error))
        }

      } else if (activeUsers.length) {

        // message
        try {
          const document = await messageModel.findByIdAndUpdate(
            message._id,
            {
              seenStatus: "seen", 
              seenBy: activeUsers 
            },
            {
              new: true,
            }
          )
          .populate("sender", "-password")

          io.to(room).emit("received-new-message", document)

          // update latest message in db
          // update new messages counter in db -- new messages Counter
          // update latest message and new messages counter in frontend
          try {

            const editedDocument = message
            const onlineUsersIds = onlineUsers.map(user => user._id)
            editedDocument.receiver = onlineUsersIds
          
            
            const newChatDocument = await chatModel.findByIdAndUpdate(
              room,
              {
                latestMessage: document,
                $push: {newMessagesCounter: editedDocument}
              }, {new: true}
              )
              .populate("users", "-password")
              .populate({
                path: "latestMessage",
                populate: {
                  path: "sender",
                  select: "-password"
                }
              })
              
              // update latest message and new messages counter in frontend
              
              const onlineUsersSocketsIds = onlineUsersIds.map(id => { 
                const socketId = connectedUsers.get(id)
                return socketId
              })

            const activeUsersIds = activeUsers.map(user => user._id)

            const activeUsersSocketsIds = activeUsersIds.map(id => { 
              const socketId = connectedUsers.get(id)
              return socketId 
            })

            const activeAndOnlineUsersSocketsIds = [...onlineUsersSocketsIds, ...activeUsersSocketsIds]

            io.to(connectedUsers.get(userId)).to(activeAndOnlineUsersSocketsIds).emit("realtime-chat-data-latest-message-and-counter", newChatDocument)
            
          } catch (error) {
            console.log(colors.bgRed(error))
          }

        } catch (error) {
          console.log(colors.bgRed(error))
        }
      }

    }

    

  })

  socket.on("chat-typing", (isTyping, roomId) => {
    socket.to(roomId).emit("chat-typing-broadcast", {isTyping, userId, name})
    console.log(isTyping)
  })

  socket.on("disconnect", async () => {
    connectedUsers.delete(userId);

    connectedUsersFullData.delete(userId);

    console.log(`user disconnected ${userId}`.bgMagenta)
    io.emit('new-offline-user', userFullData) 
    io.emit("online-users", getOnlineUsers())

    const userLastSeen = await userModel.findByIdAndUpdate(userId, {lastSeen: Date.now()}, {new: true})

    socket.to(currentRoomId).emit("last-seen", userLastSeen.lastSeen)

    if (connectedRoomUsers.length) {
      const filteredConnectedRoomUsers = connectedRoomUsers.filter(user => user !== userId) 
      const connectedRoomUsersFullData = await getOnlineUsersFullData(filteredConnectedRoomUsers)
      io.to(currentRoomId).emit("room-online-users", connectedRoomUsersFullData)
    }

    

  })
})

// Get online users in the entire app
function getOnlineUsers() {
  return Array.from(connectedUsers.keys());
}


function getOnlineUsersInRoom(roomId) {
  const connectedSocketIds = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
  const roomOnlineUsers = [];

  connectedSocketIds.forEach((socketId) => { 
    const userId = getUserIdFromSocketId(socketId);
    if (userId !== null) {
      roomOnlineUsers.push(userId);
    }
  });

  return roomOnlineUsers;
}

// Get user ID from socket ID
function getUserIdFromSocketId(socketId) {
  for (const [userId, id] of connectedUsers.entries()) { 
    if (id === socketId) {
      return userId;
    }
  }
  return null;
}

function getOnlineUsersFullData(usersIdsArray) {

  const roomOnlineUsersFullData = [];

  usersIdsArray.forEach((userId) => {
    const userIdFullData = getUserFullDataFromUserId(userId);
    if (userIdFullData !== null) {
      roomOnlineUsersFullData.push(userIdFullData);
    }
  });

  return roomOnlineUsersFullData;
}

// Get user Full Data from user ID
function getUserFullDataFromUserId(userId) {
  for (const [id, fullData] of connectedUsersFullData.entries()) {
    if (id === userId) {
      return fullData;
    }
  }
  return null;
}
