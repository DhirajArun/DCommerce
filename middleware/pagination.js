const Joi = require("joi");
const config = require("config");

module.exports = function (req, res, next) {
  const { currentPage } = req.query;
  const pageSize = config.get("productPageSize");

  req.pagination = { currentPage: 1, pageSize };

  if (currentPage) {
    const { error } = currentPageSchema.validate(currentPage);
    if (!error) {
      req.pagination = { currentPage: parseInt(currentPage), pageSize };
    }
  }
  next();
};

const currentPageSchema = Joi.number().integer().min(1).required();
