const supertest = require("supertest");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const app = require("../app");
const api = supertest(app);
const Player = require("../Models/player-model");
const Match = require("../Models/match-model");
const jwt = require("jsonwebtoken");
const helper = require("./testHelper");

const expect = require("chai").expect;
describe("Login API", () => {
  beforeAll(async () => {
    await Player.deleteMany({});
    await Match.deleteMany({});
    const passwordHash1 = await bcrypt.hash("salaisinSana", 10);

    const player = new Player({
      name: "pelaajaTesti",
      password: passwordHash1,
      matches: [],
      sign: "A",
    });

    const savedPlayer = await player.save();
  });

  test("Test login", async () => {
    const player = await Player.findOne({ name: "pelaajaTesti" });

    const playerToken = {
      player: player.name,
      id: player._id,
    };

    const token = jwt.sign(playerToken, "Eino", {
      expiresIn: 12 * 60 * 60,
    });

    await api
      .post("/login/")
      .send({ name: player.name, password: "salaisinSana" })
      .expect(200)
      .expect("Content-Type", /application\/json/)
      .expect(function (res) {
        var decodedRes = jwt.verify(res.body.token, "Eino");
        var decoded = jwt.verify(token, "Eino");
        expect(decoded.id).equal(decodedRes.id);
      });
  });
});

afterAll((done) => {
  // Closing the DB connection allows Jest to exit successfully.
  mongoose.connection.close();
  done();
});
