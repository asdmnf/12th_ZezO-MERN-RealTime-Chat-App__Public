const { check } = require('express-validator')
const validatorMiddleware = require('../Middlewares/validatorMiddleware')

// exports.createSingleChatValidatorRule = [
//   check("name")
//   .notEmpty().withMessage("name is required"),
//   validatorMiddleware
// ]