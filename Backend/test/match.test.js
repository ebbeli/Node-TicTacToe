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
    const match = new Match({
      name: "peli",
      moves: [
        { x: 2, y: 2 },
        { x: 2, y: 1 },
      ],
      result: "In Progress",
      player1: savedPlayer1._id,
      player2: savedPlayer2._id,
    });

    const savedMatch = await match.save();
    savedPlayer1.matches = savedPlayer1.matches.concat(savedMatch._id);
    savedPlayer2.matches = savedPlayer2.matches.concat(savedMatch._id);
    await savedPlayer1.save();
    await savedPlayer2.save();
  });

  test("Create new Match", async () => {
    const matchesBefore = await helper.whatFound(Match);

    const player1 = await Player.findOne({ name: "pelaaja1" });
    const player2 = await Player.findOne({ name: "pelaaja2" });

    const newMatch = {
      name: "matsi",
      player1: player1._id,
      player2: player2.name,
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

  test("Delete Match", async () => {
    const matchesBefore = await helper.whatFound(Match);
    const match = await Match.findOne({});
    console.log(match);

    await api
      .get("/matches/deleteById")
      .send({ id: match._id })
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const matchesAfter = await helper.whatFound(Match);
    expect(matchesAfter.length).equal(matchesBefore.length - 1);

    const matches = matchesAfter.map((p) => p.name);
    expect(matches).not.contain(match.name);
  });

  test("Update moves", async () => {
    const matchToFind = await Match.findOne({ name: "matsi" });

    const id = matchToFind._id;
    const move = { x: 1, y: 2 };
    const lastMoveBy = 1;

    await api
      .put("/matches/update")
      .send({ id, move, lastMoveBy })
      .expect(201)
      .expect("Content-Type", /application\/json/)
      .expect(function (res) {
        expect(res.body.moves.length).equal(matchToFind.moves.length + 1);
        expect(res.body.lastMoveBy).equal(lastMoveBy);
      });
  });

  test("'Get moves", async () => {
    const matchToFind = await Match.findOne({ name: "matsi" });
    await api
      .get("/matches/moves")
      .send({ id: matchToFind._id })
      .expect(201)
      .expect("Content-Type", /application\/json/)
      .expect(function (res) {
        expect(res.body.moves.length).equal(matchToFind.moves.length);
        expect(res.body.lastMoveBy).equal(matchToFind.lastMoveBy);
      });
  });
});

test("'Get players matches", async () => {
  const player = await Player.findOne({ name: "pelaaja1" });
  await api
    .get("/matches/players")
    .send({ id: player._id })
    .expect(201)
    .expect("Content-Type", /application\/json/)
    .expect(function (res) {
      const matches = res.body.p1.concat(res.body.p2);
      let matchIds = [];
      matches.forEach((match) => {
        matchIds.push(match.id);
      });
      expect(matches.length).equal(player.matches.length);
      expect(matchIds[0]).equals(String(player.matches[0]));
    });
});

afterAll((done) => {
  // Closing the DB connection allows Jest to exit successfully.
  mongoose.connection.close();
  done();
});
