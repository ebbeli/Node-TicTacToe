const bcrypt = require("bcrypt");
const Player = require("../Models/player-model");
const mongoose = require("mongoose");

const createPlayer = async (req, res) => {
  let { name, password, sign } = req.body;

  const salt = 10;
  password = await bcrypt.hash(password, salt);

  const player = new Player({
    name,
    password,
    sign,
  });

  const savedPlayer = await player.save();

  res.status(201).json(savedPlayer);
};

const getPlayerById = async (req, res) => {
  const { id } = req.body;

  const player = await Player.findOne({ _id: id });

  res.status(201).json(player);
};

const getPlayerByName = async (req, res) => {
  console.log(req.body);

  const { name } = req.body;

  console.log(name);
  const player = await Player.findOne({ name: name });

  res.status(201).json(player);
};

const getAll = async (req, res) => {
  let players = [];
  players = await Player.find({});
  console.log(players);
  res.status(201).json(players);
};

const addMatch = async (req, res) => {
  console.log(req.body);
  const { playerId, matchId } = req.body;
};

exports.createPlayer = createPlayer;
exports.byId = getPlayerById;
exports.byName = getPlayerByName;
exports.getAll = getAll;
