const express = require("express");

const router = express.Router();

const authService = require("../services/authService");

const {
  createBrand,
  getBrands,
  getBrand,
  updateBrand,
  deleteBrand,
  uploadBrandImage,
  resizeImage,
} = require("../services/brandService");
const {
  createBrandValidator,
  getBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
  // eslint-disable-next-line import/extensions
} = require("../utils/validators/brandValidator.js");

router
  .route("/")
  .get(getBrands)
  .post(
    authService.protect,
    authService.allowedTo("admin", "manger"),
    uploadBrandImage,
    resizeImage,
    createBrandValidator,
    createBrand
  );
router
  .route("/:id")
  .get(getBrandValidator, getBrand)
  .put(
    authService.protect,
    authService.allowedTo("admin", "manger"),
    uploadBrandImage,
    resizeImage,
    updateBrandValidator,
    updateBrand
  )
  .delete(
    authService.protect,
    authService.allowedTo("admin"),
    deleteBrandValidator,
    deleteBrand
  );

module.exports = router;
