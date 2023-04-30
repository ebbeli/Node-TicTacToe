const Player = require("../Models/player-model");

const playersFound = async () => {
  const players = await Player.find({});
  return players.map((p) => p.toJSON());
};

module.exports = {
  playersFound,
};
