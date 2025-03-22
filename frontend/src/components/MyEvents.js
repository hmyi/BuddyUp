import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../AuthContext";

import ListItemButton from "@mui/material/ListItemButton";
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

function MyEvents({ userProfile }) {
  const [selectedType, setType] = useState("Attending");
  const [events, setEvents] = useState([]);
  const { accessToken } = useContext(AuthContext);

  const [hoveredEvent, setHoveredEvent] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    fetchEvents();
  }, [selectedType]);

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

    const attendingData =
      attendingResponse && typeof attendingResponse.json === "function"
        ? await attendingResponse.json()
        : [];
    const hostingData =
      hostingResponse && typeof hostingResponse.json === "function"
        ? await hostingResponse.json()
        : [];

    const attendingEvents = Array.isArray(attendingData)
      ? attendingData
      : (attendingData.attending_events || []);
    const hostingEvents = Array.isArray(hostingData)
      ? hostingData
      : (hostingData.hosting_events || []);

    let filteredEvents = [];
    if (selectedType === "Attending") {
      filteredEvents = attendingEvents.filter(
        (event) => event.status !== "expire"

      );
    }

    else if (selectedType === "Hosting") {
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



  
  useEffect(() => {
    fetchEvents();
  }, [selectedType]);

  if (accessToken === null) {
    return <div>Loading events...</div>;
  }

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
            <ListItemButton
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
            </ListItemButton>
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
            <Card
              onMouseEnter={() => setHoveredEvent(event.id)}
              onMouseLeave={() => setHoveredEvent(null)}
              key={event.id}
              sx={{
                display: "flex",
                marginBottom: "1rem",
                transition:
                  "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                transform:
                  hoveredEvent === event.id ? "scale(1.05)" : "scale(1)",
                boxShadow: hoveredEvent === event.id ? 6 : 3,
              }}
              onClick={() =>
                navigate(`/events/${event.id}`, {
                  state: { event, userProfile, accessToken },
                })
              }
              style={{ cursor: "pointer" }}
            >
              <CardMedia
                component={"img"}
                sx={{ width: 200, height: 150 }}
                image={
                  event.event_image_url ?? `events_pics/${event.category}.jpg`
                }
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
                  {event.status === "full" && (
                    <Typography
                      color={"error"}
                      component={"span"}
                      sx={{ marginLeft: "8px" }}
                    >
                      Event Full{" "}
                    </Typography>
                  )}
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
