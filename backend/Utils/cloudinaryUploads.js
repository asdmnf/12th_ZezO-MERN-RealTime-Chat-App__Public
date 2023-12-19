


const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv').config()

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const cloudinaryUploadImage = async (profilePic) => {

  let DefaultprofilePic = "https://icon-library.com/images/profile-picture-icon/profile-picture-icon-14.jpg";

  // cloudinary upload image
  if (profilePic) {
    const image = await cloudinary.uploader.upload(profilePic, { 
      folder: "zezo-chat-app_UsersProfilePics"
    })

    DefaultprofilePic = image.secure_url

    if (!image) {
      return next(new apiError("Failed To Upload Profile Picture", 400))
    }
  }

  return DefaultprofilePic
}

module.exports = cloudinaryUploadImage