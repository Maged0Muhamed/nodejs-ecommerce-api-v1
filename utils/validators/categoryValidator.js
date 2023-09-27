const { check, body } = require("express-validator");
const slugify = require("slugify");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

exports.createCategoryValidator = [
  check("name").notEmpty().withMessage("Category required"),
  isLength({ min: 3 }).withMessage("Too short category name"),
  isLength({ max: 3 }).withMessage("Too Long category name"),
  custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  validatorMiddleware,
];

exports.updateCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Category Id Format "),
  body("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];
exports.deleteCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Category Id Format "),
  validatorMiddleware,
];
