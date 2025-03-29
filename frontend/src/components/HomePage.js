import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import InfiniteScroll from "react-infinite-scroll-component";
import Fab from "@mui/material/Fab";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

import CustomizedSnackbars from "./CustomizedSnackbars";
import EventCard from "./EventCard";

function HomePage({ userProfile, accessToken, openSnackBar, setOpenSnackBar }) {
  const [allFetchedEvents, setAllFetchedEvents] = useState([]);
  const [events, setEvents] = useState([]);
  const [visibleCount, setVisibleCount] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const pageSize = 6;  
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

      setAllFetchedEvents(result);

      setEvents(result.slice(0, pageSize));
      setVisibleCount(pageSize);
    } catch (err) {
      console.error("Error fetching events:", err);
      setAllFetchedEvents([]);
      setEvents([]);
      setVisibleCount(0);
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

  const loadMore = () => {
    const nextCount = visibleCount + pageSize;
    const newSlice = allFetchedEvents.slice(0, nextCount);
    setEvents(newSlice);
    setVisibleCount(nextCount);
  };

  const hasMore = visibleCount < allFetchedEvents.length;

  const handleViewAll = () => {
    navigate("/search");
  };

  return (
    <div>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mx: 4,
          mt: 3,
        }}
      >
        <h2 style={{ margin: 0 }}>Events near Waterloo</h2>
        <Button
          variant="outlined"
          size="medium"
          onClick={handleViewAll}
          sx={{ textTransform: "none" }}
        >
          View All Events
        </Button>
      </Box>

      <InfiniteScroll
        dataLength={events.length}
        next={loadMore}
        hasMore={hasMore}
        loader={<h4 style={{ textAlign: "center" }}>Loading more events...</h4>}
        endMessage={
          <Box sx={{ textAlign: "center", mt: 2 }}>
            <h4>No more events found.</h4>
          </Box>
        }
        style={{ overflow: "visible" }} 
        scrollThreshold={0.9}
      >
        <Grid
          container
          spacing={3}
          justifyContent="center"
          sx={{
            px: 2,
            mt: 1,
          }}
        >
          {events.map((evt) => (
            <Grid
              item
              key={evt.id}
              xs={12}
              sm={6}
              md={4}
              lg={3}
              sx={{ minWidth: 280 }}
            >
              <EventCard
                userProfile={userProfile}
                accessToken={accessToken}
                event={evt}
              />
            </Grid>
          ))}
        </Grid>
      </InfiniteScroll>

      {showScrollTop && (
        <Fab
          color="primary"
          onClick={scrollToTop}
          sx={{
            position: "fixed",
            bottom: 24,
            right: 24,
            zIndex: 2000,
            boxShadow: 4,
            transition: "opacity 0.3s ease",
          }}
        >
          <KeyboardArrowUpIcon />
        </Fab>
      )}

      <CustomizedSnackbars openSnackBar={openSnackBar} setOpenSnackBar={setOpenSnackBar}>
        You successfully created an event!
      </CustomizedSnackbars>

    </div>
  );
}

export default HomePage;
