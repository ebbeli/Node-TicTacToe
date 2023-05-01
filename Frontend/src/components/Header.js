import {
  AppBar,
  Box,
  IconButton,
  Toolbar,
  Typography,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import React from "react";
import { useState } from "react";
import PublicIcon from "@mui/icons-material/Public";
import MenuIcon from "@mui/icons-material/Menu";
import Mode from "./ModeSelector.js";
import { Link } from "react-router-dom";

const DropMenu = () => {
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
      <>
        <MenuItem component={Link} to="Login">
          <Typography
            sx={{
              color: "#154870",
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            Kirjautuminen
          </Typography>
        </MenuItem>

        <MenuItem component={Link} to="Register">
          <Typography
            sx={{
              color: "#154870",
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            Registeröityminen
          </Typography>
        </MenuItem>
      </>
    );
  } else {
    return (
      <div className="App">
        <>
          <MenuItem component={Link} to="Logout">
            <Typography
              sx={{
                color: "#154870",
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              Uloskirjaus
            </Typography>
          </MenuItem>
        </>
      </div>
    );
  }
};

const ResponsiveMenu = () => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <Box>
      <Box sx={{ float: "right", flexGrow: 0 }}>
        <Tooltip title="Avaa asetukset">
          <IconButton onClick={handleOpenUserMenu} sx={{ p: 1, mr: "26px" }}>
            <MenuIcon sx={{ color: "white" }} />
          </IconButton>
        </Tooltip>
        <Menu
          sx={{
            mt: "30px",
          }}
          id="testiMenu"
          anchorEl={anchorElUser}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={Boolean(anchorElUser)}
          onClose={handleCloseUserMenu}
        >
          <DropMenu />
          <MenuItem component={Link} to="Scores" key="highScores">
            <Typography
              sx={{
                color: "#154870",
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              High Scores
            </Typography>
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

const Content = ({ asd }) => {
  return (
    <Toolbar sx={{ ml: "30px" }} disableGutters>
      <PublicIcon
        sx={{
          color: "white",
          ml: 0,
          display: { xs: "none", md: "flex" },
          mr: 1,
        }}
      />
      <Box sx={{ float: "left", width: "100%" }}>
        <Typography
          sx={{
            color: "white",
            fontWeight: "bold",
            float: "left",
          }}
          variant="h6"
        >
          Tic-Tac-Toe By Eino Rissanen
        </Typography>
      </Box>
      <Mode />

      <ResponsiveMenu />
    </Toolbar>
  );
};

const Header = ({ foo }) => {
  return (
    <AppBar
      component={"nav"}
      sx={{
        borderBottom: 1,
        borderColor: "gray",
        mt: 0,
        marginTop: 0,
        backgroundColor: "#59595950",
        backdropFilter: "blur(10px)",
      }}
    >
      <Content />
    </AppBar>
  );
};
export default Header;
