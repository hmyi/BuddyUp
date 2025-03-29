import React, { useState } from "react";
import { Box, Stack, Link, Paper, Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import { NavLink } from "react-router-dom";

import TermsOfService from "../pages/TermsOfService";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import CookiePolicy from "../pages/CookiePolicy";

function Footer() {
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState(null);
  const [dialogTitle, setDialogTitle] = useState("");

  const openDialogWithContent = (title, Component) => (event) => {
    event.preventDefault();
    setDialogTitle(title);
    setDialogContent(<Component />);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setDialogContent(null);
    setDialogTitle("");
  };

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
          <Link
            component={NavLink}
            to="/terms"
            variant="body2"
            sx={{ textDecoration: "none" }}
            onClick={openDialogWithContent("Terms of Service", TermsOfService)}
          >
            Terms of Service
          </Link>

          <Link
            component={NavLink}
            to="/privacy"
            variant="body2"
            sx={{ textDecoration: "none" }}
            onClick={openDialogWithContent("Privacy Policy", PrivacyPolicy)}
          >
            Privacy Policy
          </Link>

          <Link
            component={NavLink}
            to="/cookie-policy"
            variant="body2"
            sx={{ textDecoration: "none" }}
            onClick={openDialogWithContent("Cookie Policy", CookiePolicy)}
          >
            Cookie Policy
          </Link>

          <Link
            component={NavLink}
            to="/settings?tab=cookie"
            variant="body2"
            onClick={(e) => {

            }}
          >
            Cookie Preferences
          </Link>
        </Stack>
      </Paper>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="md" // or "sm", "lg", etc. 
      >
        <DialogTitle>{dialogTitle}</DialogTitle>
        <DialogContent dividers sx={{ maxHeight: "70vh" }}>
          {dialogContent}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Footer;
