import React, { useState, useEffect } from "react";
import {
  Card,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

const ScoreRows = () => {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState([true]);
  function getYear() {
    return new Date().getFullYear();
  }
  const currentYear = getYear();
  useEffect(() => {
    fetch("http://localhost:3000/scores/top")
      .then((response) => response.json())
      .then((responseData) => {
        console.log(responseData);
        setScores(responseData);
        setLoading(false);
        console.log(responseData);
      })
      .catch((error) => console.log(error));
  }, []);

  const listScores = scores.map((score) => (
    <TableRow>
      <TableCell width={"50%"} align="center">
        {score.player.name}
      </TableCell>
      <TableCell align="center">{score.wins}</TableCell>
    </TableRow>
  ));
  if (loading) {
    return (
      <tbody>
        <td>Lataa..</td>
      </tbody>
    );
  }
  return <TableBody>{listScores}</TableBody>;
};
const ScoreTable = () => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell align="center">Käyttjän nimi</TableCell>
          <TableCell align="center">Voitot</TableCell>
        </TableRow>
      </TableHead>
      <ScoreRows />
    </Table>
  );
};

const Scores = (props) => {
  return (
    <Card sx={{ p: 5 }}>
      <Typography>Pisteet</Typography>

      <ScoreTable />
    </Card>
  );
};

const App = () => {
  return <Scores />;
};

export default App;
