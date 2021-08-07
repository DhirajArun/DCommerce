const express = require("express");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const {
  Product,
  validateProduct,
  productSchema,
} = require("../models/product");
const { ProductCat, validateProductCat } = require("../models/productCat");
const _ = require("lodash");

const router = express.Router();

router.get("/", async (req, res, next) => {
  let products;

  let filter = {};
  let sortBy = "_id";
  let orderBy = 1;
  let pageSize = 20;
  let pageNo = 1;

  const {
    cat: catId,
    sortBy: qSortBy,
    orderBy: qOrderBy,
    pageSize: qPageSize,
    pageNo: qPageNO,
  } = req.query;

  //filtering
  if (catId) {
    const { error } = validateSingleQuery("cat", catId);
    if (!error) {
      const cat = await ProductCat.findOne({ _id: catId });
      if (cat) {
        filter.cat = catId;
      }
    }
  }

  // sorting
  if (qSortBy) {
    console.log("qSortBy");
    if (productSchema.path(qSortBy)) {
      sortBy = qSortBy;
      console.log("sorted");
    }
  }

  //orderBy
  if (qOrderBy) {
    const { error } = validateSingleQuery("orderBy", qOrderBy);
    if (!error) {
      orderBy = qOrderBy;
      console.log("ordered");
    }
  }

  //pageSize
  if (qPageSize) {
    const { error } = validateSingleQuery("pageSize", qPageSize);
    if (!error) {
      pageSize = parseInt(qPageSize);
      console.log("paged");
    }
  }

  //pageNo
  if (qPageNO) {
    const { error } = validateSingleQuery("pageNo", qPageNO);
    if (!error) {
      pageNo = parseInt(qPageNO);
      console.log("no page");
    }
  }

  console.log({ filter, sortBy, orderBy, pageSize, pageNo });

  products = await Product.find(filter)
    .sort({ [sortBy]: orderBy })
    .skip((pageNo - 1) * pageSize)
    .limit(pageSize)
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

const querySchema = {
  cat: Joi.objectId(),
  sortBy: Joi.string().min(1),
  orderBy: Joi.number().valid(1, -1),
  pageSize: Joi.number().integer().min(1).max(100),
  pageNo: Joi.number().integer().min(1),
};

function validateSingleQuery(sq, data) {
  return querySchema[sq].validate(data);
}

module.exports = router;
