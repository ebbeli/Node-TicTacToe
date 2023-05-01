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
import { Link } from "react-router-dom";
function getId() {}
const MatchRows = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState([true]);

  useEffect(() => {
    fetch("http://localhost:3000/matches/players")
      .then((response) => response.json())
      .then((responseData) => {
        console.log(responseData);
        let matches = responseData.body.p1.concat(responseData.body.p2);
        console.log(matches);
        matches = matches.sort(function (a, b) {
          return new Date(b.updatedAt) - new Date(a.updatedAt);
        });
        setMatches(matches);
        setLoading(false);
        console.log(responseData);
      })
      .catch((error) => console.log(error));
  }, []);

  const listMatches = matches.map((match) => (
    <Link to={"/playGame/" + match.id}>
      <TableRow>
        <TableCell width={"50%"} align="center">
          {match.player.name}
        </TableCell>
        <TableCell align="center">{match.name}</TableCell>
        <TableCell align="center">{match.lastMoveBy}</TableCell>
        <TableCell align="center">{match.result}</TableCell>
      </TableRow>
    </Link>
  ));
  if (loading) {
    return <TableCell>Lataa..</TableCell>;
  }
  return <TableBody>{listMatches}</TableBody>;
};
const MatchTable = () => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell align="center">Pelin Nimi</TableCell>
          <TableCell align="center">Viimeisin Siirto</TableCell>
          <TableCell align="center">Tilanne</TableCell>
        </TableRow>
      </TableHead>
      <MatchRows />
    </Table>
  );
};

const Matches = (props) => {
  return (
    <Card sx={{ p: 5 }}>
      <Typography>Pelit</Typography>

      <MatchTable />
    </Card>
  );
};

const App = () => {
  return <Matches />;
};

export default App;
