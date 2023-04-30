const Player = require("../Models/player-model");

const whatFound = async (x) => {
  const array = await x.find({});
  return array.map((p) => p.toJSON());
};

module.exports = {
  whatFound,
};
