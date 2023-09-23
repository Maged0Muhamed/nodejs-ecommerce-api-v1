const factory = require("./handlersFactory");
const Coupon = require("../models/couponModel");

// @desc Create Coupon
// @route POST /api/v1/coupons
// @access  Private/admin-manger
exports.createCoupon = factory.createOne(Coupon);

// @desc Get All Categories
// @route GET /api/v1/coupons
// @access  Private/admin-manger
exports.getCoupons = factory.getAll(Coupon);

// @desc Get Specific Coupon
// @route GET /api/v1/coupons:Id
// @access  Private/admin-manger
exports.getCoupon = factory.getOne(Coupon);

// @desc Update Coupon
// @route PUT /api/v1/coupons:Id
// @access  Private/admin-manger
exports.updateCoupon = factory.updateOne(Coupon);

// @desc Delete Specific Coupon
// @route PUT /api/v1/coupons:Id
// @access  Private/admin-manger
exports.deleteCoupon = factory.deleteOne(Coupon);
