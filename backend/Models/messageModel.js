const { default: mongoose } = require("mongoose");


const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  receiver: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],
  message: {
    type: String,
    trim: true,
  },
  belongingChat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chat"
  },
  seenStatus: {
    type: String,
    default: "stored",
    enum: ["stored", "delivered", "seen"]
  },
  seenBy: []
}, {
  timestamps: true,
})


const messageModel = mongoose.model('Message', messageSchema)

module.exports = messageModel