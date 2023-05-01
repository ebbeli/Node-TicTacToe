const Player = require("../Models/player-model");
const Match = require("../Models/match-model");

const createMatch = async (req, res) => {
  const match = req.body;
  Match.deleteMany({});
  Player.deleteMany({});
  const player1 = await Player.findById({ _id: match.player1 });
  const player2 = await Player.findOne({ name: match.player2 });

  let result = "In Progress";

  const newMatch = new Match({
    name: match.name,
    moves: [],
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

  res.status(200).json(savedMatch);
};

const getMoves = async (req, res, next) => {
  const body = req.body;

  const foundMoves = await Match.findById({ _id: body.id })
    .select("moves lastMoveBy")
    .catch((err) => next(err));

  res.status(200).json(foundMoves);
};
const deleteMatch = async (req, res, next) => {
  const body = req.body;
  const id = body.id;

  let match = await Match.findOne({ _id: id });

  const deletedMatch = await Match.deleteOne({ _id: id }).catch((err) =>
    next(err)
  );
  console.log(deletedMatch);

  const player1 = await Player.findOne({ _id: match.player1 }).catch((err) =>
    next(err)
  );

  const player2 = await Player.findOne({ _id: match.player2 }).catch((err) =>
    next(err)
  );

  let response = await player1
    .updateOne({ $pull: { matches: id } })
    .catch((err) => next(err));
  console.log(response);
  response = await player2
    .updateOne({ $pull: { matches: id } })
    .catch((err) => next(err));
  console.log(response);

  res.status(200).json(deletedMatch);
};

const deleteMatchByName = async (req, res, next) => {
  const body = req.body;

  const deletedMatch = await Match.deleteOne({ _id: body.name }).catch((err) =>
    next(err)
  );

  res.status(200).json(deletedMatch);
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
  res.status(200).json(matchesToReturn);
};

exports.create = createMatch;
exports.updateMoves = updateMoves;
exports.getMoves = getMoves;
exports.getPlayers = getPlayers;
exports.deleteByName = deleteMatchByName;
exports.deleteById = deleteMatch;
