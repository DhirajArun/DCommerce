const sharp = require("../middleware/sharp");
const { getName, getExt } = require("../utils/fileName");

const productThumbnails = [
  { width: 720, height: 200 },
  { width: 1080, height: 400 },
];

const getThumbnails = (req) => {
  if (req.params.dest === "product") return productThumbnails;
};

module.exports = sharp.createThumbnails(getThumbnails, {
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
