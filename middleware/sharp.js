const sharp = require("sharp");
const fs = require("fs");
const winston = require("winston");

exports.extract = ({ width, height, top, left }) => {
  return (req, res, next) => {
    const path = req.file.path;
    const newPath = `${path.split(".")[0]}${top}${left}.${path.split(".")[1]}`;
    sharp(path)
      .extract({ width, height, top, left })
      // .resize({ width: 400, height: 600 })
      .toFile(newPath)
      .then((value) => {
        fs.unlink(path, (err) => {
          if (err) {
            winston.error(err.message, err);
          }
        });
        req.file.path = newPath;
        next();
      })
      .catch((err) => next(err));
  };
};

exports.resize = ({ width, height }) => {
  return (req, res, next) => {
    const path = req.file.path;
    const newPath = `${path.split(".")[0]}${width}${height}.${
      path.split(".")[1]
    }`;
    sharp(path)
      .resize({ width, height })
      .toFile(newPath)
      .then((value) => {
        fs.unlink(path, (err) => {
          if (err) {
            winston.error(err.message, err);
          }
        });
        req.file.path = newPath;
        next();
      })
      .catch((err) => next(err));
  };
};
