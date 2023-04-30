const mongoose = require("mongoose");
const unique = require("mongoose-unique-validator");

const playerSchema = mongoose.Schema({
  name: { type: String, required: true, unique: true },
  password: { type: String },
  sign: { type: String, maxLength: 1 },
  matches: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Match",
    },
  ],
  score: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Score",
  },
});

playerSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.password;
  },
});

const Player = mongoose.model("Player", playerSchema, "players");

module.exports = Player;
