const winston = require("winston");
require("express-async-errors");

module.exports = function () {
  winston.add(new winston.transports.File({ filename: "logFile.log" }));
  winston.exceptions.handle([
    new winston.transports.File({ filename: "unCaughtException.log" }),
    new winston.transports.Console(),
  ]);

  process.on("unhandledRejection", (ex) => {
    throw ex;
  });
};
