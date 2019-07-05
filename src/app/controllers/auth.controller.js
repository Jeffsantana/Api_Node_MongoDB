/* Libraries */
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
/* Middlewares */
const { auth } = require("../middlewares");
/* Models */
const { User } = require("../models");
/* Functions */
const isEmailValid = emailAdress => {
  const EMAIL_REGEXP = /\S+@\S+\.\S+/;
  return !EMAIL_REGEXP.test(emailAdress);
};
const AuthController = dependencies => {
  // New Users reques access
  router.post("/register", async (req, res) => {
    try {
      if (await isEmailValid(req.body.email)) {
        return res.status(400).send({ message: "Not valid email." });
      } else {
        let user = await User.create({ ...req.body });
        return res.status(201).send({ message: "Insert user with success." });
      }
    } catch (error) {
      let { message } = error;
      message = message.split(":");
      let index = message.length - 3;

      message = message[index];
      return res.status(400).send({ message: message });
    }
  });
  // Login
  router.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      let user = await User.findOne({ email }).select("+password");
      if (!user)
        return res.status(401).send({ message: "User/password are wrong." });
      if (!user.compare(password))
        return res.status(401).send({ message: "User/password are wrong." });
      if (user.pending)
        return res.status(401).send({
          message:
            "Access not allowed, please contact support for further information."
        });
      user.password = undefined;
      return res
        .status(200)
        .send({ user, token: await user.generateToken(user) });
    } catch (error) {
      if (error.code === 11000)
        return res
          .status(409)
          .send({ message: "This email already in use in our database" });
      return res.status(400).send({ message: error.message });
    }
  });
  //Verify if token is valid
  router.post("/validate-token", async (req, res) => {
    try {
      const { token } = req.body;
      let check = await User.verifyToken(token);
      return res.status(200).send({ token: check });
    } catch (error) {
      return res.status(400).send({ message: error.message });
    }
  });
  //Verify API and MongoDB status
  router.get("/", async (req, res) => {
    try {
      if (mongoose.connection.readyState)
        return res.status(200).send(`<h2> API OK </h2> <h3> SGBD: OK </h3>`);
      else
        return res.status(200).send(`<h2> API OK </h2> <h3> SGBD: BAD </h3>`);
    } catch (error) {
      return res.status(400).send({ error: { message: "BAD REQUEST" } });
    }
  });
  return router;
};

module.exports = AuthController;
