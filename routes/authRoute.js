const express = require("express");
const router = express.Router();
const { registerValidator, logInValidator } = require("../validators/authValidator");
const {register, login}= require('../services/authService')

router.post("/register", registerValidator, register );
router.post("/login", logInValidator, login );

module.exports = router;
