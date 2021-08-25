const sharp = require("sharp");
const { getName, getExt } = require("../utils/fileName");
const { join } = require("path");

const createThumbnails = (input, { source, dest, fileName }) => {
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

const productThumbnails = [
  { width: 720, height: 200 },
  { width: 1080, height: 400 },
];

const getThumbnails = (req) => {
  if (req.params.dest === "product") return productThumbnails;
};

module.exports = createThumbnails(getThumbnails, {
  source: (req) => {
    return req.extracted.path;
  },
  dest: (req) => {
    return "images/";
  },
  fileName: (req, data) => {
    return `${getName(req.extracted.filename)}${data.width}${
      data.height
    }.${getExt(req.extracted.filename)}`;
  },
});
