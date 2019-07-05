/* Libraries */
const express = require("express");
const router = express.Router();
const { auth, validateError } = require("../middlewares");
const multer = require("multer");
const env = require("dotenv").config().parsed;
const bcrypt = require("bcryptjs");
/* Config */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./src/public/uploads/img-users");
  },

  filename: (req, file, cb) => {
    cb(null, req.user._id.concat(".").concat(file.mimetype.split("/")[1]));
  }
});
const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * env.MAX_FILE_SIZE_MB
  }
}).single("file");
const isEmailValid = emailAdress => {
  const EMAIL_REGEXP = /\S+@\S+\.\S+/;
  return !EMAIL_REGEXP.test(emailAdress);
};
/* Models */
const { User } = require("../models");

const UserController = dependencies => {
  router.use(auth);

  // Inser NEW User
  router.post("/user", async (req, res) => {
    try {
      if (await isEmailValid(req.body.email)) {
        return res.status(400).send({ message: "Not valid email." });
      } else {
        let newUser = req.body;
        newUser.pending = false;
        let user = await User.create({ ...newUser });
        return res.status(201).send({ message: "Insert user with success." });
      }
    } catch (error) {
      let { message } = error;
      message = message.split(":");
      let index = message.length - 1;
      message = message[index];
      if (error.code === 11000)
        return res
          .status(409)
          .send({ message: "This email already in use in our database." });
      return res.status(400).send({ message: message });
    }
  });
  // Update user bY token
  router.put("/myuser", async (req, res) => {
    try {
      const { _id } = req.user;
      if (req.body.password) {
        const hash = await bcrypt.hash(req.body.password, 10);
        req.body.password = hash;
      }
      const user = await User.findByIdAndUpdate(
        _id,
        { $set: { ...req.body } },
        { new: true }
      );
      return res.status(200).send(user);
    } catch (error) {
      return res.status(400).send({ message: await validateError(error) });
    }
  });
  // Update user bY params
  router.put("/user/:id", async (req, res) => {
    try {
      const { id } = req.params;
      if (req.body.password) {
        const hash = await bcrypt.hash(req.body.password, 10);
        req.body.password = hash;
      }
      const user = await User.findByIdAndUpdate(
        id,
        { $set: { ...req.body } },
        { new: true }
      );
      if (!user) return res.status(404).send({ message: " User not Found." });
      return res.status(200).send(user);
    } catch (error) {
      return res.status(400).send({ message: await validateError(error) });
    }
  });
  // Get User bY toKen
  router.get("/myuser", async (req, res) => {
    try {
      const { _id } = req.user;
      const user = await User.findOne({ _id });
      return res.status(200).send(user);
    } catch (error) {
      return res.status(400).send({ message: await validateError(error) });
    }
  });
  // List With Pagination
  router.get("/user", async (req, res) => {
    if (req.user.role == "admin" || req.user.role == "dev") {
      try {
        // const { _id } = req.user;
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 20;
        const sort = { name: 1 };
        const select = { __v: 0 };
        const options = {
          select,
          sort,
          limit,
          page
        };
        const result = await User.paginate({}, options);
        return res.status(200).send(result);
      } catch (error) {
        return res.status(400).send({ message: await validateError(error) });
      }
    } else {
      return res.status(401).send({
        message: "You dont have permission to access this information"
      });
    }
  });
  // List Pending User With Pagination
  router.get("/user-pending", async (req, res) => {
    if (req.user.role == "admin" || req.user.role == "dev") {
      try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 20;
        const sort = { name: 1 };
        const select = { __v: 0 };
        const options = {
          select,
          sort,
          limit,
          page
        };
        const result = await User.paginate({ pending: true }, options);
        return res.status(200).send(result);
      } catch (error) {
        return res.status(400).send({ message: await validateError(error) });
      }
    } else {
      return res.status(400).send({
        message: "You dont have permission to access this information"
      });
    }
  });
  // List One (only for admin or dev users)
  router.get("/user-listone/:id", async (req, res) => {
    if (req.user.role == "admin" || req.user.role == "dev") {
      try {
        const { id } = req.params;
        const result = await User.findOne({ _id: id });
        return res.status(200).send(result);
      } catch (error) {
        return res.status(400).send({ message: await validateError(error) });
      }
    } else {
      return res.status(400).send({
        message: "You dont have permission to access this information"
      });
    }
  });
  // List With Search and Pagination (only for admin or dev users)
  // Search by name or email
  router.get("/user-find/:search?", async (req, res) => {
    if (req.user.role == "admin" || req.user.role == "dev") {
      try {
        let search = req.params.search;
        let query = RegExp(`^${search}`);
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 20;
        const sort = { name: 1 };
        const select = { __v: 0 };
        const options = {
          select,
          sort,
          limit,
          page
        };
        const result = await User.paginate(
          {
            $or: [
              {
                name: query
              },
              {
                email: query
              }
            ]
          },
          options
        );
        return res.status(200).send(result);
      } catch (error) {
        return res.status(400).send({ message: await validateError(error) });
      }
    } else {
      return res
        .status(400)
        .send({ message: "You dont have permission to access this function" });
    }
  });
  // Delete user
  router.delete("/user/:id", async (req, res) => {
    if (req.user.role == "admin" || "dev") {
      try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);
        if (!user) return res.status(404).send({ message: "Not Found." });
        return res.status(200).send({ message: "Delete with Success ." });
      } catch (error) {
        return res.status(400).send({ message: await validateError(error) });
      }
    } else {
      return res.status(400).send({ message: "You dont have permission" });
    }
  });
  // Upload image
  router.post("/image-user", async (req, res) => {
    try {
      const { _id } = req.user;
      await upload(req, res, async error => {
        try {
          if (error) {
            const message = "Max size file: "
              .concat(env.MAX_FILE_SIZE_MB)
              .concat(" MB.");
            return res.status(401).send({ message });
          }
          if (!req.file) {
            const message = "The file was not selected";
            return res.status(401).send({ message });
          }
          const image = {
            filename: _id,
            url: "/uploads/img-users/"
              .concat(_id)
              .concat(".")
              .concat(req.file.mimetype.split("/")[1]),
            type: req.file.mimetype
          };
          const user = await User.findByIdAndUpdate(
            _id,
            { $set: { image } },
            { new: true }
          );
          console.log("user:");
          console.log(user);
          if (user) {
            return res.status(200).send({ message: "Image Upload to:", user });
          }
        } catch (error) {
          return res.status(400).send({ message: await validateError(error) });
        }
      });
    } catch (error) {
      return res.status(400).send({ message: await validateError(error) });
    }
  });
  router.post("/confirm-password", async (req, res) => {
    try {
      const { email, password } = req.body;
      let user = await User.findOne({ email }).select("+password");
      if (!user.compare(password))
        return res.status(401).send({ message: "Your Password are wrong" });
      return res.status(200).send({ user });
    } catch (error) {
      return res.status(400).send({ message: await validateError(error) });
    }
  });

  return router;
};

module.exports = UserController;
