const express = require("express");

const authService = require("../services/authService");
const {
  addAddress,
  getLoggedUserAddresses,
  removeAddress,
} = require("../services/addressService");

// const {

// } = require("../services/addressService.js");

const router = express.Router();
router.use(authService.protect, authService.allowedTo("user"));

router.route("/").get(getLoggedUserAddresses).post(addAddress);
router.route("/:addressId").get().put().delete(removeAddress);

module.exports = router;
