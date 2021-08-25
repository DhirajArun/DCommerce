const sharp = require("sharp");
const { join } = require("path");
const sizeOf = require("image-size");

exports.extract = (data, { source, dest, fileName }) => {
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

exports.createThumbnails = (input, { source, dest, fileName }) => {
  return async (req, res, next) => {
    let data;
    if (typeof input == "function") {
      data = input(req);
    } else {
      data = input;
    }

    const path = source(req);
    let thumbnails = [];

    data.forEach((item, index) => {
      const filename = fileName(req, item);
      const newPath = join(dest(req), filename);

      thumbnails[index] = new Promise(async (resolve, reject) => {
        try {
          const value = await sharp(path).resize(item).toFile(newPath);
          resolve({ ...value, filename, path: newPath });
        } catch (err) {
          reject(err.message);
        }
      });
    });

    try {
      req.thumbnails = await Promise.all(thumbnails);
      next();
    } catch (err) {
      next(err);
    }
  };
};
