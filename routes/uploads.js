const express = require("express");
const { upload } = require("../middleware/multer");

// var multer = require("multer");
// var upload = multer({ dest: "images/" });

const router = express.Router();

router.post(
  "/",
  upload,
  async (req, res) => {
    console.log(req.file, req.body);
    res.send("done");
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

module.exports = router;
