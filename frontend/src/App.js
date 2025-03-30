import React from "react";
import ReactDOM from 'react-dom';

import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Routes, Route, useNavigate } from "react-router-dom";
import Profile from "./components/Profile";
import Header from "./components/Header";
import MyEvents from "./components/MyEvents";
import EventDetails from "./components/EventDetails";
import AttendeesPage from "./components/AttendeesPage";
import SettingsPage from "./components/SettingsPage";

import SearchPage from "./components/SearchPage";
import HomePage from "./components/HomePage";
import { EventProvider } from "./EventContext";
import { AuthProvider, AuthContext } from "./AuthContext";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import FacebookLogin from "@greatsumini/react-facebook-login";
import { GlobalStyles, Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import decodeToken from "./utils/decodeToken";
import { handleFacebookSuccess } from "./auth/handleFacebook";
import { handleGoogleSuccess, handleGoogleFailure } from "./auth/handleGoogle";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import CookiePolicy from "./pages/CookiePolicy";
import Footer from "./components/Footer";

const FACEBOOK_APP_ID = process.env.REACT_APP_FACEBOOK_APP_ID;
const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;



function AppContent({ toggleTheme, mode }) {
  const navigate = useNavigate();
  const { setIsSignedIn, setUserProfile, setAccessToken } = React.useContext(AuthContext);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openLoginDialog, setOpenLoginDialog] = React.useState(false);
  const [openSnackBar, setOpenSnackBar] = React.useState({ open: false, msg: "" });

  const handleLogout = () => {
    setIsSignedIn(false);
    setUserProfile(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userProfile");
    setAccessToken(null);
    navigate("/");
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
      <Route        path="/"
         element={
           <HomePage
             openSnackBar={openSnackBar}
             setOpenSnackBar={setOpenSnackBar}
           />
         }
        />
        <Route
    path="/events/:id"
    element={<EventDetails openLoginDialog={() => setOpenLoginDialog(true)} />}
  />        <Route path="/events/:id/attendee" element={<AttendeesPage />} />
        <Route path="/users/:id" element={<Profile />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/myEvents" element={<MyEvents />} />
        <Route
          path="/settings"
          element={
            <SettingsPage
              toggleTheme={toggleTheme}
              mode={mode}
              openSnackBar={openSnackBar}
              setOpenSnackBar={setOpenSnackBar}
            />
          }
        />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/cookie-policy" element={<CookiePolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />}/>
          <Route path="/privacy-policy" element={<PrivacyPolicy />}/>
        <Route path="*" element={<HomePage />} />
      </Routes>
        <Footer />

      <Dialog open={openLoginDialog} onClose={() => setOpenLoginDialog(false)}>
        <DialogTitle>Sign In</DialogTitle>
        <DialogContent>
          <FacebookLogin
            appId={FACEBOOK_APP_ID}
            onSuccess={(response) =>
              handleFacebookSuccess(response, {
                setIsSignedIn,
                setAccessToken,
                setUserProfile,
                navigate,
                setOpenLoginDialog,
              })
            }
            onFail={(error) => {
              console.error("Facebook Auth Error:", error);
              setIsSignedIn(false);
            }}
            usePopup
            initParams={{ version: "v19.0", xfbml: true, cookie: true }}
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
          <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <GoogleLogin
              onSuccess={(response) =>
                handleGoogleSuccess(response, {
                  setIsSignedIn,
                  setAccessToken,
                  setUserProfile,
                  setOpenLoginDialog,
                  navigate,
                })
              }
              onError={handleGoogleFailure}
            />
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
  const [mode, setMode] = React.useState(() => {
    const savedMode = localStorage.getItem("mode");
    return savedMode ? savedMode : "light";
  });

  const theme = React.useMemo(

    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode]
  );

  const toggleTheme = () => {
    setMode((prevMode) => {
      const newMode = prevMode === "light" ? "dark" : "light";
      localStorage.setItem("mode", newMode);
      return newMode;
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles
        styles={{
          body: {
            backgroundColor: theme.palette.background.default,
            color: theme.palette.text.primary,
          },
          ".header": {
            backgroundColor: theme.palette.background.paper,
          },
          ".footer": {
            backgroundColor: theme.palette.background.paper,
          },
        }}
      />

      <AuthProvider>
        <EventProvider>
          <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <AppContent toggleTheme={toggleTheme} mode={mode} />
          </GoogleOAuthProvider>
        </EventProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;


