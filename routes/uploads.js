const express = require("express");
const { uploads, upload } = require("../middleware/multer");
const sharp = require("../middleware/sharp");
const config = require("config");
const tmpdir = require("../middleware/tmpdir");

const winston = require("winston");

const router = express.Router();

const extract = sharp.extract(
  { width: 500, height: 200, top: 20, left: 25 },
  {
    source: (req) => {
      return req.file.path;
    },
    dest: (req) => {
      return "images/";
    },

    fileName: (req, data) => {
      const filename = req.file.filename;
      const { top, left } = data;
      return `${filename.split(".")[0]}${top}${left}.${filename.split(".")[1]}`;
    },
  }
);

const imagesTmpDir = tmpdir("images/");

router.post(
  "/single",
  [imagesTmpDir, upload, extract, imagesTmpDir],
  async (req, res) => {
    const path = `${config.get("host")}/${req.extracted.path}`;
    res.send(path);
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
