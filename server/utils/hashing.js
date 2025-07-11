  const { hash, compare } = require("bcryptjs");
  const { createHmac } = require("crypto");

  exports.hashPassword = async (value, saltValue = 12) => {
    return await hash(value, saltValue);
  };

  exports.comparePassword = async (value, hashedValue) => {
    return await compare(value, hashedValue);
  };

  exports.hmacProcess = (value, secret) => {
    return createHmac("sha256", secret).update(value).digest("hex");
  };

  exports.hmacProcessVerify = (token, storedToken) => {
    const secret = process.env.HMAC_CODE;
    return (
      createHmac("sha256", secret).update(token).digest("hex") === storedToken
    );
  };
