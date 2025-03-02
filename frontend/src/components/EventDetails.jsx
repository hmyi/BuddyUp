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
<<<<<<< Updated upstream
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
=======
  Badge,
  Chip
} from "@mui/material";
import { styled } from "@mui/material/styles";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import ShareIcon from "@mui/icons-material/Share";

const categoryImages = {
  sports: "/events_pics/sports.jpg",
  hiking: "/events_pics/hiking.jpg",
  food: "/events_pics/food.jpg",
};

const ImageContainer = styled(Box)(({ theme }) => ({
>>>>>>> Stashed changes
  position: "relative",
  width: "100%",
  height: "400px",
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

<<<<<<< Updated upstream
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
=======
const TopRightOverlay = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: 0,
  right: 0,
  padding: theme.spacing(2),
  boxSizing: "border-box",
}));

const BottomOverlay = styled(Box)(({ theme }) => ({
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: "rgba(0, 0, 0, 0.6)",
  color: "white",
  padding: theme.spacing(1),
  boxSizing: "border-box",
  textAlign: "center",
}));

const MapContainer = styled("div")(({ theme }) => ({
  position: "relative",
  width: "100%",
  paddingTop: "100%", 
  marginBottom: theme.spacing(2),
}));

const StatsOverlay = styled(Box)(({ theme }) => ({
  position: "absolute",
  bottom: 0,
  right: 0,
  backgroundColor: "rgba(0, 0, 0, 0.7)",
  color: "white",
  padding: theme.spacing(1),
  borderTopLeftRadius: theme.shape.borderRadius,
  textAlign: "right",
  fontSize: "0.8rem",
}));

function formatEventDate(dateString) {
  const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString("en-US", options);
}

function formatEventTimeRange(start, end) {
  const startDate = new Date(start);
  const endDate = new Date(end);
  return `${startDate.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })} to ${endDate.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZoneName: "short" })}`;
}
function generateGoogleCalendarLink(eventData) {
  // Provide defaults if missing
  const defaultStart = "2025-01-01T00:00:00Z";
  const defaultEnd = "2025-01-01T01:00:00Z";
  const startTime = eventData.start_time || defaultStart;
  const endTime = eventData.end_time || defaultEnd;
  const startDate = new Date(startTime);
  const endDate = new Date(endTime);

  // Even if the provided times are invalid, fallback to defaults
  if (isNaN(startDate) || isNaN(endDate)) {
    console.error(
      "Invalid start or end time",
      eventData.start_time,
      eventData.end_time
    );
    const fallbackStartDate = new Date(defaultStart);
    const fallbackEndDate = new Date(defaultEnd);
    const startUTC = fallbackStartDate
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}Z$/, "Z");
    const endUTC = fallbackEndDate
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}Z$/, "Z");
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      eventData.title || "Event"
    )}&details=${encodeURIComponent(
      eventData.description || "No description"
    )}&location=${encodeURIComponent(
      `${eventData.location || "Unknown location"}, ${eventData.city || ""}`
    )}&dates=${startUTC}/${endUTC}`;
  }

  const startUTC = startDate
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}Z$/, "Z");
  const endUTC = endDate
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}Z$/, "Z");

  const title = encodeURIComponent(eventData.title || "Event");
  const details = encodeURIComponent(eventData.description || "No description");
  const location = encodeURIComponent(
    `${eventData.location || "Unknown location"}, ${eventData.city || ""}`
  );
>>>>>>> Stashed changes
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${startUTC}/${endUTC}`;
}


const EventScheduleBox = ({ eventDate, eventTimeRange, calendarLink, handleShare }) => {
  return (
    <Box sx={{ borderBottom: "1px solid #ddd", pb: 2, mb: 2 }}>
      <Typography variant="h6">{eventDate}</Typography>
      <Typography variant="subtitle1">{eventTimeRange}</Typography>
      <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
        <Button variant="outlined" onClick={() => window.open(calendarLink, "_blank")} sx={{ mr: 2 }}>
          <EventAvailableIcon sx={{ mr: 0.5 }} />
          Add to Calendar
        </Button>
        <Button variant="outlined" onClick={handleShare}>
          <ShareIcon sx={{ mr: 0.5 }} />
          Share
        </Button>
      </Box>
    </Box>
  );
};

