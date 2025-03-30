// src/components/SearchPage.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CustomizedSnackbars from "./CustomizedSnackbars";
import InfiniteScroll from "react-infinite-scroll-component";
import Fab from "@mui/material/Fab";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

// The new FilterMenu import
import FilterMenu from "./FilterMenu";
import SearchEventCard from "./SearchEventCard";
import { useEventContext } from "../EventContext";

function SearchPage({ openSnackBar, setOpenSnackBar }) {
  const { events, setEvents, city, setCity, category, setCategory } = useEventContext();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";

  const pageSize = 5;
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [allFetchedEvents, setAllFetchedEvents] = useState([]);

  // Show or hide the FAB based on scroll
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

  // Fetch all events initially (or on city/category/query change)
  const fetchAllEvents = async () => {
    let apiUrl = "";

    if (query.trim()) {
      apiUrl = `https://18.226.163.235:8000/api/events/search/?city=${city}&query=${encodeURIComponent(query.trim())}`;
    } else {
      apiUrl = `https://18.226.163.235:8000/api/events/filter/?key=city&name=${city}`;
      if (category) {
        apiUrl += `&key=category&name=${category}`;
      }
    }

    try {
      const res = await fetch(apiUrl);
      const data = await res.json();
      const result = data.results || data;

      setAllFetchedEvents(result);
      setEvents(result.slice(0, pageSize));
      setVisibleCount(pageSize);
    } catch (err) {
      console.error("Error loading events:", err);
      setAllFetchedEvents([]);
      setEvents([]);
    }
  };

  useEffect(() => {
    setVisibleCount(pageSize);
    setEvents([]);
    setAllFetchedEvents([]);
    fetchAllEvents();
    // eslint-disable-next-line
  }, [city, category, query]);

  const loadMore = () => {
    const nextCount = visibleCount + pageSize;
    const newSlice = allFetchedEvents.slice(0, nextCount);
    setEvents(newSlice);
    setVisibleCount(nextCount);
  };

  const hasMore = visibleCount < allFetchedEvents.length;

  return (
    <div>
      {/* The FilterMenu, styled to match your header or subheader */}
      <FilterMenu
        city={city}
        setCity={setCity}
        category={category}
        setCategory={setCategory}
      />

      <Typography variant="h5" sx={{ ml: 4, mt: 2, mb: 1 }}>
        {query.trim() ? `Search results for "${query}"` : `Events near ${city}`}
      </Typography>

      <InfiniteScroll
        dataLength={events.length}
        next={loadMore}
        hasMore={hasMore}
        scrollThreshold={0.9}
        loader={<h4 style={{ textAlign: "center" }}>Loading more events...</h4>}
        endMessage={
          <Typography align="center" color="text.secondary" sx={{ mt: 2 }}>
            No more events found.
          </Typography>
        }
        style={{ overflow: "visible" }}
      >
        <Box sx={{ mx: 4, display: "flex", flexDirection: "column", gap: 2 }}>
          {events.map((evt) => (
            <SearchEventCard key={evt.id} event={evt} />
          ))}
        </Box>
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

export default SearchPage;
