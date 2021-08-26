const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: String,
  images: [String],
  mrp: Number,
  off: Number,
  cat: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "ProductCat",
  },
  color: String,
  size: String,
});

function validateProduct(data) {
  const schema = Joi.object({
    title: Joi.string().min(1).max(30).required(),
    images: Joi.array()
      .items(Joi.string().min(1).required())
      .min(1)
      .max(8)
      .required(),
    mrp: Joi.number().min(1).required(),
    off: Joi.number().integer().min(0).max(100).required(),
    cat: Joi.array().items(Joi.objectId()).min(1).max(8).required(),
    color: Joi.string().required(),
    size: Joi.string(),
  });
  return schema.validate(data);
}

const Product = mongoose.model("products", productSchema);

exports.Product = Product;
exports.productSchema = productSchema;
exports.validateProduct = validateProduct;
