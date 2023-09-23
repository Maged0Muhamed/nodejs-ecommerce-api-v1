const express = require("express");

const router = express.Router();

const authService = require("../services/authService");

const {
  addProductToCart,
  getLoggedUserCart,
  removeSpecificCartItem,
  clearCart,
  updateCartItemQuantity,
  applyCoupon,
} = require("../services/cartService");

router.use(authService.protect, authService.allowedTo("user"));

router
  .route("/")
  .get(getLoggedUserCart)
  .post(addProductToCart)
  .delete(clearCart);

router.put("/applyCoupon", applyCoupon);
router
  .route("/:itemId")
  .get()
  .put(updateCartItemQuantity)
  .delete(removeSpecificCartItem);

module.exports = router;
