const sharp = require("sharp");
const { join } = require("path");

exports.extract = (data, { source, dest, fileName }) => {
  return (req, res, next) => {
    const path = source(req);
    const filename = fileName(req, data);
    const newPath = join(dest(req), filename);

    sharp(path)
      .extract(data)
      .toFile(newPath)
      .then((value) => {
        req.extracted = { filename: filename, path: newPath, ...value };
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

exports.createThumbnails = (data, { source, dest, fileName }) => {
  return (req, res, next) => {
    const path = source(req);

    const thumbnails = data.map((item) => {
      const filename = fileName(req, item);
      const newPath = join(dest(req), filename);

      let thumbnail;
      sharp(path)
        .resize(item)
        .toFile(newPath)
        .then((value) => {
          thumbnail = { ...value, filename, path: newPath };
        })
        .catch((err) => next(err));

      return thumbnail;
    });

    req.thumbnails = thumbnails;
    next();
  };
};