const EventCapacityBox = ({ capacity, attendance, spotsAvailable, status, category, location }) => {
  return (
    <Box sx={{ borderBottom: "1px solid #ddd", pb: 2, mb: 2 }}>
      <Typography variant="body2">
        <strong>Capacity:</strong> {capacity} | <strong>Joined:</strong> {attendance} | <strong>Spots Available:</strong> {spotsAvailable}
      </Typography>
      <Box sx={{ mt: 1 }}>
      <Chip
  label={(status || "unknown").toUpperCase()}
  color={
    (status || "").toLowerCase() === "active"
      ? "success"
      : (status || "").toLowerCase() === "full"
      ? "warning"
      : "default"
  }
/>

<Chip
  label={(category || "unknown").toUpperCase()}
  color={(category || "").toLowerCase() === "sports" ? "success" : "default"}
  sx={{ mr: 1 }}
/>
<Chip
  label={(location || "unknown").toUpperCase()}
  color={"default"}
/>
    </Box>
    </Box>
  );
};

const EventActionsBox = ({ userIsAttending, handleJoinEvent, handleLeaveEvent }) => {
  return (
    <Box sx={{ mt: 2 }}>
      <Button
        variant="contained"
        color="primary"
        onClick={userIsAttending ? handleLeaveEvent : handleJoinEvent}       >
        {userIsAttending ? "Leave Event" : "Join Event"}
      </Button>
    </Box>
  );
};

const EventMap = ({ googleMapSrc }) => {
  return (
    <Card sx={{ p: 2, height: "100%" }}>
      <MapContainer>
        <iframe
          title="Google Map"
          src={googleMapSrc}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            border: 0,
          }}
          loading="lazy"
          allowFullScreen
        ></iframe>
      </MapContainer>
    </Card>
  );
};

function EventDetails({ userProfile, accessToken }) {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
<<<<<<< Updated upstream

  // Use event from state if available; otherwise fetch it.
  const [eventData, setEventData] = useState(state?.event || null);
  const [loading, setLoading] = useState(false);
  const accessToken = localStorage.getItem("accessToken");

=======
  const [eventData, setEventData] = useState(state?.event || null);
  const [loading, setLoading] = useState(false);
  const currentUserId = userProfile ? userProfile.userID : null;

>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
  }, [id, eventData, accessToken]);
=======
  }, [id, accessToken]); // Remove eventData from dependencies
  
>>>>>>> Stashed changes

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

<<<<<<< Updated upstream
  // Compute the image source based on eventData.category
  const imageSrc =
    categoryImages[eventData.category] || "/events_pics/default.jpg";
  const startTime = formatDateTime(eventData.start_time);
  const endTime = formatDateTime(eventData.end_time);

  // Generate Google Map URL (requires a valid API key)
=======
  const categoryKey = (eventData.category && eventData.category.toLowerCase()) || "";
  const imageSrc = categoryImages[categoryKey] || "/events_pics/default.jpg";  
  const eventDate = formatEventDate(eventData.start_time);
  const eventTimeRange = formatEventTimeRange(eventData.start_time, eventData.end_time);
  const spotsAvailable = eventData.capacity - eventData.attendance;
