const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Player = require("../Models/player-model");

const login = async (req, res) => {
  const { name, password } = req.body;

  const player = await Player.findOne({ name });
  const passwordCorrect =
    player === null ? false : await bcrypt.compare(password, player.password);
  console.log(player);
  console.log(passwordCorrect);
  if (!(player && passwordCorrect)) {
    return response.status(401).json({
      error: "Invalid username or password",
    });
  }

  const playerToken = {
    player: player.name,
    id: player._id,
  };

  const token = jwt.sign(playerToken, "Eino", {
    expiresIn: 12 * 60 * 60,
  });

  res.status(200).json({ token, name: player.name, sign: player.sign });
};

exports.login = login;
