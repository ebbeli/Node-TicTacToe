const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const loginRouter = require("express").Router();
const Player = require("../Models/player-model");

loginRouter.post("/", async (request, response) => {
  const { name, password } = request.body;

  const player = await Player.findOne({ name });
  const passwordCorrect =
    player === null
      ? false
      : await bcrypt.compare(password, player.passwordHash);

  if (!(player && passwordCorrect)) {
    return response.status(401).json({
      error: "Invalid username or password",
    });
  }

  const playerToken = {
    player: player.name,
    id: player._id,
  };

  const token = jwt.sign(playerToken, process.env.SECRET);

  response.status(200).send({ token, name: player.name, sign: player.sign });
});

module.exports = loginRouter;
