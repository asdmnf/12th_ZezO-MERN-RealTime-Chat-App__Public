const asyncHandler = require('express-async-handler')
const userModel = require('../Models/userModel')
const apiError = require('../Utils/apiError')
const cloudinaryUploadImage = require('../Utils/cloudinaryUploads')

exports.searchUsers = asyncHandler(async (req, res, next) => {
  const {keyword} = req.query

  const documents = await userModel.find(keyword ? {
    $or: [
      {name: {$regex: keyword, $options: "i"}},
      {email: {$regex: keyword, $options: "i"}}
    ]
  } : {})
  .find({_id: {$ne: req.user._id}})
  .select("-password")


  res.status(200).json({
    data: documents,
    results: documents.length,
    status: 200
  })

})

// update Logged User Profile Picture
exports.updateLoggedUserProfilePic = asyncHandler(async (req, res, next) => {
  const {profilePic} = req.body

  // cloudinary upload image
  const imageURL = await cloudinaryUploadImage(profilePic)

  // update image
  const document = await userModel.findByIdAndUpdate(req.user._id,
    {
      profilePic: imageURL
    },
    {
      new: true,
    }
    )
    .select("-password")

    if (!document) {
      return next(apiError("Failed To Update Profile Picture", 400))
    }

    res.status(201).json({
      data: document,
      status: 201
    })
})

// get logged user data
exports.getLoggedUserData = asyncHandler(async (req, res, next) => {

  const document = await userModel.findById(req.user._id)
  .select("-password")

  if (!document) {
    return next(apiError("Failed To Get Logged User Data", 400))
  }

  res.status(200).json({
    data: document,
    status: 200,
  })
})