const { default: mongoose } = require("mongoose");


const chatSchema = new mongoose.Schema({
  chatName: {
    type: String,
    trim: true,
  },
  isGroupChat: {
    type: Boolean,
    default: false,
  },
  groupAdmin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],
  latestMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Message"
  },
  newMessagesCounter: []

}, {
  timestamps: true,
})

// chatSchema.pre('save', function(next) {
//   this.populate({path: "users", select: "-password"})
//   next()
// })


const chatModel = mongoose.model("Chat", chatSchema)

module.exports = chatModel