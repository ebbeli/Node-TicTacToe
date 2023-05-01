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

    const passwordHash = await bcrypt.hash("secret", 10);

    const player1 = new Player({
      name: "pelaaja1",
      password: passwordHash,
      matches: [],
      sign: "A",
    });

    const player2 = new Player({
      name: "pelaaja2",
      password: passwordHash,
      matches: [],
      sign: "B",
    });

    const savedPlayer1 = await player1.save();
    const savedPlayer2 = await player2.save();
  });

  test("Create new score", async () => {
    const player = await Player.findOne({ name: "pelaaja1" });
    await api
      .post("/scores/update")
      .send({ id: player._id })
      .expect(201)
      .expect("Content-Type", /application\/json/);
    expect(function (score) {
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
      expect(score.wins).equal(2);
      expect(score.player).equal(String(player._id));
    });
  });

  test("Get Scores and populate", async () => {
    const scoresToCompare = await Score.find({});
    const player = await Player.findById({ _id: scoresToCompare[0].player });

    await api
      .get("/scores/")
      .expect(201)
      .expect("Content-Type", /application\/json/);
    expect(function (scores) {
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
    await api
      .get("/scores/players")
      .send({ name: playerToCompare.name })
      .expect(201)
      .expect("Content-Type", /application\/json/);
    expect(function (player) {
      expect(playerToCompare).equal(player);
    });
  });
  test("High score", async () => {
    const passwordHash = await bcrypt.hash("secret", 10);
    let savedPlayer;
    for (let i = 3; i < 7; i++) {
      const player = new Player({
        name: "pelaaja" + i,
        password: passwordHash,
        matches: [],
        sign: "A",
      });
      savedPlayer = await player.save();

      const score = new Score({
        wins: i,
        player: savedPlayer._id,
      });
      const savedScore = await score.save();
      await Player.updateOne({ _id: player._id }, { score: savedScore._id });
    }

    await api
      .get("/scores/top")
      .expect(201)
      .expect("Content-Type", /application\/json/);
    expect(function (scores) {
      expect(scores[0].wins).equal(6);
      expect(scores[0].player.name).equal("pelaaja6");
      expect(scores.length).equal(5);
    });
  });
});

afterAll((done) => {
  // Closing the DB connection allows Jest to exit successfully.
  mongoose.connection.close();
  done();
});
