const supertest = require("supertest");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const app = require("../app");
const api = supertest(app);
const Player = require("../Models/player-model");
const helper = require("./testHelper");
const expect = require("chai").expect;

describe("Player API", () => {
  beforeAll(async () => {
    await Player.deleteMany({});

    const passwordHash = await bcrypt.hash("secret", 10);
    const player = new Player({
      name: "root",
      password: passwordHash,
      sign: "X",
    });

    await player.save();
  });

  test("Create new player", async () => {
    const playersBefore = await helper.whatFound(Player);
    const newPlayer = {
      name: "ebeli",
      password: "salainen",
      sign: "@",
    };

    await api
      .post("/players/create")
      .send(newPlayer)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const playersAfter = await helper.whatFound(Player);
    expect(playersAfter.length).equal(playersBefore.length + 1);

    const players = playersAfter.map((p) => p.name);
    expect(players).contain(newPlayer.name);
  });

  test("Get player by Id", async () => {
    const playerToFind = await Player.findOne({ name: "root" });
    let id = playerToFind._id;
    await api
      .get("/players/id")
      .send({ id })
      .expect(200)
      .expect("Content-Type", /application\/json/)
      .expect(function (res) {
        expect(res.body.name).equal(playerToFind.name);
      });
  });

  test("Get player by name", async () => {
    const playerToFind = await Player.findOne({ name: "root" });
    const name = playerToFind.name;
    const playerByString = await Player.findById({
      _id: "644d44265a49ad575c355ff0",
    });

    await api
      .get("/players/name")
      .send({ name })
      .expect(200)
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
