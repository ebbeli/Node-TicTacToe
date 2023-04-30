const app = require("./app");
const config = require("./Config/config");
const logger = require("./Config/logger");
const ip = require("ip");

app.listen(config.PORT, () => {
  logger.info(`Server running on http://${ip.address()}:${config.PORT}`);
});
