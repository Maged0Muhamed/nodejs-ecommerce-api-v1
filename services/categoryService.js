/* eslint-disable import/no-extraneous-dependencies */
const asyncHandler = require("express-async-handler");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");

const Category = require("../models/categoryModel");
const factory = require("./handlersFactory");
const ApiError = require("../utils/apiError");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");

// Upload Single image
exports.uploadCategoryImage = uploadSingleImage("image");
// image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `category-${uuidv4()}-${Date.now()}.jpeg`;

  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/categories/${filename}`);
    //Save image into body
    req.body.image = filename;
  }
  next();
});

// @desc Create category
// @route POST /api/v1/category
// @access  Private/admin-manger
exports.createCategory = factory.createOne(Category);
// exports.createCategory = asyncHandler(async (req, res) => {
//   const { name } = req.body;
//   const category = await Category.create({ name, slug: slugify(name) });
//   res.status(201).json({ data: category });

//   // .catch((err) => {
//   //   res.status(400).send(err);
//   // });
//   // const category = new Category({ name });
//   // category
//   //   .save()
//   //   .then((doc) => {
//   //     res.json(doc);
//   //   })
//   //   .catch((err) => {
//   //     console.error(`${err.message}`);
//   //   });
// });

// @desc Get All Categories
// @route GET /api/v1/categories
// @access  Public
exports.getCategories = factory.getAll(Category);
// exports.getCategories = asyncHandler(async (req, res) => {
//   const page = req.query.page || 1;
//   const limit = req.query.limit || 5;
//   const skip = (page - 1) * limit;

//   const categories = await Category.find({}).skip(skip).limit(limit);
//   res.status(200).json({ results: categories.length, data: categories });
// });

// @desc Get Specific Category
// @route GET /api/v1/categories
// @access  Public
exports.getCategory = factory.getOne(Category);
// exports.getCategory = asyncHandler(async (req, res, next) => {
//   const { id } = req.params;
//   const category = await Category.findById(id);
//   if (!category) {
//     // res.status(404).json({ msg: `no category for this id => ${id}` });
//     return next(new ApiError(`no category for this id => ${id}`, 404));
//   }
//   res.status(200).json({ data: category });
// });

// @desc Update Category
// @route PUT /api/v1/categories
// @access  Private/admin-manger
exports.updateCategory = factory.updateOne(Category);
// exports.updateCategory = asyncHandler(async (req, res, next) => {
//   const { id } = req.params;
//   const { name } = req.body;
//   req.body.slug = slugify(req.body.name);
//   const category = await Category.findByIdAndUpdate(
//     { _id: id },
//     { name, slug: slugify(name) },
//     {
//       new: true,
//     }
//   );
//   if (!category) {
//     // res.status(404).json({ msg: `no category for this id => ${id}` });
//     return next(new ApiError(`no category for this id => ${id}`, 404));
//   }
//   res.status(203).json(category);
// });

// @desc Delete Specific Category
// @route DELETE /api/v1/categories
// @access  Private/admin
exports.deleteCategory = factory.deleteOne(Category);
// exports.deleteCategory = asyncHandler(async (req, res, next) => {
//   const { id } = req.params;
//   const category = await Category.findByIdAndDelete(id);
//   if (!category) {
//     // res.status(404).json({ msg: `no category for this id => ${id}` });
//     return next(new ApiError(`no category for this id => ${id}`, 404));
//   }
//   res.status(204).send();
// });
