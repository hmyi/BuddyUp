import React from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Divider,
  Avatar,
  AvatarGroup,
  Grid,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import FloatingFooter from "./FloatingFooter";

// A styled Box for the map's responsive container
const MapContainer = styled("div")(({ theme }) => ({
  position: "relative",
  width: "100%",
  paddingTop: "56.25%", // 16:9 aspect ratio
  marginBottom: theme.spacing(2),
}));

const MapIframe = styled("iframe")({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  border: 0,
});

function formatDateTime(dateString) {
  const dateObj = new Date(dateString);
  return dateObj.toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function generateGoogleCalendarLink(event) {
  const startUTC = new Date(event.start_time)
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}Z$/, "Z");
  const endUTC = new Date(event.end_time)
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}Z$/, "Z");
  const title = encodeURIComponent(event.title || "Event");
  const details = encodeURIComponent(event.description || "No description");
  const location = encodeURIComponent(`${event.location} ${event.city}`);

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${startUTC}/${endUTC}`;
}

function EventDetails() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const apiKey = process.env.REACT_APP_MAPS_EMBED_API_KEY;
  const event = state?.event;
  const userProfile = state?.userProfile;
  const accessToken = state?.accessToken;
  console.log(event);

  if (!event) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" color="error">
          No event data found!
        </Typography>
        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={() => navigate("/")}
        >
          Back to Home
        </Button>
      </Box>
    );
  }

  const startTime = formatDateTime(event.start_time);
  const endTime = formatDateTime(event.end_time);

  const googleMapSrc = `https://www.google.com/maps/embed/v1/place?key=AIzaSyAgHVPlFLzDDN4bZtQViktx_K3elrWgkeI&q=${encodeURIComponent(
    `${event.location}, ${event.city}`
  )}`;

  const calendarLink = generateGoogleCalendarLink(event);

  const participantAvatars = (event.participants || []).map((p) => {
    return {
      id: p,
      name: `User${p}`,
      avatarUrl: `https://via.placeholder.com/40/00798a/ffffff?text=U${p}`,
    };
  });

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      {/* Hero Image (if your event has an image property, replace with event.image) */}
      <CardMedia
        component="img"
        height="300"
        image="https://via.placeholder.com/800x300.png?text=Event+Image"
        alt={event.title}
        sx={{ borderRadius: 1, mb: 2, objectFit: "cover" }}
      />

      <Card sx={{ p: 2, mb: 2 }}>
        <CardContent>
          {/* Title */}
          <Typography variant="h4" gutterBottom>
            {event.title}
          </Typography>
          {/* Category & City */}
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            {event.category} | {event.city}
          </Typography>

          {/* Times */}
          <Typography variant="body1" sx={{ mt: 2 }}>
            <strong>Start:</strong> {startTime}
          </Typography>
          <Typography variant="body1">
            <strong>End:</strong> {endTime}
          </Typography>

          {/* "Add to Calendar" Button */}
          <Button
            variant="outlined"
            size="small"
            sx={{ mt: 1 }}
            onClick={() => window.open(calendarLink, "_blank")}
          >
            Add to Calendar
          </Button>

          <Divider sx={{ my: 2 }} />

          {/* Description */}
          <Typography variant="body1" paragraph>
            {event.description}
          </Typography>

          {/* Capacity & Attendance */}
          <Typography variant="body1" paragraph>
            <strong>Capacity:</strong> {event.capacity} &nbsp;|&nbsp;{" "}
            <strong>Attendance:</strong> {event.attendance}
          </Typography>

          {/* Status & Creator */}
          <Typography variant="body1" paragraph>
            <strong>Status:</strong> {event.status} &nbsp;|&nbsp;{" "}
            <strong>Creator:</strong> {event.creator}
          </Typography>

          <Divider sx={{ my: 2 }} />

          {/* Participants Avatars */}
          <Typography variant="h6" sx={{ mb: 1 }}>
            Participants
          </Typography>
          {participantAvatars.length > 0 ? (
            <AvatarGroup max={8}>
              {participantAvatars.map((p) => (
                <Avatar
                  key={p.id}
                  alt={p.name}
                  src={p.avatarUrl}
                  sx={{
                    bgcolor: "#00798a",
                    width: 40,
                    height: 40,
                    fontSize: 14,
                  }}
                />
              ))}
            </AvatarGroup>
          ) : (
            <Typography variant="body2">No participants yet.</Typography>
          )}
        </CardContent>
      </Card>
      <Card sx={{ p: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Location
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            {event.location}, {event.city}
          </Typography>
          <MapContainer>
            <MapIframe
              loading="lazy"
              allowFullScreen
              title="Google Map"
              src={googleMapSrc}
            />
          </MapContainer>
        </CardContent>
      </Card>

      {/* Additional Info at bottom if desired */}
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={6}>
          <Typography variant="caption" display="block" gutterBottom>
            <strong>Created:</strong>{" "}
            {new Date(event.created_at).toLocaleString()}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography
            variant="caption"
            display="block"
            gutterBottom
            align="right"
          >
            <strong>Updated:</strong>{" "}
            {new Date(event.updated_at).toLocaleString()}
          </Typography>
        </Grid>
      </Grid>
      <FloatingFooter
        accessToken={accessToken}
        userID={userProfile?.userID}
        hostID={event.creator}
        eventID={event.id}
        eventTitle={event.title}
        eventTime={event.start_time}
        participationList={event.participants}
      >
        {/* Back Button */}
        <Box sx={{ textAlign: "right", mt: 0 }}>
          <Button variant="contained" onClick={() => navigate("/")}>
            Back to Home
          </Button>
        </Box>
      </FloatingFooter>
    </Box>
  );
}

export default EventDetails;
