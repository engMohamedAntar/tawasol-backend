//userValidator.js
const { check } = require("express-validator");
const validatorMiddleware = require("../middlewares/validatorMiddleware");

exports.registerValidator = [
  check("name")
    .notEmpty()
    .withMessage("user must have a name")
    .isLength({ min: 3 })
    .withMessage("too short user name")
    .isLength({ max: 32 })
    .withMessage("too long user name"),
  check("email")
    .isEmail().withMessage("email is not valid")
    .notEmpty().withMessage("email can not be empty"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("password should be at least 6 digits"),
  validatorMiddleware,
];
