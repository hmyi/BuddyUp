import React from "react";
import { IconButton, Avatar, Menu, MenuItem, Button } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";

function Header({
  isSignedIn,
  userProfile,
  handleLogout,
  anchorEl,
  handleMenuOpen,
  handleMenuClose,
  handleOpenLoginDialog
}) {
  return (
    <header className="header">
      <div className="header-left">
        <span className="logo">BuddyUp</span>
      </div>

      <div className="search-bar">
        <input type="text" placeholder="Search for groups or events" />
        <button>Search</button>
      </div>

      <div className="header-right">
        {isSignedIn ? (
          <div className="profile-section">
            <IconButton
              onClick={handleMenuOpen}
              aria-controls={anchorEl ? "profile-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={anchorEl ? "true" : undefined}
              sx={{ padding: 0, position: "relative" }}
            >
              <Avatar
                src={userProfile?.picture?.data?.url}
                sx={{ width: 40, height: 40, border: "2px solid #fff", boxShadow: 1 }}
              />
            </IconButton>

            <Menu
              id="profile-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              keepMounted
            >
              <MenuItem onClick={handleMenuClose}>
                <SettingsIcon sx={{ mr: 2 }} fontSize="small" />
                Settings
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
          <Button variant="contained" onClick={handleOpenLoginDialog}>
            Login
          </Button>
        )}
      </div>
    </header>
  );
}

export default Header;
