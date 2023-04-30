//require("dotenv").config();

const user = "projekti";
const password = process.env.PW;

const PORT = process.env.PORT;
const DB =
  "mongodb+srv://" +
  user +
  ":" +
  password +
  "@cluster0.kkexnr0.mongodb.net/tictactoe?retryWrites=true&w=majority";

module.exports = {
  DB,
  PORT,
};
