const express = require("express");
const { uploads, upload } = require("../middleware/multer");
const sharp = require("../middleware/sharp");
const config = require("config");

const router = express.Router();

const extract = sharp.extract(
  { width: 500, height: 200, top: 20, left: 25 },
  {
    source: (req) => req.file.path,
    fileName: (req, data) => {
      const path = req.file.path;
      const { top, left } = data;
      return `${path.split(".")[0]}${top}${left}.${path.split(".")[1]}`;
    },
  }
);

router.post(
  "/single",
  [upload, extract],
  async (req, res) => {
    const path = `${config.get("host")}/${req.file.path}`;
    res.send(path);
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
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
