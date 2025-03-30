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
  Stack
} from "@mui/material";
import { styled } from "@mui/material/styles";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import ShareIcon from "@mui/icons-material/Share";
import TodayIcon from "@mui/icons-material/Today";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PeopleIcon from "@mui/icons-material/People";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CustomizedSnackbars from "./CustomizedSnackbars";
import { fetchUserInfo } from "./fetchUserInfo";
import { AuthContext } from "../AuthContext";
import { Link } from "react-router-dom";

const ImageContainer = styled(Box)(({ theme }) => ({
  position: "relative",
  width: "100%",
  height: 400,
  marginBottom: theme.spacing(2),
  overflow: "hidden"
}));

const StyledImage = styled("img")({
  width: "100%",
  height: "100%",
  objectFit: "cover"
});

const TopOverlay = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  backgroundColor: "rgba(0,0,0,0.6)",
  color: "white",
  padding: theme.spacing(2),
  boxSizing: "border-box"
}));

function formatEventDate(dateString) {
  const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString("en-US", options);
}

function formatEventTimeRange(start, end) {
  const s = new Date(start);
  const e = new Date(end);
  return `${s.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit"
  })} - ${e.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short"
  })}`;
}

function generateGoogleCalendarLink(eventData) {
  const defaultStart = "2025-01-01T00:00:00Z";
  const defaultEnd = "2025-01-01T01:00:00Z";
  const startTime = eventData?.start_time || defaultStart;
  const endTime = eventData?.end_time || defaultEnd;
  const s = new Date(startTime);
  const e = new Date(endTime);
  if (isNaN(s) || isNaN(e)) {
    const fs = new Date(defaultStart);
    const fe = new Date(defaultEnd);
    const startUTC = fs.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
    const endUTC = fe.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      eventData?.title || "Event"
    )}&details=${encodeURIComponent(eventData?.description || "No description")}&location=${encodeURIComponent(
      `${eventData?.location || "Unknown location"}, ${eventData.city || ""}`
    )}&dates=${startUTC}/${endUTC}`;
  }
  const startUTC = s.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
  const endUTC = e.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
  const title = encodeURIComponent(eventData?.title || "Event");
  const details = encodeURIComponent(eventData?.description || "No description");
  const location = encodeURIComponent(
    `${eventData?.location || "Unknown location"}, ${eventData?.city || ""}`
  );
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${startUTC}/${endUTC}`;
}

