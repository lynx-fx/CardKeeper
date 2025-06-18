require("dotenv").config("../.env");
const jwt = require("jsonwebtoken");
const tokenExtractor = require("../utils/tokenExtractor");

exports.identifier = (req, res, next) => {
  const token = tokenExtractor(req);
  if (!token) {
    return res
      .status()
      .json({
        success: false,
        message: "No token provided for identification.",
      });
  }
  try {
    const decode = jwt.verify(token, process.env.TOKEN_SECRET);
    if (decode) {
      req.user = jwtVerified;
      next();
    } else {
      return res
        .status(401)
        .json({ success: false, message: "Idenfitication failed." });
    }
  } catch (err) {
    console.console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Identification error." });
  }
};
