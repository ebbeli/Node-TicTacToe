const express = require("express");
const app = express();
const playerRoutes = require("./Routes/player-route");
const config = require("./Config/config");
const mongoose = require("mongoose");
const cors = require("cors");
const logger = require("./Config/logger");
require("express-async-errors");
const bodyParser = require("body-parser");

const playerRouter = require("./Routes/player-route");
const middleware = require("./Config/middleware");

mongoose.set("strictQuery", false);

logger.info("connecting to", config.DB);

mongoose
  .connect(config.DB)
  .then(() => {
    logger.info("connected to db");
  })
  .catch((error) => {
    logger.error("error connecting to db:", error.message);
  });

app.use(bodyParser.json());

app.use(cors({ origin: "*" }));
app.use(express.static("build"));
app.use(middleware.reqLogger);

app.use("/players", playerRoutes);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
