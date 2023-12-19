const asyncHandler = require('express-async-handler')
const messageModel = require('../Models/messageModel')
const apiError = require('../Utils/apiError')

// create message
exports.createMessageController = asyncHandler(async (req, res, next) => {

  const {message, belongingChatId, receiver} = req.body

  const document = await messageModel.create({
    sender: req.user._id,
    message,
    belongingChat: belongingChatId,
    receiver: receiver
  })

  if (!document) {
    return next(new apiError("Failed To Create Message", 400))
  }

  const test = await messageModel.findOne({_id: document._id}).populate("sender", "-password")

  res.status(201).json({
    data: test,
    status: 201
  })
})


// ------------------------------------------------------------------------------------------------
// get all messages for specific chat id
exports.getAllChatMessagesController = asyncHandler(async (req, res, next) => {

  const {chatId} = req.params

  const documents = await messageModel.find({belongingChat: chatId})
  .populate("sender", "-password")
  .sort({ createdAt: 1 });

  res.status(200).json({
    data: documents,
    status: 200
  })
})
// ------------------------------------------------------------------------------------------------

// get specific message
exports.getSpecificMessageController = asyncHandler(async (req, res, next) => {

  const {messageId} = req.params

  const document = await messageModel.findOne({_id: messageId})

  if (!document) {
    return next(new apiError("Message Not Found", 404))
  }

  res.status(200).json({
    data: document,
    status: 200
  })
})

// delete specific message
exports.deleteSpecificMessageController = asyncHandler(async (req, res, next) => {

  const {messageId} = req.body

  const document = await messageModel.findOneAndUpdate(
    {_id: messageId},
    {message: "This Message Was Deleted"},
    {new: true}
    )

  if (!document) {
    return next(new apiError("Message Not Found", 404))
  }

  res.status(201).json({
    data: document,
    status: 201
  })
})