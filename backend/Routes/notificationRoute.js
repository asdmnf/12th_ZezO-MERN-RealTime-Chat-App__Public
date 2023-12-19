const express = require('express');
const { protectedRouteAuth } = require('../Controllers/authenticationController');
const { getAllNotificationForLoggedUser, deleteOneNotificationForLoggedUser, deleteAllNotificationForLoggedUser, createNotification, updateIsSeenNotification } = require('../Controllers/notificationController');

const notificationRouter = express.Router();

notificationRouter.post("/", protectedRouteAuth, createNotification)
notificationRouter.get("/", protectedRouteAuth, getAllNotificationForLoggedUser)
notificationRouter.delete("/delete-one-notification/:notificationId", protectedRouteAuth, deleteOneNotificationForLoggedUser)
notificationRouter.delete("/delete-all-notifications", protectedRouteAuth, deleteAllNotificationForLoggedUser)
notificationRouter.put("/:notificationId", protectedRouteAuth, updateIsSeenNotification)

module.exports = notificationRouter;