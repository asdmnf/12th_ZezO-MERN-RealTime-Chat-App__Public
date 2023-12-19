const express = require('express');
const { signUpAuthValidatorRule, logInAuthValidatorRule } = require('../Validators/authenticationValidator');
const { signUpAuthController, loginAuthController, protectedRouteAuth } = require('../Controllers/authenticationController');
const { searchUsers, updateLoggedUserProfilePic, getLoggedUserData } = require('../Controllers/userController');

const authRouter = express.Router()

// authentication
authRouter.post("/signup", signUpAuthValidatorRule, signUpAuthController)
authRouter.post("/login", logInAuthValidatorRule, loginAuthController)

// user
authRouter.get('/', protectedRouteAuth, searchUsers)
authRouter.get('/logged-user-data', protectedRouteAuth, getLoggedUserData)
authRouter.put('/update-profile-picture', protectedRouteAuth, updateLoggedUserProfilePic)

module.exports = authRouter