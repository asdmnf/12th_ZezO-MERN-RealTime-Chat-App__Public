const asyncHandler = require('express-async-handler')
const notificationModel = require('../Models/notificationModel')

exports.getAllNotificationForLoggedUser = asyncHandler(async (req, res, next) => {

  const documents = await notificationModel.find({
    toUser: req.user._id
  })
  .populate("fromUser", "-password")
  .populate("belongingChat")
  .sort({ createdAt: -1 });

  res.status(200).json({
    data: documents,
    status: 200
  })

})


exports.deleteOneNotificationForLoggedUser = asyncHandler(async (req, res, next) => {

  const document = await notificationModel.findByIdAndDelete(req.params.notificationId)

  if (!document) {
    return next(apiError("Notification Not Found", 404))
  }

  res.status(201).json({
    data: document,
    status: 201
  })
})


exports.deleteAllNotificationForLoggedUser = asyncHandler(async (req, res, next) => {

  const documents = await notificationModel.deleteMany({
    toUser: req.user._id
  })

  if (!documents) {
    return next(apiError("Failed To Delete Notifications", 400))
  }

  res.status(201).json({
    data: "all notifications deleted successfully",
    status: 201
  })

})


exports.createNotification = asyncHandler(async (req, res, next) => {

  const {notificationType, toUser, belongingChat} = req.body

  const document = await notificationModel.create({
    notificationType,
    fromUser: req.user._id,
    toUser,
    belongingChat
  })

  if (!document) {
    return next(apiError("Failed To Create Notification", 400))
  }

  res.status(201).json({
    data: document,
    status: 201
  })

})

exports.updateIsSeenNotification = asyncHandler(async (req, res, next) => {

  const document = await notificationModel.findByIdAndUpdate(
      req.params.notificationId,
      {
        isSeen: true
      },
      {
        new: true
      }
    )

    res.status(201).json({
      data: document,
      status: 201
    })
})