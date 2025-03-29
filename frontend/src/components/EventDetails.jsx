import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Avatar,
  Chip,
  Paper,
  Divider,
  Stack,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import ShareIcon from "@mui/icons-material/Share";
import PeopleIcon from "@mui/icons-material/People";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CustomizedSnackbars from "./CustomizedSnackbars";
import { fetchUserInfo } from "./fetchUserInfo";
import { AuthContext } from "../AuthContext";

//
// ----- STYLED COMPONENTS & HELPERS (unchanged from your snippet) -----
//

const ImageContainer = styled(Box)(({ theme }) => ({
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

function formatEventDate(dateString) {
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString("en-US", options);
}

function formatEventTimeRange(start, end) {
  const startDate = new Date(start);
  const endDate = new Date(end);
  return `${startDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  })} to ${endDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  })}`;
}

function generateGoogleCalendarLink(eventData) {
  const defaultStart = "2025-01-01T00:00:00Z";
  const defaultEnd = "2025-01-01T01:00:00Z";
  const startTime = eventData?.start_time || defaultStart;
  const endTime = eventData?.end_time || defaultEnd;
  const startDate = new Date(startTime);
  const endDate = new Date(endTime);

  if (isNaN(startDate) || isNaN(endDate)) {
    console.error("Invalid start or end time", eventData?.start_time, eventData?.end_time);
    const fallbackStartDate = new Date(defaultStart);
    const fallbackEndDate = new Date(defaultEnd);
    const startUTC = fallbackStartDate.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
    const endUTC = fallbackEndDate.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      eventData?.title || "Event"
    )}&details=${encodeURIComponent(eventData?.description || "No description")}&location=${encodeURIComponent(
      `${eventData?.location || "Unknown location"}, ${eventData.city || ""}`
    )}&dates=${startUTC}/${endUTC}`;
  }

  const startUTC = startDate.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
  const endUTC = endDate.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
  const title = encodeURIComponent(eventData?.title || "Event");
  const details = encodeURIComponent(eventData?.description || "No description");
  const location = encodeURIComponent(
    `${eventData?.location || "Unknown location"}, ${eventData?.city || ""}`
  );
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${startUTC}/${endUTC}`;
}

//
// ----- LEFT COLUMN COMPONENTS -----
//

const EventScheduleBox = ({ eventDate, eventTimeRange, calendarLink, handleShare }) => (
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

function LeftColumn({ eventData, calendarLink, handleShare }) {
  const eventDate = formatEventDate(eventData.start_time);
  const eventTimeRange = formatEventTimeRange(eventData.start_time, eventData.end_time);

  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <CardContent sx={{ flexGrow: 1, overflowY: "auto" }}>
        <EventScheduleBox
          eventDate={eventDate}
          eventTimeRange={eventTimeRange}
          calendarLink={calendarLink}
          handleShare={handleShare}
        />
        <AttendeeListBox eventData={eventData} accessToken={eventData.accessToken} />

        <Typography variant="body2" gutterBottom>
          <strong>Location:</strong> {eventData.location}, {eventData.city}
        </Typography>
        <Typography variant="body1" paragraph sx={{ mt: 2 }}>
          {eventData.description}
        </Typography>
      </CardContent>
    </Card>
  );
}

//
// ----- RIGHT COLUMN COMPONENTS -----
//

const EventActionsBox = ({
  handleCancelEvent,
  currentUserId,
  participants,
  eventHostId,
  handleJoinEvent,
  handleLeaveEvent,
  status,
  cancelled,
}) => (
  <Box sx={{ mt: 2 }}>
    <Button
      variant="contained"
      color="primary"
      fullWidth
      disabled={!currentUserId || status === "full" || cancelled}
      onClick={
        currentUserId === eventHostId
          ? handleCancelEvent
          : participants.includes(currentUserId)
          ? handleLeaveEvent
          : handleJoinEvent
      }
    >
      {currentUserId === eventHostId
        ? "Cancel"
        : participants.includes(currentUserId)
        ? "Leave"
        : "Attend"}
    </Button>
  </Box>
);

function RightSidebar({
  googleMapSrc,
  eventData,
  spotsAvailable,
  currentUserId,
  participants,
  handleJoinEvent,
  handleLeaveEvent,
  handleCancelEvent,
}) {
  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column", boxShadow: 3 }}>
      {/* Fixed height map */}
      <Box
        component="iframe"
        src={googleMapSrc}
        title="Google Map"
        sx={{
          width: "100%",
          height: 400,
          border: 0,
          flexShrink: 0,
        }}
        loading="lazy"
        allowFullScreen
      />
      <CardContent sx={{ flexGrow: 1, overflowY: "auto" }}>
        <Stack spacing={2}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <LocationOnIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {eventData.location}, {eventData.city}
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="body2" color="text.secondary">
              Capacity:
            </Typography>
            <EventSeatIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {eventData.capacity}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              |
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Joined:
            </Typography>
            <PeopleIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {eventData.attendance}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              |
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Spots Available:
            </Typography>
            <EventSeatIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {spotsAvailable}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1}>
            <Chip
              label={(eventData.status || "unknown").toUpperCase()}
              color={
                (eventData.status || "").toLowerCase() === "active"
                  ? "success"
                  : (eventData.status || "").toLowerCase() === "full"
                  ? "error"
                  : "default"
              }
              size="small"
            />
            <Chip
              label={(eventData.category || "unknown").toUpperCase()}
              color={
                (eventData.category || "").toLowerCase() === "food"
                  ? "warning"
                  : "default"
              }
              size="small"
            />
          </Stack>
          <EventActionsBox
            currentUserId={currentUserId}
            participants={participants}
            eventHostId={eventData.creator}
            handleJoinEvent={handleJoinEvent}
            handleLeaveEvent={handleLeaveEvent}
            handleCancelEvent={handleCancelEvent}
            status={eventData.status}
            cancelled={eventData.cancelled}
          />
        </Stack>
      </CardContent>
    </Card>
  );
}

