const express = require("express");
const { uploads, upload } = require("../middleware/multer");
const { extract, resize } = require("../middleware/sharp");
const config = require("config");

const router = express.Router();

router.post(
  "/single",
  [upload, extract({ width: 900, height: 900, top: 1, left: 1 })],
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
