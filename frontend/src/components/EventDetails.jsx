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
  AvatarGroup,
  Badge,
  Chip,
  Paper,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import ShareIcon from "@mui/icons-material/Share";
import {fetchUserInfo} from "./fetchUserInfo";
import { AuthContext } from "../AuthContext";

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

// Helper functions
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
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${startUTC}/${endUTC}`;
}

const EventScheduleBox = ({ eventDate, eventTimeRange, calendarLink, handleShare }) => (
  <Box sx={{ borderBottom: "1px solid #ddd", pb: 2, mb: 2 }}>
    <Typography variant="h6">{eventDate}</Typography>
    <Typography variant="subtitle1">{eventTimeRange}</Typography>
    <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
      <Button
        variant="outlined"
        onClick={() => window.open(calendarLink, "_blank")}
        sx={{ mr: 2 }}
      >
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


const EventCapacityBox = ({
  capacity,
  attendance,
  spotsAvailable,
  status,
  category,
  location,
}) => (
  <Box sx={{ borderBottom: "1px solid #ddd", pb: 2, mb: 2 }}>
    <Typography variant="body2">
      <strong>Capacity:</strong> {capacity} | <strong>Joined:</strong> {attendance} |{" "}
      <strong>Spots Available:</strong> {spotsAvailable}
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
      <Chip label={(location || "unknown").toUpperCase()} color={"default"} />
    </Box>
  </Box>
);

const EventActionsBox = ({
  handleCancelEvent,
  currentUserId,
  participants,
  eventHostId,
  userIsAttending,
  handleJoinEvent,
  handleLeaveEvent,
  status,
  cancelled,
}) => {
  return (
    <Box sx={{ mt: 2 }}>
      <Button
        variant="contained"
        color="primary"
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
};

const EventMap = ({ googleMapSrc }) => (
  <Card sx={{ p: 2, height: "100%" }}>
    <MapContainer>
      <iframe
        title="Google Map"
        src={googleMapSrc}
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: 0 }}
        loading="lazy"
        allowFullScreen
      ></iframe>
    </MapContainer>
  </Card>
);

function AttendeeListBox({eventData, accessToken}) {
  const navigate = useNavigate();
  const [hostProfile, setHostProfile] = useState(null);
  const [attendeeProfiles, setAttendeeProfile] = useState([]);
  const participantID = eventData?.participants || [];
  const numParticipants = participantID.length;
  const hostID = eventData.creator;

  useEffect(() => {
    if (!hostID || !accessToken) return;

    const fetchAllUsers = async() => {
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
        console.error("Error fetch attendee info: ", error);
      }
    };

    fetchAllUsers();
  }, [participantID, accessToken, hostID]);

  const combinedAttendees = hostProfile ? [hostProfile, ...attendeeProfiles] : attendeeProfiles;

  const totalCount = combinedAttendees.length;
  const previewCount = 3;
  const previewAttendees = combinedAttendees.slice(0,previewCount);

  const handleSeeAll = () => {
    navigate(`/events/${eventData.id}/attendee`,{state: {eventData, accessToken}})
  };

  if (!hostProfile && !numParticipants) {
    return null;
  }

  return (
      <Box sx={{borderBottom:"1px solid #ddd", pb:2, mb:2}}>
        <Box sx={{display:"flex", alignItems:"center", justifyContent:"space-between", mb:2}}>
          <Typography variant={"h6"}>{totalCount} Attendees</Typography>
          <Button variant={"text"} onClick={handleSeeAll}>
            See All
          </Button>
        </Box>

        <Grid container spacing={2}>
          {previewAttendees.map((profile, index) => {

              const isHost = hostProfile && profile.id === eventData.creator;
              return (
                  <Grid item key={profile.id || index}>
                    <Paper sx={{width:120, p:1.5, textAlign:"center", boxShadow:2, position:"relative"}}>
                      {isHost && (
                          <Chip label={"Host"} color={"success"} size={"small"}
                                sx={{position:"absolute", top:8, left:8, zIndex:1}}/>)}
                      <Avatar alt={profile.username}
                              src={profile.profile_image || `https://ui-avatars.com/api/?name=${profile.username}`}
                              sx={{width:60, height:60, mx:"auto", mb:1}}
                      />
                      <Typography variant={"body2"} noWrap>{profile.username}</Typography>
                    </Paper>
                  </Grid>
              );
        })}
        </Grid>
      </Box>
  );

}

