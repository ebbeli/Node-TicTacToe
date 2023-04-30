const logger = require("./logger");

const reqLogger = (req, res, next) => {
  logger.info("Method:", req.method);
  logger.info("Path:  ", req.path);
  logger.info("Body:  ", req.body);
  logger.info("---");
  next();
};

const unknownEndpoint = (re, res) => {
  res.status(404).send({ error: "Unknown endpoint" });
};

const errorHandler = (err, req, res, next) => {
  logger.error(err.message);

  if (err.name === "CastError") {
    return res.status(400).send({ error: "Check id" });
  } else if (err.name === "ValidationError") {
    return res.status(400).json({ error: err.message });
  }

  next(err);
};

module.exports = {
  reqLogger,
  unknownEndpoint,
  errorHandler,
};
