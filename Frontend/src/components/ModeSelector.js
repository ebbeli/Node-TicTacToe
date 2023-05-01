import * as React from "react";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import BrightnessIcon from "@mui/icons-material/Brightness7";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { ColorModeContext } from "../Context";
import { Tooltip } from "@mui/material";

const ModeSelect = () => {
  const theme = useTheme();
  const colorMode = React.useContext(ColorModeContext);
  return (
    <Box sx={{ minWidth: 50 }}>
      <Tooltip title="Vaihda väritilaa">
        <IconButton
          sx={{ ml: 1 }}
          onClick={colorMode.toggleColorMode}
          color="inherit"
        >
          {theme.palette.mode === "dark" ? (
            <DarkModeIcon />
          ) : (
            <BrightnessIcon />
          )}
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default ModeSelect;
