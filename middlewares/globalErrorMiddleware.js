const ApiError = require("../utils/apiError");

/* eslint-disable no-use-before-define */
const sendErrorForDev = (res, err) =>
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
const sendErrorForProd = (res, err) =>
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
const handleJwtInvalidSignature = (message, statusCode) =>
  new ApiError(`${message}`, statusCode);
const globalError = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (process.env.NODE_ENV === "development") {
    sendErrorForDev(res, err);
  } else {
    if (err.name === "JsonWebTokenError")
      err = handleJwtInvalidSignature(
        "Invalid token , please login again",
        401
      );
    if (err.name === "TokenExpiredError")
      err = handleJwtInvalidSignature(
        "Invalid token cause TokenExpired, please login again",
        401
      );
    sendErrorForProd(res, err);
  }
};
module.exports = globalError;
