const mongoose = require("mongoose");
// Schema
const cartSchema = new mongoose.Schema(
  {
    cartItems: [
      {
        product: {
          type: mongoose.Schema.ObjectId,
          ref: "Product",
        },
        quantity: { type: Number, default: 1 },
        color: String,
        price: Number,
      },
    ],
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    totalCartPrice: Number,
    totalPriceAfterDiscount: Number,
    // coupon: { type: mongoose.Schema.ObjectId, ref: "Coupon" },
  },
  { timestamps: true }
);
cartSchema.pre(/^find/, function (next) {
  this.populate({
    path: "cartItems.product",
    select: "title description -category -_id",
  });
  next();
});
module.exports = mongoose.model("Cart", cartSchema);
