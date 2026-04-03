const express = require("express");
const router = express.Router();
const { registerValidator } = require("../validators/authValidator");
const bcrypt= require('bcrypt');
const User= require('../models/User');
const jwt= require('jsonwebtoken');

router.post("/register", registerValidator, async(req, res) => {
const {name, email, password}= req.body;
// check if user eixist, if yes, return error
let user= await User.findOne({email});
if(user) return res.status(400).send({errors: [{msg: 'User already exists'}]});
// hash password
const hashedPassword= await bcrypt.hash(password, 10);
// save data in db
user= new User({name, email, password: hashedPassword});
await user.save();

// return JWT
const payload= {
    id: user._id
}
const token= jwt.sign(payload, process.env.JWT_SECRET);
res.send({token});
});

module.exports = router;
