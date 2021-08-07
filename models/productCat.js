const mongoose = require("mongoose");
const Joi = require("joi");

const productCatSchema = new mongoose.Schema({
  name: String,
});

function validateProductCat(data) {
  const schema = Joi.object({
    name: Joi.string().min(2).max(25).required(),
  });

  return schema.validate(data);
}

const ProductCat = mongoose.model("ProductCat", productCatSchema);

exports.ProductCat = ProductCat;
exports.validateProductCat = validateProductCat;
