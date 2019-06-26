const express = require("express");
const bodyParser = require("body-parser");
const queryParser = require("express-query-parser");
const env = require("dotenv").config().parsed;
const path = require("path");
const cors = require("cors");
const appPort = env.SERVER_PORT;

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(queryParser({ parseNull: true, parseBoolean: true }));
app.use(bodyParser.json());
app.use(cors());

//consts to https mode
// const https = require("https");
// const fs = require("fs");

// var key = fs.readFileSync("cert-https/private.key");
// var cert = fs.readFileSync("cert-https/vinci.crt");
// var ca = fs.readFileSync("cert-https/chain.crt");

// var options = {
//   key: key,
//   cert: cert,
//   ca: ca
// };

app.use(
  "/api/v1/uploads",
  express.static(path.join(__dirname, "/src/public/uploads"))
); //All this Path is available 'nameOfServer + /api/v1/uploads/ + nameFile

app.apiUrl = env.BASE_URL;

require("./src/app/routes/v1")(app);
// HTTP mode
app.listen(appPort, () => {
  console.info("Aplication runing in port: ", appPort);
});

