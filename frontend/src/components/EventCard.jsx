import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
} from "@mui/material";

function EventCard({ userProfile, accessToken, event }) {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();

  const goToDetails = () => {
    navigate(`/events/${event.id}`, {
      state: { event, userProfile, accessToken },
    });
  };

  return (
    <Card
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      sx={{
        maxWidth: 400,
        minHeight: 400,
        margin: "20px auto",
        boxShadow: 3,
        // display: "flex",
        cursor: "pointer",
        // flexDirection: "column",
      }}
      onClick={goToDetails}

      className="Card">


      <CardMedia
        component="img"
        height="200"
        image={`/events_pics/${event.category}.jpg`}
        alt={event.title}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography
          gutterBottom
          variant="h5"
          component="div"
          sx={hovered ? { textDecoration: "underline" } : {}}
        >
          {event.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">

        Time: {event.start_time} <br />

          Location: {event.location} <br />
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
