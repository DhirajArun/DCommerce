const sharp = require("sharp");
const { join } = require("path");
const sizeOf = require("image-size");

exports.extract = (data, { source, dest, fileName }) => {
  return async (req, res, next) => {
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

exports.resize = (data, { source, dest, fileName }) => {
  return async (req, res, next) => {
    const path = source(req);
    const filename = fileName(req, data);
    const newPath = join(dest(req), filename);

    try {
      const value = await sharp(path).resize({ width, height }).toFile(newPath);
      req.resized = { path: newPath, filename, ...value };
      next();
    } catch (err) {
      next(err);
    }
  };
};

exports.createThumbnails = (data, { source, dest, fileName }) => {
  return (req, res, next) => {
    const path = source(req);

    req.thumbnails = [];

    data.forEach(async (item, index) => {
      const filename = fileName(req, item);
      const newPath = join(dest(req), filename);

      try {
        const value = await sharp(path).resize(item).toFile(newPath);
        thumbnail = { ...value, filename, path: newPath };
        req.thumbnails[index] = thumbnail;
        dummyNext(data.length, next);
      } catch (err) {
        next(err);
      }
    });
  };
};

let counter = 0;
function dummyNext(stopAfter, cb) {
  counter++;
  if (counter === stopAfter) {
    cb();
    counter = 0;
  }
}
