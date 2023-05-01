import React, { useState } from "react";
import { TextField, Button, Container, Stack, Card } from "@mui/material";
import { Link } from "react-router-dom";
import axios from "axios";

const RegisterForm = () => {
  const [name, setName] = useState("");
  const [sign, setSign] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    return await axios
      .post("http://localhost:3000/players/create", {
        name: name,
        sign: sign,
        password: password,
      })
      .then((response) => {
        console.log(response);
        alert("Käyttäjä luoto");
        window.location.replace("/");
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const handleChange = (e) => {
    const limitChar = 1;
    if (e.target.value.toString().length <= limitChar) {
      setSign(e.target.value);
    }
  };
  return (
    <Card sx={{ p: 5 }}>
      <h2>Rekisteröityminen</h2>
      <form onSubmit={handleSubmit} action={<Link to="/login" />}>
        <Stack spacing={2} direction="row" sx={{ marginBottom: 4 }}>
          <TextField
            type="text"
            variant="outlined"
            color="secondary"
            label="Käyttäjätunnuksesi"
            onChange={(e) => setName(e.target.value)}
            value={name}
            fullWidth
            required
          />
          <TextField
            type="text"
            variant="outlined"
            color="secondary"
            label="Ristinolla merkkisi:"
            onChange={(e) => handleChange(e)}
            value={sign}
            fullWidth
            required
            inputProps={{ maxLength: 12 }}
          />
        </Stack>
        <TextField
          type="password"
          variant="outlined"
          color="secondary"
          label="Salasanasi"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          required
          fullWidth
          sx={{ mb: 4 }}
        />
        <Button variant="outlined" color="secondary" type="submit">
          Rekisteröidy
        </Button>
      </form>
      <small>
        Onko sinulla jo tunnus? <Link to="/l">Kirjaudu täältä</Link>
      </small>
    </Card>
  );
};

export default RegisterForm;
