const asyncHandler = require('express-async-handler')
const chatModel = require('../Models/chatModel')
const apiError = require('../Utils/apiError')

exports.createSingleChat = asyncHandler(async (req, res, next) => {
  const {otherUserId} = req.body

  const document = await chatModel.findOne({
    isGroupChat: false,
    $and: [ 
      {users: {$elemMatch: {$eq: req.user._id}}},
      {users: {$elemMatch: {$eq: otherUserId}}}
    ]
  })
  .populate("users", "-password")

  if (document) {
    res.status(200).json({
      data: document,
      status: 200
    })
  } else {
    const document = await chatModel.create({
      chatName: "single chat",
      isGroupChat: false,
      users: [
        req.user._id, otherUserId
      ],
    })

    if (!document) {
      return next(new apiError("Faild To Create Single Chat", 400))
    }

    const test = await chatModel.findOne({_id: document._id}).populate("users", "-password")

    res.status(201).json({
      data: test,
      status: 201
    })
  }
})

exports.getAllUserChats = asyncHandler(async (req, res, next) => {

  if (req.query.page !== "undefined" || req.query.limit !== "undefined") {

    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 10;
    const skip = (page - 1) * limit;

    // query
    const documents = await chatModel
      .find({
        users: { $elemMatch: { $eq: req.user._id } },
      })
      .limit(limit)
      .skip(skip)
      .populate("users", "-password")
      .populate({
        path: "latestMessage",
        populate: {
          path: "sender",
          select: "-password"
        }
      })
      .sort({ updatedAt: -1 });

    const documentsCount = await chatModel.countDocuments({
      users: { $elemMatch: { $eq: req.user._id } },
    });

    // pagination
    const paginationObject = {};
    paginationObject.limit = limit * 1;
    paginationObject.limit = limit * 1;
    if (skip > 0) {
      paginationObject.previousPage = page - 1;
    }
    paginationObject.currentPage = page;
    if (page * limit < documentsCount) {
      paginationObject.nextPage = page + 1;
    }
    paginationObject.totalPages = Math.ceil(documentsCount / limit) || 1;
    paginationObject.totalResults = documentsCount;

    // response
    res.status(200).json({
      data: documents,
      paginationData: paginationObject,
      status: 200,
    });
  } else {

    // query
  const documents = await chatModel.find({
    users: {$elemMatch: {$eq: req.user._id}}
  })
  .populate("users", "-password")
  .populate({
    path: "latestMessage",
    populate: {
      path: "sender",
    }
  })
  .sort({updatedAt: -1})

  // response
  res.status(200).json({
    data: documents,
    paginationData: {totalResults: documents.length},
    status: 200
  })
  
  }
})

exports.getSpecificChat = asyncHandler(async (req, res, next) => {

  const document = await chatModel.findById(req.params.chatId)
  .populate("users", "-password")

  res.status(200).json({
    data: document,
    status: 200
  })
  
})

exports.createGroupChat = asyncHandler(async (req, res, next) => {
  
  let users = req.body.users
  
  if (users.length < 2 ) {
    return next(new apiError("At Least 2 Users Required For Group Chats", 400))
  }
  
  users.push(req.user._id)

  const document = await chatModel.create({
    chatName: req.body.chatName,
    isGroupChat: true,
    groupAdmin: req.user._id,
    users
  })

  if (!document) {
    return next(new apiError("Faild To Create Group Chat", 400))
  }

  const test = await chatModel.findById(document._id)
  .populate("users", "-password")

  res.status(201).json({
    data: test,
    status: 201
  })
})

exports.renameGroupChat = asyncHandler(async (req, res, next) => {

  const {groupChatId, newGroupChatName} = req.body

  const document = await chatModel.findByIdAndUpdate(groupChatId,
  {
    chatName: newGroupChatName
  },
  {
    new: true
  })
  .populate("users", "-password")

  if (!document) {
    return next(new apiError("Failed To Remane Group Chat", 400))
  }

  res.status(201).json({
    data:document,
    status: 201
  })

})

exports.addUserToGroupChat = asyncHandler(async (req, res, next) => {
  const {groupChatId, userId} = req.body

  const document = await chatModel.findByIdAndUpdate(groupChatId,
    {
      $push: {users: userId}
    },
    {
      new: true
    })
    .populate("users", "-password")

    res.status(201).json({
      data:document,
      status: 201
    })
})

exports.removeUserFromGroupChat = asyncHandler(async (req, res, next) => {
  const {groupChatId, userId} = req.body

  const document = await chatModel.findByIdAndUpdate(groupChatId,
    {
      $pull: {users: userId}
    },
    {
      new: true
    })
    .populate("users", "-password")

    res.status(201).json({
      data:document,
      status: 201
    })
})

