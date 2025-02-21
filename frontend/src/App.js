import React, { useState } from "react";
import Profile from "./components/Profile";
import Header from "./components/Header";
import "./App.css";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardActions,
} from "@mui/material";

import Grid2 from "@mui/material/Grid";
import { Routes, Route, useNavigate } from "react-router-dom";

import { jwtDecode } from "jwt-decode";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import FacebookLogin from "@greatsumini/react-facebook-login";

const FACEBOOK_APP_ID = "508668852260570";
const GOOGLE_CLIENT_ID =
  "951498977249-r9scenl51h8qtsmsc1rv3nierj7k7ohh.apps.googleusercontent.com";

function BasicCard() {
  const [flag, setFlag] = useState(0);

  return (
    <Card
      onMouseEnter={() => setFlag(1)}
      onMouseLeave={() => setFlag(0)}
      sx={{ maxWidth: 300, margin: "20px auto", boxShadow: 3 }}
    >
      <CardMedia
        className="Card"
        component="img"
        height="200"
        image="events_pics/hiking.jpg"
        alt="hiking"
      />
      <CardContent>
        <Typography
          gutterBottom
          variant="h5"
          component="div"
          sx={flag === 1 ? { textDecoration: "underline" } : {}}
        >
          Hiking
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={flag === 1 ? { textDecoration: "underline" } : {}}
        >
          description about time, location, category, created by
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

export function handleFacebookSuccess(response) {
  console.log("handleFacebookSuccess Called with:", response);

  if (!response || !response.accessToken) {
    console.error("No access token received! Response:", response);
    return;
  }

  const fbAccessToken = response.accessToken;
  console.log("Facebook Access Token Received:", fbAccessToken);

  console.log("Making API Request...");
  fetch("https://18.218.44.88:8000/api/auth/facebook/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ access_token: fbAccessToken }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("API Response Data:", data);

      if (!data.access) {
        console.error("API Response does not contain 'access' token:", data);
        return;
      }

      console.log("Decoding Token:", data.access);
      const decodedToken = jwtDecode(data.access);
      console.log("Decoded JWT:", decodedToken);
    })
    .catch((error) => console.error("❌ Error retrieving JWT:", error));
}

function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openLoginDialog, setOpenLoginDialog] = useState(false);
  const [accessToken, setAccessToken] = useState(null);
  const navigate = useNavigate();
  const data = [1, 1, 1, 1, 1, 1, 1, 1];

  const handleFacebookSuccess = (response) => {
    console.log("HandleFacebookSuccess Called with:", response);

    // Ensure authResponse is not undefined before accessing its properties
    if (!response || !response.accessToken) {
      console.error("No access token received! Response:", response);
      return;
    }

    const fbAccessToken = response.accessToken;
    console.log("Facebook Access Token Received:", fbAccessToken);

    console.log("🚀 Making API Request...");
    fetch("https://3.128.172.39:8000/api/auth/facebook/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ access_token: fbAccessToken }),
    })
      .then((res) => {
        console.log("API Fetch Called, Status:", res.status);
        return res.json();
      })
      .then((data) => {
        console.log("API Response Data:", data);

        if (!data.access) {
          console.error("API Response does not contain 'access' token:", data);
          return;
        }

        setIsSignedIn(true);

        console.log("Decoding Token:", data.access);
        setAccessToken(data.access);

        const decodedToken = jwtDecode(data.access);
        console.log("Decoded JWT:", decodedToken);

        setUserProfile({
          name: decodedToken.username || "Unknown",
          email: decodedToken.email || "No Email Provided",
        });
      })
      .catch((error) => console.error("Error retrieving JWT:", error));

    setOpenLoginDialog(false);
  };

  const handleFacebookFailure = (error) => {
    console.error("Facebook Auth Error:", error);
    setIsSignedIn(false);
  };

  const handleGoogleSuccess = (response) => {
    console.log("Google Auth Success:", response);
    setIsSignedIn(true);
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
    navigate("/");
  };

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Header
        isSignedIn={isSignedIn}
        userProfile={userProfile}
        accessToken={accessToken}
        handleLogout={handleLogout}
        anchorEl={anchorEl}
        handleMenuOpen={handleMenuOpen}
        handleMenuClose={handleMenuClose}
        openLoginDialog={() => setOpenLoginDialog(true)}
      />

      <Routes>
        <Route
          path="/"
          element={
            <div>
              <h1 style={{ marginLeft: "150px" }}>Events near Waterloo</h1>
              <Grid2 container spacing={3}>
                {data.map((item, index) => (
                  <Grid2 xs={12} sm={6} md={3} key={index}>
                    <BasicCard />
                  </Grid2>
                ))}
              </Grid2>
              <footer className="footer">
                <div className="footer-content">
                  <span>©2025 BuudyUp</span>
                  <span>Terms of Service</span>
                  <span>Privacy Policy</span>
                  <span>Cookie Settings</span>
                  <span>Cookie Policy</span>
                  <span>Help</span>
                </div>
              </footer>
            </div>
          }
        />
        <Route path="/profile" element={<Profile />} />
      </Routes>

      <Dialog open={openLoginDialog} onClose={() => setOpenLoginDialog(false)}>
        <DialogTitle>Sign In</DialogTitle>
        <DialogContent>
          <FacebookLogin
            appId={FACEBOOK_APP_ID}
            onSuccess={handleFacebookSuccess}
            onFail={handleFacebookFailure}
            usePopup
            initParams={{ version: "v19.0", xfbml: true, cookie: true }}
            loginOptions={{
              scope: "public_profile,email",
              return_scopes: true,
            }}
            render={({ onClick }) => (
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={onClick}
              >
                Sign In with Facebook
              </Button>
            )}
          />
          <br />
          <br />
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleFailure}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenLoginDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </GoogleOAuthProvider>
  );
}

export default App;
