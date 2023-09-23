const fs = require("fs");
// eslint-disable-next-line import/no-extraneous-dependencies, node/no-unpublished-require
require("colors");
const dotenv = require("dotenv");

const Product = require("../../models/productModel");
const dbConnection = require("../../config/database");

dotenv.config({ path: "../../config.env" });

//Connect To Db
dbConnection();

//Read Data
const products = JSON.parse(fs.readFileSync("./products.json"));

const insertData = async () => {
  try {
    await Product.create(products);
    console.log("Data inserted".green.inverse);
    process.exit(1);
  } catch (error) {
    console.error(error);
  }
};
const destroyData = async () => {
  try {
    await Product.deleteMany();
    console.log("Data Destroyed".red.inverse);
    process.exit(1);
  } catch (error) {
    console.error(error);
  }
};

if (process.argv[2] === "-i") {
  insertData();
} else if (process.argv[2] === "-d") {
  destroyData();
}
