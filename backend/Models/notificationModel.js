const { default: mongoose } = require("mongoose");


const notificationSchema = new mongoose.Schema({
  notificationType: {
    type: String,
    enum: ["new-message", "friend-request"]
  },
  messageContent: {
    type: String,
  },
  fromUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  toUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  belongingChat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chat"
  },
  isSeen: {
    type: Boolean,
    default: false
  },
}, {
  timestamps: true,
})

const notificationModel = mongoose.model("Notification", notificationSchema)

module.exports = notificationModel