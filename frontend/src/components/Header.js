import React, { useState, useContext } from "react";
import {
  Box,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Button,
  TextField,
  InputAdornment
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import EventIcon from "@mui/icons-material/Event";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import EventCreation from "./EventCreation";
import { useEventContext } from "../EventContext";
import { AuthContext } from "../AuthContext";

function Header({
  handleLogout,
  anchorEl,
  handleMenuOpen,
  handleMenuClose,
  setOpenSnackBar,
  openLoginDialog
}) {
  const navigate = useNavigate();
  const { city, setCity } = useEventContext();
  const { isSignedIn, userProfile } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    let trimmedQuery = searchQuery.trim();
    const recognizedCities = ["Waterloo", "Toronto", "Kitchener"];
    let foundCity = "";

    for (const cityName of recognizedCities) {
      const regex = new RegExp(`\\b${cityName}\\b`, "i");
      if (regex.test(trimmedQuery)) {
        foundCity = cityName;
        trimmedQuery = trimmedQuery.replace(regex, "").trim();
        break;
      }
    }

    if (foundCity) {
      setCity(foundCity);
    }
    if (trimmedQuery) {
      navigate(`/search?query=${encodeURIComponent(trimmedQuery)}`);
    } else {
      navigate("/search");
    }
    setSearchQuery("");
  };

  return (
    <Box
      component="header"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        p: 2,
        backgroundColor: "background.paper",
        boxShadow: 1,
        borderBottom: 1,
        borderColor: "divider"
      }}
    >
      {/* Logo */}
      <Box>
        <Box
          component="span"
          onClick={() => navigate("/")}
          sx={{
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "1.5rem",
            color: "primary.main"
          }}
        >
          BuddyUp
        </Box>
      </Box>

      {/* Search Bar */}
      <Box sx={{ flexGrow: 1, mx: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search for groups or events"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleSearch} edge="end">
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
      </Box>

      {/* Right Section */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        {isSignedIn ? (
          // When signed in, show Create Event button and Profile Section
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Button
              variant="contained"
              onClick={() => {
                // You can either open the EventCreation component as a dialog
                // or navigate to a dedicated "Create Event" page.
                // Here we assume a dialog:
                EventCreation({ setOpenSnackBar });
              }}
              sx={{
                borderRadius: 2,
                px: 2,
                py: 1,
                textTransform: "none",
                fontWeight: "bold"
              }}
            >
              Create Event
            </Button>
            <IconButton
              onClick={handleMenuOpen}
              aria-controls={anchorEl ? "profile-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={anchorEl ? "true" : undefined}
              sx={{ p: 0 }}
            >
              <Avatar
                src={
                  userProfile?.picture?.data?.url ||
                  `https://ui-avatars.com/api/?name=${userProfile?.name}`
                }
                sx={{
                  width: 40,
                  height: 40,
                  border: "2px solid",
                  borderColor: "background.paper"
                }}
              />
            </IconButton>
            <Menu
              id="profile-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              keepMounted
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              sx={{
                "& .MuiPaper-root": {
                  mt: 1.5,
                  minWidth: 200,
                  boxShadow: 3,
                  borderRadius: 2
                }
              }}
            >
              <MenuItem onClick={() => { navigate("/settings"); handleMenuClose(); }}>
                <SettingsIcon sx={{ mr: 2 }} fontSize="small" />
                Settings
              </MenuItem>
              <MenuItem onClick={() => { navigate(`/users/${userProfile?.userID}`); handleMenuClose(); }}>
                <AccountCircleIcon sx={{ mr: 2 }} fontSize="small" />
                View profile
              </MenuItem>
              <MenuItem onClick={() => { navigate("/myEvents"); handleMenuClose(); }}>
                <EventIcon sx={{ mr: 2 }} fontSize="small" />
                My events
              </MenuItem>
              <MenuItem onClick={() => { handleLogout(); handleMenuClose(); }}>
                <LogoutIcon sx={{ mr: 2 }} fontSize="small" />
                Sign Out
              </MenuItem>
            </Menu>
          </Box>
        ) : (
          // When not signed in, show Login button
          <Button
            variant="contained"
            onClick={openLoginDialog}
            sx={{
              borderRadius: 2,
              px: 2,
              py: 1,
              textTransform: "none",
              fontWeight: "bold"
            }}
          >
            Login
          </Button>
        )}
      </Box>
    </Box>
  );
}

export default Header;
