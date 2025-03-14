import React,{ useEffect, useState, useContext} from "react";
import { useParams } from "react-router-dom";
import "../App.css";
import { Divider, Chip, Box, Typography, Paper } from "@mui/material";
import { AuthContext } from "../AuthContext";

function Profile() {
    const {id} = useParams();
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const { accessToken } = useContext(AuthContext);

    const fetchUserProfile = async () => {
        try {
            const response = await fetch (`https://18.226.163.235:8000/api/users/${id}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
            if (!response.ok) {
                throw new Error(`Failed to fatch user data: ${response.status}`);
            }
            const data = await response.json();
            setUserProfile(data);
        } catch (error) {
            console.error("Error fatch user profile: ", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserProfile();
    }, [id]);

    if (loading) {
        return <Typography>Loading user profile...</Typography>;
    }
    if (!userProfile) {
        return (
            <Box>
                <Typography variant={"h6"} color={"error"}>
                    No user data found!
                </Typography>
            </Box>
        );
    }

    const {_, username, email, profile_image, location, bio, interests = [],} = userProfile;

    return (
        <div>
            <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "center", padding: "2rem", gap: "5rem" }}>
                <Paper sx={{ padding: "2rem", width: "350px", textAlign: "center", boxShadow: 3 }}>
                    <img
                        src={profile_image || `https://ui-avatars.com/api/?name=${username}`}
                        alt="User Profile"
                        style={{ width: "100%", height: "250px", objectFit: "cover" }}
                    />
                    <Typography variant="h5" sx={{ mt: 2 }}>{username || "Unknown User"} </Typography>
                    <Typography variant="body2" color="text.secondary">
                         {location || "Location not provided"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                         {email || "Email not provided"}
                    </Typography>


                    <Divider sx={{ my: 2 }} />

                    <Typography variant="h6">About Me</Typography>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                        {bio || "This user hasn't shared an about me section yet."}
                    </Typography>
                </Paper>

                <Paper sx={{ padding: "2rem", width: "600px", height: "150px", boxShadow: 3 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>Interests</Typography>

                    <Divider sx={{ mb: 2 }} />

                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                        {Array.isArray(interests) && interests.length > 0 ? (
                            interests.map((interest, index) => (
                                <Chip key = {index} label = {interest} variant = "outlined" color = "primary" />
                            ))
                        ) : (
                            <Typography variant={"body2"}>
                                No interests have been provided.
                            </Typography>
                        )}
                    </Box>
                </Paper>
            </Box>
        </div>
    );
}

export default Profile;