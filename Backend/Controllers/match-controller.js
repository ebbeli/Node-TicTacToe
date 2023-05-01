const Player = require("../Models/player-model");
const Match = require("../Models/match-model");

const createMatch = async (req, res) => {
  const match = req.body;
  const player1 = await Player.findById({ _id: match.player1.id });
  const player2 = await Player.findById({ _id: match.player2.id });

  let result = "In Progress";

  const newMatch = new Match({
    name: match.name,
    moves: match.moves,
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

const updateMoves = async (req, res, next) => {
  const body = req.body;

  const updatedMatch = await Match.findById({ _id: body.id }).catch((err) =>
    next(err)
  );

  updatedMatch.moves = updatedMatch.moves.concat(body.move);

  updatedMatch.lastMoveBy = body.lastMoveBy;

  const savedMatch = await updatedMatch.save();

  res.status(201).json(savedMatch);
};

const getMoves = async (req, res, next) => {
  const body = req.body;

  const foundMoves = await Match.findById({ _id: body.id })
    .select("moves lastMoveBy")
    .catch((err) => next(err));

  res.status(201).json(foundMoves);
};

const getPlayers = async (req, res, next) => {
  const { id } = req.body;
  const matchesToReturn = { p1: [], p2: [] };

  await Match.find({ player1: id })
    .populate("player2", "name")
    .then((matches) => {
      matchesToReturn.p1 = matches;
    })
    .catch((err) => next(err));

  await Match.find({ player2: id })
    .populate("player1", "name")
    .then((matches) => {
      matchesToReturn.p2 = matches;
    })
    .catch((err) => next(err));

  res.status(201).json(matchesToReturn);
};

exports.create = createMatch;
exports.updateMoves = updateMoves;
exports.getMoves = getMoves;
exports.getPlayers = getPlayers;
