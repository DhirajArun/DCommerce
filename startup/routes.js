const express = require("express");
const products = require("../routes/products");
const users = require("../routes/users");
const auth = require("../routes/auth");
const error = require("../middleware/error");
const productCats = require("../routes/productCats");
const cors = require("cors");
const uploads = require("../routes/uploads");

module.exports = function (app) {
  app.use(
    cors({
      origin: "http://localhost:3000",
    })
  );
  app.use(express.json());
  app.use("/api/products", products);
  app.use("/api/uploads", uploads);
  app.use("/api/productCats", productCats);
  app.use("/api/users", users);
  app.use("/api/auth", auth);
  app.use(error);
};
