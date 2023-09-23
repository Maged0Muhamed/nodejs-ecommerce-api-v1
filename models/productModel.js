const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      unique: true,
      minLength: [3, "Too Short product title"],
      maxLength: [100, "Too Long product title"],
      required: [true, "product title  Required "],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    description: {
      type: String,
      minLength: [3, "Too Short product description "],
      maxLength: [2000, "Too Long product description "],
      required: [true, "product description Required "],
    },
    quantity: {
      type: Number,
      required: [true, "product quantity is Required "],
    },
    sold: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      trim: true,
      max: [200000, "Too Long product price"],
      required: [true, "product price is Required "],
    },
    priceAfterDiscount: {
      type: Number,
    },
    colors: [String],
    imageCover: {
      type: String,
      required: [true, "product imageCover is Required"],
    },
    images: [String],
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "Product Must Be Belong To A Category"],
    },
    subcategories: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "SubCategory",
      },
    ],
    brand: {
      type: mongoose.Schema.ObjectId,
      ref: "Brand",
    },
    ratingsAverage: {
      type: Number,
      min: [1, "rating must be above or equal 1 "],
      max: [5, "rating must be below or equal 5 "],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true, //To Enable Virtual Populate
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
productSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "product",
  localField: "_id",
});
// Refactor Function
const setImageURL = (doc) => {
  if (doc.imageCover) {
    const imageUrl = `${process.env.BASE_URL}/products/${doc.imageCover}`;
    doc.imageCover = imageUrl;
  }
  if (doc.images) {
    const imagesArr = [];
    doc.images.forEach((image) => {
      const imageUrl = `${process.env.BASE_URL}/products/${image}`;
      imagesArr.push(imageUrl);
    });
    doc.images = imagesArr;
  }
};
// post middleware does not work with create use save middleware instead.
// getAll,getOne,updateOne
productSchema.post("init", (doc) => {
  setImageURL(doc);
});
//createOne
productSchema.post("save", (doc) => {
  setImageURL(doc);
});
// mongoose
productSchema.pre(/^find/, function (next) {
  this.populate({ path: "category", select: "name" });
  next();
});

module.exports = mongoose.model("Product", productSchema);
