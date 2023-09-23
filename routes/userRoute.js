const express = require("express");

const router = express.Router();

const authService = require("../services/authService");

const {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  uploadUserImage,
  resizeImage,
  changeUserPassword,
  getLoggedUserData,
  updateLoggedUserPassword,
  updateLoggedUserData,
  deActiveLoggedUserData,
} = require("../services/userService");
const {
  createUserValidator,
  getUserValidator,
  updateUserValidator,
  deleteUserValidator,
  changeUserPasswordValidator,
  updateLoggedUserValidator,
  // eslint-disable-next-line import/extensions
} = require("../utils/validators/userValidator");

//User

router.use(authService.protect);

router.get("/getMe", getLoggedUserData, getUser);
router.put("/changeMyPassword", updateLoggedUserPassword, updateUser);
router.put("/updateMe", updateLoggedUserValidator, updateLoggedUserData);
router.put("/deActiveMe", deActiveLoggedUserData);
// router.pet("/deActiveMe", authService.protect, getLoggedUserData, getUser);

//Admin
router.use(authService.protect, authService.allowedTo("admin", "manger"));

router.put(
  "/changePassword/:id",
  changeUserPasswordValidator,
  changeUserPassword
);

router
  .route("/")
  .get(getUsers)
  .post(uploadUserImage, resizeImage, createUserValidator, createUser);
router
  .route("/:id")
  .get(getUserValidator, getUser)
  .put(uploadUserImage, resizeImage, updateUserValidator, updateUser)
  .delete(deleteUserValidator, deleteUser);

module.exports = router;
