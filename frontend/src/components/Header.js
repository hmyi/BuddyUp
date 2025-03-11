import React, { useState } from "react";
import { useEventContext } from "../EventContext";
import "../App.css";
import {
  Box,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Typography,
  Stack,
  InputBase,
  Button,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import EventIcon from "@mui/icons-material/Event";
import { useNavigate } from "react-router-dom";
import EventCreation from "./EventCreation";

function Header({ userProfile, accessToken, handleLogout, setOpenSnackBar }) {
  const navigate = useNavigate();
  const { city, setEvents } = useEventContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleSearch = () => {
    const queryParam = encodeURIComponent(searchQuery.trim());
    const apiUrl = queryParam
      ? `https://18.226.163.235:8000/api/events/search/?city=${city}&query=${queryParam}`
      : `https://18.226.163.235:8000/api/events/search/?city=${city}`;

    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setEvents(data);
        else if (data.results && Array.isArray(data.results)) setEvents(data.results);
        else setEvents([]);
      })
      .catch((err) => console.error(err));

    setSearchQuery("");
  };

  return (
    <header className="header">
      <div className="header-left">
        <span className="logo" onClick={() => navigate("/")}>
          BuddyUp
        </span>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder={`Search events in ${city}`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <div className="header-right">
        <EventCreation accessToken={accessToken} setOpenSnackBar={setOpenSnackBar} />

        <IconButton onClick={handleMenuOpen}>
          <Avatar src={userProfile?.picture?.data?.url} />
        </IconButton>

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem onClick={handleMenuClose}>
            <SettingsIcon sx={{ mr: 2 }} fontSize="small" /> Settings
          </MenuItem>
          <MenuItem onClick={() => navigate("/profile", { state: { userProfile } })}>
            <AccountCircleIcon sx={{ mr: 2 }} fontSize="small" /> View Profile
          </MenuItem>
          <MenuItem onClick={() => navigate("/myEvents", { state: { userProfile } })}>
            <EventIcon sx={{ mr: 2 }} fontSize="small" /> My Events
          </MenuItem>
          <MenuItem onClick={() => { handleLogout(); handleMenuClose(); }}>
            <LogoutIcon sx={{ mr: 2 }} fontSize="small" /> Sign Out
          </MenuItem>
        </Menu>
      </div>
    </header>
  );
}

export default Header;
