const { tmpdir } = require("os");
const { join } = require("path");
const fs = require("fs");
const removeDir = require("../utils/removeDir");

module.exports = function (path) {
  return function (req, res, next) {
    const dir = join(tmpdir(), path);

    const exists = fs.existsSync(dir);
    if (exists && req.tmpdir == dir) {
      try {
        removeDir(dir);
        next();
      } catch (err) {
        next(err);
      }
    } else if (exists) {
      req.tmpdir = dir;
      next();
    } else {
      fs.mkdir(dir, (err) => {
        if (err) next(err);
      });
      req.tmpdir = dir;
      next();
    }
  };
};
