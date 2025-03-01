import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Avatar,
  AvatarGroup,
} from "@mui/material";
import { styled } from "@mui/material/styles";

// Mapping for category images
const categoryImages = {
  Sport: "/events_pics/sports.jpg",
  Hiking: "/events_pics/hiking.jpg",
  Food: "/events_pics/food.jpg",
  // add more mappings as needed
};

// Styled components for the image and overlay
const ImageContainer = styled(Box)(({ theme }) => ({
  position: "relative",
  width: "100%",
  height: "400px", // increased height
  marginBottom: theme.spacing(2),
  overflow: "hidden",
}));

const StyledImage = styled("img")({
  width: "100%",
  height: "100%",
  objectFit: "cover",
});

const TopOverlay = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  backgroundColor: "rgba(0, 0, 0, 0.6)",
  color: "white",
  padding: theme.spacing(2),
  boxSizing: "border-box",
}));

// New TopRightOverlay for participants
const TopRightOverlay = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: 0,
  right: 0,
  backgroundColor: "rgba(0, 0, 0, 0.6)",
  color: "white",
  padding: theme.spacing(2),
  boxSizing: "border-box",
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-end",
  gap: theme.spacing(1),
}));

// Styled components for the map embed
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

// Utility function for formatting date/time
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

// Function to generate a Google Calendar link
function generateGoogleCalendarLink(eventData) {
  const startUTC = new Date(eventData.start_time)
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}Z$/, "Z");
  const endUTC = new Date(eventData.end_time)
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}Z$/, "Z");
  const title = encodeURIComponent(eventData.title || "Event");
  const details = encodeURIComponent(eventData.description || "No description");
  const location = encodeURIComponent(`${eventData.location} ${eventData.city}`);
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${startUTC}/${endUTC}`;
}

function EventDetails() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  // Use event from state if available; otherwise fetch it.
  const [eventData, setEventData] = useState(state?.event || null);
  const [loading, setLoading] = useState(false);
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    if (!eventData) {
      setLoading(true);
      fetch(`https://18.226.163.235:8000/api/events/${id}/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          setEventData(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching event details:", error);
          setLoading(false);
        });
    }
  }, [id, eventData, accessToken]);

  if (loading) {
    return <Typography>Loading event details...</Typography>;
  }

  if (!eventData) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" color="error">
          No event data found!
        </Typography>
        <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate("/")}>
          Back to Home
        </Button>
      </Box>
    );
  }

  // Compute the image source based on eventData.category
  const imageSrc =
    categoryImages[eventData.category] || "/events_pics/default.jpg";
  const startTime = formatDateTime(eventData.start_time);
  const endTime = formatDateTime(eventData.end_time);

  // Generate Google Map URL (requires a valid API key)
  const apiKey = process.env.REACT_APP_MAPS_EMBED_API_KEY;
  const googleMapSrc = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(
    `${eventData.location}, ${eventData.city}`
  )}`;

  // Generate Google Calendar link
  const calendarLink = generateGoogleCalendarLink(eventData);

  // For demonstration: simulate user's attendance status (replace with real logic)
  const userIsAttending = eventData.participants
    ? eventData.participants.includes("currentUserId") // replace with actual user id
    : false;

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      {/* Image with overlays */}
      <ImageContainer>
        <StyledImage src={imageSrc} alt={eventData.title} />
        <TopOverlay>
          <Typography variant="h5">{eventData.title}</Typography>
          <Typography variant="subtitle1">
            {eventData.category} | {eventData.city}
          </Typography>
        </TopOverlay>
        {/* Top right overlay for participants */}
        {eventData.participants && eventData.participants.length > 0 && (
          <TopRightOverlay>
            <AvatarGroup sx={{ "& .MuiAvatar-root": { marginRight: "-4px" } }} max={4}>
              {eventData.participants.map((participant, idx) => (
                <Avatar
                  key={idx}
                  alt={`User ${participant}`}
                  src={`https://via.placeholder.com/40/00798a/ffffff?text=U${participant}`}
                />
              ))}
            </AvatarGroup>
          </TopRightOverlay>
        )}
      </ImageContainer>

      {/* Layout for Event Info and Map in two equal columns */}
      <Grid container spacing={2} alignItems="stretch">
        {/* Left column: event details, start/end times, join event, and add to calendar */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2, height: "100%" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Description:
              </Typography>
              <Typography variant="body1" paragraph>
                {eventData.description}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Start:</strong> {startTime}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>End:</strong> {endTime}
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Button variant="contained" color="primary" sx={{ mr: 2 }}>
                  {!userIsAttending ? "Join Event" : "You're Attending"}
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => window.open(calendarLink, "_blank")}
                >
                  Add to Google Calendar
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Right column: Google Map */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2, height: "100%" }}>
            <MapContainer>
              <MapIframe
                loading="lazy"
                allowFullScreen
                title="Google Map"
                src={googleMapSrc}
              />
            </MapContainer>
          </Card>
        </Grid>
      </Grid>

      {/* Back Button */}
      <Box sx={{ textAlign: "right", mt: 2 }}>
        <Button variant="contained" onClick={() => navigate("/")}>
          Back to Home
        </Button>
      </Box>
    </Box>
  );
}

export default EventDetails;
