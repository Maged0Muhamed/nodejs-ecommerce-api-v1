/* eslint-disable import/no-extraneous-dependencies */
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: [true, "name required"] },
    slug: { type: String, lowercase: true },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      required: [true, "name required"],
    },
    password: {
      type: String,
      required: [true, "password required"],
      minlength: [6, "too short password"],
    },
    passwordResetCode: String,
    passwordResetExpired: Date,
    passwordResetVerified: Boolean,
    passwordChangedAt: Date,
    phone: {
      type: String,
    },
    profileImage: {
      type: String,
    },
    role: { type: String, enum: ["user", "manger", "admin"], default: "user" },
    active: { type: Boolean, default: true },
    // child reference ( one to many )
    wishList: [{ type: mongoose.Schema.ObjectId, ref: "Product" }],
    addresses: [
      {
        id: { type: mongoose.Schema.Types.ObjectId },
        alias: String,
        details: String,
        phone: String,
        city: String,
        postalCode: String,
      },
    ],
  },
  { timestamps: true }
);
//Mongoose schema
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  // Hashing user password
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

module.exports = mongoose.model("User", userSchema);
