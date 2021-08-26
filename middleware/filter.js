const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

module.exports = function (req, res, next) {
  const { cat } = req.query;
  const filter = (req.filter = {});

  if (cat) {
    const { error } = catSchema.validate(cat);
    if (!error) {
      filter.cat = cat;
    }
  }
  next();
};

const catSchema = Joi.objectId().required();
