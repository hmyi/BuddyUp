import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Profile from "./components/Profile";
import Header from "./components/Header";
import MyEvents from "./components/MyEvents";
import EventDetails from "./components/EventDetails";
import SearchPage from "./components/SearchPage";

import EventCard from "./components/EventCard";
import HomePage from "./components/HomePage";
import { EventProvider } from "./EventContext";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import FacebookLogin from "@greatsumini/react-facebook-login";
import "./App.css";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

const FACEBOOK_APP_ID = process.env.REACT_APP_FACEBOOK_APP_ID;
const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

export function handleFacebookSuccess(
  response,
  { setIsSignedIn, setAccessToken, setUserProfile, setOpenLoginDialog } = {}
) {
  console.log("HandleFacebookSuccess Called with:", response);

  if (!response || !response.accessToken) {
    console.error("No access token received! Response:", response);
    return;
  }

  const fbAccessToken = response.accessToken;
  console.log("Facebook Access Token Received:", fbAccessToken);
  console.log("Making API Request...");

  fetch("https://18.226.163.235:8000/api/auth/facebook/", {
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

      if (setIsSignedIn) setIsSignedIn(true);
      if (setAccessToken) setAccessToken(data.access);
      localStorage.setItem("accessToken", data.access); // Persist token

      console.log("Decoding Token:", data.access);
      const decodedToken = jwtDecode(data.access);
      console.log("Decoded JWT:", decodedToken);
    })
    .catch((error) => console.error("Error retrieving JWT:", error));

  if (setOpenLoginDialog) setOpenLoginDialog(false);
}
function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openLoginDialog, setOpenLoginDialog] = useState(false);
  const [accessToken, setAccessToken] = useState(null);

  const [openSnackBar, setOpenSnackBar] = useState(false);

  const navigate = useNavigate();

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
    fetch("https://18.226.163.235:8000/api/auth/facebook/", {
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
          userID: decodedToken.user_id,
          picture: {
            data: { url: data.profile_image_url },
          },
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
    localStorage.removeItem("accessToken");
    setAccessToken(null);
    navigate("/");
  };

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  return (
    <EventProvider>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Header
        isSignedIn={isSignedIn}
        userProfile={userProfile}
        accessToken={accessToken}
        handleLogout={handleLogout}
        anchorEl={anchorEl}
        handleMenuOpen={handleMenuOpen}
        handleMenuClose={handleMenuClose}
        setOpenSnackBar={setOpenSnackBar}
        openLoginDialog={() => setOpenLoginDialog(true)}
      />
      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              userProfile={userProfile}
              accessToken={accessToken}
              openSnackBar={openSnackBar}
              setOpenSnackBar={setOpenSnackBar}
            />
          }
        />
        <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/search" element={<SearchPage />} />
        <Route
          path="/myEvents"
          element={
            <MyEvents userProfile={userProfile} accessToken={accessToken} />
          }
          />
            
        <Route
          path="*"
          element={
            <HomePage
              userProfile={userProfile}
              accessToken={accessToken}
              openSnackBar={openSnackBar}
              setOpenSnackBar={setOpenSnackBar}
            />
          }
        />{" "}
        {/* Catch-all for unknown routes */}
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
    </EventProvider>
  );
}

export default App;
