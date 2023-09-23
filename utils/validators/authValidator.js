/* eslint-disable import/no-extraneous-dependencies */
const { check } = require("express-validator");
const slugify = require("slugify");

const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const User = require("../../models/userModel");
// @desc Create Signup
// @route POST /api/v1/auth/signup
// @access  Public
exports.signUpValidator = [
  check("name")
    .notEmpty()
    .withMessage("User required ")
    .isLength({ min: 3 })
    .withMessage("too short User name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true; //return true in custom hook equals next()
    }),

  check("email")
    .notEmpty()
    .withMessage("email required ")
    .isEmail()
    .withMessage("Invalid Email Address")
    .custom((val) =>
      User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("E-mail already in use"));
        }
      })
    ),
  check("password")
    .notEmpty()
    .withMessage("password required ")
    .isLength({ min: 6 })
    .withMessage("password must be at least 6 characters")
    .custom((password, { req }) => {
      if (password !== req.body.passwordConfirm) {
        throw new Error("passwordConfirmation is incorrect");
      }
      return true;
    }),
  check("passwordConfirm")
    .notEmpty()
    .withMessage("password Confirmation required ")
    .isLength({ min: 6 })
    .withMessage("password must be at least 6 characters"),

  validatorMiddleware,
];
exports.loginValidator = [
  check("email")
    .notEmpty()
    .withMessage("email required ")
    .isEmail()
    .withMessage("Invalid Email Address"),
  check("password")
    .notEmpty()
    .withMessage("password required ")
    .isLength({ min: 6 })
    .withMessage("password must be at least 6 characters"),

  validatorMiddleware,
];
