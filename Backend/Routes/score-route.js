const router = require("express").Router();
const scoreController = require("../Controllers/score-controller");

router.post("/update", scoreController.update);
router.get("/", scoreController.getAll);
router.get("/players", scoreController.players);
router.get("/top", scoreController.highScores);

module.exports = router;
