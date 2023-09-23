// eslint-disable-next-line import/no-extraneous-dependencies
const stripe = require("stripe")(
  "sk_test_51NsMV6AiAYkkxN6W57KFf2PiShe7kQmsf10748yqJ6X6nUAPMq03RHeEBM4aOPDn9pAQS4ZUQVpND3i5Tvsy40mf00EZj12UEq"
);
const { v4: uuidv4 } = require("uuid");

const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");

const Order = require("../models/orderModel");
const factory = require("./handlersFactory");
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");

// @desc Create cash order
// @route POST /api/v1/orders:cartId
// @access  Protected/user
exports.createCashOrder = asyncHandler(async (req, res, next) => {
  // app settings
  const taxPrice = 0;
  const shippingPrice = 0;

  // 1)   Get cart depend on cartId
  const userCart = await Cart.findById(req.params.cartId);
  if (!userCart) {
    return next(
      new ApiError(`There is no such cart with id ${req.params.cartId} `, 404)
    );
  }

  // 2)   Get order price depend on cart price "check if coupon applied"
  const cartPrice = userCart.totalPriceAfterDiscount
    ? userCart.totalPriceAfterDiscount
    : userCart.totalCartPrice;
  const totalOrderPrice = cartPrice + taxPrice + shippingPrice;

  // 3)  Create order with default payment method type => cash
  const order = await Order.create({
    user: req.user._id,
    cartItems: userCart.cartItems,
    shippingAddress: req.body.shippingAddress,
    totalOrderPrice,
  });
  // 4)  After creating order , decrement product quantity .increasing product sold
  if (order) {
    const bulkOption = userCart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));
    await Product.bulkWrite(bulkOption, {});

    // 5)  clear cart depend on cartId
    await Cart.findByIdAndDelete(req.params.cartId);
  }

  res.status(201).json({ status: "success", data: order });
});
exports.filterOrderForLoggedUser = asyncHandler(async (req, res, next) => {
  if (req.user.role === "user") {
    req.filterObj = { user: req.user._id };
  } else req.filterObj = {};
  next();
});

// @desc Get All orders
// @route POST /api/v1/orders
// @access  Protected/user-admin-manger
exports.getAllOrders = factory.getAll(Order);

// @desc Get specific order
// @route POST /api/v1/orders:id
// @access  Protected/user-admin-manger
exports.getSpecificOrder = factory.getOne(Order);

// @desc Update order paid status
// @route PUT /api/v1/orders:id/pay
// @access  Protected/admin-manger
exports.updateOrderToPaid = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!Order) {
    return next(
      new ApiError(
        `There is no such a order with this id ${req.params.id}`,
        404
      )
    );
  }
  order.isPaid = true;
  order.paidAt = Date.now();
  const updateOrder = await order.save();
  res.status(200).json({ status: "success", data: updateOrder });
});

// @desc Update order delivered status
// @route PUT /api/v1/orders:id/deliver
// @access  Protected/admin-manger
exports.updateOrderToDeliver = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!Order) {
    return next(
      new ApiError(
        `There is no such a order with this id ${req.params.id}`,
        404
      )
    );
  }
  order.isDelivered = true;
  order.deliveredAt = Date.now();
  const deliveredOrder = await order.save();
  res.status(200).json({ status: "success", data: deliveredOrder });
});
// @desc Get checkout session from stripe and send it as response
// @route GET /api/v1/orders/checkout-session/:cartId
// @access  Protected/user
exports.checkoutSession = asyncHandler(async (req, res, next) => {
  const taxPrice = 0;
  const shippingPrice = 0;
  // 1)   Get cart depend on cartId
  const userCart = await Cart.findById(req.params.cartId);
  if (!userCart) {
    return next(
      new ApiError(`There is no such cart with id ${req.params.cartId} `, 404)
    );
  }

  // 2)   Get order price depend on cart price "check if coupon applied"
  const cartPrice = userCart.totalPriceAfterDiscount
    ? userCart.totalPriceAfterDiscount
    : userCart.totalCartPrice;

  const totalOrderPrice = cartPrice + taxPrice + shippingPrice;

  // 3) Create stripe checkout session
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "egp",
          unit_amount: totalOrderPrice * 100,

          product_data: {
            name: userCart.cartItems[0].product.title,
            description: userCart.cartItems[0].product.description,
          },
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${req.protocol}://${req.get("host")}/api/v1/orders`,
    cancel_url: `${req.protocol}://${req.get("host")}/api/v1/cart`,
    customer_email: req.user.email,
    client_reference_id: req.params.cartId,
    metadata: req.body.shippingAddress,
  });

  // 4) send session to response
  res.status(200).json({ status: "success", session });
});
