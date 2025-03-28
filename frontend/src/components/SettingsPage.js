import React, {useState, useContext} from "react";
import { Box, Tabs, Tab, Paper } from "@mui/material";
import EditProfileTab from "./EditProfileTab";
import InterestsTab from "./InterestsTab";
import {AuthContext} from "../AuthContext";

export default function SettingsPage() {
    const {accessToken, userProfile} = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState(0);
    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    return (
        <Box sx={{display:"flex", minHeight:"80vh"}}>
            <Paper sx={{width:200, mr:2}}>
                <Tabs orientation={"vertical"} variant={"scrollable"}
                      value={activeTab} onChange={handleTabChange} sx={{borderRight:1, borderColor:"divider"}}>
                    <Tab label={"Edit Profile"} />
                    <Tab label={"Interests"} />
                </Tabs>
            </Paper>

            <Box sx={{flex:1}}>
                {activeTab === 0 && <EditProfileTab userProfile={userProfile} accessToken={accessToken}/>}
                {activeTab === 1 && <InterestsTab userProfile={userProfile} accessToken={accessToken}/>}
            </Box>
        </Box>
    );
}