/* eslint-disable import/no-extraneous-dependencies */
const { check, body } = require("express-validator");
const slugify = require("slugify");
const bcrypt = require("bcryptjs");

const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const User = require("../../models/userModel");

exports.createUserValidator = [
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
  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid Phone Number Only Accept EG And SA Phone Numbers"),
  check("profileImage").optional(),
  check("role").optional(),
  validatorMiddleware,
];
exports.getUserValidator = [
  check("id").isMongoId().withMessage("invalid User id format "),
  validatorMiddleware,
];
exports.updateUserValidator = [
  check("id").isMongoId().withMessage("invalid User id format "),
  body("name")
    .optional()
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
  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid Phone Number Only Accept EG And SA Phone Numbers"),
  check("profileImage").optional(),
  check("role").optional(),
  validatorMiddleware,
];
exports.deleteUserValidator = [
  check("id").isMongoId().withMessage("invalid User id format "),
  validatorMiddleware,
];

exports.changeUserPasswordValidator = [
  check("id").isMongoId().withMessage("invalid User id format "),
  body("currentPassword")
    .notEmpty()
    .withMessage("You must enter your current password ")
    .isLength({ min: 6 })
    .withMessage("password must be at least 6 characters"),
  body("passwordConfirm")
    .notEmpty()
    .withMessage("You must enter your password Confirm ")
    .isLength({ min: 6 })
    .withMessage("password must be at least 6 characters"),
  body("password")
    .notEmpty()
    .withMessage("You must enter your current password ")
    .custom(async (val, { req }) => {
      //2- verify current password
      const user = await User.findById(req.params.id);

      if (!user) {
        throw new Error(`there is no user for this ${req.params.id}`);
      }

      console.log(req.body.currentPassword);
      console.log(user.password);

      const isCorrectPassword = await bcrypt.compare(
        req.body.currentPassword, // Password as the user written
        user.password // Password of the user from db with hashing layer
      );
      if (!isCorrectPassword) throw new Error(`Incorrect current password`);

      //2- verify password confirm
      if (val !== req.body.passwordConfirm) {
        throw new Error(`Incorrect password Confirmation`);
      }
      return true;
    }),

  validatorMiddleware,
];

exports.updateLoggedUserValidator = [
  body("name")
    .optional()
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
  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid Phone Number Only Accept EG And SA Phone Numbers"),

  validatorMiddleware,
];
