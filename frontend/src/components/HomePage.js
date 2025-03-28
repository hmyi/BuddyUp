import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import EventCard from "./EventCard";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import * as React from "react";

function HomePage({ userProfile, accessToken }) {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch("https://18.226.163.235:8000/api/events/search/?city=Waterloo&page=0")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setEvents(data);
        } else if (data.results && Array.isArray(data.results)) {
          setEvents(data.results);
        } else {
          setEvents([]);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div>
      <h1 style={{ textAlign: "center", margin: "1rem 0" }}>
        Events near Waterloo
      </h1>
      <Grid
        container
        spacing={3}
        sx={{
          justifyContent: "center",
          px: 2, // some horizontal padding
        }}
      >
        {events.map((evt) => (
          <Grid item xs={12} sm={6} md={3} key={evt.id}>
            <EventCard
              userProfile={userProfile}
              accessToken={accessToken}
              event={evt}
            />
          </Grid>
        ))}
      </Grid>
      <Box sx={{ display: "flex", justifyContent: "center", margin: "2rem" }}>
        <Button variant="contained">Load more</Button>
      </Box>
      <footer className="footer">
        <Stack direction="row" spacing={5} justifyContent="center">
          <span>©2025 BuddyUp</span>
          <span>Terms of Service</span>
          <span>Privacy Policy</span>
          <span>Cookie Settings</span>
          <span>Cookie Policy</span>
          <span>Help</span>
        </Stack>
      </footer>
    </div>
  );
}

export default HomePage;
