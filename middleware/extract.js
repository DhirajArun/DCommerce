const sharp = require("../middleware/sharp");
const { getName, getExt } = require("../utils/fileName");

module.exports = sharp.extract(null, {
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
