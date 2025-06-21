// require("dotenv").config("../.env");
const jwt = require("jsonwebtoken");

// middleware
const {
  signUpSchema,
  changePasswordSchema,
} = require("../middleware/validator.js");
const transport = require("../middleware/sendMail.js");

// Models
const User = require("../model/userModel.js");

// utils
const {
  hashPassword,
  comparePassword,
  hmacProcess,
  hmacProcessVerify,
} = require("../utils/hashing.js");
const tokenExtractor = require("../utils/tokenExtractor.js");

// TODO: Remake validation

exports.signup = async (req, res) => {
  try {
    const { userName, email, password } = req.body;

    // validating data
    // const { error, value } = signUpSchema.validate({ email, password });
    // if (error) {
    //   return res.status(400).json({ error: error.details[0].message });
    // }

    // checking for exising user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    // hashing password
    const hashedPassword = await hashPassword(password, 12);

    // creating instance of user
    const newuser = new User({
      userName,
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
    return res
      .status(500)
      .json({ success: false, message: "Error while signing up" });
  }
};

// DONE: login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // const { error, value } = signUpSchema.validate({ email, password });
    // if (error) {
    //   return res
    //     .status(400)
    //     .json({ success: false, message: "Use alpha numeric characters only" });
    // }

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

// DONE: send mail here
// TODO: Update link to production link and email
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    // check if user exists or not
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User doesn't exists." });
    }

    // Random 6 digit value
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // generating link
    const link = `${
      process.env.FRONT_END
    }/reset-password?email=${encodeURIComponent(email)}&token=${code}`;

    // Sending mail here
    let info = await transport.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Reset Your Password",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
          <div style="max-width: 500px; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #333; text-align: center;">Reset Your Password</h2>
            <p style="color: #555;">You requested a password reset. Click the button below to reset your password. This link will expire in <strong>10 minutes</strong>.</p>
            <div style="text-align: center; margin: 20px 0;">
              <a href="${link}" 
                 style="background-color: #007bff; color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px; display: inline-block;">
                 Reset Password
              </a>
            </div>
            <p style="color: #555;">If you didn’t request this, please ignore this email.</p>
            <hr style="border: none; border-top: 1px solid #ddd;">
            <p style="color: #777; font-size: 12px; text-align: center;">&copy; ${new Date().getFullYear()} CardKeeper. All rights reserved.</p>
          </div>
        </div>
      `,
    });

    // Check if email was sent successfully
    if (info.accepted.length > 0) {
      // Hash the code before saving
      const hashedCode = hmacProcess(code, process.env.HMAC_CODE);
      // Saving code as token
      existingUser.token = hashedCode;
      existingUser.tokenValidation = Date.now() + 10 * 60 * 1000; // 10 min expiration
      await existingUser.save();

      return res
        .status(200)
        .json({ success: true, message: "Mail sent successfully" });
    } else {
      return res
        .status(500)
        .json({ success: false, message: "Couldn't send mail" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// DONE: validate token from link
exports.validateToken = async (req, res) => {
  try {
    const email = req.query.email;
    const token = req.query.token;
    // Finding user by email
    const existingUser = await User.findOne({ email }).select(
      "+token +tokenValidation"
    );

    if (!existingUser) {
      return res
        .status(404)
        .json({ success: false, message: "User doesn't exists" });
    }

    // validating expiration of code
    if (Date.now() > existingUser.tokenValidation) {
      return res
        .status(401)
        .json({ success: false, message: "Link is expired. Resend email." });
    }

    // Comparing token

    const hashedCode = hmacProcess(token, process.env.HMAC_CODE);
    console.log(hashedCode);
    console.log(existingUser);
    if (hashedCode !== existingUser.token) {
      return res
        .status(403)
        .json({ success: false, message: "Invalid token." });
    }

    // Remove token to prevent reuse after verification
    existingUser.token = undefined;
    existingUser.tokenValidation = undefined;
    await existingUser.save();

    return res.status(200).json({ success: true, message: "Token verified." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// DONE: change password
exports.changePassword = async (req, res) => {
  try {
    const { newPassword, oldPassword } = req.body;
    // validating password
    const { error, value } = changePasswordSchema.validate(newPassword);
    if (error) {
      return res
        .status(400)
        .json({ success: false, message: "Alpha numeric characters only." });
    }
    // getting token
    const token = tokenExtractor(req);
    if (!token) {
      return res
        .status(403)
        .json({ success: false, message: "Token not provided." });
    }

    // getting user details
    const decode = jwt.verify(token, process.env.TOKEN_SECRET);
    const existingUser = await User.findOne({ email: decode.email }).select(
      "+password"
    );

    if (!existingUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    // checking password
    const result = await comparePassword(oldPassword, existingUser.password);
    if (!result) {
      return res
        .status(401)
        .json({ success: false, message: "Incorrect old password." });
    } else {
      // changing password if matches
      const hashedPassword = await hashPassword(newPassword);
      existingUser.password = hashedPassword;
      await existingUser.save();

      return res
        .status(200)
        .json({ success: true, message: "Password changed successfully." });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// DONE: reset password
exports.resetPassword = async (req, res) => {
  try {
    const email = req.params.email;
    const { newPassword } = req.body;
    // validating password
    const { error, value } = changePasswordSchema.validate(newPassword);
    if (error) {
      return res
        .status(400)
        .json({ success: false, message: "Alpha numeric characters only." });
    }

    // getting user data and changing pass
    const existingUser = await User.findOne({ email }).select("+password");

    if (!existingUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    } else {
      const hashedPassword = await hashPassword(newPassword);
      existingUser.password = hashedPassword;
      await existingUser.save();

      return res
        .status(200)
        .json({ success: true, message: "Password changed successfully." });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};
