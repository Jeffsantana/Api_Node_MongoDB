const mongoose = require("mongoose");
const env = require("dotenv").config().parsed;

mongoose.connect(
  `mongodb://${env.DB_USER}:${env.DB_PASS}@${env.DB_HOST}:${env.DB_PORT}/${
    env.DB_NAME
  }`,
  { useNewUrlParser: true, useCreateIndex: true },
  function(error) {
    if (error) console.log(error);
    else console.log("Mongodb connected!");
  }
);

mongoose.Promise = global.Promise;
mongoose.Error.messages.Number.min =
  "The '{VALUE}' is lower than the minimum threshold of '{MIN}'. ";
mongoose.Error.messages.Number.max =
  "The '{VALUE}' is higher than the maximum threshold of'{MAX}'. ";
mongoose.Error.messages.String.enum = "The '{VALUE}' is not valid '{PATH}'. ";
mongoose.Error.messages.general.required = "The field '{PATH}' is required.";

module.exports = mongoose;
