const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const error = require("../middleware/error");
const home = require("../routes/home");
const auth = require("../routes/auth");
const products = require("../routes/products");
const users = require("../routes/users");
const admin = require("../routes/admin");

module.exports = function (app) {
  app.use(cors());
  app.use(fileUpload());
  app.use(express.json());
  app.use("/static", express.static("public"));
  app.use("/", home);
  app.use("/api/products", products);
  app.use("/api/users", users);
  app.use("/api/admin", admin);
  app.use("/api/auth", auth);

  app.use(error);
};
