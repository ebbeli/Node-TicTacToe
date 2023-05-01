const bcrypt = require("bcrypt");
const Player = require("../Models/player-model");

const createPlayer = async (req, res, next) => {
  let { name, password, sign } = req.body;

  const salt = 10;
  password = await bcrypt.hash(password, salt);

  const player = new Player({
    name,
    password,
    sign,
  });

  const savedPlayer = await player.save().catch((err) => next(err));

  res.status(201).json(savedPlayer);
};

const getPlayerById = async (req, res, next) => {
  const { id } = req.body;

  const player = await Player.findOne({ _id: id }).catch((err) => next(err));

  res.status(201).json(player);
};

const getPlayerByName = async (req, res, next) => {
  const { name } = req.body;
  const player = await Player.findOne({ name: name }).catch((err) => next(err));

  res.status(201).json(player);
};

const getAll = async (req, res, next) => {
  let players = [];
  players = await Player.find({}).catch((err) => next(err));

  res.status(201).json(players);
};

exports.createPlayer = createPlayer;
exports.byId = getPlayerById;
exports.byName = getPlayerByName;
exports.getAll = getAll;
