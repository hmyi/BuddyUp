import React, { useState, useEffect } from "react";
import { Box, Typography, Chip, Button } from "@mui/material";
import CustomizedSnackbars from "./CustomizedSnackbars";

const ALL_CATEGORIES = ["Social", "Entertainment", "Sports", "Food", "Outdoor", "Gaming", "Carpool"];

export default function InterestsTab({ userProfile, accessToken }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [interests, setInterests] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState({ open: false, msg: "" });

  const showSnackbar = (message, severity = "success") => {
    setSnackbarOpen(true);
  };

  useEffect(() => {
    if (!userProfile || !accessToken) {
      setLoading(false);
      return;
    }
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `https://18.226.163.235:8000/api/users/${userProfile.userID}/`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch user profile interests ${response.status}`);
        }
        const data = await response.json();
        setUserData(data);
        setInterests(data.interests || []);
      } catch (error) {
        console.error("Error fetching user interests:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [userProfile, accessToken]);

  const handleToggle = (category) => {
    if (interests.includes(category)) {
      setInterests(interests.filter((c) => c !== category));
    } else {
      setInterests([...interests, category]);
    }
  };

  const handleSaveInterests = async () => {
    try {
      const response = await fetch("https://18.226.163.235:8000/api/users/update/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ interests }),
      });
      if (!response.ok) {
        throw new Error(`Failed to update user interests ${response.status}`);
      }
      await response.json();
      setSnackbarOpen({ open: true, msg: "Interests saved successfully" });
    } catch (error) {
      console.error("Error updating interests: ", error);
      setSnackbarOpen({ open: true, msg: "Error updating interests" });
    }
  };

  if (loading) {
    return <Typography>Loading user interests...</Typography>;
  }

  if (!userData) {
    return <Typography color="error">Failed to load user profile</Typography>;
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Select Interests
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
        {ALL_CATEGORIES.map((category) => {
          const isSelected = interests.includes(category);
          return (
            <Chip
              key={category}
              label={category}
              variant={isSelected ? "filled" : "outlined"}
              color={isSelected ? "primary" : "default"}
              onClick={() => handleToggle(category)}
              sx={{ cursor: "pointer" }}
            />
          );
        })}
      </Box>
      <Button variant="contained" onClick={handleSaveInterests}>
        Save Interests
      </Button>
      <CustomizedSnackbars
  openSnackBar={snackbarOpen}      
  setOpenSnackBar={setSnackbarOpen}
/>

    </Box>
  );
}
