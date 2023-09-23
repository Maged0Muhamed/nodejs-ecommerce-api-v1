const mongoose = require("mongoose");
// Schema
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "category name required"],
      unique: [true, "category must be unique"],
      minlength: [3, " too short category name"],
      maxlength: [32, " too long category name"],
    },
    slug: {
      type: String,
      lowercase: [true, "category name required"],
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);
// Refactor Function
const setImageURL = (doc) => {
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/categories/${doc.image}`;
    doc.image = imageUrl;
  }
};
// post middleware does not work with create use save middleware instead.
// getAll,getOne,updateOne
categorySchema.post("init", (doc) => {
  setImageURL(doc);
});
//createOne
categorySchema.post("save", (doc) => {
  setImageURL(doc);
});
module.exports = mongoose.model("Category", categorySchema);
