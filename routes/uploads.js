const express = require("express");
const { uploads, upload } = require("../middleware/multer");
const sharp = require("../middleware/sharp");
const config = require("config");
const tmpdir = require("../middleware/tmpdir");
const { getName, getExt } = require("../utils/fileName");
const imageResolutionFilter = require("../middleware/imageResoultionFilter");

const winston = require("winston");

const router = express.Router();

const extract = sharp.extract(
  { width: 500, height: 200, top: 20, left: 25 },
  {
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
  }
);

const thumb = sharp.createThumbnails(
  [
    { width: 720, height: 200 },
    { width: 1080, height: 400 },
  ],
  {
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
  }
);

const resolutions = {
  maxWidth: 720,
  maxHeight: 578,
  minWidth: 100,
  minHeight: 50,
};

const resolutionFilter = imageResolutionFilter(
  (req) => req.file.path,
  resolutions
);

const imagesTmpDir = tmpdir("images/");

router.post(
  "/single",
  [imagesTmpDir, upload, resolutionFilter, extract, thumb, imagesTmpDir],
  async (req, res) => {
    const path = `${config.get("host")}/${req.extracted.path}`;
    return res.send(req.thumbnails);
  },
  (error, req, res, next) => {
    winston.error(error.message, error);
    res.status(400).send(error.message);
  }
);

router.post(
  "/array",
  uploads,
  async (req, res) => {
    const paths = req.files.map((item) => {
      return `${config.get("host")}/${item.path}`;
    });
    res.send(paths);
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

module.exports = router;
