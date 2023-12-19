const { check } = require('express-validator')
const validatorMiddleware = require('../Middlewares/validatorMiddleware');
const userModel = require('../Models/userModel');

exports.signUpAuthValidatorRule = [
  check("name")
  .notEmpty().withMessage("name is required"),

  check("email")
  .notEmpty().withMessage("email is required")
  .isEmail().withMessage("email format is incorrect")
  .custom(async (value) => {
    await userModel.findOne({email: value}).then(email => { 
      if (email) {
        return Promise.reject(new Error(`email is already in use`));
      }
      return true
    })
  }),

  check("password")
  .notEmpty().withMessage("password is required"),

  check("passwordConfirmation")
  .notEmpty().withMessage("password confirmation is required")
  .custom((value, {req}) => {
    if (req.body.password !== value) {
      throw new Error("password confirmation is wrong")
    }
    return true
  }),
  validatorMiddleware
]

exports.logInAuthValidatorRule = [
  check("email")
  .notEmpty().withMessage("email is required")
  .isEmail().withMessage("email format is incorrect"),

  check("password")
  .notEmpty().withMessage("password is required"),
  validatorMiddleware
]