/* eslint-disable import/no-extraneous-dependencies */
const multer = require("multer");

const ApiError = require("../utils/apiError");

// 1-DiskStorage Engine
// const multerStorage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/categories");
//   },
//   filename: function (req, file, cb) {
//     // category-${id}-Date.now().webp
//     const ext = file.mimetype.split("/")[1];
//     const filename = `category-${uuidv4()}-${Date.now()}.${ext}`;
//     cb(null, filename);
//   },
// });
// 2-memoryStorage Engine
// const multerStorage = multer.memoryStorage();

// const multerFilter = function (req, file, cb) {
//   if (file.mimetype.startsWith("image")) {
//     cb(null, true);
//   } else {
//     cb(new ApiError("Only Images Allowed", 400), false);
//   }
// };

// const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

exports.uploadSingleImage = (fieldNameInSchema) => {
  const multerStorage = multer.memoryStorage();

  const multerFilter = function (req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new ApiError("Only Images Allowed", 400), false);
    }
  };

  const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
  return upload.single(fieldNameInSchema);
};

exports.uploadImages = (fieldsArray) => {
  const multerStorage = multer.memoryStorage();

  const multerFilter = function (req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new ApiError("Only Images Allowed", 400), false);
    }
  };

  const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
  return upload.fields(fieldsArray);
};
