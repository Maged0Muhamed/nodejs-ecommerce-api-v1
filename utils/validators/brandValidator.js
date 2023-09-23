const { check, body } = require("express-validator");
const slugify = require("slugify");

const validatorMiddleware = require("../../middlewares/validatorMiddleware");

exports.createBrandValidator = [
  check("name")
    .notEmpty()
    .withMessage("Brand required ")
    .isLength({ min: 3 })
    .withMessage("too short Brand name")
    .isLength({ max: 32 })
    .withMessage("too long Brand name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true; //return true in custom hook equals next()
    }),
  validatorMiddleware,
];
exports.getBrandValidator = [
  check("id").isMongoId().withMessage("invalid Brand id format "),
  validatorMiddleware,
];
exports.updateBrandValidator = [
  check("id").isMongoId().withMessage("invalid Brand id format "),
  body("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true; //return true in custom hook equals next()
    }),
  validatorMiddleware,
];
exports.deleteBrandValidator = [
  check("id").isMongoId().withMessage("invalid Brand id format "),
  validatorMiddleware,
];
