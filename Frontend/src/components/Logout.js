import React, { useState } from "react";
import { Button, Card } from "@mui/material";
import { Form } from "react-router-dom";

import Cookies from "universal-cookie";

const Login = () => {
  const cookies = new Cookies();

  const handleSubmit = async (event) => {
    event.preventDefault();
    cookies.remove("authorization");
    window.location.replace("/");
  };

  return (
    <Card sx={{ p: 8 }}>
      <form autoComplete="off" onSubmit={handleSubmit}>
        <h2>Kirjaudu ulos:</h2>
        <Button variant="outlined" color="secondary" onClick={handleSubmit}>
          Logout
        </Button>
      </form>
    </Card>
  );
};

export default Login;
