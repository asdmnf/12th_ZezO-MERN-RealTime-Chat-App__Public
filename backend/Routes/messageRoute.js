const express = require('express');
const { protectedRouteAuth } = require('../Controllers/authenticationController');
const { createMessageController, getAllChatMessagesController, getSpecificMessageController, deleteSpecificMessageController } = require('../Controllers/messageController');

const messageRouter = express.Router();

messageRouter.post("/create-message", protectedRouteAuth, createMessageController)
messageRouter.get("/get-all-chat-messages/:chatId", protectedRouteAuth, getAllChatMessagesController)
messageRouter.get("/get-specific-message/:messageId", protectedRouteAuth, getSpecificMessageController)
messageRouter.put("/delete-specific-message", protectedRouteAuth, deleteSpecificMessageController)

module.exports = messageRouter;