>>>>>>> Stashed changes
  const apiKey = process.env.REACT_APP_MAPS_EMBED_API_KEY;
  const googleMapSrc = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(
    `${eventData.location}, ${eventData.city}`
  )}`;
  const calendarLink = generateGoogleCalendarLink(eventData);
  const userIsAttending =
    eventData.participants && currentUserId
      ? eventData.participants.includes(currentUserId)
      : false;

<<<<<<< Updated upstream
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
=======
  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: eventData.title,
          text: eventData.description,
          url: window.location.href,
        })
        .then(() => console.log("Successful share"))
        .catch((error) => console.log("Error sharing", error));
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Event URL copied to clipboard");
    }
  };

  const handleJoinEvent = () => {
    fetch(`https://18.226.163.235:8000/api/events/${id}/join/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Join event failed");
        }
        return res.json();
      })
      .then(() => {
        alert("Successfully joined the event.");
        setEventData({
          ...eventData,
          participants: [...(eventData.participants || []), currentUserId],
        });
      })
      .catch((error) => {
        console.error("Error joining event:", error);
        alert("Error joining event.");
      });
  };

  const handleLeaveEvent = () => {
    fetch(`https://18.226.163.235:8000/api/events/${id}/leave/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Leave event failed");
        }
        return res.json();
      })
      .then(() => {
        alert("Successfully left the event.");
        setEventData({
          ...eventData,
          participants: eventData.participants.filter((p) => p !== currentUserId),
        });
      })
      .catch((error) => {
        console.error("Error leaving event:", error);
        alert("Error leaving event.");
      });
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <ImageContainer>
        <StyledImage src={imageSrc} alt={eventData.title} />
        <TopOverlay>
          <div>
            <Typography variant="h5">{eventData.title}</Typography>
            <Typography variant="subtitle1">
              {eventData.category} | {eventData.city}
            </Typography>
          </div>
          <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
            {eventData.hostImage && (
              <Avatar
                src={eventData.hostImage}
                alt={eventData.hostName}
                sx={{ width: 32, height: 32, mr: 1 }}
              />
            )}
            <Typography variant="caption">Hosted by: {eventData.hostName}</Typography>
          </Box>
        </TopOverlay>
        <TopRightOverlay>
          {eventData.participants && eventData.participants.length > 0 && (
            <Badge badgeContent={eventData.participants.length} color="error" overlap="circular">
              <AvatarGroup sx={{ "& .MuiAvatar-root": { marginRight: "-4px" } }} max={4}>
                {eventData.participants.map((participant, idx) => (
                  <Avatar
                    key={idx}
                    alt={`User ${participant}`}
                    src={`https://via.placeholder.com/40/00798a/ffffff?text=U${participant}`}
                  />
                ))}
              </AvatarGroup>
            </Badge>
          )}
        </TopRightOverlay>
        <BottomOverlay>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <AccessTimeIcon fontSize="small" sx={{ mr: 0.5 }} />
            <Typography variant="subtitle1">Starts: {eventDate}</Typography>
          </Box>
        </BottomOverlay>
        <StatsOverlay>
          <Typography variant="caption">
            Capacity: {eventData.capacity} <br />
            Joined: {eventData.attendance} <br />
            Spots: {spotsAvailable} <br />
            Status: {eventData.status ? eventData.status.toUpperCase() : "UNKNOWN"}
            </Typography>
        </StatsOverlay>
      </ImageContainer>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2, height: "100%" }}>
            <CardContent>
              <EventScheduleBox
                eventDate={eventDate}
                eventTimeRange={eventTimeRange}
                calendarLink={calendarLink}
                handleShare={handleShare}
              />
              <Typography variant="body2" gutterBottom>
                <strong>Location:</strong> {eventData.location}, {eventData.city}
              </Typography>
              <Typography variant="body1" paragraph sx={{ mt: 2 }}>
                {eventData.description}
              </Typography>
              <EventCapacityBox
                capacity={eventData.capacity}
                attendance={eventData.attendance}
                spotsAvailable={spotsAvailable}
                status={eventData.status}
                category={eventData.category}
                location={eventData.location}
              />
              <EventActionsBox
                userIsAttending={userIsAttending}
                handleJoinEvent={handleJoinEvent}
                handleLeaveEvent={handleLeaveEvent}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <EventMap googleMapSrc={googleMapSrc} />
        </Grid>
      </Grid>
>>>>>>> Stashed changes
      <Box sx={{ textAlign: "right", mt: 2 }}>
        <Button variant="contained" onClick={() => navigate("/")}>
          Back to Home
        </Button>
      </Box>
    </Box>
  );
}

export default EventDetails;
