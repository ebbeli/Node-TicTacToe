import Header from "./components/Header";
import "./css/App.css";
import "./css/index.css";
import Routing from "./components/Routing";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import * as React from "react";
import { ColorModeContext, AuthContextProvider } from "./Context";
import Layout from "./components/Layout";

function App() {
  const [mode, setMode] = React.useState("light");

  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    []
  );

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <Layout>
          <Routing />
        </Layout>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
