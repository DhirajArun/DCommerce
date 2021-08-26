exports.getExt = (filename) => {
  return filename.split(".")[1];
};

exports.getName = (filename) => {
  return filename.split(".")[0];
};
