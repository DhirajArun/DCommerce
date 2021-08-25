const sharp = require("sharp");
const { join } = require("path");
const sizeOf = require("image-size");
const { getName, getExt } = require("../utils/fileName");

const extract = (data, { source, dest, fileName }) => {
  return async (req, res, next) => {
    if (data == null)
      data = {
        width: parseInt(req.body.width),
        height: parseInt(req.body.height),
        top: parseInt(req.body.top),
        left: parseInt(req.body.left),
      };

    const path = source(req);
    const filename = fileName(req, data);
    const newPath = join(dest(req), filename);

    const sourceDimens = sizeOf(path);

    if (sourceDimens.width < data.width || sourceDimens.height < data.width) {
      return res.status(400).send("width and height of image should be more");
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
