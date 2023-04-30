const express = require("express");
const app = express();
const config = require("./Config/config");
const mongoose = require("mongoose");
const cors = require("cors");
const logger = require("./Config/logger");
const bodyParser = require("body-parser");

const playerRouter = require("./Routes/player-route");
const matchRouter = require("./Routes/match-route");
const scoreRouter = require("./Routes/score-route");
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
app.use(middleware.errorHandler);

app.use("/players", playerRouter);
app.use("/matches", matchRouter);
app.use("/scores", scoreRouter);

app.use(middleware.unknownEndpoint);

module.exports = app;
