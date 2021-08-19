const sharp = require("sharp");
const { join, resolve } = require("path");

exports.extract = (data, { source, dest, fileName }) => {
  return async (req, res, next) => {
    const path = source(req);
    const filename = fileName(req, data);
    const newPath = join(dest(req), filename);

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

    // const thumbnails = data.map(async (item) => {
    //   const filename = fileName(req, item);
    //   const newPath = join(dest(req), filename);

    //   try {
    //     const value = await sharp(path).resize(item).toFile(newPath);
    //     thumbnail = { ...value, filename, path: newPath };
    //     console.log("sharp-createThumbnail", thumbnail);
    //     return thumbnail;
    //   } catch (err) {
    //     next(err);
    //   }
    // });

    data.forEach(async (item, index) => {
      const filename = fileName(req, item);
      const newPath = join(dest(req), filename);

      try {
        const value = await sharp(path).resize(item).toFile(newPath);
        thumbnail = { ...value, filename, path: newPath };
        req.thumbnails[index] = thumbnail;

        if (index === data.length - 1) {
          next();
        }
      } catch (err) {
        next(err);
      }
    });

    // req.thumbnails = thumbnails;
    // next();
  };
};

let counter = 0;
function dummyNext(stopAt, cb) {
  if (counter === stopAt) {
    cb();
    counter = 0;
  }
  counter++;
}
