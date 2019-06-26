const express = require("express");
const { auth } = require("../middlewares");
const { UserController, AuthController } = require("../controllers");
const router = express.Router();

const routes = app => {
  app.use("/api/v1", AuthController({ io: app.io }));
  app.use("/api/v1", UserController({ io: app.io }));
};

module.exports = routes;
