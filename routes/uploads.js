const express = require("express");
const { uploads } = require("../middleware/multer");
const config = require("config");

const router = express.Router();

router.post(
  "/",
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
