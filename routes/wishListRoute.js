const express = require("express");

const authService = require("../services/authService");

const {
  addProductToWishList,
  removeProductFromWishList,
  getLoggedUserWishList,
} = require("../services/wishListService");

const router = express.Router();
router.use(authService.protect, authService.allowedTo("user"));

router.route("/").get(getLoggedUserWishList).post(addProductToWishList);
router.route("/:productId").get().put().delete(removeProductFromWishList);

module.exports = router;
