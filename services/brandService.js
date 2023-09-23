/* eslint-disable import/no-extraneous-dependencies */
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");

const factory = require("./handlersFactory");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");
const Brand = require("../models/brandModel");

// Upload Single image
exports.uploadBrandImage = uploadSingleImage("image");
// image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `brand-${uuidv4()}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/brands/${filename}`);
  //Save image into body
  req.body.image = filename;
  next();
});

// @desc Create brand
// @route POST /api/v1/brand
// @access  Private/admin-manger
exports.createBrand = factory.createOne(Brand);
// exports.createBrand = asyncHandler(async (req, res) => {
//   const { name } = req.body;
//   const brand = await Brand.create({ name, slug: slugify(name) });
//   res.status(201).json({ data: brand });

//   // .catch((err) => {
//   //   res.status(400).send(err);
//   // });
//   // const brand = new brand({ name });
//   // brand
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
exports.getBrands = factory.getAll(Brand);
// exports.getBrands = asyncHandler(async (req, res) => {
//   const page = req.query.page || 1;
//   const limit = req.query.limit || 5;
//   const skip = (page - 1) * limit;

//   const brands = await Brand.find({}).skip(skip).limit(limit);
//   res.status(200).json({ results: brands.length, data: brands });
// });

// @desc Get Specific brand
// @route GET /api/v1/categories
// @access  Public
exports.getBrand = factory.getOne(Brand);
// exports.getBrand = asyncHandler(async (req, res, next) => {
//   const { id } = req.params;
//   const brand = await Brand.findById(id);
//   if (!brand) {
//     // res.status(404).json({ msg: `no brand for this id => ${id}` });
//     return next(new ApiError(`no brand for this id => ${id}`, 404));
//   }
//   res.status(200).json({ data: brand });
// });

// @desc Update brand
// @route PUT /api/v1/categories
// @access  Private/admin-manger
exports.updateBrand = factory.updateOne(Brand);
// exports.updateBrand = asyncHandler(async (req, res, next) => {
//   const { id } = req.params;
//   const { name } = req.body;
//   req.body.slug = slugify(req.body.name);
//   const brand = await Brand.findByIdAndUpdate(
//     { _id: id },
//     { name, slug: slugify(name) },
//     {
//       new: true,
//     }
//   );
//   if (!brand) {
//     // res.status(404).json({ msg: `no brand for this id => ${id}` });
//     return next(new ApiError(`no brand for this id => ${id}`, 404));
//   }
//   res.status(203).json(brand);
// });

// @desc Delete Specific brand
// @route DELETE /api/v1/categories
// @access  Private/admin
exports.deleteBrand = factory.deleteOne(Brand);
// exports.deleteBrand = asyncHandler(async (req, res, next) => {
//   const { id } = req.params;
//   const brand = await Brand.findByIdAndDelete(id);
//   if (!brand) {
//     // res.status(404).json({ msg: `no brand for this id => ${id}` });
//     return next(new ApiError(`no brand for this id => ${id}`, 404));
//   }
//   res.status(204).send();
// });
