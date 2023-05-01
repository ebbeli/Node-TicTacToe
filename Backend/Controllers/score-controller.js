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
  await Player.updateOne({ _id: id }, { score: savedScore._id }).catch((err) =>
    next(err)
  );

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
      const topFive = scores.slice(0, 5);
      res.status(201).json(topFive);
    })
    .catch((err) => next(err));
};

exports.update = updateScore;
exports.getAll = getAllScores;
exports.players = getByPlayersName;
exports.highScores = getHighScores;
