import React from "react";
import { Box, Stack, Link, Paper } from "@mui/material";
import { NavLink } from "react-router-dom"; 

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        mt: "auto",
        borderTop: 1,
        borderColor: "divider",
        backgroundColor: "background.paper",
      }}
    >
 
      <Paper
        elevation={0}
        sx={{
          p: 2,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 1,
        }}
      >
        <Box component="span" sx={{ fontSize: "0.875rem", color: "text.secondary" }}>
          ©2025 BuddyUp
        </Box>
        <Stack direction="row" spacing={3} justifyContent="center">
          
          <Link component={NavLink} to="/terms" variant="body2" sx={{ textDecoration: "none" }}>
            Terms of Service
          </Link>
          <Link component={NavLink} to="/privacy" variant="body2" sx={{ textDecoration: "none" }}>
            Privacy Policy
          </Link>
          <Link component={NavLink} to="/cookie-policy" variant="body2" sx={{ textDecoration: "none" }}>
            Cookie Policy
          </Link>
          <Link component={NavLink} to="/settings?tab=cookie" variant="body2">
  Cookie Settings
</Link>
        </Stack>
      </Paper>
    </Box>
  );
}

export default Footer;
