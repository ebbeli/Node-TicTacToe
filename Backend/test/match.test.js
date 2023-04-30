const supertest = require("supertest");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const app = require("../app");
const api = supertest(app);
const Player = require("../Models/player-model");
const Match = require("../Models/match-model");

const helper = require("./testHelper");
const { ObjectId } = require("mongodb");

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

    const player1ToSave = await Player.findOne({ name: "pelaaja1" });
    const player2ToSave = await Player.findOne({ name: "pelaaja2" });
    console.log(player1ToSave._id);
    const match = new Match({
      name: "peli",
      moves: [
        { x: 2, y: 2 },
        { x: 2, y: 1 },
      ],
      result: "In Progress",
      player1: player1ToSave._id,
      player2: player2ToSave._id,
    });

    const savedMatch = await match.save();
    savedPlayer1.matches = savedPlayer1.matches.concat(savedMatch._id);
    savedPlayer2.matches = savedPlayer2.matches.concat(savedMatch._id);
    await savedPlayer1.save();
    await savedPlayer2.save();
  });

  test("Create new Match", async () => {
    const matchesBefore = await helper.whatFound(Match);

    const id1 = await Player.findOne({ name: "pelaaja1" }).select("_id");
    const id2 = await Player.findOne({ name: "pelaaja2" }).select("_id");

    const newMatch = {
      name: "matsi",
      moves: [{ x: 2, y: 3 }],
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

    console.log("Match to Update: ", matchToFind);
    const id = matchToFind._id;
    const move = { x: 1, y: 2 };
    const lastMoveBy = 1;
    console.log(id, move, lastMoveBy);

    await api
      .put("/matches/update")
      .send({ id, move, lastMoveBy })
      .expect(201)
      .expect("Content-Type", /application\/json/)
      .expect(function (res) {
        console.log(res.body.moves);
        console.log(res.body);
        expect(res.body.moves.length).equal(matchToFind.moves.length + 1);
        expect(res.body.lastMoveBy).equal(lastMoveBy);
      });
  });

  test("'Get moves", async () => {
    const matchToFind = await Match.findOne({ name: "matsi" });

    console.log("Matches moves to get: ", matchToFind);

    await api
      .get("/matches/moves")
      .send({ id: matchToFind._id })
      .expect(201)
      .expect("Content-Type", /application\/json/)
      .expect(function (res) {
        console.log(res.body);
        expect(res.body.moves.length).equal(matchToFind.moves.length);
        expect(res.body.lastMoveBy).equal(matchToFind.lastMoveBy);
      });
  });
});

test("'Get players matches", async () => {
  const player = await Player.findOne({ name: "pelaaja1" });

  console.log("Player matches to get: ", player);

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
