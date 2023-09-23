const mongoose = require("mongoose");
// Schema
const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "brand name required"],
      unique: [true, "brand must be unique"],
      minlength: [3, " too short brand name"],
      maxlength: [32, " too long brand name"],
    },
    slug: {
      type: String,
      lowercase: [true, "brand name required"],
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
    const imageUrl = `${process.env.BASE_URL}/brands/${doc.image}`;
    doc.image = imageUrl;
  }
};
// post middleware does not work with create use save middleware instead.
// getAll,getOne,updateOne
brandSchema.post("init", (doc) => {
  setImageURL(doc);
});
//createOne
brandSchema.post("save", (doc) => {
  setImageURL(doc);
});
module.exports = mongoose.model("Brand", brandSchema);
