const ApiError = require("../utils/apiError");

const sendErrorForDev = (err, res) =>
  res.status(err.statusCode).json({
    error: err,
    status: err.status,
    message: err.message,
    stack: err.stack,
  });
const sendErrorForProd = (err, res) =>
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
const handleJwtInvalidSignature = () =>
  new ApiError("Invalid token , please login again ", 401);
const handleJwtExpired = () =>
  new ApiError("Invalid token , please login again ", 401);

const globalError = (err, res, req, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if ((process.env.NODE_ENV = "development")) {
    sendErrorForDev();
  } else {
    if (err.name === "JsonWebTokenError") err = handleJwtInvalidSignature();
    if (err.name === "TokenExpiredError") err = handleJwtExpired();
    sendErrorForProd();
  }
};
module.exports = globalError;