function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userProfile, accessToken, isSignedIn } = useContext(AuthContext);
  const currentUserId = userProfile?.userID;

  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Re-run fetch when auth state changes so the event data is fresh
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
        console.log("Event Data Set:", data);
      })
      .catch((error) => {
        console.error("Error fetching event details:", error);
        setLoading(false);
      });
  }, [id, isSignedIn, userProfile]);

  useEffect(() => {
    if (!eventHostId || !accessToken) return;

    fetchUserInfo(eventHostId, accessToken)
        .then((hostData) => {setHostProfile(hostData);})
        .catch((error) => {console.error("Error fetching host info: ", error)});
  }, [eventHostId, accessToken]);

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

  const eventDate = formatEventDate(eventData.start_time);
  const eventTimeRange = formatEventTimeRange(eventData.start_time, eventData.end_time);
  const spotsAvailable = eventData.capacity - eventData.attendance;
  const apiKey = process.env.REACT_APP_MAPS_EMBED_API_KEY;
  const googleMapSrc = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(
    `${eventData.location}, ${eventData.city}`
  )}`;
  const calendarLink = generateGoogleCalendarLink(eventData);
  const participants = eventData?.participants || [];
  const eventHostId = eventData?.creator;
  const userIsAttending = participants.includes(currentUserId);

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

  const handleCancelEvent = () => {
    fetch(`https://18.226.163.235:8000/api/events/${eventData.id}/cancel/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((res) => {
        console.log("Cancel event, Status:", res.status);
        navigate("/");
      })
      .catch((error) => console.error("Error:", error));
  };


  const handleDeleteEvent = () => {
    fetch(`https://18.226.163.235:8000/api/events/${eventData.id}/`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((res) => {
        console.log("Status:", res);
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
        if (!res.ok) {
          throw new Error("Join event failed");
        }
        return res.json();
      })
      .then(() => {
        alert("Successfully joined the event.");
        setEventData({
          ...eventData,
          participants: [...participants, currentUserId],
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
          participants: participants.filter((p) => p !== currentUserId),
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
                <Box sx={{ display: "flex", alignItems: "center", gap:2}}>
                  <Avatar
                      src={hostProfile.profile_image || `https://ui-avatars.com/api/?name=${hostProfile.username}`}
                      alt={hostProfile.username}
                      sx={{ width: 40, height: 40}}
                  />

                  <Box>
                    <Typography variant="body2">
                      Hosted by
                    </Typography>
                    <Typography variant={"body2"} sx={{fontWeight:"bold"}}>
                      {hostProfile.username}
                    </Typography>
                  </Box>
                </Box>
            )}
        </TopOverlay>
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
              <AttendeeListBox eventData={eventData} accessToken={accessToken}></AttendeeListBox>
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
                currentUserId={currentUserId}
                userIsAttending={userIsAttending}
                participants={participants}
                eventHostId={eventData.creator}
                handleJoinEvent={handleJoinEvent}
                handleLeaveEvent={handleLeaveEvent}
                handleCancelEvent={handleCancelEvent}
                status={eventData.status}
                cancelled={eventData.cancelled}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <EventMap googleMapSrc={googleMapSrc} />
        </Grid>
      </Grid>

      <Box sx={{ textAlign: "right", mt: 2 }}>
        <Button variant="contained" onClick={() => navigate("/")}>
          Back to Home
        </Button>
      </Box>
    </Box>
  );
}

export default EventDetails;
