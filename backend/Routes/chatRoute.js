const express = require('express');
const { createSingleChat, getAllUserChats, createGroupChat, renameGroupChat, addUserToGroupChat, removeUserFromGroupChat, getSpecificChat } = require('../Controllers/chatController');
const { protectedRouteAuth } = require('../Controllers/authenticationController');

const chatRouter = express.Router();

chatRouter.post("/create-single-chat", protectedRouteAuth, createSingleChat)
chatRouter.get("/", protectedRouteAuth, getAllUserChats)
chatRouter.get("/:chatId", protectedRouteAuth, getSpecificChat)
chatRouter.post("/create-group-chat", protectedRouteAuth, createGroupChat)
chatRouter.put("/rename-group-chat", protectedRouteAuth, renameGroupChat)
chatRouter.put("/add-user-to-group-chat", protectedRouteAuth, addUserToGroupChat)
chatRouter.put("/remove-user-from-group-chat", protectedRouteAuth, removeUserFromGroupChat)

module.exports = chatRouter;