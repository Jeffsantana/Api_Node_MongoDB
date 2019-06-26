"use strict";

/* Mongodb Schema */
const mongoose = require("../../database");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoosePaginate = require("mongoose-paginate");
const env = require("dotenv").config().parsed;

const UserSchema = new Schema(
  {
    name: { type: String, required: [true, "Name is required"] },
    username: {
      type: String,
      required: [true, "User Name is required."],
      unique: [true, "Username already registered."]
    },
    role: { type: String, required: [true, "Role is required."] },
    phone: { type: String },
    active: { type: Boolean, default: true },
    pending: { type: Boolean, default: true },
    email: {
      type: String,
      lowercase: true,
      unique: [true, "E-mail already registered."],
      required: [true, "E-mail is required."]
    },
    password: { type: String, min: 6, max: 30, required: true, select: false },
    street: { type: String },
    number: { type: String },
    district: { type: String },
    zip: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    image: {
      filename: { type: String, default: "default.png" },
      url: { type: String, default: "/uploads/img-users/default.png" },
      type: { type: String, default: "image/png" }
    }
  },
  { timestamps: true }
);

UserSchema.index({ "$**": "text" });

UserSchema.pre("save", async function(next) {
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;
  next();
});

UserSchema.methods.compare = function(senha) {
  return bcrypt.compareSync(senha, this.password);
};

UserSchema.methods.generateToken = async user => {
  let payload = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role
  };
  return await jwt.sign({ payload }, env.SECRET_KEY, {
    expiresIn: "2h"
  });
};

UserSchema.statics.verifyToken = async token => {
  return await jwt.verify(token, env.SECRET_KEY);
};

UserSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("user", UserSchema);
