// SearchEventCard.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardMedia, CardContent, Typography, CardActions, Button, Box } from "@mui/material";

function SearchEventCard({ userProfile, accessToken, event }) {
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
      onClick={goToDetails}
      sx={{
        display: "flex",
        width: "100%",
        minHeight: 150,
        mb: 2,
        boxShadow: 3,
        cursor: "pointer",
      }}
    >
      {/* Left side: Event image */}
      <CardMedia
        component="img"
        image={`events_pics/${event.category}.jpg`}
        alt={event.title}
        sx={{
          width: "20%", // adjust as desired (e.g., 15% to 20%)
          objectFit: "cover",
        }}
      />
      {/* Right side: Event details */}
      <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography
            variant="h6"
            gutterBottom
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
      </Box>
    </Card>
  );
}

export default SearchEventCard;
