/* eslint-disable import/no-extraneous-dependencies */
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");

const { default: slugify } = require("slugify");
const factory = require("./handlersFactory");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");
const User = require("../models/userModel");
const ApiError = require("../utils/apiError");
const createToken = require("../utils/createToken");

// Upload Single image
exports.uploadUserImage = uploadSingleImage("profileImage");
// image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `user-${uuidv4()}-${Date.now()}.jpeg`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/users/${filename}`);
    //Save image into body
    req.body.profileImage = filename;
  }

  next();
});

// @desc Create user
// @route POST /api/v1/users
// @access  Private/admin-manger
exports.createUser = factory.createOne(User);
// exports.createUser = asyncHandler(async (req, res) => {
//   const { name } = req.body;
//   const user = await User.create({ name, slug: slugify(name) });
//   res.status(201).json({ data: user });

//   // .catch((err) => {
//   //   res.status(400).send(err);
//   // });
//   // const user = new user({ name });
//   // user
//   //   .save()
//   //   .then((doc) => {
//   //     res.json(doc);
//   //   })
//   //   .catch((err) => {
//   //     console.error(`${err.message}`);
//   //   });
// });

// @desc Get All users
// @route GET /api/v1/users
// @access  Private/admin
exports.getUsers = factory.getAll(User);
// exports.getUser = asyncHandler(async (req, res) => {
//   const page = req.query.page || 1;
//   const limit = req.query.limit || 5;
//   const skip = (page - 1) * limit;

//   const users = await User.find({}).skip(skip).limit(limit);
//   res.status(200).json({ results: users.length, data: users });
// });

// @desc Get Specific user
// @route GET /api/v1/users/:id
// @access  Private/admin
exports.getUser = factory.getOne(User);
// exports.getUser= asyncHandler(async (req, res, next) => {
//   const { id } = req.params;
//   const user = await User.findById(id);
//   if (!user) {
//     // res.status(404).json({ msg: `no user for this id => ${id}` });
//     return next(new ApiError(`no user for this id => ${id}`, 404));
//   }
//   res.status(200).json({ data: user });
// });

// @desc Update user
// @route PUT /api/v1/users/:id
// @access  Private/admin
exports.updateUser = asyncHandler(async (req, res, next) => {
  // req.body.slug = slugify(req.body.name);
  const document = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      slug: req.body.slug,
      phone: req.body.phone,
      email: req.body.email,
      profileImage: req.body.profileImage,
      role: req.body.role,
    },
    {
      new: true,
    }
  );
  if (!document) {
    // res.status(404).json({ msg: `no document for this id => ${id}` });
    return next(
      new ApiError(`no document for this id => ${req.params.id}`, 404)
    );
  }
  res.status(203).json(document);
});
// exports.updateUser = asyncHandler(async (req, res, next) => {
//   const { id } = req.params;
//   const { name } = req.body;
//   req.body.slug = slugify(req.body.name);
//   const user = await User.findByIdAndUpdate(
//     { _id: id },
//     { name, slug: slugify(name) },
//     {
//       new: true,
//     }
//   );
//   if (!user) {
//     // res.status(404).json({ msg: `no user for this id => ${id}` });
//     return next(new ApiError(`no user for this id => ${id}`, 404));
//   }
//   res.status(203).json(user);
// });

// @desc Delete specific use
// @route DELETE /api/v1/users/:id
// @access  Private/admin
exports.deleteUser = factory.deleteOne(User);
// exports.deleteUser = asyncHandler(async (req, res, next) => {
//   const { id } = req.params;
//   const user = await User.findByIdAndDelete(id);
//   if (!user) {
//     // res.status(404).json({ msg: `no user for this id => ${id}` });
//     return next(new ApiError(`no user for this id => ${id}`, 404));
//   }
//   res.status(204).send();
// });

exports.changeUserPassword = asyncHandler(async (req, res, next) => {
  const document = await User.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );
  if (!document) {
    // res.status(404).json({ msg: `no document for this id => ${id}` });
    return next(
      new ApiError(`no document for this id => ${req.params.id}`, 404)
    );
  }
  res.status(203).json(document);
});

// @desc Get logged user data
// @route GET /api/v1/users/getMe
// @access  Private/Protect
exports.getLoggedUserData = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});
// @desc Update logged user password
// @route PUT /api/v1/users/changePassword
// @access  Private/Protect
exports.updateLoggedUserPassword = asyncHandler(async (req, res, next) => {
  // 1) Update user Password based user payload (user_id)
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );
  //Generate Token
  const token = createToken(user._id);

  res.status(200).json({ data: user, token });
});

// @desc Update logged user Data (without password,role)
// @route PUT /api/v1/users/updateLoggedUserData
// @access  Private/Protect
exports.updateLoggedUserData = asyncHandler(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      slug: slugify(req.body.name),
      email: req.body.email,
      phone: req.body.phone,
    },
    { new: true }
  );

  res.status(200).json({ data: updatedUser });
});
// @desc deActive Logged User Data (active:false)
// @route PUT /api/v1/users/deActiveLoggedUserData
// @access  Private/Protect
exports.deActiveLoggedUserData = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      active: false,
    },
    { new: true }
  );

  res.status(204).json({ status: "success" });
});
