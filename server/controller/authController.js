// require("dotenv").config("../.env");
const jwt = require("jsonwebtoken");

// middleware
const { signUpSchema } = require("../middleware/validator.js");

// Models
const User = require("../model/userModel.js");

// utils
const {
  hashPassword,
  comparePassword,
  hmacProcess,
  hmacProcessVerify,
} = require("../utils/hashing.js");

exports.signup = async (req, res) => {
  const { email, password } = req.body;
  try {
    // validating data
    const { error, value } = signUpSchema.validate({ email, password });
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // checking for exising user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // hashing password
    const hashedPassword = await hashPassword(password, 12);

    // creating instanc of user
    const newuser = new User({
      email,
      password: hashedPassword,
    });

    // saving user to database
    await newuser.save();

    // response
    return res.status(200).json({
      success: true,
      message: "User signed up successfully.",
    });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ error: "Error while signing up" });
  }
};

// DONE: login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const { error, value } = signUpSchema.validate({ email, password });
    if (error) {
      return res
        .status()
        .json({ success: false, message: "Use alpha numeric characters only" });
    }

    // getting user data
    const existingUser = await User.findOne({ email }).select("+password");

    if (!existingUser) {
      return res
        .status(404)
        .json({ success: false, message: "User doesn't exists" });
    }

    console.log(existingUser.password);

    // comparing password
    const result = await comparePassword(password, existingUser.password);

    if (!result) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid username or password" });
    }

    // signing jwt token
    const token = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
      },
      process.env.TOKEN_SECRET,
      {
        expiresIn: "168 hours",
      }
    );
    existingUser.lastLogin = Date.now();
    await existingUser.save();

    // response
    return res
      .cookie("auth", token, {
        expries: new Date(Date.now() + 86400000),
        httpOnly: process.env.NODE_ENV === "production",
        secure: process.env.NODE_ENV === "production",
      })
      .json({ success: true, message: "Logged in" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// TODO: send mail here
exports.forgotPassword = async (req, res) => {
  try {
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// TODO: validate token from link
exports.validateToken = async (req, res) => {
  try {
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// TODO: reset password
exports.resetPassword = async (req, res) => {
  try {
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// TODO: change password
exports.changePassword = async (req, res) => {
  try {
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};
