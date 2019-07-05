"use strict";

/* Mongodb Schema */
const mongoose = require("../../database");
const Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate");

const CompanySchema = new Schema(
  {
    email: { type: String, unique: [true, "E-mail already registered."] },
    name: { type: String, required: [true, "Name required"] },
    abbr: { type: String, required: [true, "abbreviation required"] },
    phone: { type: String, required: [true, "Phone required"] },

    image: {
      filename: { type: String },
      url: { type: String },
      type: { type: String }
    },
    address: {
      street: { type: String },
      number: { type: String },
      district: { type: String },
      zip: { type: String },
      city: { type: String },
      state: { type: String },
      country: { type: String }
    },

    issue_report: { type: Boolean, default: false },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

CompanySchema.plugin(mongoosePaginate);

module.exports = mongoose.model("company", CompanySchema);
