import React, { useState, useContext } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Stack,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
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
    timeZoneName: "short",
  });
}

function EventCard({ event, hostName }) {
  const navigate = useNavigate();
  const { userProfile, accessToken } = useContext(AuthContext);

  const [participants, setParticipants] = useState(event.participants || []);
  const attendanceCount = participants.length;
  const spotsLeft = event.capacity - attendanceCount;
  const formattedDateTime = formatDateTime(event.start_time);
  const isAttending = participants.includes(userProfile?.userID);
  const [openConfirm, setOpenConfirm] = useState(false);

  const goToDetails = () => {
    navigate(`/events/${event.id}`, {
      state: { event, userProfile, accessToken },
    });
  };

  const handleOverlayClick = (e) => {
    e.stopPropagation();
    if (!userProfile?.userID) {
      alert("Please log in to perform this action.");
      return;
    }
    if (!isAttending && spotsLeft <= 0) return;
    setOpenConfirm(true);
  };
  const handleConfirmAction = async () => {
    const endpoint = `https://18.226.163.235:8000/api/events/${event.id}/${isAttending ? "leave" : "join"}/`;
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!res.ok) {
        throw new Error(`${isAttending ? "Leave" : "Join"} event failed`);
      }
      if (!isAttending) {
        setParticipants([...participants, userProfile.userID]);
        alert("Successfully joined the event!");
      } else {
        setParticipants(participants.filter((id) => id !== userProfile.userID));
        alert("You have left the event.");
      }
    } catch (error) {
      console.error("Error in join/leave event:", error);
      alert(`Error ${isAttending ? "leaving" : "joining"} event.`);
    }
    setOpenConfirm(false);
  };

  const handleCancelAction = () => {
    setOpenConfirm(false);
  };

  return (
    <>
      <Card
        onClick={goToDetails}
        sx={{
          maxWidth: 400,
          margin: "20px auto",
          boxShadow: 3,
          cursor: "pointer",
          position: "relative",
          transition: "box-shadow 0.3s ease-in-out",
          "&:hover": {
            boxShadow: "0 0 15px 5px rgba(0,123,255,0.7)",
          },
        }}
      >
        <Box sx={{ position: "relative" }}>
          <CardMedia
            component="img"
            height="200"
            image={`/events_pics/${event.category}.jpg`}
            alt={event.title}
          />
          {/* Bottom overlay integrated into the image */}
          <Box
            onClick={handleOverlayClick}
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
              color: "white",
              textAlign: "center",
              py: 1,
              cursor: "pointer",
            }}
          >
            {isAttending ? (
              <Typography
                variant="subtitle1"
                sx={{ color: "lightgreen", fontWeight: "bold" }}
              >
                You are attending this event!
              </Typography>
            ) : (
              <Button
                variant="contained"
                size="small"
                sx={{
                  backgroundColor: spotsLeft > 0 ? "green" : "grey",
                  color: "white",
                  textTransform: "none",
                }}
                disabled={spotsLeft <= 0}
              >
                {spotsLeft > 0 ? "Join Event" : "Event Full"}
              </Button>
            )}
          </Box>
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

      <Dialog open={openConfirm} onClose={handleCancelAction}>
        <DialogTitle>{isAttending ? "Leave Event?" : "Join Event?"}</DialogTitle>
        <DialogContent>
          <Typography>
            {isAttending
              ? "Are you sure you want to leave this event?"
              : "Do you want to join this event?"}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelAction} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmAction} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default EventCard;
