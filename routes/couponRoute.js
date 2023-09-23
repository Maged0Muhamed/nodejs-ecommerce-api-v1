const express = require("express");

const router = express.Router();

const authService = require("../services/authService");

const {
  createCoupon,
  getCoupons,
  getCoupon,
  updateCoupon,
  deleteCoupon,
} = require("../services/CouponService");

router.use(authService.protect, authService.allowedTo("admin", "manger"));

router.route("/").get(getCoupons).post(createCoupon);
router.route("/:id").get(getCoupon).put(updateCoupon).delete(deleteCoupon);

module.exports = router;
