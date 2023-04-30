const mongoose = require("mongoose");
const Player = require("../Models/player-model");
const Match = require("../Models/match-model");

const createMatch = async (req, res) => {
  const body = req.body;

  const player1 = await Player.findById(body.player1Id);
  const player2 = await Player.findById(body.player2Id);

  let result = "";
  if (!body.result) {
    result = "In Progress";
  } else {
    result = body.result;
  }
  const newMatch = new Match({
    name: body.name,
    moves: body.moves,
    result: result,
    player1: player1._id,
    player2: player2._id,
  });

  const savedMatch = await newMatch.save();

  player1.matches = player1.matches.concat(savedMatch._id);
  player2.matches = player2.matches.concat(savedMatch._id);

  await player1.save();
  await player2.save();

  res.status(201).json(savedMatch);
};

const updateMoves = async (req, res) => {
  const body = req.body;

  const updatedMatch = await Match.findById({ _id: body.id });

  updatedMatch.moves = updatedMatch.moves.concat(body.move);
  updatedMatch.lastMoveBy = body.name;

  const savedMatch = await updatedMatch.save();

  res.status(201).json(savedMatch);
};

const getMoves = async (req, res) => {
  const { id } = req.body;

  const foundMoves = await Match.findById({ _id: id }).select(
    "moves lastMoveBy"
  );

  res.status().json(foundMoves);
};

const getPlayers = async (req, res) => {
  const { id } = req.body;
  const matchesToReturn = { p1, p2 };

  await Match.find({ player1: id })
    .populate("player2", "name")
    .exec(function (err, matches) {
      if (err) throw err;
      matchesToReturn.p1 = matches;
    });

  await Match.find({ player2: id })
    .populate("player1", "name")
    .exec(function (err, matches) {
      if (err) throw err;
      matchesToReturn.p2 = matches;
    });

  console.log("To Return:", matchesToReturn);

  res.status().json(matchesToReturn);
};

exports.create = createMatch;
exports.updateMoves = updateMoves;
exports.getMoves = getMoves;
exports.getPlayers = getPlayers;

/*
const getMatchById = async (req, res) => {
  const { id } = req.body;

  const foundMatch = await Match.findById({ _id: id });

  res.status().json(foundMatch);
};

const getMatchByName = async (req, res) => {
  const { name } = req.body;

  const foundMatch = await Match.findOne({ name: name });

  res.status().json(foundMatch);
};

exports.byId = getMatchById;
exports.byName = getMatchByName;
*/
