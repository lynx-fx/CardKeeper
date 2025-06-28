const jwt = require("jsonwebtoken");
const {tokenExtractor} = require("../utils/tokenExtractor");

exports.identifier = (req, res, next) => {
  const token = tokenExtractor(req);
  if (!token) {
    return res
      .status(400)
      .json({
        success: false,
        message: "No token provided for identification.",
      });
  }
  try {
    const decode = jwt.verify(token, process.env.TOKEN_SECRET);
    if (decode) {
      next();
    } else {
      return res
        .status(401)
        .json({ success: false, message: "Idenfitication failed." });
    }
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Identification error." });
  }
};
