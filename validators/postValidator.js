//profileValidator.js
const { check } = require("express-validator");
const validatorMiddleware = require("../middlewares/validatorMiddleware");

exports.createPostValidator = [
  check("text")
    .notEmpty()
    .withMessage("text is required"),
  validatorMiddleware
];

exports.createCommentValidator = [
  check("text")
    .notEmpty()
    .withMessage("text is required"),
  validatorMiddleware
];
