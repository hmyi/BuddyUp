import React, { useState } from "react";
import Grid2 from '@mui/material/Grid2'
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import FacebookLogin, { FacebookLoginClient } from "@greatsumini/react-facebook-login";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Menu,
  MenuItem,
  IconButton,
  Avatar
} from "@mui/material";

import "./App.css";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardActions from "@mui/material/CardActions";

const FACEBOOK_APP_ID = "508668852260570";
const GOOGLE_CLIENT_ID =
  "951498977249-r9scenl51h8qtsmsc1rv3nierj7k7ohh.apps.googleusercontent.com";

function App() {
  const data = [1, 1, 1, 1, 1, 1, 1, 1];

  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  const [openLoginDialog, setOpenLoginDialog] = useState(false);

  const [anchorEl, setAnchorEl] = useState(null);

  //----------------------- Facebook Login ---------------------------- //
  const handleFacebookSuccess = (response) => {
    console.log("Facebook Auth Success:", response);
    setIsSignedIn(true);
    FacebookLoginClient.getProfile(
      (profile) => {
        console.log("Facebook User Profile:", profile);
        setUserProfile(profile);
      },
      { fields: "id,first_name,last_name,email,picture" }
    );
    setOpenLoginDialog(false);
  };

  const handleFacebookFailure = (error) => {
    console.error("Facebook Auth Error:", error);
    setIsSignedIn(false);
  };

  //----------------------- Google Login ---------------------------- //
  const handleGoogleSuccess = (response) => {
    console.log("Google Auth Success:", response);
    setIsSignedIn(true);
    // For demo: store minimal user info
    setUserProfile({
      email: "Google User",
      picture: { data: { url: "https://via.placeholder.com/150" } },
    });
    setOpenLoginDialog(false);
  };

  const handleGoogleFailure = (error) => {
    console.error("Google Auth Error:", error);
  };

  const handleLogout = () => {
    setIsSignedIn(false);
    setUserProfile(null);
    setAnchorEl(null);
  };

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  function BasicCard() {
    const [flag, setFlag] = useState(0);

    return (
      <Card
        onMouseEnter={() => setFlag(1)}
        onMouseLeave={() => setFlag(0)}
        sx={{ maxWidth: 300, margin: "20px auto", boxShadow: 3 }}
      >
        <CardMedia
          component="img"
          height="200"
          image="events_pics/hiking.jpg"
          alt="hiking"
        />
        <CardContent>
          <Typography
            gutterBottom
            variant="h5"
            sx={flag === 1 ? { textDecoration: "underline" } : {}}
          >
            Hiking
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={flag === 1 ? { textDecoration: "underline" } : {}}
          >
            Description about time, location, category, created by
          </Typography>
        </CardContent>
        <CardActions>
          <Button
            size="small"
            sx={
              flag === 1
                ? { border: "1px solid", background: "#00798a", color: "white" }
                : {}
            }
          >
            Attend
          </Button>
          <Button
            size="small"
            sx={
              flag === 1
                ? { border: "1px solid", background: "#00798a", color: "white" }
                : {}
            }
          >
            Share
          </Button>
        </CardActions>
      </Card>
    );
  }

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <header className="header">
        <span className="logo">BuddyUp</span>

        <div className="search-bar">
          <input type="text" placeholder="Search for groups or events" />
          <button>Search</button>
        </div>

        <div className="header-right">
          {isSignedIn ? (
            <IconButton
              onClick={handleMenuOpen}
              aria-controls={anchorEl ? "profile-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={anchorEl ? "true" : undefined}
            >
              <Avatar src={userProfile?.picture?.data?.url} />
            </IconButton>
          ) : (
            <Button variant="contained" onClick={() => setOpenLoginDialog(true)}>
              Login
            </Button>
          )}
        </div>

        <Menu
          id="profile-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          keepMounted
        >
          <MenuItem onClick={handleMenuClose}>
            <span>Settings</span>
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleLogout();
              handleMenuClose();
            }}
          >
            <span>Sign Out</span>
          </MenuItem>
        </Menu>
      </header>

      <div>
        <h1 style={{ marginLeft: "150px" }}>Events near Waterloo</h1>
        <Grid2 container spacing={3} sx={{ marginX: "150px" }}>
          {data.map((item, index) => (
            <Grid2 item xs={12} sm={6} md={4} key={index}>
              <BasicCard />
            </Grid2>
          ))}
        </Grid2>
      </div>

      <Dialog open={openLoginDialog} onClose={() => setOpenLoginDialog(false)}>
        <DialogTitle>Sign In</DialogTitle>
        <DialogContent>
          <FacebookLogin
            appId={FACEBOOK_APP_ID}
            onSuccess={handleFacebookSuccess}
            onFail={handleFacebookFailure}
            usePopup
            initParams={{
              version: "v19.0",
              xfbml: true,
              cookie: true,
            }}
            loginOptions={{
              scope: "public_profile,email",
              return_scopes: true,
            }}
            render={({ onClick }) => (
              <Button fullWidth variant="contained" color="primary" onClick={onClick}>
                Sign In with Facebook
              </Button>
            )}
          />
          <br />
          <br />
          <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleFailure} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenLoginDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </GoogleOAuthProvider>
  );
}

export default App;
