const express = require("express");

const router = express.Router();

const {
  signup,
  login,
  forgetPassword,
  verifyPassResetCode,
  resetPassword,
} = require("../services/authService");
const {
  signUpValidator,
  loginValidator,
  // eslint-disable-next-line import/extensions
} = require("../utils/validators/authValidator");

router.route("/signup").post(signUpValidator, signup);
router.route("/login").post(loginValidator, login);
router.route("/forgetPassword").post(forgetPassword);
router.route("/verifyResetCode").post(verifyPassResetCode);
router.route("/resetPassword").put(resetPassword);

module.exports = router;
