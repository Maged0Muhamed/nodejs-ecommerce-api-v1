/* eslint-disable import/no-extraneous-dependencies */
const crypto = require("crypto");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const User = require("../models/userModel");
const ApiError = require("../utils/apiError");
const sendEmail = require("../utils/sendEmail");
const createToken = require("../utils/createToken");

// @desc signup
// @route POST /api/v1/auth/signup
// @access  Public
exports.signup = asyncHandler(async (req, res, next) => {
  //1-Create User
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  //2-Generate Token
  const token = createToken(user._id);

  res.status(201).json({ data: user, token });
});
// @desc login
// @route POST /api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  //Check if password and email in body
  //Check if user exist & check if password
  const user = await User.findOne({ email: req.body.email });
  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new ApiError("incorrect email or password", 401));
  }
  // generate token
  const token = createToken(user._id);

  res.status(200).json({ data: user, token });
});
// @desc make sure the user is logged in
exports.protect = asyncHandler(async (req, res, next) => {
  //1-Check if token , if exist get it
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
    console.log(token);
  }
  if (!token) {
    return next(
      new ApiError("You are not login to get access this route", 401)
    );
  }
  //2-verify token (no change happens), expired token
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  console.log(decoded);
  //Check if user exist
  const currentUser = await User.findById(decoded.userId);
  if (!currentUser) {
    return next(
      new ApiError(
        "the user that belong to this token does not longer exist",
        401
      )
    );
  }
  //Check if user change his password after created
  if (currentUser.passwordChangedAt) {
    const passwordChangedTimeStamp = parseInt(
      currentUser.passwordChangedAt.getTime() / 1000,
      10
    );
    // Password changed after token created
    if (passwordChangedTimeStamp > decoded.iat) {
      return next(
        new ApiError(
          "User recently changed his password , please login again ",
          401
        )
      );
    }
  }

  req.user = currentUser;

  next();
});
// @desc authorization [User Permission]
//["admin","manger"]
exports.allowedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError("You are not allowed to access this route", 403)
      );
    }
    next();
    //1)access roles
    //2)access registered user (req.user.role)
  });
// @desc Forget Password
// @route POST /api/v1/auth/forgetPassword
// @access  Public
exports.forgetPassword = asyncHandler(async (req, res, next) => {
  // Get user email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new ApiError(
        `There is no user with that email => ${req.body.email} `,
        404
      )
    );
  }
  // If user exist , Generate hash reset random 6 digits and save it in db
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");
  // console.log(resetCode);
  // console.log(hashedResetCode);
  user.passwordResetCode = hashedResetCode;
  //Add expiration time for password reset code (10 min)
  user.passwordResetExpired = Date.now() + 10 * 60 * 1000;

  user.passwordResetVerified = false;

  await user.save();
  // 3)Send the reset code via email
  const message = `Hi ${user.name},\n We received a request to reset the password on your E-shop Account. \n ${resetCode} \n Enter this code to complete the reset. \n Thanks for helping us keep your account secure.\n The E-shop Team`;
  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset code ( valid for 10min)",
      message,
    });
  } catch (err) {
    user.passwordResetCode = undefined;
    user.passwordResetExpired = undefined;
    user.passwordResetVerified = undefined;
    await user.save();
    return next(new ApiError("there is an error in sending email", 500));
  }
  res
    .status(200)
    .json({ status: "success", message: "Reset code sent to email" });
});
// @desc Verify Reset Code
// @route POST /api/v1/auth/verifyResetCode
// @access  Public
exports.verifyPassResetCode = asyncHandler(async (req, res, next) => {
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(req.body.resetCode)
    .digest("hex");
  const user = await User.findOne({
    passwordResetCode: hashedResetCode,
    passwordResetExpired: { $gt: Date.now() },
  });
  if (!user) {
    return next(new ApiError("Reset code invalid or expired", 404));
  }
  user.passwordResetVerified = true;
  await user.save();
  res.status(200).json({ status: "success" });
});
// @desc Verify Reset Password
// @route POST /api/v1/auth/resetPassword
// @access  Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  //1)Get user based on email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new ApiError(`there is no user with this email => ${req.body.email}`, 404)
    );
  }
  //2)Check if reset code verified

  if (!user.passwordResetVerified) {
    return next(
      new ApiError(`Reset code not verified => ${req.body.email}`, 400)
    );
  }
  user.password = req.body.newPassword;
  user.passwordResetCode = undefined;
  user.passwordResetExpired = undefined;
  user.passwordResetVerified = undefined;
  await user.save();
  //3)If everything okay , generate token

  const token = createToken(user._id);
  res.status(200).json({ token });
});
