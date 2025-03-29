import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Fab from "@mui/material/Fab";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import CustomizedSnackbars from "./CustomizedSnackbars";
import EventCard from "./EventCard";

function HomePage({ userProfile, accessToken, openSnackBar, setOpenSnackBar }) {
  const [events, setEvents] = useState([]);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const navigate = useNavigate();

  const fetchEvents = async () => {
    try {
      const res = await fetch("https://18.226.163.235:8000/api/events/search/?city=Waterloo&page=0");
      const data = await res.json();
      let result;
      if (Array.isArray(data)) {
        result = data;
      } else if (data.results && Array.isArray(data.results)) {
        result = data.results;
      } else {
        result = [];
      }
      setEvents(result);
    } catch (err) {
      console.error("Error fetching events:", err);
      setEvents([]);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 150);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleViewAll = () => {
    navigate("/search");
  };

  return (
    <div>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mx: 4, mt: 3 }}>
        <h2 style={{ margin: 0 }}>Events near Waterloo</h2>
        <Button variant="outlined" size="medium" onClick={handleViewAll} sx={{ textTransform: "none" }}>
          View All Events
        </Button>
      </Box>
      <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "20px", px: 2, mt: 1 }}>
        {events.map((evt) => (
          <Box key={evt.id}>
            <EventCard userProfile={userProfile} accessToken={accessToken} event={evt} />
          </Box>
        ))}
      </Box>
      {showScrollTop && (
        <Fab
          color="primary"
          onClick={scrollToTop}
          sx={{ position: "fixed", bottom: 24, right: 24, zIndex: 2000, boxShadow: 4, transition: "opacity 0.3s ease" }}
        >
          <KeyboardArrowUpIcon />
        </Fab>
      )}


<CustomizedSnackbars openSnackBar={openSnackBar} setOpenSnackBar={setOpenSnackBar} />



    </div>
  );
}

export default HomePage;