const DescriptionCard = ({ description }) => {
  return (
    <Card sx={{ height: 200, display: "flex", flexDirection: "column" }}>
      <CardContent sx={{ overflowY: "auto" }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Description
        </Typography>
        <Typography variant="body1">{description}</Typography>
      </CardContent>
    </Card>
  );
};

function AttendeeCard({
  eventData,
  currentUserId,
  participants,
  handleJoinEvent,
  handleLeaveEvent,
  handleCancelEvent,
  accessToken,
  openLoginDialog 
}) {
  const spotsAvailable = eventData.capacity - eventData.attendance;
  const userIsLoggedIn = Boolean(currentUserId && accessToken);

  return (
    <Card sx={{ height: 305, display: "flex", flexDirection: "column" }}>
      <CardContent sx={{ overflowY: "auto" }}>
        {userIsLoggedIn ? (
          <AttendeeListBox eventData={eventData} accessToken={accessToken} />
        ) : (
          <Typography variant="body2" sx={{ mb: 2 }}>
            {participants.length} Attendees
            <br />
            Please{" "}
            <Button
              variant="text"
              color="primary"
              onClick={openLoginDialog}
              sx={{ textTransform: "none", p: 0, minWidth: "unset" }}
            >
              log in
            </Button>{" "}
            to view participatings, or to join this event.
          </Typography>
        )}

        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="body2">
            <EventSeatIcon fontSize="small" sx={{ verticalAlign: "middle", mr: 0.5 }} />
            Capacity: {eventData.capacity}
          </Typography>
          <Typography variant="body2">
            <PeopleIcon fontSize="small" sx={{ verticalAlign: "middle", mr: 0.5 }} />
            Joined: {eventData.attendance}
          </Typography>
          <Typography variant="body2">
            <EventSeatIcon fontSize="small" sx={{ verticalAlign: "middle", mr: 0.5 }} />
            Spots: {spotsAvailable}
          </Typography>
        </Stack>

        {userIsLoggedIn && (
          <Button
            variant="contained"
            color="primary"
            fullWidth
            disabled={eventData.status === "full" || eventData.cancelled}
            onClick={
              currentUserId === eventData.creator
                ? handleCancelEvent
                : participants.includes(currentUserId)
                ? handleLeaveEvent
                : handleJoinEvent
            }
          >
            {currentUserId === eventData.creator
              ? "Cancel"
              : participants.includes(currentUserId)
              ? "Leave"
              : "Attend"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}


const InfoCard = ({ eventData }) => (
  <Card sx={{ height: 200, display: "flex", flexDirection: "column" }}>
    <CardContent sx={{ overflowY: "auto" }}>
      <Stack spacing={1} sx={{ mb: 1 }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <TodayIcon fontSize="small" />
          <Typography variant="subtitle1">
            {formatEventDate(eventData.start_time)}
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1}>
          <AccessTimeIcon fontSize="small" />
          <Typography variant="subtitle1">
            {formatEventTimeRange(eventData.start_time, eventData.end_time)}
          </Typography>
        </Stack>
      </Stack>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
        <LocationOnIcon fontSize="small" />
        <Typography variant="subtitle1">
          {eventData.location}, {eventData.city}
        </Typography>
      </Stack>
      <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
        <Button variant="outlined" size="small" onClick={() => window.open(generateGoogleCalendarLink(eventData), "_blank")}>
          <EventAvailableIcon fontSize="small" sx={{ mr: 0.5 }} />
          Add to Calendar
        </Button>
        <Button
          variant="outlined"
          size="small"
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: eventData.title,
                text: eventData.description,
                url: window.location.href
              }).catch((error) => console.log("Error sharing", error));
            } else {
              navigator.clipboard.writeText(window.location.href);
              alert("Event URL copied to clipboard");
            }
          }}
        >
          <ShareIcon fontSize="small" sx={{ mr: 0.5 }} />
          Share
        </Button>
      </Stack>
    </CardContent>
  </Card>
);

const MapCard = ({ googleMapSrc }) => (
  <Card sx={{ height: 305, display: "flex", flexDirection: "column" }}>
    <Box
      component="iframe"
      src={googleMapSrc}
      title="Google Map"
      sx={{ width: "100%", height: "100%", border: 0 }}
      loading="lazy"
      allowFullScreen
    />
  </Card>
);

