const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const createJWT = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET);
};

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  //1- check if user eixist, if yes, return error
  let user = await User.findOne({ email });
  // if (user)
  //   return res.status(400).send({ errors: [{ msg: "User already exists" }] });
  //2- hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  //3- save data in db
  user = new User({ name, email, password: hashedPassword });
  await user.save();

  //4- return JWT
  const token = createJWT({ id: user._id });
  res.send({ token });
};

exports.login = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user || !(await bcrypt.compare(req.body.password, user.password)))
    return res.status(400).send({ errors: [{ msg: "Invalid credentials" }] });

  const token = createJWT({ id: user._id });
  const { password, ...rest } = user._doc;
  res.status(200).json({ data: rest, token });
};

// @desc create the protect middlewaare
exports.protect = async (req, res, next) => {
  // check weather token exist (user is loggedIn)
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer")
  )
    return res.status(401).send({ errors: [{ msg: "Unauthorized" }] });
  const token = req.headers.authorization.split(" ")[1];

  // verify token (not expired and valid)
  const decoded = jwt.verify(token, process.env.JWT_SECRET); //?

  // ensure that the user still exit
  const user = await User.findById(decoded.id);
  if (!user)
    return res
      .status(401)
      .send({ errors: [{ msg: "No user found for this token" }] });

  req.user = user;
  
  next();
};
