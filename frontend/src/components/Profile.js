import React from "react";


import { useLocation } from "react-router-dom";
import "../App.css";
import { Divider, Chip, Box, Typography, Paper } from "@mui/material";

function Profile() {
    const location = useLocation();
    const { userProfile } = location.state || {};

    const interests = userProfile?.interests || [
        "Fitness", "Music", "Food", "Travel", "Technology", "Movies"
    ];

    return (
        <div>
            <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "center", padding: "2rem", gap: "5rem" }}>
                <Paper sx={{ padding: "2rem", width: "350px", textAlign: "center", boxShadow: 3 }}>
                    <img
                        src={userProfile?.picture?.data?.url || "default-avatar.png"}
                        alt="User Profile"
                        style={{ width: "100%", height: "250px", objectFit: "cover" }}
                    />
                    <Typography variant="h5" sx={{ mt: 2 }}>{userProfile?.name} </Typography>
                    <Typography variant="body2" color="text.secondary">
                         {userProfile?.location || "Waterloo, ON"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                         {userProfile?.email || "Email not provided"}
                    </Typography>


                    <Divider sx={{ my: 2 }} />

                    <Typography variant="h6">About Me</Typography>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                        {userProfile?.about || "This user hasn't shared an about me section yet."}
                    </Typography>
                </Paper>

                <Paper sx={{ padding: "2rem", width: "600px", height: "150px", boxShadow: 3 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>Interests</Typography>

                    <Divider sx={{ mb: 2 }} />

                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                        {interests.map((interest, index) => (
                            <Chip key={index} label={interest} variant="outlined" color="primary" />
                        ))}
                    </Box>
                </Paper>
            </Box>
        </div>
    );
}

export default Profile;
