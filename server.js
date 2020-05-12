const winston = require("winston");
const express = require("express");
const app = express();

require("./startup/logging")();
require("./startup/db")();
require("./startup/config")();
require("./startup/routes")(app);

const port = process.env.PORT || 5050;
app.listen(port, () => {
  winston.info(`Listenning at port ${port}`);
});