//
// ----- ATTENDEE LIST COMPONENT -----
//
function AttendeeListBox({ eventData, accessToken }) {
  const navigate = useNavigate();
  const [hostProfile, setHostProfile] = useState(null);
  const [attendeeProfiles, setAttendeeProfile] = useState([]);
  const participantID = eventData?.participants || [];
  const hostID = eventData.creator;

  useEffect(() => {
    if (!hostID || !accessToken) return;
    const fetchAllUsers = async () => {
      try {
        const hostData = await fetchUserInfo(hostID, accessToken);
        setHostProfile(hostData);

        if (participantID.length > 0) {
          const promises = participantID.map((id) => fetchUserInfo(id, accessToken));
          const results = await Promise.all(promises);
          setAttendeeProfile(results);
        } else {
          setAttendeeProfile([]);
        }
      } catch (error) {
        console.error("Error fetching attendee info: ", error);
      }
    };
    fetchAllUsers();
  }, [participantID, accessToken, hostID]);

  const combinedAttendees = hostProfile ? [hostProfile, ...attendeeProfiles] : attendeeProfiles;
  const totalCount = combinedAttendees.length;
  const previewCount = 3;
  const previewAttendees = combinedAttendees.slice(0, previewCount);

  const handleSeeAll = () => {
    navigate(`/events/${eventData.id}/attendee`, { state: { eventData, accessToken } });
  };

  if (!hostProfile && participantID.length === 0) {
    return null;
  }

  return (
    <Box sx={{ borderBottom: "1px solid #ddd", pb: 2, mb: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h6">{totalCount} Attendees</Typography>
        <Button variant="text" onClick={handleSeeAll}>
          See All
        </Button>
      </Box>
      <Grid container spacing={2}>
        {previewAttendees.map((profile, index) => {
          const isHost = hostProfile && profile.id === eventData.creator;
          return (
            <Grid item key={profile.id || index}>
              <Paper sx={{ width: 120, p: 1.5, textAlign: "center", boxShadow: 2, position: "relative" }}>
                {isHost && (
                  <Chip
                    label="Host"
                    color="success"
                    size="small"
                    sx={{ position: "absolute", top: 8, left: 8, zIndex: 1 }}
                  />
                )}
                <Avatar
                  alt={profile.username}
                  src={profile.profile_image || `https://ui-avatars.com/api/?name=${profile.username}`}
                  sx={{ width: 60, height: 60, mx: "auto", mb: 1 }}
                />
                <Typography variant="body2" noWrap>
                  {profile.username}
                </Typography>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}

//
// ----- MAIN COMPONENT: EventDetails -----
//
function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userProfile, accessToken } = useContext(AuthContext);
  const currentUserId = userProfile?.userID;

  const [eventData, setEventData] = useState(null);
  const [hostProfile, setHostProfile] = useState(null); // only if you want to show host in the overlay
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });

  const showSnackbar = (message) => {
    setSnackbar({ open: true, message });
  };

  // Fetch event details
  useEffect(() => {
    setLoading(true);
    fetch(`https://18.226.163.235:8000/api/events/${id}/`)
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
  }, [id]);

  // Optionally fetch host for the overlay
  useEffect(() => {
    if (!eventData?.creator || !accessToken) return;
    fetchUserInfo(eventData.creator, accessToken)
      .then((hostData) => setHostProfile(hostData))
      .catch((error) => console.error("Error fetching host info: ", error));
  }, [eventData?.creator, accessToken]);

  if (loading) {
    return <Typography>Loading event details...</Typography>;
  }
  if (!eventData) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" color="error">
          No event data found!
        </Typography>
      </Box>
    );
  }

  // Helper stuff
  const spotsAvailable = eventData.capacity - eventData.attendance;
  const googleMapSrc = eventData
    ? `https://www.google.com/maps/embed/v1/place?key=${process.env.REACT_APP_MAPS_EMBED_API_KEY}&q=${encodeURIComponent(
        `${eventData.location}, ${eventData.city}`
      )}`
    : "";
  const calendarLink = generateGoogleCalendarLink(eventData);
  const participants = eventData?.participants || [];

  // Handlers
  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: eventData.title,
          text: eventData.description,
          url: window.location.href,
        })
        .catch((error) => console.log("Error sharing", error));
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Event URL copied to clipboard");
    }
  };

  const handleCancelEvent = () => {
    fetch(`https://18.226.163.235:8000/api/events/${eventData.id}/cancel/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then(() => {
        navigate("/");
      })
      .catch((error) => console.error("Error:", error));
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
        if (!res.ok) throw new Error("Join event failed");
        return res.json();
      })
      .then(() => {
        showSnackbar("Successfully joined the event.");
        setEventData({
          ...eventData,
          participants: [...participants, currentUserId],
        });
      })
      .catch(() => {
        showSnackbar("Error joining event.");
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
        if (!res.ok) throw new Error("Leave event failed");
        return res.json();
      })
      .then(() => {
        showSnackbar("You left the event.");
        setEventData({
          ...eventData,
          participants: participants.filter((p) => p !== currentUserId),
        });
      })
      .catch(() => {
        showSnackbar("Error leaving event.");
      });
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      {/* The top image container with hosted by info remains the same */}
      <ImageContainer>
        <StyledImage
          src={eventData.event_image_url ?? `/events_pics/${eventData.category}.jpg`}
          alt={eventData.title}
        />
        <TopOverlay>
          <div>
            <Typography variant="h5">{eventData.title}</Typography>
            <Typography variant="subtitle1">
              {eventData.category} | {eventData.city}
            </Typography>
          </div>
          {hostProfile && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 2 }}>
              <Avatar
                src={
                  hostProfile.profile_image ||
                  `https://ui-avatars.com/api/?name=${hostProfile.username}`
                }
                alt={hostProfile.username}
                sx={{ width: 40, height: 40 }}
              />
              <Box>
                <Typography variant="body2">Hosted by</Typography>
                <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                  {hostProfile.username}
                </Typography>
              </Box>
            </Box>
          )}
        </TopOverlay>
      </ImageContainer>

      {/* Below: Two columns with total fixed height of 600px */}
      <Grid
        container
        spacing={2}
        sx={{
          height: "600px", // fix total height for the columns
        }}
      >
        {/* LEFT COLUMN */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <LeftColumn
            eventData={{ ...eventData, accessToken }}
            calendarLink={calendarLink}
            handleShare={handleShare}
          />
        </Grid>

        {/* RIGHT COLUMN */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <RightSidebar
            googleMapSrc={googleMapSrc}
            eventData={eventData}
            spotsAvailable={spotsAvailable}
            currentUserId={currentUserId}
            participants={participants}
            handleJoinEvent={handleJoinEvent}
            handleLeaveEvent={handleLeaveEvent}
            handleCancelEvent={handleCancelEvent}
          />
        </Grid>
      </Grid>

      <CustomizedSnackbars
        openSnackBar={snackbar.open}
        setOpenSnackBar={(open) => setSnackbar((prev) => ({ ...prev, open }))}
      >
        {snackbar.message}
      </CustomizedSnackbars>
    </Box>
  );
}

export default EventDetails;
