const router = require("express").Router();
const playerController = require("../Controllers/player-controller");

router.post("/create", playerController.createPlayer);
router.get("/id", playerController.byId);
router.get("/name", playerController.byName);
router.get("/all", playerController.getAll);

module.exports = router;
