const { ObjectId, Timestamp } = require("bson");
const mongoose = require("mongoose");
const unique = require("mongoose-unique-validator");

const scoreSchema = mongoose.Schema({
  wins: { type: Number, require: true },
  player: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Player",
    unique: true,
  },
});

scoreSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Score = mongoose.model("Score", scoreSchema, "scores");

module.exports = Score;
