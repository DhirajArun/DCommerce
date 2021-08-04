const express = require("express");
const winston = require("winston");

const app = express();

require("./startup/routes")(app);
require("./startup/db")();
require("./startup/logging")();

const port = process.env.PORT || 3100;
const server = app.listen(port, () =>
  winston.info(`listening on port ${port}`)
);

module.exports = server;
