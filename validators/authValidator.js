//userValidator.js
const { check } = require("express-validator");
const validatorMiddleware = require("../middlewares/validatorMiddleware");
const User= require("../models/User");
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

exports.logInValidator = [
  check("email")
    .isEmail().withMessage("email is not valid")
    .notEmpty().withMessage("email can not be empty").custom(async(val,{req})=>{
      const user= await User.findOne({email: val});
      if(!user)
        return Promise.reject(new Error('no user found',404));
      return true;
    }),
  check("password")
    .isLength({ min: 6 })
    .withMessage("password should be at least 6 digits"),
  validatorMiddleware
];