import React, {useState, useEffect} from "react";
import {useParams, useLocation, useNavigate} from "react-router-dom";
import {Box, Typography, Avatar, Paper, Chip, Button, Divider} from "@mui/material";
import {fetchUserInfo} from "./fetchUserInfo";

export default function AttendeesPage () {
    const {id} = useParams();
    const {state} = useLocation();
    const navigate = useNavigate();

    const [eventData, setEventData] = useState(state?.eventData || null);
    const [loading, setLoading] = useState(!eventData);
    const [attendeeProfiles, setAttendeeProfiles] = useState([]);
    const [hostProfile, setHostProfile] = useState(null);

    const accessToken = state?.accessToken || null;

    useEffect(() => {
        if (!eventData) {
            setLoading(true);
            fetch(`https://18.226.163.235:8000/api/events/${id}/`).then((res) => {
                if (!res.ok) {
                    throw new Error(`HTTP error: ${res.status}`);
                }
                return res.json();
            }).then((data) => {
                setEventData(data);
                setLoading(false);
            }).catch((error) => {
                console.error("Error fetching event data: ", error);
                setLoading(false);
            })
        }
    }, [id, eventData]);

    useEffect(() => {
        if (!eventData || !accessToken) return;

        const fetchAttendees = async() => {
            try {
                const hostData = await fetchUserInfo(eventData.creator, accessToken);
                setHostProfile(hostData);

                const promises = (eventData.participants || []).map((participant) =>
                    fetchUserInfo(participant, accessToken));
                const results = await Promise.all(promises);
                setAttendeeProfiles(results);
            } catch (error) {
                console.error("Error fetch attendee info: ", error);
            }
        };
        fetchAttendees();
    }, [eventData, accessToken]);

    if (loading) {
        return <Typography>Loading attendees...</Typography>
    }

    if (!eventData) {
        return (
            <Box sx={{p:2}}>
                <Typography variant={"h6"} color={"error"}>
                    No Event Data Found!
                </Typography>
                <Button variant={"contained"} sx={{mt:2}} onClick={()=>navigate("/")}>
                    Back to Home
                </Button>
            </Box>
        );
    }

    const combinedProfile = hostProfile ? [hostProfile, ...attendeeProfiles] : attendeeProfiles;

    return (
        <Box sx={{display:"flex", justifyContent:"center", mt:4, mb:4}}>
            <Box sx={{width:"100%", maxWidth:600, px:2}}>
                <Typography variant={"h5"} sx={{mb:1, fontWeight:"bold"}}>Attendee List for</Typography>
                <Typography variant={"h5"} sx={{mb:2}}>{eventData.title}</Typography>
                <Typography variant={"body2"}>{eventData.location} {eventData.city}</Typography>
                <Typography variant={"body2"}>Starts: {new Date(eventData.start_time).toLocaleString()}</Typography>

                <Divider sx={{mb:2}} />

                {combinedProfile.map((profile) => {
                    const isHost = hostProfile && profile.id === eventData.creator;
                    const handleProfileClick = () => {navigate(`/users/${profile.id}`);};

                    return (
                        <Paper key={profile.id} sx={{display:"flex",
                            alignItems:"center", p:2, mb:2, boxShadow:2, cursor: "pointer",
                            "&:hover": { boxShadow: 4 }}} onClick={handleProfileClick}>
                            <Avatar alt={profile.username} src={profile.profile_image ||
                                `https://ui-avatars.com/api/?name=${profile.username}`}
                                    sx={{width:50, height:50, mr:2}}/>
                            <Box sx={{flex:1}}>
                                <Typography variant={"body1"} sx={{fontWeight:"bold"}}>
                                    {profile.username}
                                </Typography>
                                {isHost && <Chip label={"Host"} color={"success"} size={"small"} sx={{mt:0.5}}/>}
                            </Box>
                        </Paper>
                    );
                })}
                <Box sx={{textAlign:"right", mt:2}}>
                    <Button variant={"contained"} onClick={()=>navigate(-1)}>
                        Back
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}