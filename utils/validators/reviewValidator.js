const { check, body } = require("express-validator");
const slugify = require("slugify");

const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const Review = require("../../models/reviewModel");
const ApiError = require("../apiError");

exports.createReviewValidator = [
  check("title").optional(),
  check("ratings")
    .notEmpty()
    .withMessage("ratings value required")
    .isFloat({ min: 1, max: 5 })
    .withMessage("ratings value must be between 1 to 5"),
  check("user")
    .notEmpty()
    .withMessage("user value required")
    .isMongoId()
    .withMessage("invalid user id format "),
  check("product")
    .notEmpty()
    .withMessage("product value required")
    .isMongoId()
    .withMessage("invalid product id format ")
    .custom((val, { req }) =>
      //Check if logged user create review before
      Review.findOne({
        user: req.user._id,
        product: req.body.product,
      }).then((review) => {
        if (review) {
          return Promise.reject(
            new Error("You already created a review before")
          );
        }
      })
    ),

  validatorMiddleware,
];
exports.getReviewValidator = [
  check("id").isMongoId().withMessage("invalid Review id format "),
  validatorMiddleware,
];
exports.updateReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("invalid Review id format ")
    .custom((val, { req }) =>
      // Check review ownership before update
      Review.findById(val).then((review) => {
        if (!review) {
          return Promise.reject(new Error(`There is no review with id ${val}`));
        }

        if (review.user._id.toString() !== req.user._id.toString()) {
          return Promise.reject(
            new Error(`Yor are not allowed to preform this action`)
          );
        }
      })
    ),
  validatorMiddleware,
];
exports.deleteReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("invalid Review id format ")
    .custom((val, { req }) => {
      // Check review ownership before delete

      if (req.user.role === "user") {
        return Review.findById(val).then((review) => {
          if (!review) {
            return Promise.reject(
              new Error(`There is no review with id ${val}`)
            );
          }

          if (review.user._id.toString() !== req.user._id.toString()) {
            return Promise.reject(
              new Error(`Yor are not allowed to preform this action`)
            );
          }
        });
      }
      return true;
    }),
  validatorMiddleware,
];
