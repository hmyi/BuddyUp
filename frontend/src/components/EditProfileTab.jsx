import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Divider,
} from "@mui/material";
import CustomizedSnackbars from "./CustomizedSnackbars"; 

export default function EditProfileTab({ userProfile, accessToken, openSnackBar, setOpenSnackBar  }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");

  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");

  const [snackbarOpen, setSnackbarOpen] = useState({ open: false, msg: "" });


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
          throw new Error(`Failed to fetch user data: ${response.status}`);
        }
        const data = await response.json();
        setUserData(data);

        setEmail(data.email || "");
        setLocation(data.location || "");
        setBio(data.bio || "");
        if (data.profile_image) {
          setPreviewImage(data.profile_image);
        }
      } catch (error) {
        console.error("Error fetching user data: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [userProfile, accessToken]);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0]);
      setPreviewImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbarOpen({ open: true, msg: message });
  };

  const handleUploadImage = async () => {
    if (!profileImage) return;

    const formData = new FormData();
    formData.append("profile_image", profileImage);

    try {
      const response = await fetch(
        "https://18.226.163.235:8000/api/users/upload-profile-image/",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: formData,
        }
      );
      if (!response.ok) {
        throw new Error(`Failed to upload image. Status: ${response.status}`);
      }
      const data = await response.json();
      console.log("New image data: ", data);
      setSnackbarOpen({ open: true, msg: "Profile image uploaded successfully!" });
    } catch (error) {
      console.error("Error uploading image: ", error);
      showSnackbar("Error uploading image.");    }
  };

  const handleSaveProfile = async () => {
    const payload = { email, location, bio };
    try {
      const response = await fetch(
        "https://18.226.163.235:8000/api/users/update/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(payload),
        }
      );
      if (!response.ok) {
        throw new Error(`Failed to save profile changes. Status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Update profile data: ", data);
      setOpenSnackBar({ open: true, msg: "Profile updated successfully!" });
    } catch (error) {
      console.error("Error updating profile: ", error);
      setOpenSnackBar({ open: true, msg: "Error updating profile!" });
    }
  };

  if (loading) {
    return <Typography>Loading profile...</Typography>;
  }

  if (!userData) {
    return (
      <Typography color={"error"}>
        Failed to load user profile
      </Typography>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant={"h6"} sx={{ mb: 2 }}>
        Edit Profile
      </Typography>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant={"body1"} sx={{ mb: 1 }}>
          Profile Image
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <img
            alt={"Profile Preview"}
            src={
              previewImage ||
              `https://ui-avatars.com/api/?name=${userData.username}`
            }
            style={{ width: 80, height: 80, objectFit: "cover", borderRadius: "50%" }}
          />
          <Button variant={"contained"} component={"label"}>
            Choose File
            <input type={"file"} hidden accept={"image/*"} onChange={handleImageChange} />
          </Button>
          {profileImage && (
            <Button variant={"outlined"} onClick={handleUploadImage}>
              Upload
            </Button>
          )}
        </Box>
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Typography variant="body1" sx={{ mb: 1 }}>
          Email
        </Typography>
        <TextField
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ mb: 2 }}
        />

        <Typography variant="body1" sx={{ mb: 1 }}>
          Location
        </Typography>
        <TextField
          fullWidth
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          sx={{ mb: 2 }}
        />

        <Typography variant="body1" sx={{ mb: 1 }}>
          Bio
        </Typography>
        <TextField
          fullWidth
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          sx={{ mb: 2 }}
        />

        <Divider sx={{ my: 2 }} />
        <Button variant={"contained"} onClick={handleSaveProfile}>
          Save Changes
        </Button>
      </Paper>

          <CustomizedSnackbars
      openSnackBar={snackbarOpen}      
      setOpenSnackBar={setSnackbarOpen}
    />
    </Box>
  );
}
