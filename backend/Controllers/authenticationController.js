const asyncHandler = require('express-async-handler')
const userModel = require('../Models/userModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const apiError = require('../Utils/apiError')
const cloudinaryUploadImage = require('../Utils/cloudinaryUploads')

exports.signUpAuthController = asyncHandler(async (req, res, next) => {
  const {name, email, password, profilePic} = req.body


  

  // cloudinary upload image
  const imageURL = await cloudinaryUploadImage(profilePic)
  

  //1- create signup document
  const document = await userModel.create({
    name,
    email,
    password: await bcrypt.hash(password, 12),
    profilePic: imageURL
  })

  // 2- check document
  if (!document) {
    return next(new apiError("Signup Failed", 400))
  }

  // 3- generate token
  const token = jwt.sign(
    {userId: document._id},
    process.env.JWT_SCRET_KET,
    {expiresIn: process.env.JWT_EXPIRES_IN}
  )

  // 4- response
  res.status(201).json({
    data: {
      _id: document._id,
      name: document.name,
      email: document.email,
      profilePic: document.profilePic
    },
    token: token,
    status: 201
  })
})

exports.loginAuthController = asyncHandler(async (req, res, next) => {

  const {email, password} = req.body

  // 1- find user by email
  const document = await userModel.findOne({email})

  // 2- compare password and check document
  if (!document || !(await bcrypt.compare(password, document.password))) {
    return next(new apiError("incorrect email or password", 404))
  }


  // 3- generate token
  const token = jwt.sign(
    {userId: document._id},
    process.env.JWT_SCRET_KET,
    {expiresIn: process.env.JWT_EXPIRES_IN}
  )

  // 4- response
  res.status(200).json({
    data: {
      _id: document._id,
      name: document.name,
      email: document.email,
      profilePic: document.profilePic
    },
    token: token,
    status: 200
  })

})

exports.protectedRouteAuth = asyncHandler(async (req, res, next) => {

  // 1- get token from req.header.authorization
  let token
  if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1]
  }

  if (!token) {
    return next(new apiError("you are not logged in please login and try again", 401))
  }

  // 2- verify token with jwt secret key
  const verifiedToken = jwt.verify(token, process.env.JWT_SCRET_KET)

  // 3- get document by verified token
  const document = await userModel.findById(verifiedToken.userId).select("-password")

  if (!document) {
    return next(new apiError(`your user account is not exists any more please signup again`, 401))
  }

  // 4- store document
  req.user = document

  next()
})