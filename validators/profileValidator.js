//profileValidator.js
const { check } = require("express-validator");
const validatorMiddleware = require("../middlewares/validatorMiddleware");
const User = require("../models/User");

exports.createProfileValidator = [
  check("user")
    .notEmpty()
    .withMessage("User is required")
    .isMongoId()
    .withMessage("Invalid user id")
    .custom(async (val) => {
      const user = await User.findById(val);
      if (!user) {
        return Promise.reject("User not found");
      }
      return true;
    }),
  check("company")
    .optional()
    .trim()
    .isString()
    .withMessage("Company must be a string")
    .isLength({ min: 2 })
    .withMessage("Company must be at least 2 characters"),
  check("status").notEmpty().withMessage("Status is required"),
  check("skills").notEmpty().withMessage("Skills is required"),
  validatorMiddleware,
];

// exports.logInValidator = [
//   check("email")
//     .isEmail().withMessage("email is not valid")
//     .notEmpty().withMessage("email can not be empty").custom(async(val,{req})=>{
//       const user= await User.findOne({email: val});
//       if(!user)
//         return Promise.reject(new Error('no user found',404));
//       return true;
//     }),
//   check("password")
//     .isLength({ min: 6 })
//     .withMessage("password should be at least 6 digits"),
//   validatorMiddleware
// ];
