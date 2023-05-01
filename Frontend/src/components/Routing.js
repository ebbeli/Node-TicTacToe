import React from "react";
import Login from "./LoginPage";
import Logout from "./Logout";
import Game from "./Game";
import Register from "./Register";
import HighScores from "./HighScores";
import { Route, Routes } from "react-router-dom";
import { useState } from "react";
const App = () => {
  const [token, setToken] = useState(null);
  function getCookie(name) {
    var dc = document.cookie;
    var prefix = name + "=";
    var begin = dc.indexOf("; " + prefix);
    if (begin == -1) {
      begin = dc.indexOf(prefix);
      if (begin != 0) return null;
    } else {
      begin += 2;
      var end = document.cookie.indexOf(";", begin);
      if (end == -1) {
        end = dc.length;
      }
    }
    // because unescape has been deprecated, replaced with decodeURI
    //return unescape(dc.substring(begin + prefix.length, end));
    return decodeURI(dc.substring(begin + prefix.length, end));
  }

  var myCookie = getCookie("authorization");

  if (myCookie == null) {
    return (
      <div className="App">
        <Routes>
          <Route path="/*" element={<Login />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/Scores" element={<HighScores />} />
        </Routes>
      </div>
    );
  } else {
    return (
      <div className="App">
        <Routes>
          <Route path="/*" element={<Logout />} />
          <Route path="/Game" element={<Game />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/Scores" element={<HighScores />} />
        </Routes>
      </div>
    );
  }
};
export default App;
