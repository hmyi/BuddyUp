import React from "react";
import { Box, Typography, Switch, FormControlLabel } from "@mui/material";

function CookieSettings() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Cookie Settings
      </Typography>
      <FormControlLabel control={<Switch />} label="Enable essential cookies" />
      <FormControlLabel control={<Switch />} label="Enable analytics cookies" />
      <FormControlLabel control={<Switch />} label="Enable marketing cookies" />
    </Box>
  );
}

export default CookieSettings;
