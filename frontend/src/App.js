// App.js
import React from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Profile from "./components/Profile";
import Header from "./components/Header";
import MyEvents from "./components/MyEvents";
import EventDetails from "./components/EventDetails";
import SearchPage from "./components/SearchPage";
import HomePage from "./components/HomePage";
import { EventProvider } from "./EventContext";
import { AuthProvider, AuthContext } from "./AuthContext";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import FacebookLogin from "@greatsumini/react-facebook-login";
import { jwtDecode } from "jwt-decode";

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

function AppContent() {
  const navigate = useNavigate();
  const { setIsSignedIn, setUserProfile, setAccessToken } = React.useContext(AuthContext);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openLoginDialog, setOpenLoginDialog] = React.useState(false);
  const [openSnackBar, setOpenSnackBar] = React.useState(false);

  const handleLogout = () => {
    setIsSignedIn(false);
    setUserProfile(null);
    localStorage.removeItem("accessToken");
    setAccessToken(null);
    navigate("/");
  };

  const handleFacebookSuccess = (response) => {
    console.log("HandleFacebookSuccess Called with:", response);
    if (!response || !response.accessToken) {
      console.error("No access token received! Response:", response);
      return;
    }
    const fbAccessToken = response.accessToken;
    console.log("Facebook Access Token Received:", fbAccessToken);
    fetch("https://18.226.163.235:8000/api/auth/facebook/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ access_token: fbAccessToken }),
    })
      .then((res) => res.json().then(data => ({ status: res.status, data })))
      .then(({ status, data }) => {
        console.log("API Response Data:", data);
        if (!data.access) {
          console.error("API Response does not contain 'access' token:", data);
          return;
        }
        localStorage.setItem("accessToken", data.access);
        setIsSignedIn(true);
        setAccessToken(data.access);
        try {
          const decodedToken = jwtDecode(data.access);

          setUserProfile({
            name: decodedToken.username || "Unknown",
            email: decodedToken.email || "No Email Provided",
            userID: decodedToken.user_id,
            picture: {
              data: {
                url:
                  data.profile_image_url ||
                  decodedToken.profile_image_url 
              },
            },
          });
        } catch (err) {
          console.error("Error decoding token:", err);
        }
        if (window.location.pathname.startsWith("/events/")) {
          navigate(window.location.pathname, { replace: true });
        }
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
    fetch("https://18.226.163.235:8000/api/auth/google/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_token: response.credential }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.access) {
          console.error("No access token received from backend", data);
          return;
        }
        localStorage.setItem("accessToken", data.access);
        setIsSignedIn(true);
        setAccessToken(data.access);
        const decodedToken = require("jwt-decode")(data.access);
        setUserProfile({
          name: decodedToken.username || "Unknown",
          email: decodedToken.email || "No Email Provided",
          userID: decodedToken.user_id,
          picture: {
            data: {
              url:
                data.profile_image_url ||
                decodedToken.profile_image_url ||
                "https://via.placeholder.com/40",
            },
          },
        });
        if (window.location.pathname.startsWith("/events/")) {
          navigate(window.location.pathname, { replace: true });
        }
        setOpenLoginDialog(false);
      })
      .catch((error) => console.error("Error during Google login:", error));
  };

  const handleGoogleFailure = (error) => {
    console.error("Google Auth Error:", error);
  };

  return (
    <>
      <Header
        handleLogout={handleLogout}
        openLoginDialog={() => setOpenLoginDialog(true)}
        handleMenuOpen={(e) => setAnchorEl(e.currentTarget)}
        handleMenuClose={() => setAnchorEl(null)}
        setOpenSnackBar={setOpenSnackBar}
        anchorEl={anchorEl}
      />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/myEvents" element={<MyEvents />} />
        <Route path="*" element={<HomePage />} />
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
            loginOptions={{ scope: "public_profile,email", return_scopes: true }}
            render={({ onClick }) => (
              <Button fullWidth variant="contained" color="primary" onClick={onClick}>
                Sign In with Facebook
              </Button>
            )}
          />
          <br /><br />
          <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleFailure} />
          </GoogleOAuthProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenLoginDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <EventProvider>
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          <AppContent />
        </GoogleOAuthProvider>
      </EventProvider>
    </AuthProvider>
  );
}

export default App;
