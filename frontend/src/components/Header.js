import React from "react";
import { IconButton, Avatar, Menu, MenuItem, Button } from "@mui/material";

import SettingsIcon from "@mui/icons-material/Settings";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import EventIcon from '@mui/icons-material/Event';
import { useNavigate } from "react-router-dom";
import EventCreation from "./EventCreation";

function Header({
  isSignedIn,
  userProfile,
  accessToken,
  handleLogout,
  anchorEl,
  handleMenuOpen,
  handleMenuClose,
  openLoginDialog,
}) {
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="header-left">
        <span
          className="logo"
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
        >
          BuddyUp
        </span>
      </div>

      <div className="search-bar">
        <input type="text" placeholder="Search for groups or events" />
        <button>Search</button>
      </div>

      <div className="header-right">
        {isSignedIn ? (
          <div className="profile-section">
            <EventCreation accessToken={accessToken} />
            <IconButton
              onClick={handleMenuOpen}
              aria-controls={anchorEl ? "profile-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={anchorEl ? "true" : undefined}
              sx={{
                padding: 0,
                "&:hover": { backgroundColor: "transparent" },
                position: "relative",
              }}
            >
              <Avatar
                src={userProfile?.picture?.data?.url}
                sx={{
                  bgcolor: "primary.main",
                  width: 40,
                  height: 40,
                  border: "2px solid #fff",
                  boxShadow: 1,
                }}
              />
            </IconButton>

            <Menu
              id="profile-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              keepMounted
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              sx={{
                "& .MuiPaper-root": {
                  mt: 1.5,
                  minWidth: 200,
                  boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.15)",
                  borderRadius: "8px",
                },
              }}
            >
              <MenuItem onClick={handleMenuClose}>
                <SettingsIcon sx={{ mr: 2 }} fontSize="small" />
                Settings
              </MenuItem>
              <MenuItem
                onClick={() => navigate("/profile", { state: { userProfile } })}
              >
                <AccountCircleIcon sx={{ mr: 2 }} fontSize="small" />
                View profile
              </MenuItem>
                <MenuItem onClick={() => navigate("/myEvents", { state: { userProfile } })} >
                    <EventIcon sx={{ mr: 2 }} fontSize="small" />
                    My events
                </MenuItem>
              <MenuItem
                onClick={() => {
                  handleLogout();
                  handleMenuClose();
                }}
              >
                <LogoutIcon sx={{ mr: 2 }} fontSize="small" />
                Sign Out
              </MenuItem>
            </Menu>
          </div>
        ) : (
          <Button
            variant="contained"
            color="primary"
            onClick={openLoginDialog}
            sx={{
              textTransform: "none",
              fontWeight: "bold",
              borderRadius: "20px",
              padding: "8px 20px",
            }}
          >
            Login
          </Button>
        )}
      </div>
    </header>
  );
}

export default Header;
