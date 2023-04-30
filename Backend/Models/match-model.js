const { ObjectId, Timestamp } = require("bson");
const mongoose = require("mongoose");
const unique = require("mongoose-unique-validator");

const matchSchema = mongoose.Schema(
  {
    name: { type: String, unique: true },
    moves: { type: Array, require: true },
    result: String,
    lastMoveBy: String,
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
    returnedObject.id = returnedObject._id.$oid;
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Match = mongoose.model("Match", matchSchema, "matches");

module.exports = Match;
