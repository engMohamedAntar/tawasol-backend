const express = require("express");
const {
  createProfile,
  getMyProfile,
  getProfiles,
  getUserProfile,
  deleteProfile,
  uploadImage
} = require("../services/profileService");
const { createProfileValidator } = require("../validators/profileValidator");
const { protect } = require("../services/authService");
const addUserToReqBody = require("../middlewares/addUserToReqBody");
const upload = require("../utils/upload");
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

router.get("/me", protect, getMyProfile);
router.get("/", protect, getProfiles);
router.get("/user/:user_id", protect, getUserProfile);

router.delete("/", protect, deleteProfile);

// router.post("/upload", protect, uploadImage);
router.post("/upload", protect, upload, (req,res)=>{
  res.status(201).json(req.file);
});


module.exports = router;
