import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Stack,
  Chip,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PeopleIcon from "@mui/icons-material/People";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import { AuthContext } from "../AuthContext";

function formatDateTime(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });
}

function SearchEventCard({ event }) {
  const navigate = useNavigate();
  const { userProfile } = useContext(AuthContext);
  const userID = userProfile?.userID;

  const participants = event.participants || [];
  const isAttending = participants.includes(userID);
  const attendanceCount = participants.length;
  const spotsLeft = event.capacity - attendanceCount;
  const isStartingSoon =
    new Date(event.start_time) - new Date() <= 60 * 60 * 1000;

  const goToDetails = () => {
    navigate(`/events/${event.id}`, {
      state: { event },
    });
  };

  return (
    <Card
      onClick={goToDetails}
      sx={{
        display: "flex",
        width: "100%",
        borderRadius: 2,
        overflow: "hidden",
        mb: 2,
        boxShadow: 3,
        cursor: "pointer",
        position: "relative",
        transition: "box-shadow 0.3s ease-in-out, transform 0.2s ease-in-out",
        "&:hover": {
          transform: "scale(1.01)",
          boxShadow: "0 0 15px 5px rgba(0,123,255,0.7)",
        },
      }}
    >
      <Box sx={{ width: "25%", position: "relative" }}>
        <CardMedia
          component="img"
          image={event.event_image_url ?? `events_pics/${event.category}.jpg`}
          alt={event.title}
          sx={{
            height: "100%",
            objectFit: "cover",
          }}
        />

        {isAttending && (
          <Box
            sx={{
              position: "absolute",
              top: 12,
              left: -30,
              width: 120,
              backgroundColor: "green",
              color: "white",
              textAlign: "center",
              fontSize: "0.7rem",
              fontWeight: "bold",
              transform: "rotate(-45deg)",
              zIndex: 10,
              py: 0.5,
              boxShadow: 2,
            }}
          >
            Attending
          </Box>
        )}
        {!isAttending && spotsLeft <= 0 && (
          <Box
            sx={{
              position: "absolute",
              top: 12,
              left: -30,
              width: 120,
              backgroundColor: "red",
              color: "white",
              textAlign: "center",
              fontSize: "0.7rem",
              fontWeight: "bold",
              transform: "rotate(-45deg)",
              zIndex: 10,
              py: 0.5,
              boxShadow: 2,
            }}
          >
            Event Full
          </Box>
        )}
        {!isAttending && spotsLeft > 0 && isStartingSoon && (
          <Box
            sx={{
              position: "absolute",
              bottom: 12,
              left: -30,
              width: 120,
              backgroundColor: "orange",
              color: "white",
              textAlign: "center",
              fontSize: "0.7rem",
              fontWeight: "bold",
              transform: "rotate(-45deg)",
              zIndex: 10,
              py: 0.5,
              boxShadow: 2,
            }}
          >
            Starting Soon
          </Box>
        )}
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          width: "50%",
          px: 2,
          py: 1.5,
        }}
      >
        <Typography variant="h6">{event.title}</Typography>

        <Stack direction="row" spacing={1} alignItems="center" mt={1}>
          <AccessTimeIcon fontSize="small" />
          <Typography variant="body2" color="text.secondary">
            {formatDateTime(event.start_time)}
          </Typography>
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center" mt={0.5}>
          <PeopleIcon fontSize="small" />
          <Typography variant="body2" color="text.secondary">
            {attendanceCount} going
          </Typography>
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center" mt={0.5}>
          <EventSeatIcon fontSize="small" />
          <Typography variant="body2" color="text.secondary">
            {spotsLeft} spots left
          </Typography>
        </Stack>
      </Box>

      <Box
        sx={{
          width: "25%",
          borderLeft: "1px solid #ddd",
          px: 2,
          py: 1.5,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 1,
        }}
      >
        {event.city && (
          <Chip
            icon={<LocationOnIcon />}
            label={event.city}
            size="small"
            variant="outlined"
          />
        )}

        {event.category && (
          <Chip
            label={event.category}
            size="small"
            variant="outlined"
            sx={{ textTransform: "capitalize" }}
          />
        )}

        {event.end_time && (
          <Chip
            icon={<HourglassBottomIcon />}
            label={`Ends: ${new Date(event.end_time).toLocaleTimeString([], {
              hour: "numeric",
              minute: "2-digit",
            })}`}
            size="small"
            variant="outlined"
          />
        )}

        {event.description && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 0.5 }}
          >
            {event.description.slice(0, 90)}...
          </Typography>
        )}
      </Box>
    </Card>
  );
}

export default SearchEventCard;
