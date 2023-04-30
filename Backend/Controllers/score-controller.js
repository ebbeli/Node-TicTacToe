const mongoose = require("mongoose");
const Player = require("../Models/player-model");
const Match = require("../Models/match-model");
const Score = require("../Models/score-model");

const updateScore = async (req, res) => {
  const { id } = req.body;
  let savedScore;
  let player = await Player.findOne({ _id: id });

  if (player.populated("score")) {
    const score = await Score.findById(player.score._id);
    score.wins = score.wins + 1;
    savedScore = await score.save();
  } else {
    const score = new Score({
      wins: 1,
      player: player._id,
    });
    savedScore = await score.save();
    player.score = savedScore._id;
    await player.save;
  }
  res.status(201).json(savedScore);
};

const getAllScores = async (req, res) => {
  body = req.body;
  const scores = await Score.find({})
    .populate()
    .exec(function (err, scores) {
      if (err) throw err;
      res.status(201).json(scores);
    });
};

const getByPlayersName = async (req, res) => {
  const { name } = req.body;

  await Player.findOne({ name: name })
    .populate("score")
    .exec(function (err, player) {
      if (err) throw err;
      res.status(201).json(player.score);
    });
};

const getHighScores = async (req, res) => {
  await Score.find({})
    .populate("player")
    .sort({ wins: -1 })
    .exec(function (err, scores) {
      if (err) throw err;
      const topFive = scores.slice(0, 4);
      res.status(201).json(topFive);
    });
};

module.update = updateScore;
module.getAll = getAllScores;
module.players = getByPlayersName;
module.highScores = getHighScores;
/*
const createScore = async (req, res) => {
  let body = req.body;

  if (!body.wins) {
    body.wins = 0;
  }
  body.playerId = await Player.findOne({ _id: playerId }).select(_id);
  let scoreFound = await Score.findOne({ player: body.playerId });

  if (scoreFound) {
    if (scoreFound.wins < body.wins) {
      scoreFound.wins = body.wins;
      scoreFound.save();
    }
    res.status(201).json(scoreFound);
  } else {
    const newScore = new Score({
      wins: body.wins,
      player: body.playerId,
    });

    const savedScore = await newScore.save();

    res.status(201).json(savedScore);
  }
};

const getPlayerScore = async (req, res) => {
  const { id } = req.body;

  const score = await Score.findById({ player: id });

  res.status(201).json(score);
};*/
