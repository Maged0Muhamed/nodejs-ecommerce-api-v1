const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");

const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const couponModel = require("../models/couponModel");

const calcTotalPrice = (userCart) => {
  // Calculate total cart price
  let totalPrice = 0;
  userCart.cartItems.forEach((item) => {
    totalPrice += item.quantity * item.price;
  });
  userCart.totalCartPrice = totalPrice;
  userCart.totalPriceAfterDiscount = undefined;

  return totalPrice;
};
// @desc Add product to cart
// @route POST /api/v1/cart
// @access  Private/user
exports.addProductToCart = asyncHandler(async (req, res, next) => {
  const { productId, color } = req.body;
  // 1) Get cart for logged user
  const product = await Product.findById(productId);
  let userCart = await Cart.findOne({ user: req.user._id });
  if (!userCart) {
    // Create cart for logged user with product
    userCart = await Cart.create({
      user: req.user._id,
      cartItems: [{ product: productId, color, price: product.price }],
    });
  } else {
    // product exist in cart , update product quantity
    const productIndex = userCart.cartItems.findIndex(
      (item) => item.product.toString() === productId && item.color === color
    );

    if (productIndex > -1) {
      const cartItem = userCart.cartItems[productIndex];
      cartItem.quantity += 1;

      userCart.cartItems[productIndex] = cartItem;
    } else {
      // product not exist in cart , push product to cartItems array
      userCart.cartItems.push({
        product: productId,
        color,
        price: product.price,
      });
    }
  }
  // Calculate total cart price
  calcTotalPrice(userCart);

  await userCart.save();

  res.status(200).json({
    status: "success",
    message: "Product added to cart successfully",
    data: userCart,
  });
});
// @desc Get cart user
// @route GET /api/v1/cart
// @access  Private/user
exports.getLoggedUserCart = asyncHandler(async (req, res, next) => {
  const userCart = await Cart.findOne({ user: req.user._id });
  if (!userCart) {
    return next(
      new ApiError(`there is no cart for this user ${req.user._id}`, 404)
    );
  }
  res.status(200).json({
    status: "success",
    numOfCartItems: userCart.cartItems.length,
    data: userCart,
  });
});
// @desc Remove specific cart item
// @route DELETE /api/v1/cart:itemId
// @access  Private/user
exports.removeSpecificCartItem = asyncHandler(async (req, res, next) => {
  const userCart = await Cart.findOneAndUpdate(
    req.user._id,
    { $pull: { cartItems: { _id: req.params.itemId } } },
    { new: true }
  );
  calcTotalPrice(userCart);
  userCart.save();
  res.status(200).json({
    status: "success",
    numOfCartItems: userCart.cartItems.length,
    data: userCart,
  });
});
// @desc Clear logged user cart
// @route DELETE /api/v1/cart
// @access  Private/user
exports.clearCart = asyncHandler(async (req, res, next) => {
  await Cart.findOneAndDelete({ user: req.user._id });
  res.status(204).send();
});
// @desc Update specific cart item quantity
// @route PUT /api/v1/cart/:itemId
// @access  Private/user
exports.updateCartItemQuantity = asyncHandler(async (req, res, next) => {
  const { quantity } = req.body;
  const userCart = await Cart.findOne({ user: req.user._id });
  if (!userCart) {
    return next(
      new ApiError(`there is no cart for user =>${req.user._id}`, 404)
    );
  }
  const itemIndex = userCart.cartItems.findIndex(
    (item) => item._id.toString() === req.params.itemId
  );
  if (itemIndex > -1) {
    const cartItem = userCart.cartItems[itemIndex];
    cartItem.quantity = quantity;
    userCart.cartItems[itemIndex] = cartItem;
  } else {
    return next(
      new ApiError(`there is no item for id =>${req.params.itemId}`, 404)
    );
  }
  calcTotalPrice(userCart);

  res.status(200).json({
    status: "success",
    numOfCartItems: userCart.cartItems.length,
    data: userCart,
  });
});
// @desc Apply coupon on logged user cart
// @route PUT /api/v1/cart/applyCoupon
// @access  Private/user
exports.applyCoupon = asyncHandler(async (req, res, next) => {
  console.log(req.body);
  //1) Get coupon based on coupon name
  const coupon = await couponModel.findOne({
    name: req.body.coupon,
    expire: { $gt: Date.now() },
  });
  if (!coupon) {
    return next(new ApiError("Coupon is invalid or expired", 400));
  }

  //2) Get logged user user cart to get total cart price
  const userCart = await Cart.findOne({ user: req.user._id });

  //3)  Calculate price after discount
  const totalPrice = userCart.totalCartPrice;
  const totalPriceAfterDiscount = (
    totalPrice -
    (totalPrice * coupon.discount) / 100
  ).toFixed(2); //99.23.
  userCart.totalPriceAfterDiscount = totalPriceAfterDiscount;
  await userCart.save();

  res.status(200).json({
    status: "success",
    numOfCartItems: userCart.cartItems.length,
    data: userCart,
  });
});
