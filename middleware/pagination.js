const Joi = require("joi");

module.exports = function (req, res, next) {
  const { currentPage } = req.query;
  const pageSize = 10;

  if (currentPage) {
    const { error } = currentPageSchema.validate(currentPage);
    if (!error) {
      req.pagination = { currentPage: parseInt(currentPage), pageSize };
    }
  }

  next();
};

const currentPageSchema = Joi.number().integer().min(1).required();
