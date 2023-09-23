const jwt = require("jsonwebtoken");

// create token using JWT
const createToken = (payload) =>
  jwt.sign({ userId: payload }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  }); // sign() = create()

module.exports = createToken;
