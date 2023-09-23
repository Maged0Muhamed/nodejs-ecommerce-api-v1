const mongoose = require("mongoose");
const Product = require("./productModel");
// Schema
const reviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    ratings: {
      type: Number,
      min: [1, "min rating value is 1.0"],
      max: [5, "max rating value is 5.0"],
      required: [true, " Review ratings required"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review must be belong to user "],
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: [true, "Review must be belong to product "],
    },
  },
  { timestamps: true }
);
reviewSchema.pre(/^find/, function (next) {
  this.populate({ path: "user", select: "name" });
  next();
});

reviewSchema.statics.calcAverageRatingsAndQuantity = async function (
  productId
) {
  const result = await this.aggregate([
    //Stage 1 :get all reviews in specific product
    { $match: { product: productId } },
    //Stage 1 :Grouping reviews based on productId and calc ratingsAverage and increase ratingsQuantity

    {
      $group: {
        _id: "product",
        avgRatings: { $avg: "$ratings" },
        ratingsQuantity: { $sum: 1 },
      },
    },
  ]);

  console.log(result); //array

  if (result.length > 0) {
    await Product.findByIdAndUpdate(
      productId,
      {
        ratingsAverage: result[0].avgRatings,
        ratingsQuantity: result[0].ratingsQuantity,
      },
      { new: true }
    );
  } else {
    await Product.findByIdAndUpdate(
      productId,
      {
        ratingsAverage: 0,
        ratingsQuantity: 0,
      },
      { new: true }
    );
  }
};
reviewSchema.post("save", async function (next) {
  await this.constructor.calcAverageRatingsAndQuantity(this.product);
});
reviewSchema.post("remove", async function (next) {
  await this.constructor.calcAverageRatingsAndQuantity(this.product);
});
module.exports = mongoose.model("Review", reviewSchema);
