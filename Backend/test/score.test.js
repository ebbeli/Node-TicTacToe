const supertest = require("supertest");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const app = require("../app");
const api = supertest(app);
const Player = require("../Models/player-model");
const Score = require("../Models/score-model");
const helper = require("./testHelper");
const { ObjectId } = require("mongodb");
const { players } = require("../Controllers/score-controller");

const expect = require("chai").expect;
describe("Score API", () => {
  beforeAll(async () => {
    await Score.deleteMany({});
    await Player.deleteMany({});

    const passwordHash1 = await bcrypt.hash("secret", 10);
    const passwordHash2 = await bcrypt.hash("secret", 10);

    const player1 = new Player({
      name: "pelaaja1",
      password: passwordHash1,
      matches: [],
      sign: "A",
    });

    const player2 = new Player({
      name: "pelaaja2",
      password: passwordHash2,
      matches: [],
      sign: "B",
    });

    const savedPlayer1 = await player1.save();
    const savedPlayer2 = await player2.save();
  });

  test("Create new score", async () => {
    const player = await Player.findOne({ name: "pelaaja1" });
    console.log(player);
    await api
      .post("/scores/update")
      .send({ id: player._id })
      .expect(201)
      .expect("Content-Type", /application\/json/);
    expect(function (score) {
      console.log(score);
      expect(score.wins).equal(1);
      expect(score.player).equal(String(player._id));
    });
  });

  test("Update score", async () => {
    const player = await Player.findOne({ name: "pelaaja1" });

    await api
      .post("/scores/update")
      .send({ id: player._id })
      .expect(201)
      .expect("Content-Type", /application\/json/);
    expect(function (score) {
      console.log(score);
      expect(score.wins).equal(2);
      expect(score.player).equal(String(player._id));
    });
  });

  test("Get Scores and populate", async () => {
    const scoresToCompare = await Score.find({});
    console.log(scoresToCompare);
    const player = await Player.findById({ _id: scoresToCompare[0].player });

    await api
      .get("/scores/")
      .expect(201)
      .expect("Content-Type", /application\/json/);
    expect(function (scores) {
      console.log(score);
      expect(scores.length).equal(scoresToCompare.length);
      expect(scores[0].player.name).equal(player.name);
    });
  });
  test("Players score", async () => {
    let playerToCompare;
    await Player.findOne({ name: "pelaaja1" })
      .populate("score")
      .then((player) => {
        playerToCompare = player;
      });
    console.log(playerToCompare);
    await api
      .get("/scores/players")
      .send({ name: playerToCompare.name })
      .expect(201)
      .expect("Content-Type", /application\/json/);
    expect(function (player) {
      console.log(player);
      expect(playerToCompare).equal(player);
    });
  });
});

afterAll((done) => {
  // Closing the DB connection allows Jest to exit successfully.
  mongoose.connection.close();
  done();
});
