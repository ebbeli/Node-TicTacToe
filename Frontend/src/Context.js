import * as React from "react";
import axios from "axios";
import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";

export const ColorModeContext = React.createContext({
  toggleColorMode: () => {},
});

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    let userProfle = localStorage.getItem("userProfile");
    if (userProfle && userProfle !== undefined) {
      return userProfle;
    }
    return null;
  });
  const navigate = useNavigate();

  const options = {
    method: "POST",
    url: "https://microsoft-translator-text.p.rapidapi.com/Detect",
    params: { "api-version": "3.0" },
    headers: {
      "content-type": "application/json",
      "X-RapidAPI-Key": "your-rapidapi-key",
      "X-RapidAPI-Host": "microsoft-translator-text.p.rapidapi.com",
    },
    data: [
      {
        Text: "Ich würde wirklich gern Ihr Auto um den Block fahren ein paar Mal.",
      },
    ],
  };
  const login = async (payload) => {
    await axios.get("http://localhost:3000/players/name/", { name: "name" });
    let apiResponse = localStorage.setItem("userProfile", "asd");

    navigate("/");
  };
  return (
    <>
      <AuthContext.Provider value={{ user, login }}>
        {children}
      </AuthContext.Provider>
    </>
  );
};
export default AuthContext;
