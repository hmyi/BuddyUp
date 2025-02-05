import React, { useState, useEffect } from "react";
import Profile from "./Profile";
import Header from "./Header";
import { Routes, Route, useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import "./App.css";
import FacebookLogin, { FacebookLoginClient } from '@greatsumini/react-facebook-login';
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CardActions from "@mui/material/CardActions";
import { Grid2 } from '@mui/material';

function App() {
  const data = [1, 1, 1, 1, 1, 1, 1, 1];
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    FacebookLoginClient.init({
      appId: '508668852260570',
      version: 'v19.0',
    });
  }, []);

  const handleSuccess = (response) => {
    console.log('handleSuccess triggered');
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
    }
  };

  const handleLogout = () => {
    setIsSignedIn(false);
    setUserProfile(null);
    console.log('User logged out');
  };

  return (
      <>
      <Header isSignedIn={isSignedIn} userProfile={userProfile} handleLogout={handleLogout}
              handleSuccess={handleSuccess} handleFailure={handleFailure}/>
      <Routes>
        <Route path={"/"} element={
          <div>
            <h1 style={{marginLeft: "150px"}}>Events near Waterloo</h1>
            <Grid2 container spacing={3} sx={{marginX: "150px"}}>
              {data.map((item, index) => (
                  <Grid2 item xs={12} sm={6} md={4} key={index}>
                    <BasicCard/>
                  </Grid2>
              ))}
            </Grid2>
          </div>
        }/>
        <Route path="/profile" element={<Profile />} />
      </Routes>
      </>
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