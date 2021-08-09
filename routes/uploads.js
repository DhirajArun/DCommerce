const express = require("express");
const { uploads } = require("../middleware/multer");

// var multer = require("multer");
// var upload = multer({ dest: "images/" });

const router = express.Router();

router.post(
  "/",
  uploads,
  async (req, res) => {
    const paths = req.files.map((item) => {
      return item.path;
    });
    res.send(paths);
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

module.exports = router;
