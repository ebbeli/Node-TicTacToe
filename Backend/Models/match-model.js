const { ObjectId, Timestamp } = require("bson");
const mongoose = require("mongoose");
const unique = require("mongoose-unique-validator");

const moveSchema = mongoose.Schema({
  x: Number,
  y: Number,
});

const matchSchema = mongoose.Schema(
  {
    name: { type: String, unique: true },
    moves: [moveSchema],
    result: String,
    lastMoveBy: Number,
    player1: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
    },
    player2: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
    },
  },
  { timestamps: true }
);

matchSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Match = mongoose.model("Match", matchSchema, "matches");

module.exports = Match;
