const asyncHandler = require("express-async-handler");

const User = require("../models/userModel");

// @desc Add Product to wishList
// @route POST /api/v1/wishlist
// @access  Protected/user
exports.addProductToWishList = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $addToSet: { wishList: req.body.productId } },
    {
      new: true,
    }
  );
  res.status(200).json({
    status: "success",
    message: "Product added successfully to your wishList ",
    data: user.wishList,
  });
});

// @desc Remove Product from wishList
// @route DELETE /api/v1/wishlist/:id
// @access  Protected/user
exports.removeProductFromWishList = asyncHandler(async (req, res) => {
  // $pull => remove productId from wishlist array if productId exist
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $pull: { wishList: req.params.productId } },
    {
      new: true,
    }
  );
  res.status(200).json({
    status: "success",
    message: "Product removed successfully from your wishList ",
    data: user.wishList,
  });
});
// @desc Get logged user wishList
// @route GET /api/v1/wishlist
// @access  Protected/user
exports.getLoggedUserWishList = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate({
    path: "wishList",
  });
  res.status(200).json({
    result: user.wishList.length,
    status: "success",
    data: user.wishList,
  });
});
