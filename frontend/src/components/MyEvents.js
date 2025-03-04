import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import {
  Divider,
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Card,
  CardContent,
  CardMedia,
} from "@mui/material";

const eventTypes = ["Attending", "Hosting", "Past"];
const defaultImages = {
  Social: "events_pics/social.jpg",
  Entertainment: "events_pics/entertainment.jpg",
  Sports: "events_pics/sports.jpg",
  Food: "events_pics/food.jpg",
  Outdoor: "events_pics/outdoor.jpg",
  Gaming: "events_pics/gaming.jpg",
  Carpool: "events_pics/carpool.jpg",
};

function MyEvents({ userProfile, accessToken }) {
  const [selectedType, setType] = useState("Attending");
  const [events, setEvents] = useState([]);
  const [hoveredEvent, setHoveredEvent] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    fetchEvents();
  }, [selectedType]);

  if (!accessToken) {
    console.error("No access Token received!");
    return;
  }

  console.log("MyEvents with accessToken: ", accessToken);
  console.log("Making API Request...");

  const fetchEvents = async () => {
    try {
      const attendingResponse = await fetch(
        "https://18.226.163.235:8000/api/events/joined/",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const hostingResponse = await fetch(
        "https://18.226.163.235:8000/api/events/created",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const attendingEvents = await attendingResponse.json();
      const hostingEvents = await hostingResponse.json();

      let filteredEvents = [];
      if (selectedType === "Attending") {
        filteredEvents = attendingEvents.filter(
          (event) => event.status !== "expire"
        );
      } else if (selectedType === "Hosting") {
        filteredEvents = hostingEvents.filter(
          (event) => event.status !== "expire"
        );
      } else {
        filteredEvents = [...attendingEvents, ...hostingEvents].filter(
          (event) => event.status === "expire"
        );
      }
      filteredEvents.sort(
        (a, b) => new Date(a.start_time) - new Date(b.start_time)
      );
      setEvents(filteredEvents);
    } catch (error) {
      console.error("Error fetching events: ", error);
    }
  };
  return (
    <Box
      sx={{
        display: "flex",
        gap: "3rem",
        padding: "2rem",
        justifyContent: "center",
      }}
    >
      <Paper
        sx={{
          width: "250px",
          height: "150px",
          padding: "1rem",
          backgroundColor: "#f7f7f7f7",
        }}
      >
        <List>
          {eventTypes.map((type) => (
            <ListItem
              button
              key={type}
              onClick={() => setType(type)}
              style={{ cursor: "pointer" }}
            >
              <ListItemText
                primary={type}
                primaryTypographyProps={{
                  sx: {
                    fontWeight: selectedType === type ? "bold" : "normal",
                    color: selectedType === type ? "#007b8f" : "gray",
                  },
                }}
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      <Box sx={{ width: "600px" }}>
        <Typography variant={"h6"} sx={{ mb: 2, fontWeight: "bold" }}>
          {" "}
          {selectedType} Events
        </Typography>
        <Divider sx={{ mb: 2 }}></Divider>
        {events.length > 0 ? (
          events.map((event) => (
            <Card onMouseEnter={() => setHoveredEvent(event.id)}
                  onMouseLeave={() => setHoveredEvent(null)} key={event.id} sx={{ display: "flex", marginBottom: "1rem",
              transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
              transform: hoveredEvent === event.id ? "scale(1.05)" : "scale(1)",
              boxShadow: hoveredEvent === event.id ? 6 : 3}} onClick={() => navigate(`/events/${event.id}`, {
              state: { event, userProfile, accessToken },
            })} style={{ cursor: "pointer" }}>
              <CardMedia
                component={"img"}
                sx={{ width: 150, height: 100 }}
                image={defaultImages[event.category]}
                alt={event.category}
              />
              <CardContent>
                <Typography variant={"subtitle2"}>
                  {new Date(event.start_time).toLocaleString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Typography>
                <Typography variant={"h6"}>{event.title}</Typography>
                <Typography variant={"body2"}>
                  {event.location}, {event.city}
                </Typography>
                <Typography variant={"body2"}>
                  {event.attendance} attendees
                  {event.status === "full" &&
                      (<Typography color={"error"} component={"span"} sx={{marginLeft:"8px"}}>
                        Event Full </Typography>)}
                </Typography>
              </CardContent>
            </Card>
          ))
        ) : (
          <Typography variant={"body1"} sx={{ textAlign: "center" }}>
            No events found
          </Typography>
        )}
      </Box>
    </Box>
  );
}

export default MyEvents;
