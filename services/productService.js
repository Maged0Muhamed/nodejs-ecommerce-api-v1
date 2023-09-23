/* eslint-disable import/no-extraneous-dependencies */
const asyncHandler = require("express-async-handler");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");

const Product = require("../models/productModel");
const factory = require("./handlersFactory");
const { uploadImages } = require("../middlewares/uploadImageMiddleware");
const ApiError = require("../utils/apiError");

exports.uploadProductImages = uploadImages([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 5 },
]);
exports.resizeProductImages = asyncHandler(async (req, res, next) => {
  if (req.files.imageCover) {
    const imageCoverFileName = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;

    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/products/${imageCoverFileName}`);
    //Save image into body
    req.body.imageCover = imageCoverFileName;
  }

  if (req.files.images) {
    req.body.images = [];

    await Promise.all(
      req.files.images.map(async (imageObj, index) => {
        const imageName = `product-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;

        await sharp(imageObj.buffer)
          .resize(600, 600)
          .toFormat("jpeg")
          .jpeg({ quality: 95 })
          .toFile(`uploads/products/${imageName}`);

        //Save image into body
        req.body.images.push(imageName);
      })
    );
  }
  next();
});

// @desc    Create product
// @route   GET /api/v1/Products
// @access  Private/admin-manger
exports.createProduct = factory.createOne(Product);
// exports.createProduct = asyncHandler(async (req, res) => {
//   req.body.slug = slugify(req.body.title);
//   const product = await Product.create(req.body);
//   res.status(201).json({ data: product });
// });

// @desc    Get list of products
// @route   GET /api/v1/products
// @access  Public
exports.getProducts = factory.getAll(Product, "Products");
// exports.getProducts = asyncHandler(async (req, res) => {
//   // // 1)Filtering
//   // const queryStringObj = { ...req.query };
//   // const excludesFields = ["skip", "limit", "page", "fields"];
//   // excludesFields.forEach((field) => {
//   //   delete queryStringObj[field];
//   // });
//   // //Apply filtration using [gte|gt|lte|lt]
//   // let queryStr = JSON.stringify(queryStringObj);
//   // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

//   // 2)pagination
//   // const page = req.query.page * 1 || 1;
//   // const limit = req.query.limit * 1 || 50;
//   // const skip = (page - 1) * limit;
//   const apiFeatures = new ApiFeatures(Product.find(), req.query)
//     .paginate()
//     .filter()
//     .search()
//     .limitFields()
//     .sort();
//   // Build Query
//   // let mongooseQuery = Product.find(JSON.parse(queryStr));
//   // s

//   // 3)Sorting
//   // if (req.query.sort) {
//   //   console.log(req.query.sort);
//   //   const sortBy = req.query.sort.split(",").join(" ");
//   //   mongooseQuery = mongooseQuery.sort(sortBy);
//   // } else {
//   //   mongooseQuery = mongooseQuery.sort("-createAt");
//   // }
//   // 4)Fields Limiting
//   // if (req.query.fields) {
//   //   const fields = req.query.fields.split(",").join(" ");
//   //   mongooseQuery = mongooseQuery.select(fields);
//   // } else {
//   //   mongooseQuery = mongooseQuery.select("-__v");
//   // }
//   // 5)Searching
//   // if (req.query.keyword) {
//   //   console.log(req.query.keyword);
//   //   const query = {};
//   //   query.$or = [
//   //     {
//   //       title: { $regex: req.query.keyword, $options: "i" },
//   //     },
//   //     { description: { $regex: req.query.keyword, $options: "i" } },
//   //   ];
//   //   mongooseQuery = mongooseQuery.find(query);
//   // }
//   const products = await apiFeatures.mongooseQuery;
//   // .populate({ path: "category", select: "name -_id" })
//   // .populate({ path: "brand", select: "name -_id" });

//   res.status(200).json({ results: products.length, data: products });
// });

// @desc    get specific product by id
// @route   GET /api/v1/products/:id
// @access  Public
exports.getProduct = factory.getOne(Product, "reviews");
// exports.getProduct = asyncHandler(async (req, res, next) => {
//   const { id } = req.params;
//   const product = await Product.findById(id)
//     .populate({
//       path: "category",
//       select: "name -_id",
//     })
//     .populate({ path: "brand", select: "name -_id" });

//   if (!product) {
//     return next(new ApiError(`no Product found for this id ${id}`, 404));
//   }
//   res.status(200).json({ data: product });
// });

// @desc    Update specific Product by id
// @route   Put /api/v1/Products/:id
// @access  Private/admin-manger
exports.updateProduct = factory.updateOne(Product);
// exports.updateProduct = asyncHandler(async (req, res, next) => {
//   const { id } = req.params;
//   if (req.body.title) {
//     req.body.slug = slugify(req.body.title);
//   }

//   const product = await Product.findByIdAndUpdate({ _id: id }, req.body, {
//     new: true,
//   });
//   if (!product) {
//     return next(new ApiError(`no Product found for this id ${id}`, 404));
//     // res.status(404).json({ msg: `no Product found for this id ${id}` });
//   }
//   res.status(200).json({ data: product });
// });

// @desc    Delete specific product by id
// @route   Delete /api/v1/products/:id
// @access  Private/admin
exports.deleteProduct = factory.deleteOne(Product);
// exports.deleteProduct = asyncHandler(async (req, res, next) => {
//   const { id } = req.params;
//   const product = await Product.findByIdAndDelete(id);
//   if (!product) {
//     return next(new ApiError(`no Product found for this id ${id}`, 404));
//     // res.status(404).json({ msg: `no Product found for this id ${id}` });
//   }
//   res.status(204).send();
// });
