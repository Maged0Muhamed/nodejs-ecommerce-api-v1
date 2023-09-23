const mongoose = require("mongoose");

const dbConnection = () => {
  mongoose
    .connect(process.env.DB_URI)
    .then((con) => {
      console.log(`database connected => ${con.connection.host}`);
    })
    // .catch((err) => {
    //   console.error(`Database error:${err.message}`);
    //   process.exit(1);
    // });
};
module.exports = dbConnection;
