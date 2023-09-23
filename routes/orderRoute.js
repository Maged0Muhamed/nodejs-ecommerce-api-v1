const express = require("express");

const authService = require("../services/authService");

const {
  createCashOrder,
  getAllOrders,
  getSpecificOrder,
  filterOrderForLoggedUser,

  updateOrderToPaid,
  updateOrderToDeliver,
  checkoutSession,
} = require("../services/orderService");

const router = express.Router();

router.use(authService.protect);

router
  .route("/checkout-session/:cartId")
  .get(authService.allowedTo("user"), checkoutSession);

router.route("/:cartId").post(authService.allowedTo("user"), createCashOrder);

router
  .route("/")
  .get(
    authService.allowedTo("user", "admin", "manger"),
    filterOrderForLoggedUser,
    getAllOrders
  );
router.route("/:id").get(getSpecificOrder);

router
  .route("/:id/pay")
  .put(authService.allowedTo("admin", "manger"), updateOrderToPaid);
router
  .route("/:id/deliver")
  .put(authService.allowedTo("admin", "manger"), updateOrderToDeliver);

module.exports = router;
