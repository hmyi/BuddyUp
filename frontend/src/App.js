import React, { useState } from "react";
import Card from "@mui/material/Card";
import "./App.css";

import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CardActions from "@mui/material/CardActions";
import { Grid2 } from "@mui/material";

export default App;

function App() {
  const data = [1, 1, 1, 1, 1, 1, 1, 1];

  return (
    <div>
      <Header></Header>
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

function Header() {
  return (
    <header className="header">
      {/* Logo */}
      <span>BuddyUp</span>
      {/* Search Bar */}
      <div className="search-bar">
        <input type="text" placeholder="Search for groups or events" />
        <button>Search</button>
      </div>
      <div className="auth-buttons">
        <button className="sign-in">Sign in</button>
      </div>
    </header>
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
        // className={flag === 1 ? "Card" : ""}
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
          descriptio about time. location, category, created by
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
