const express = require("express");
const _ = require("lodash");
const { Product, validateProduct } = require("../models/product");

const filter = require("../middleware/filter");
const sorting = require("../middleware/sorting");
const pagination = require("../middleware/pagination");

const router = express.Router();

router.get("/", [filter, sorting, pagination], async (req, res, next) => {
  const products = await Product.find(req.filter)
    .sort({ [req.sorting.sortBy]: 1 })
    .skip((req.pagination.currentPage - 1) * req.pagination.pageSize)
    .limit(req.pagination.pageSize)
    .select("-__v");

  res.send(products);
});

router.get("/:id", async (req, res, next) => {
  const product = await Product.findOne({ _id: req.params.id }).select("-__v");
  if (!product) return res.status(404).send("no product found");
  res.send(product);
});

router.post("/", async (req, res) => {
  const { error } = validateProduct(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const product = new Product(
    _.pick(req.body, ["title", "images", "mrp", "off", "cat", "color", "size"])
  );

  await product.save();
  res.send(product);
});

router.put("/:id", async (req, res) => {
  const { error } = validateProduct(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!product) return res.status(404).send("no such product found!");
  res.send(product);
});

router.delete("/:id", async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return res.status(404).send("no such product");
  res.send(product);
});

module.exports = router;
