const express = require("express");

const router = express.Router({ mergeParams: true });

const authService = require("../services/authService");

const {
  createReview,
  getReviews,
  getReview,
  updateReview,
  deleteReview,
  createFilterObject,
  setProductIdAndUserIdToBody,
} = require("../services/reviewService");
const {
  createReviewValidator,
  updateReviewValidator,
  getReviewValidator,
  deleteReviewValidator,
  // eslint-disable-next-line import/extensions
} = require("../utils/validators/reviewValidator.js");

router
  .route("/")
  .get(createFilterObject, getReviews)
  .post(
    authService.protect,
    authService.allowedTo("user"),
    setProductIdAndUserIdToBody,
    createReviewValidator,
    createReview
  );
router
  .route("/:id")
  .get(getReview)
  .put(
    authService.protect,
    authService.allowedTo("user"),
    updateReviewValidator,
    updateReview
  )
  .delete(
    authService.protect,
    authService.allowedTo("admin", "user", "manger"),
    deleteReviewValidator,
    deleteReview
  );

module.exports = router;
