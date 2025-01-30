import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import "./App.css";
import FacebookLogin, { FacebookLoginClient } from '@greatsumini/react-facebook-login';

import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CardActions from "@mui/material/CardActions";
import { Grid2 } from '@mui/material';
import { Avatar, Menu, MenuItem, IconButton } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";

function App() {
  const data = [1, 1, 1, 1, 1, 1, 1, 1];
  const [isSignedIn, setIsSignedIn] = useState(false); 
  const [userProfile, setUserProfile] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null); 

  useEffect(() => {
    FacebookLoginClient.init({
      appId: '508668852260570',
      version: 'v19.0',
    });
  }, []);

  const handleSuccess = (response) => {
    console.log('Auth Success:', response);
    setIsSignedIn(true);
    FacebookLoginClient.getProfile((profile) => {
      console.log('User Profile:', profile);
      setUserProfile(profile);
    }, {
      fields: 'id,first_name,last_name,email,picture',
    });
  };

  const handleFailure = (error) => {
    console.error('Auth Error:', error);
    setIsSignedIn(false);
    if (error?.error === 'user_cancelled') {
      alert('Please complete the login process');
    }
  };

  const handleLogout = () => {
    setIsSignedIn(false); 
    console.log('User logged out');
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = () => {
    handleLogout(); 
    handleMenuClose(); 
  };

  function Header() {
    return (
      <header className="header">
        <span>BuddyUp</span>
        <div className="search-bar">
          <input type="text" placeholder="Search for groups or events" />
          <button>Search</button>
        </div>
        {isSignedIn ? (
          <>
            <IconButton onClick={handleMenuOpen}>
              <Avatar
                src={userProfile?.picture?.data?.url}
                sx={{
                  bgcolor: "primary.main",
                  cursor: "pointer",
                  width: 40,
                  height: 40,
                  "&:hover": { opacity: 0.8 },
                }}
              >
                {userProfile?.first_name?.[0]}
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              <MenuItem onClick={handleMenuClose}>
                <SettingsIcon sx={{ marginRight: 1 }} />
                Settings
              </MenuItem>
              <MenuItem onClick={handleSignOut}>
                <LogoutIcon sx={{ marginRight: 1 }} />
                Sign Out
              </MenuItem>
            </Menu>
          </>
        ) : (
          <FacebookLogin
            appId="508668852260570"
            onSuccess={handleSuccess}
            onFail={handleFailure}
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
              <Button
                variant="contained"
                color="primary"
                onClick={onClick}
                sx={{
                  textTransform: "none",
                  fontWeight: "bold",
                  borderRadius: "20px",
                  padding: "8px 20px",
                }}
              >
                Sign In with Facebook
              </Button>
            )}
          />
        )}
      </header>
    );
  }

  return (
    <div>
      <Header />
      <h1 style={{ marginLeft: "150px" }}>Events near Waterloo</h1>
      <Grid2 container spacing={3} sx={{ marginX: "150px" }}>
        {data.map((item, index) => (
          <Grid2 item xs={12} sm={6} md={4} key={index}>
            <BasicCard />
          </Grid2>
        ))}
      </Grid2>
    </div>
  );
}

function BasicCard() {
  const [flag, setflag] = useState(0);

  return (
    <Card
      onMouseEnter={() => setflag(1)}
      onMouseLeave={() => setflag(0)}
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
              ? { border: "solid 1px", background: "#00798a", color: "white" }
              : {}
          }
        >
          Attend
        </Button>
        <Button
          size="small"
          sx={
            flag === 1
              ? { border: "solid 1px", background: "#00798a", color: "white" }
              : {}
          }
        >
          Share
        </Button>
      </CardActions>
    </Card>
  );
}

export default App;