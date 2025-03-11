import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid2";
import Stack from "@mui/material/Stack";
import CustomizedSnackbars from "./CustomizedSnackbars";
import EventCard from "./EventCard";
import FilterMenu from "./FilterMenu";
import Header from "./Header";
import { useEventContext } from "../EventContext";


function HomePage({ userProfile, accessToken, openSnackBar, setOpenSnackBar }) {
  const { events, setEvents, city, setCity, category, setCategory } = useEventContext();

  useEffect(() => {
    let apiUrl = `https://18.226.163.235:8000/api/events/filter/?key=city&name=${city}`;
    if (category) {
      apiUrl += `&key=category&name=${category}`;
    }

    fetch(apiUrl)
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
      .catch((err) => console.error(err));
  }, [city, category]);

  return (
    <div>

      <FilterMenu
        city={city}
        setCity={setCity}
        category={category}
        setCategory={setCategory}
      />

<h1 style={{ marginLeft: "50px", textAlign: "center" }}>
        Events near {city}
      </h1>

      <Grid container spacing={3} sx={{ marginX: "50px" }}>
        {events.map((evt) => (
          <Grid xs={12} sm={6} md={3} key={evt.id}>
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

      <CustomizedSnackbars
        openSnackBar={openSnackBar}
        setOpenSnackBar={setOpenSnackBar}
      >
        You successfully created an event!
      </CustomizedSnackbars>

      <footer className="footer">
        <Stack direction="row" spacing={5} justifyContent="center">
          <span>©2025 BuudyUp</span>
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