function AttendeeListBox({ eventData, accessToken }) {
  const navigate = useNavigate();
  const [hostProfile, setHostProfile] = useState(null);
  const [attendeeProfiles, setAttendeeProfiles] = useState([]);
  const participantIDs = eventData?.participants || [];
  const hostID = eventData.creator;

  useEffect(() => {
    if (!hostID || !accessToken) return;
    const fetchAll = async () => {
      try {
        const hostData = await fetchUserInfo(hostID, accessToken);
        setHostProfile(hostData);

        if (participantIDs.length > 0) {
          const promises = participantIDs.map((id) => fetchUserInfo(id, accessToken));
          const results = await Promise.all(promises);
          setAttendeeProfiles(results);
        } else {
          setAttendeeProfiles([]);
        }
      } catch (error) {
        console.error("Error fetching attendee info:", error);
      }
    };
    fetchAll();
  }, [participantIDs, accessToken, hostID]);

  const combinedAttendees = hostProfile ? [hostProfile, ...attendeeProfiles] : attendeeProfiles;
  const totalCount = combinedAttendees.length;
  const previewCount = 3;
  const previewAttendees = combinedAttendees.slice(0, previewCount);

  const handleSeeAll = () => {
    navigate(`/events/${eventData.id}/attendee`, { state: { eventData, accessToken } });
  };

  if (!accessToken) return null;
  if (!hostProfile && participantIDs.length === 0) return null;

  return (
    <Box sx={{ borderBottom: "1px solid #ddd", pb: 2, mt: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
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
              <Paper
                sx={{
                  width: 120,
                  p: 1.5,
                  textAlign: "center",
                  boxShadow: 2,
                  position: "relative"
                }}
              >
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

function EventDetails({openLoginDialog }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userProfile, accessToken } = useContext(AuthContext);
  const currentUserId = userProfile?.userID;
  const [eventData, setEventData] = useState(null);
  const [hostProfile, setHostProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });
  const [openSnackBar, setOpenSnackBar] = useState({ open: false, msg: "" });

  useEffect(() => {
    setLoading(true);
    fetch(`https://18.226.163.235:8000/api/events/${id}/`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setEventData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching event details:", err);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (!eventData?.creator || !accessToken) return;
    fetchUserInfo(eventData.creator, accessToken)
      .then((hostData) => setHostProfile(hostData))
      .catch((err) => console.error("Error fetching host info:", err));
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

  const participants = eventData?.participants || [];
  const googleMapSrc = eventData
    ? `https://www.google.com/maps/embed/v1/place?key=${
        process.env.REACT_APP_MAPS_EMBED_API_KEY
      }&q=${encodeURIComponent(`${eventData.location}, ${eventData.city}`)}`
    : "";

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: eventData.title,
          text: eventData.description,
          url: window.location.href
        })
        .catch((err) => console.log("Error sharing", err));
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Event URL copied to clipboard");
    }
  };

  const handleCancelEvent = () => {
    fetch(`https://18.226.163.235:8000/api/events/${eventData.id}/cancel/`, {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}` }
    })
      .then((res) => {
        if (!res.ok) throw new Error("Cancel event failed");
        return res.json();
      })
      .then(() => {
        setOpenSnackBar({ open: true, msg: "Event canceled successfully." });
        setTimeout(() => navigate("/"), 1000); 
      })
      .catch(() =>
        setOpenSnackBar({ open: true, msg: "Error canceling event." })
      );
  };

  const handleJoinEvent = () => {
    fetch(`https://18.226.163.235:8000/api/events/${id}/join/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`
      }
    })
      .then((res) => {
        if (!res.ok) throw new Error("Join event failed");
        return res.json();
      })
      .then(() => {
        setOpenSnackBar({ open: true, msg: "Successfully joined the event." });
        setEventData({
          ...eventData,
          participants: [...participants, currentUserId]
        });
      })
      .catch(() =>
        setOpenSnackBar({ open: true, msg: "Error joining event." })
      );
  };

  const handleLeaveEvent = () => {
    fetch(`https://18.226.163.235:8000/api/events/${id}/leave/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`
      }
    })
      .then((res) => {
        if (!res.ok) throw new Error("Leave event failed");
        return res.json();
      })
      .then(() => {
        setOpenSnackBar({ open: true, msg: "You left the event." });
        setEventData({
          ...eventData,
          participants: participants.filter((p) => p !== currentUserId)
        });
      })
      .catch(() =>
        setOpenSnackBar({ open: true, msg: "Error leaving event." })
      );
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
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

      {/* Grid of four cards, each 300px high */}
      <Grid container spacing={2} sx={{ height: 620 }}>
        <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <DescriptionCard description={eventData.description} />
          <AttendeeCard
            eventData={eventData}
            currentUserId={currentUserId}
            participants={participants}
            handleJoinEvent={handleJoinEvent}
            handleLeaveEvent={handleLeaveEvent}
            handleCancelEvent={handleCancelEvent}
            accessToken={accessToken}
            openLoginDialog={openLoginDialog}    // <-- Pass it down here
          />
        </Grid>
        <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <InfoCard eventData={eventData} />
          <MapCard googleMapSrc={googleMapSrc} />
        </Grid>
      </Grid>

      <CustomizedSnackbars
        openSnackBar={openSnackBar}
        setOpenSnackBar={setOpenSnackBar}
      />
    </Box>
  );
}

export default EventDetails;
