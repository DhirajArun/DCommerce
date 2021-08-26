const sharp = require("sharp");
const { join } = require("path");
const sizeOf = require("image-size");
const { getName, getExt } = require("../utils/fileName");
const Joi = require("joi");
const _ = require("lodash");

function populateData(incomingData, body) {
  let data;
  let error = undefined;
  if (!incomingData) {
    error = dataSchema.validate(
      _.pick(body, ["width", "height", "top", "left"])
    ).error;

    data = {
      width: parseInt(body.width),
      height: parseInt(body.height),
      top: parseInt(body.top),
      left: parseInt(body.left),
    };
  } else {
    data = incomingData;
    error = dataSchema.validate(incomingData).error;
  }

  if (error) throw new Error(error.details[0].message);
  return data;
}

const dataSchema = Joi.object({
  width: Joi.number().integer().min(0).required(),
  height: Joi.number().integer().min(0).required(),
  top: Joi.number().integer().min(0).required(),
  left: Joi.number().integer().min(0).required(),
});

const extract = (incomingData, { source, dest, fileName }) => {
  return async (req, res, next) => {
    let data = populateData(incomingData, req.body); // also validating

    const path = source(req);
    const filename = fileName(req, data);
    const newPath = join(dest(req), filename);

    const sourceDimens = sizeOf(path);
    const isWrongDimens =
      sourceDimens.width < data.width || sourceDimens.height < data.width;
    if (isWrongDimens) {
      throw new Error("width and height of image should be more");
    }

    try {
      const value = await sharp(path).extract(data).toFile(newPath);
      req.extracted = { filename, path: newPath, ...value };
      next();
    } catch (err) {
      next(err);
    }
  };
};

module.exports = extract(null, {
  source: (req) => {
    return req.file.path;
  },
  dest: (req) => {
    return req.tmpdir;
  },

  fileName: (req, data) => {
    const filename = req.file.filename;
    const { top, left } = data;
    return `${getName(filename)}${top}${left}.${getExt(filename)}`;
  },
});
