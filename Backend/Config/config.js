//require("dotenv").config();

let PORT;
if (!process.env.PORT) {
  PORT = 3000;
} else {
  PORT = process.env.PORT;
}

// Ask for password via email, if you need it
const DB =
  "mongodb+srv://projekti:" +
  process.env.PW +
  "@cluster0.kkexnr0.mongodb.net/tictactoe?retryWrites=true&w=majority";

module.exports = {
  DB,
  PORT,
};
