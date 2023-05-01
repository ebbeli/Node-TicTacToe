import React, { useContext, useState } from "react";
import { TextField, Button, Card } from "@mui/material";
import { Link } from "react-router-dom";
import axios from "axios";
import Cookies from "universal-cookie";

const Login = () => {
  const [name, setname] = useState("");
  const [password, setPassword] = useState("");
  const [nameError, setnameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const cookies = new Cookies();

  async function loginSubmit() {
    return await axios
      .post("http://localhost:3000/login", {
        name: name,
        password: password,
      })
      .then((response) => {
        console.log(response.data);
        if (response.data.token) {
          alert("Kirjautuminen onnistui");
          cookies.set("authorization", response.data.token);
          localStorage.setItem("Token", response.data.token);
          window.location.replace("/Game");
        }
      })
      .catch((error) => {
        alert("Väärä käyttäjätunnus tai salasana");
        console.log(error);
      });
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    setnameError(false);
    setPasswordError(false);

    if (name == "") {
      setnameError(true);
    }
    if (password == "") {
      setPasswordError(true);
    }
    await loginSubmit();
  };

  if (name && password) {
    console.log(name, password);
  }

  return (
    <Card sx={{ p: 8 }}>
      <form autoComplete="off" onSubmit={handleSubmit}>
        <h2>Kirjautuminen:</h2>
        <TextField
          label="Nimimerkki"
          onChange={(e) => setname(e.target.value)}
          required
          variant="outlined"
          color="secondary"
          type="name"
          sx={{ mb: 3 }}
          fullWidth
          value={name}
          error={nameError}
        />
        <TextField
          label="Salasana"
          onChange={(e) => setPassword(e.target.value)}
          required
          variant="outlined"
          color="secondary"
          type="password"
          value={password}
          error={passwordError}
          fullWidth
          sx={{ mb: 3 }}
        />
        <Button variant="outlined" color="secondary" onClick={handleSubmit}>
          Kirjaudu
        </Button>
      </form>
      <small>
        Tarvitsetko käyttäjän? <Link to="/Register">Rekisteröityminen</Link>
      </small>
    </Card>
  );
};

export default Login;
