const { default: mongoose } = require("mongoose");


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  profilePic: {
    type: String,
  },
  lastSeen: {
    type: Date
  },
}, {
  timestamps: true,
})


const userModel = mongoose.model("User", userSchema)

module.exports = userModel