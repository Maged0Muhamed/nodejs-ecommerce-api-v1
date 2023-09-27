const path = require("path");

const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const compression = require("compression");
const cors = require("cors");
const dbConnection = require("./config/database");
const globalError = require("./middlewares/globalErrorMiddleware");

dotenv.config({ path: "config.env" });

// Connect db
dbConnection();
// express app
const app = express();

//Enable other domains to access your application
app.use(cors());
app.options("*", cors());

// compress all responses
app.use(compression());

// Middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname, "uploads")));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode => ${process.env.NODE_ENV}`);
}
// Mount Routes

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, (err) => {
  console.log(`app running on port ${PORT}`);
});

// Global error handling middleware for express
app.use(globalError);

//Handel rejection outside express
process.on("unhandledRejection", (err) => {
  console.log(`unhandledRejection Error => ${err.name} | ${err.message} `);
  server.close(() => {
    console.error("Shutting down....");
    process.exit(1);
  });
});
