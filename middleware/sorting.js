const Joi = require("joi");
const { productSchema } = require("../models/product");

module.exports = function (req, res, next) {
  const { sortBy, order } = req.query;

  if (sortBy) {
    const error = validateSort(sortBy);
    if (!error) {
      req.sorting = { sortBy, order: parseInt(order) || 1 };
    }
  }
  next();
};

function validateSort(data) {
  if (!productSchema.path(data)) {
    return new Error("no such path that you provided in sortBy");
  }
}
