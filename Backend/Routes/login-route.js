const router = require("express").Router();
const loginController = require("../Controllers/login-controller");

router.post("/", loginController.login);

module.exports = router;
