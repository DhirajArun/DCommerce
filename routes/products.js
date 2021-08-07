const express = require("express");
const { Product, validateProduct } = require("../models/product");
const _ = require("lodash");

const router = express.Router();

// filtering
// sortBy
// pagination
// orderBy

router.get("/", async (req, res, next) => {
  let products;

  let filter = {};
  let sortBy;
  let orderBy = 1;
  let pageSize = 20;
  let pageNo = 1;

  //filtering
  if (req.query.cat) {
    filter.cat = req.query.cat;
  }

  //sorting
  if (req.query.sortBy) {
    sortBy = req.query.sortBy;
  }

  //orderBy
  if (req.query.orderBy) {
    orderBy = req.query.orderBy;
  }

  //pageSize
  if (req.query.pageSize) {
    pageSize = req.query.pageSize;
  }

  //pageNo
  if (req.query.pageNo) {
    pageNo = req.query.pageNo;
  }

  products = await Product.find(filter)
    .sortBy({ [sortBy]: orderBy })
    .skip((pageNo - 1) * pageSize)
    .limit(pageSize)
    .select("-__v");

  res.send(products);
});

router.get("/:id", async (req, res, next) => {
  const product = await Product.findOne({ _id: req.params.id });
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
