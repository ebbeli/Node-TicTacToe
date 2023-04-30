const supertest = require("supertest");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const app = require("../app");
const api = supertest(app);
const Player = require("../Models/player-model");
const Match = require("../Models/match-model");
const helper = require("./testHelper");

const expect = require("chai").expect;
describe("Match API", () => {
  beforeAll(async () => {
    await Player.deleteMany({});
    await Match.deleteMany({});
    const passwordHash1 = await bcrypt.hash("secret", 10);
    const passwordHash2 = await bcrypt.hash("secret", 10);

    const player1 = new Player({
      name: "pelaaja1",
      password: passwordHash1,
      sign: "A",
    });

    const player2 = new Player({
      name: "pelaaja2",
      password: passwordHash2,
      sign: "B",
    });

    await player1.save();

    await player2.save();

    const player1ToSave = await Player.findOne({ name: "pelaaja1" });
    const player2ToSave = await Player.findOne({ name: "pelaaja2" });
    console.log(player1ToSave._id);
    const match = new Match({
      name: "peli",
      moves: [
        [2, 2],
        [2, 1],
      ],
      result: "In Progress",
      player1: player1ToSave._id,
      player2: player2ToSave._id,
    });

    await match.save();
  });

  test("Create new Match", async () => {
    const matchesBefore = await helper.whatFound(Match);

    const id1 = await Player.findOne({ name: "pelaaja1" }).select("_id");
    const id2 = await Player.findOne({ name: "pelaaja2" }).select("_id");

    const newMatch = {
      name: "matsi",
      moves: [],
      player1: id1,
      player2: id2,
    };

    await api
      .post("/matches/new")
      .send(newMatch)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const matchesAfter = await helper.whatFound(Match);
    expect(matchesAfter.length).equal(matchesBefore.length + 1);

    const matches = matchesAfter.map((p) => p.name);
    expect(matches).contain(newMatch.name);
  });

  test("Update moves", async () => {
    const matchToFind = await Match.findOne({ name: "matsi" });

    console.log("Player to Find", matchToFind);
    const id = matchToFind._id;
    const move = [1, 2];
    const lastMoveBy = "pelaaja1";

    await api
      .get("/matches/id")
      .send({ id, move, lastMoveBy })
      .expect(201)
      .expect("Content-Type", /application\/json/)
      .expect(function (res) {
        expect(res.body.moves.length).equal(matchToFind.moves.length + 1);
        expect(res.lastMoveBy).equal(lastMoveBy);
      });
  });
});

afterAll((done) => {
  // Closing the DB connection allows Jest to exit successfully.
  mongoose.connection.close();
  done();
});
