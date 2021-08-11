const sharp = require("sharp");
const winston = require("winston");

exports.extract = (data, { source, fileName }) => {
  return (req, res, next) => {
    const path = source(req);
    const newPath = fileName(req, data);

    sharp(path)
      .extract(data)
      .toFile(newPath)
      .then((value) => {
        req.extracted = { path: newPath, ...value };
        next();
      })
      .catch((err) => next(err));
  };
};

exports.resize = (data, { source, fileName }) => {
  return (req, res, next) => {
    const path = source(req);

    const newPath = fileName(req, data);
    sharp(path)
      .resize({ width, height })
      .toFile(newPath)
      .then((value) => {
        req.resized = { path: newPath, ...value };
        next();
      })
      .catch((err) => next(err));
  };
};

exports.createThumbnails = (data, { source, fileName }) => {
  return (req, res, next) => {
    const path = source(req);

    const thumbnails = data.map((item) => {
      const newPath = fileName(req, item);
      sharp(path)
        .resize(item)
        .toFile(newPath)
        .then((value) => {
          req.thumbnails = { ...value, path: newPath };
          next();
        })
        .catch((err) => next(err));
    });

    req.thumbnails = thumbnails;
  };
};
