const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "Category Name Required"],
      unique: [true, "Category Name Must Be Unique"],
      minLength: [3, "Too Short Category Name "],
      maxLength: [30, "Too Long Category Name "],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  { timestamps: true }
);

const categoryModel = mongoose.model("Category", categorySchema);
module.exports = categoryModel;
