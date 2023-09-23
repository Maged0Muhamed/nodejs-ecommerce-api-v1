const SubCategory = require("../models/subCategoryModel");
const factory = require("./handlersFactory");

// Nested Route (Create)
exports.setCategoryIdToBody = (req, res, next) => {
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};
// Nested Route (Get)
exports.createFilterObject = (req, res, next) => {
  let filterObject = {};
  if (req.params.categoryId) filterObject = { category: req.params.categoryId };
  req.filterObj = filterObject;
  next();
};

// @desc Create SubCategory
// @route POST /api/v1/subcategories
// @access  Private/admin
exports.createSubCategory = factory.createOne(SubCategory);
// exports.createSubCategory = asyncHandler(async (req, res) => {
//   //Nested Route
//   if (!req.body.category) req.body.category = req.params.categoryId;
//   const { name, category } = req.body;
//   const subCategory = await SubCategory.create({
//     name,
//     slug: slugify(name),
//     category,
//   });
//   res.status(201).json({ data: subCategory });

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

// @desc Get All SubCategories
// @route GET /api/v1/subcategories
// @access  Public
exports.getSubCategories = factory.getAll(SubCategory);

// exports.getSubCategories = asyncHandler(async (req, res) => {
//   const page = req.query.page || 1;
//   const limit = req.query.limit || 5;
//   const skip = (page - 1) * limit;

//   const subCategories = await SubCategory.find(req.filterObj)
//     .skip(skip)
//     .limit(limit);

//   res.status(200).json({ results: subCategories.length, data: subCategories });
// });

// @desc Get Specific SubCategory
// @route GET /api/v1/subcategories
// @access  Public
exports.getSubCategory = factory.getOne(SubCategory);
// exports.getSubCategory = asyncHandler(async (req, res, next) => {
//   const { id } = req.params;
//   const subCategory = await SubCategory.findById(id);
//   if (!subCategory) {
//     // res.status(404).json({ msg: `no category for this id => ${id}` });
//     return next(new ApiError(`no category for this id => ${id}`, 404));
//   }
//   res.status(200).json({ data: subCategory });
// });

// @desc Update SubCategory
// @route PUT /api/v1/subcategories
// @access  Private/admin
exports.updateSubCategory = factory.updateOne(SubCategory);

// exports.updateSubCategory = asyncHandler(async (req, res, next) => {
//   const { id } = req.params;
//   const { name, category } = req.body;
//   req.body.slug = slugify(req.body.name);
//   const subCategory = await SubCategory.findByIdAndUpdate(
//     { _id: id },
//     { name, slug: slugify(name), category },
//     {
//       new: true,
//     }
//   );
//   if (!subCategory) {
//     // res.status(404).json({ msg: `no category for this id => ${id}` });
//     return next(new ApiError(`no category for this id => ${id}`, 404));
//   }
//   res.status(203).json(subCategory);
// });

// @desc Delete Specific SubCategory
// @route DELETE /api/v1/subcategories
// @access  Private/admin
exports.deleteSubCategory = factory.deleteOne(SubCategory);

// exports.deleteSubCategory = asyncHandler(async (req, res, next) => {
//   const { id } = req.params;
//   const subCategory = await SubCategory.findByIdAndDelete(id);
//   if (!subCategory) {
//     // res.status(404).json({ msg: `no category for this id => ${id}` });
//     return next(new ApiError(`no category for this id => ${id}`, 404));
//   }
//   res.status(204).send();
// });
