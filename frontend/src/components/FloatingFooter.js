import * as React from "react";
import { Box, Button, Typography } from "@mui/material";
import Stack from "@mui/material/Stack";
import IosShareIcon from "@mui/icons-material/IosShare";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import { blue } from "@mui/material/colors";
import { useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";


function FloatingFooter({
  accessToken,
  userID,
  hostID,
  eventID,
  eventTitle,
  eventTime,
  participationList,
  children,
}) {
  const [open, setOpen] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const navigate = useNavigate();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCopied(false);
  };

  function handleClick() {
    if (userID === hostID) {
      fetch(`https://18.226.163.235:8000/api/events/${eventID}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`, // Add Bearer Token
        },
      })
        .then((res) => {
          console.log("API Fetch Called, Status:", res.status);
          return res.json();
        })
        .then((data) => {
          console.log("API Response Data:", data);
        })
        .catch((error) => console.error("Error:", error));
    } else if (participationList.includes(userID)) {
      fetch(`https://18.226.163.235:8000/api/events/${eventID}/leave/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`, // Add Bearer Token
        },
      })
        .then((res) => {
          console.log("API Fetch Called, Status:", res.status);
          return res.json();
        })
        .then((data) => {
          console.log("API Response Data:", data);
        })
        .catch((error) => console.error("Error:", error));
    } else {
      fetch(`https://18.226.163.235:8000/api/events/${eventID}/join/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`, // Add Bearer Token
        },
      })
        .then((res) => {
          console.log("API Fetch Called, Status:", res.status);
          return res.json();
        })
        .then((data) => {
          console.log("API Response Data:", data);
        })
        .catch((error) => console.error("Error:", error));
    }
    navigate("/");
  }

  return (
    <Box
      sx={{
        position: "sticky",
        bottom: 0,
        left: 0,
        width: "100%",
        bgcolor: "background.paper",
        py: 2,
        px: 3,
        display: "flex",
        justifyContent: "space-evenly",
        alignItems: "center",
        zIndex: 1000,
        transition: "transform 0.3s ease-in-out",
      }}
    >
      <Stack
        direction="column"
        sx={{
          justifyContent: "space-evenly",
          alignItems: "center",
        }}
      >
        <Typography variant="body1" fontWeight="bold">
          {eventTitle}
        </Typography>
        <Typography variant="body1">{eventTime}</Typography>
      </Stack>
      <Stack direction="row" spacing={5}>
        <Button
          variant="contained"
          color="info"
          startIcon={<IosShareIcon />}
          onClick={handleClickOpen}
        >
          Share
        </Button>
        <SimpleDialog
          open={open}
          onClose={handleClose}
          copied={copied}
          setCopied={setCopied}
        />
        <Button
          variant="contained"
          color="success"
          startIcon={<PersonAddIcon />}
          onClick={handleClick}
          disabled={!userID}
        >
          {userID === hostID
            ? "Cancel"
            : participationList.includes(userID)
            ? "Leave"
            : "Attend"}
        </Button>
        {children}
      </Stack>
    </Box>
  );
}

function SimpleDialog({ onClose, open, copied, setCopied }) {
  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  }

  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle>
        <Typography variant="h5" fontWeight="bold">
          Share this event
        </Typography>
      </DialogTitle>
      <List>
        <ListItem disablePadding key={"Copy link"}>
          <ListItemButton onClick={handleCopy}>
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                <BookmarkIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={copied ? "Copied" : "Copy link"} />
          </ListItemButton>
        </ListItem>
      </List>
    </Dialog>
  );
}


export default FloatingFooter;

