const express = require("express");
const multer = require("multer");

const upload = multer({
  dest: "images/",
});

const router = express.Router();

router.post(
  "/",
  upload.single("upload"),
  async (req, res) => {
    console.log(req.body);
    res.send("done");
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

module.exports = router;
