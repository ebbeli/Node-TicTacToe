const Player = require("../Models/player-model");
const Score = require("../Models/score-model");

const updateScore = async (req, res, next) => {
  const { id } = req.body;
  let savedScore;
  let player = await Player.findOne({ _id: id });

  if (player.score) {
    const score = await Score.findById(player.score._id);
    score.wins = score.wins + 1;
    savedScore = await score.save();
  } else {
    const score = new Score({
      wins: 1,
      player: player._id,
    });
    savedScore = await score.save();
  }
  await Player.updateOne({ _id: id }, { score: savedScore._id })
    .then((docs) => {
      console.log("Updated: ", docs);
    })
    .catch((err) => next(err));

  res.status(201).json(savedScore);
};

const getAllScores = async (req, res, next) => {
  await Score.find({})
    .populate("player")
    .then((scores) => {
      res.status(201).json(scores);
    })
    .catch((err) => next(err));
};

const getByPlayersName = async (req, res, next) => {
  const body = req.body;
  console.log(body);
  await Player.findOne({ name: body.name })
    .populate("score")
    .then((player) => {
      res.status(201).json(player.score);
    })
    .catch((err) => next(err));
};

const getHighScores = async (req, res, next) => {
  await Score.find({})
    .populate("player")
    .sort({ wins: -1 })
    .then((scores) => {
      const topFive = scores.slice(0, 4);
      res.status(201).json(topFive);
    })
    .catch((err) => next(err));
};

exports.update = updateScore;
exports.getAll = getAllScores;
exports.players = getByPlayersName;
exports.highScores = getHighScores;
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
