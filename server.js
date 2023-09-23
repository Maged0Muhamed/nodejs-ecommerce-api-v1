/* eslint-disable import/no-extraneous-dependencies */
const path = require("path");

const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const compression = require("compression");

const dbConnection = require("./config/database");
const mountRoutes = require("./routes");

const ApiError = require("./utils/apiError");
const globalError = require("./middlewares/globalErrorMiddleware");

dotenv.config({ path: "config.env" });
//Database
dbConnection();

// Express app
const app = express();

// Enable  other domains to access your application
app.use(cors());
app.options("*", cors());

// compress all responses
app.use(compression());

//Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "uploads")));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`Mode => development`);
} else {
  console.log(`Mode => production`);
}

// Routes Mounting
mountRoutes(app);

app.all("*", (req, res, next) => {
  // const err = new Error(`Can not find this route : ${req.originalUrl}`);
  next(new ApiError(`Can not find this route : ${req.originalUrl}`, 400));
});
// Global Error Handling Middleware For Express
app.use(globalError);

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`app running on port => ${PORT}`);
});
// Global Error Handling Middleware For UnhandledRejection (outside express)
process.on("unhandledRejection", (err) => {
  console.error(`unhandledRejection Errors:${err.name} | ${err.message} `);
  server.close(() => {
    console.error(`Shutting down ...`);

    process.exit(1);
  });
});
