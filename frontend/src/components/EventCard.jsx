// EventCard.jsx
import React, { useContext, useState } from "react";
import { Card, CardMedia, CardContent, Typography, Box, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PeopleIcon from "@mui/icons-material/People";
import EventSeatIcon from "@mui/icons-material/EventSeat";

function formatDateTime(startTime) {
  const date = new Date(startTime);
  return date.toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short"
  });
}

function EventCard({ event, hostName }) {
  const navigate = useNavigate();
  const { userProfile } = useContext(AuthContext);
  const [participants] = useState(event.participants || []);
  const attendanceCount = participants.length;
  const spotsLeft = event.capacity - attendanceCount;
  const formattedDateTime = formatDateTime(event.start_time);
  const isAttending = participants.includes(userProfile?.userID);

  const goToDetails = () => {
    navigate(`/events/${event.id}`, { state: { event } });
  };

  return (
    <Card
      onClick={goToDetails}
      sx={{
        width: 380,
        boxShadow: 3,
        cursor: "pointer",
        position: "relative",
        transition: "box-shadow 0.3s ease-in-out",
        "&:hover": { boxShadow: "0 0 15px 5px rgba(0,123,255,0.7)" }
      }}
    >
      <Box sx={{ position: "relative" }}>
        <CardMedia
          component="img"
          height="200"
          image={event.event_image_url ?? `/events_pics/${event.category}.jpg`}
          alt={event.title}
        />
        {isAttending && (
          <Box
            sx={{
              position: "absolute",
              top: 16,
              right: -50,
              width: 150,
              backgroundColor: "green",
              color: "white",
              textAlign: "center",
              fontSize: "0.75rem",
              fontWeight: "bold",
              transform: "rotate(45deg)",
              zIndex: 10,
              py: 0.5,
              boxShadow: 2
            }}
          >
            Attending
          </Box>
        )}
        {!isAttending && spotsLeft <= 0 && (
          <Box
            sx={{
              position: "absolute",
              top: 16,
              left: -50,
              width: 150,
              backgroundColor: "red",
              color: "white",
              textAlign: "center",
              fontSize: "0.75rem",
              fontWeight: "bold",
              transform: "rotate(-45deg)",
              zIndex: 10,
              py: 0.5,
              boxShadow: 2
            }}
          >
            Event Full
          </Box>
        )}
      </Box>

      <CardContent>
        <Typography variant="h6">{event.title}</Typography>
        {hostName && (
          <Typography variant="body2" color="text.secondary">
            Hosted by: {hostName}
          </Typography>
        )}
        <Box sx={{ mt: 1 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <AccessTimeIcon fontSize="small" />
            <Typography variant="body2" color="text.secondary">
              {formattedDateTime}
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 0.5 }}>
            <PeopleIcon fontSize="small" />
            <Typography variant="body2" color="text.secondary">
              {attendanceCount} going
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 0.5 }}>
            <EventSeatIcon fontSize="small" />
            <Typography variant="body2" color="text.secondary">
              {spotsLeft} spots left
            </Typography>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
}

export default EventCard;
