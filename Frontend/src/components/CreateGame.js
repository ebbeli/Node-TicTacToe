import React, { useState } from "react";
import { TextField, Button, Container, Stack, Card } from "@mui/material";
import { Link } from "react-router-dom";
import axios from "axios";
import jwt from "jwt-decode";

const RegisterForm = () => {
  const [name, setName] = useState("");
  const [player, setPlayer] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    let token = localStorage.getItem("Token");
    token = jwt(token);
    console.log(token);
    return await axios

      .post("http://localhost:3000/players/create", {
        name: name,
        player1: token.id,
        player2: player,
      })
      .then((response) => {
        console.log(response);
        alert("Peli luotu");
        console.log(response);
        window.location.replace("/playGame/" + response.body._id);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <Card sx={{ p: 5 }}>
      <h2>Luo peli</h2>
      <form onSubmit={handleSubmit} action={<Link to="/login" />}>
        <Stack spacing={2} direction="row" sx={{ marginBottom: 4 }}>
          <TextField
            type="text"
            variant="outlined"
            color="secondary"
            label="Pelin nimi"
            onChange={(e) => setName(e.target.value)}
            value={name}
            fullWidth
            required
          />
          <TextField
            type="text"
            variant="outlined"
            color="secondary"
            label="Vastustajasi:"
            onChange={(e) => setPlayer(e.target.value)}
            value={player}
            fullWidth
            required
            inputProps={{ maxLength: 12 }}
          />
        </Stack>

        <Button variant="outlined" color="secondary" type="submit">
          Luo Peli
        </Button>
      </form>
    </Card>
  );
};

export default RegisterForm;
