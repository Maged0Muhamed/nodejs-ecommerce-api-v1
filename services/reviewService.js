const factory = require("./handlersFactory");
const Review = require("../models/reviewModel");

// Nested Route (Get)
exports.createFilterObject = (req, res, next) => {
  let filterObject = {};
  if (req.params.productId) filterObject = { product: req.params.productId };
  req.filterObj = filterObject;
  next();
};

// @desc Get All reviews
// @route GET /api/v1/reviews
// @access  Public
exports.getReviews = factory.getAll(Review);

// @desc Get Specific Review
// @route GET /api/v1/reviews:id
// @access  Private/Protect/User
exports.getReview = factory.getOne(Review);

// Nested Route (Create)
exports.setProductIdAndUserIdToBody = (req, res, next) => {
  if (!req.body.product) req.body.product = req.params.productId;
  if (!req.body.user) req.body.user = req.user._id;
  next();
};

// @desc Create review
// @route POST /api/v1/reviews
// @access  Private/Protect/User
exports.createReview = factory.createOne(Review);

// @desc Update Review
// @route PUT /api/v1/reviews:id
// @access  Private/Protect/User
exports.updateReview = factory.updateOne(Review);

// @desc Delete Specific Review
// @route DELETE /api/v1/reviews:id
// @access  Private/Protect/User-Admin-Manger
exports.deleteReview = factory.deleteOne(Review);
