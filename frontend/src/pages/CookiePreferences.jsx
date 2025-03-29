import React from "react";
import { Box, Typography } from "@mui/material";

function CookiePreferences() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Cookie Preferences
      </Typography>
      <Typography variant="body1" paragraph>
        Currently, this site does not use analytics or marketing cookies. We only rely on
        essential cookies or local storage for login and basic functionality.
      </Typography>
      <Typography variant="body1" paragraph>
        If that changes in the future (e.g., adding analytics), we will update this page so
        you can manage or opt-out of any additional cookies.
      </Typography>
    </Box>
  );
}

export default CookiePreferences;
