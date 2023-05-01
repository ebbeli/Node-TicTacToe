const router = require("express").Router();
const matchController = require("../Controllers/match-controller");

router.post("/new", matchController.create);
router.put("/update", matchController.updateMoves);
router.get("/moves", matchController.getMoves);
router.get("/players", matchController.getPlayers);
router.get("/deleteById", matchController.deleteById);
router.get("/deleteByName", matchController.deleteByName);

module.exports = router;
