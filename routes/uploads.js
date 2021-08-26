const express = require("express");
const winston = require("winston");
const upload = require("../middleware/multer");
const tmpdir = require("../middleware/tmpdir");
const extract = require("../middleware/extract");
const thumbnails = require("../middleware/thumbnails");
const config = require("config");

const router = express.Router();

router.post(
  "/:dest",
  [tmpdir, upload, extract, thumbnails, tmpdir],
  async (req, res) => {
    const paths = req.thumbnails.map(
      (item) => `${config.get("host")}/${item.path}`
    );
    return res.send(paths);
  },
  (error, req, res, next) => {
    winston.error(error.message, error);
    res.status(400).send(error.message);
  }
);

module.exports = router;
