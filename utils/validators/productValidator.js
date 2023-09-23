const { check, body } = require("express-validator");
const slugify = require("slugify");

const validatorMiddleware = require("../../middlewares/validatorMiddleware");

const Category = require("../../models/categoryModel");
const SubCategory = require("../../models/subCategoryModel");

exports.getProductValidator = [
  check("id").isMongoId().withMessage("Invalid Product id format"),
  validatorMiddleware,
];
exports.createProductValidator = [
  check("title")
    .notEmpty()
    .withMessage("Product title required")
    .isLength({ min: 3 })
    .withMessage("Too Short Product title to create")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true; //return true in custom hook equals next()
    }),
  body("title")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true; //return true in custom hook equals next()
    }),
  check("description")
    .notEmpty()
    .withMessage("Product description required")
    .isLength({ max: 2000 })
    .withMessage("Too Long description"),
  check("quantity")
    .notEmpty()
    .withMessage("Product quantity required")
    .isNumeric()
    .withMessage("Product quantity Must be number"),
  check("sold")
    .optional()
    .isNumeric()
    .withMessage("sold quantity Must be number"),
  check("price")
    .notEmpty()
    .withMessage("Product price required")
    .isNumeric()
    .withMessage("Product price Must be number")
    .isLength({ max: 32 })
    .withMessage("Too Long Product price to create"),
  check("priceAfterDiscount")
    .optional()
    .isNumeric()
    .withMessage("priceAfterDiscount Must be number")
    .isFloat()
    .custom((value, { req }) => {
      if (req.body.price <= value) {
        throw new Error("priceAfterDiscount must be lower than price");
      }
      return true; //return true in custom hook equals next()
    }),
  check("colors")
    .optional()
    .isArray()
    .withMessage("availableColors Must be array of strings"),
  check("imageCover").notEmpty().withMessage("Product imageCover required"),
  check("images")
    .optional()
    .isArray()
    .withMessage("Product images Must be array of strings"),
  check("category")
    .notEmpty()
    .withMessage("category Must Belong Category")
    .isMongoId()
    .withMessage("Invalid Category Id Format")
    .custom((categoryId) =>
      Category.findById(categoryId).then((category) => {
        if (!category) {
          return Promise.reject(
            new Error(`no category for this id ${categoryId}`)
          );
        }
      })
    ),

  check("subcategories")
    .optional()
    .isMongoId()
    .withMessage("Invalid Id Format")
    .custom((subcategoriesIds) =>
      SubCategory.find({ _id: { $exists: true, $in: subcategoriesIds } }).then(
        (result) => {
          if (result.length < 1 || result.length !== subcategoriesIds.length) {
            return Promise.reject(new Error(`Invalid subcategories Ids`));
          }
        }
      )
    )
    .custom((val, { req }) =>
      SubCategory.find({ category: req.body.category }).then(
        (subcategories) => {
          const subcategoriesIdsInDB = [];
          subcategories.forEach((subCategory) =>
            subcategoriesIdsInDB.push(subCategory._id.toString())
          );
          const checker = (target, arr) => target.every((v) => arr.includes(v));
          if (!checker(val, subcategoriesIdsInDB)) {
            return Promise.reject(
              new Error(`these subcategories are not belong to this category`)
            );
          }
        }
      )
    ),

  check("brand").optional().isMongoId().withMessage("Invalid Id Format"),
  check("ratingsAverage")
    .optional()
    .isNumeric()
    .withMessage("ratingAverage must be number")
    .isLength({ min: 1 })
    .withMessage("rating must be above or equal 1")
    .isLength({ max: 5 })
    .withMessage("rating must be below or equal 5"),
  check("ratingsQuantity")
    .optional()
    .isNumeric()
    .withMessage("ratingQuantity must be number"),
  validatorMiddleware,
];
exports.updateProductValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Product id format to update it "),
  check("title")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true; //return true in custom hook equals next()
    }),
  validatorMiddleware,
];
exports.deleteProductValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Product id format to delete it "),
  validatorMiddleware,
];
