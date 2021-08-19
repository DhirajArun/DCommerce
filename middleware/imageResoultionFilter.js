const sizeOf = require("image-size");

module.exports = function (
  image,
  { maxWidht, maxHeight, minWidht, minHeight }
) {
  return (req, res, next) => {
    const imagePath = image(req);
    const dimensions = sizeOf(imagePath);
    console.log("imageResolutionFilter", dimensions);

    if (!(maxWidht > dimensions.width || maxHeight > dimensions.height)) {
      res.status(400).send("more resolution");
    } else if (
      !(minWidht < dimensions.width || minHeight < dimensions.height)
    ) {
      res.status(400).send("less resolution");
    } else {
      next();
    }
  };
};

// maxWidth: 720,
// maxHeight: 578,
// minWidth: 100,
// minHeight: 50,
