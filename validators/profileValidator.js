//profileValidator.js
const { check, param } = require("express-validator");
const validatorMiddleware = require("../middlewares/validatorMiddleware");
const User = require("../models/User");
const Profile = require("../models/Profile");

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

exports.createExperienceValidator = [
  check("title").notEmpty().withMessage("Title is required"),
  check("company").notEmpty().withMessage("Company is required"),
  check("from")
    .notEmpty()
    .withMessage("From date is required")
    .custom((val, { req }) => {
      return req.body.to ? val < req.body.to : true;
    })
    .withMessage("From date should be before To date"),
  validatorMiddleware,
];

exports.createEducationValidator = [
  check("school").notEmpty().withMessage("School is required"),
  check("degree").notEmpty().withMessage("Degree is required"),
  check("fieldofstudy").notEmpty().withMessage("fieldofstudy is required"),
  check("from")
    .notEmpty()
    .withMessage("From date is required")
    .custom((val, { req }) => {
      return req.body.to ? val < req.body.to : true;
    })
    .withMessage("From date should be before To date"),
  validatorMiddleware,
];

exports.deleteExperienceValidator = [
  param("exp_id")
    .isMongoId()
    .withMessage("Invalid experience id")
    .custom(async (val, { req }) => {
      const profile = await Profile.findOne({ user: req.user.id });
      const experience = profile.experience.find(
        (exp) => exp._id.toString() === val,
      );
      if (!experience)
        return Promise.reject(new Error("Experience not found", 404));

      return true;
    }),
  validatorMiddleware,
];

exports.deleteEducationValidator = [
  param("edu_id")
    .isMongoId()
    .withMessage("Invalid education id")
    .custom(async (val, { req }) => {
      const profile = await Profile.findOne({ user: req.user.id });

      const education = profile.education.find(
        (edu) => edu._id.toString() === val,
      );
      if (!education)
        return Promise.reject(new Error("Education not found", 404));
      return true;
    }),
  validatorMiddleware,
];
