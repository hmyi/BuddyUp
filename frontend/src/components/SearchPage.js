import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import CustomizedSnackbars from "./CustomizedSnackbars";
import SearchEventCard from "./SearchEventCard"; // New component for search page cards
import FilterMenu from "./FilterMenu";
import { useEventContext } from "../EventContext";

function SearchPage({ userProfile, accessToken, openSnackBar, setOpenSnackBar }) {
  const { events, setEvents, city, setCity, category, setCategory } = useEventContext();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";

  useEffect(() => {
    let apiUrl = "";
    if (query.trim()) {
      apiUrl = `https://18.226.163.235:8000/api/events/search/?city=${city}&query=${encodeURIComponent(query.trim())}`;
    } else {
      apiUrl = `https://18.226.163.235:8000/api/events/filter/?key=city&name=${city}`;
      if (category) {
        apiUrl += `&key=category&name=${category}`;
      }
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
  }, [city, category, query, setEvents]);

  return (
    <div>
      <FilterMenu
        city={city}
        setCity={setCity}
        category={category}
        setCategory={setCategory}
      />

      <h1 style={{ marginLeft: "50px", textAlign: "center" }}>
        {query.trim() ? `Search results for "${query}"` : `Events near ${city}`}
      </h1>

      <Box sx={{ marginX: "50px", display: "flex", flexDirection: "column", gap: 2 }}>
        {events.map((evt) => (
          <SearchEventCard key={evt.id} userProfile={userProfile} accessToken={accessToken} event={evt} />
        ))}
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center", margin: "2rem" }}>
        <Button variant="contained">Load more</Button>
      </Box>

      <CustomizedSnackbars openSnackBar={openSnackBar} setOpenSnackBar={setOpenSnackBar}>
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

export default SearchPage;
