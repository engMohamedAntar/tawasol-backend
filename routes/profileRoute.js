const express = require("express");
const { createProfile } = require("../services/profileService");
const { createProfileValidator } = require("../validators/profileValidator");
const { protect } = require("../services/authService");
const addUserToReqBody = require("../middlewares/addUserToReqBody");
const router = express.Router();
/*
1.  POST /profiles
2.  GET /profiles/me
3.  GET /profiles
4.  GET /profiles/user/:user_id
5.  DELETE /profiles
6.  POST /profiles/upload
7.  PUT /profiles/experience
8.  DELETE /profiles/experience/:exp_id
9.  PUT /profiles/education
10. DELETE /profiles/education/:edu_id
*/

router.post(
  "/",
  protect,
  addUserToReqBody,
  createProfileValidator,
  createProfile,
);

module.exports = router;
