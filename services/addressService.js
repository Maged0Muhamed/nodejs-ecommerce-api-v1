const asyncHandler = require("express-async-handler");

const User = require("../models/userModel");

// @desc Add Address to User addresses list
// @route POST /api/v1/addresses
// @access  Protected/user
exports.addAddress = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $addToSet: { addresses: req.body } },
    {
      new: true,
    }
  );
  res.status(200).json({
    status: "success",
    message: "address added successfully to your addresses List",
    data: user.addresses,
  });
});

// @desc Remove Product from wishList
// @route DELETE /api/v1/addresses/:addressId
// @access  Protected/user
exports.removeAddress = asyncHandler(async (req, res) => {
  // $pull => remove addressId from addresses array if addressId exist
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $pull: { addresses: { _id: req.params.addressId } } },
    {
      new: true,
    }
  );
  res.status(200).json({
    status: "success",
    message: "address removed successfully From your addresses List ",
    data: user.addresses,
  });
});
// @desc Get logged user addresses
// @route GET /api/v1/addresses
// @access  Protected/user
exports.getLoggedUserAddresses = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate("addresses");
  res.status(200).json({
    result: user.addresses.length,
    status: "success",
    data: user.addresses,
  });
});
