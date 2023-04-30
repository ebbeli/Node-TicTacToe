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
  beforeEach(async () => {
    const passwordHash1 = await bcrypt.hash("secret", 10);
    const passwordHash2 = await bcrypt.hash("secret", 10);

    const player1 = new Player({
      name: "pelaaja1",
      password: passwordHash1,
      sign: "A",
    });

    const player2 = new Player({
      name: "pelaaja1",
      password: passwordHash2,
      sign: "B",
    });

    await player1.save();

    await player2.save();

    const id1 = await Player.findOne({ name: "pelaaja1" }).select(_id);
    const id2 = await Player.findOne({ name: "pelaaja2" }).select(_id);

    const match = new Match({
      name: "peli",
      moves: [
        [2, 2],
        [2, 1],
      ],
      result: "In Progress",
      player1: id1,
      player2: id2,
    });

    await match.save();
  });

  test("Create new Match", async () => {
    const playersBefore = await helper.playersFound();

    const newPlayer = {
      name: "matsi",
    };

    await api
      .post("/players/create")
      .send(newPlayer)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const playersAfter = await helper.playersFound();
    expect(playersAfter.length).equal(playersBefore.length + 1);

    const players = playersAfter.map((p) => p.name);
    expect(players).contain(newPlayer.name);
  });

  test("Get player by Id", async () => {
    const playerToFind = await Player.findOne({ name: "root" });

    console.log("Player to Find", playerToFind);
    let id = playerToFind._id;

    await api
      .get("/players/id")
      .send({ id })
      .expect(201)
      .expect("Content-Type", /application\/json/)
      .expect(function (res) {
        expect(res.body.name).equal(playerToFind.name);
      });
  });

  test("Get player by name", async () => {
    const playerToFind = await Player.findOne({ name: "root" });

    console.log("Player to Find", playerToFind);
    const name = playerToFind.name;

    await api
      .get("/players/name")
      .send({ name })
      .expect(201)
      .expect("Content-Type", /application\/json/)
      .expect(function (res) {
        expect(res.body.id).equal(playerToFind._id.toString());
      });
  });
});

afterAll((done) => {
  // Closing the DB connection allows Jest to exit successfully.
  mongoose.connection.close();
  done();
});
