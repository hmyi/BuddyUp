import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card, CardMedia, CardContent,
  Typography, CardActions, Button
} from "@mui/material";

function EventCard({ event }) {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();

  const goToDetails = () => {
    navigate(`/events/${event.id}`, { state: { event } });
  };

  return (
    <Card
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      sx={{ maxWidth: 300, margin: "20px auto", boxShadow: 3, cursor: "pointer" }}
      onClick={goToDetails}
    >
      <CardMedia
        component="img"
        height="200"
        image="events_pics/hiking.jpg" 
        alt={event.title}
      />
      <CardContent>
        <Typography
          gutterBottom
          variant="h5"
          component="div"
          sx={hovered ? { textDecoration: "underline" } : {}}
        >
          {event.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Location: {event.location} <br />
          Category: {event.category} <br />
          Creator: {event.creator}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          sx={
            hovered
              ? { border: "1px solid", background: "#00798a", color: "white" }
              : {}
          }
        >
          Attend
        </Button>
        <Button
          size="small"
          sx={
            hovered
              ? { border: "1px solid", background: "#00798a", color: "white" }
              : {}
          }
        >
          Share
        </Button>
      </CardActions>
    </Card>
  );
}

export default EventCard;