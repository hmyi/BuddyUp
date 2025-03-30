import React, { useState, useContext, useEffect } from "react";
import { Box, Tabs, Tab, Paper, Switch, FormControlLabel, Typography } from "@mui/material";
import EditProfileTab from "./EditProfileTab";
import InterestsTab from "./InterestsTab";
import { AuthContext } from "../AuthContext";
import { useSearchParams } from "react-router-dom";

function DisplaySettingsTab({ mode, toggleTheme }) {
  return (
    <Box>
      <FormControlLabel
        control={<Switch checked={mode === "dark"} onChange={toggleTheme} />}
        label="Enable Dark Mode"
      />
    </Box>
  );
}



export default function SettingsPage({ toggleTheme, mode,openSnackBar, setOpenSnackBar }) {
  const { accessToken, userProfile } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState(0);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam === "cookie") {
      setActiveTab(3);
    }
  }, [searchParams]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ display: "flex", minHeight: "80vh" }}>
      <Paper sx={{ width: 200, mr: 2 }}>
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={activeTab}
          onChange={handleTabChange}
          sx={{ borderRight: 1, borderColor: "divider" }}
        >
          <Tab label="Edit Profile" />
          <Tab label="Interests" />
          <Tab label="Display Settings" />
        </Tabs>
      </Paper>

      <Box sx={{ flex: 1, p: 2 }}>
        {activeTab === 0 && (
          <EditProfileTab userProfile={userProfile} accessToken={accessToken}     openSnackBar={openSnackBar}
          setOpenSnackBar={setOpenSnackBar} />
        )}
        {activeTab === 1 && (
          <InterestsTab userProfile={userProfile} accessToken={accessToken}     openSnackBar={openSnackBar}
          setOpenSnackBar={setOpenSnackBar} />
        )}
        {activeTab === 2 && (
          <DisplaySettingsTab mode={mode} toggleTheme={toggleTheme}     openSnackBar={openSnackBar}
          setOpenSnackBar={setOpenSnackBar} />
        )}
      </Box>
    </Box>
  );
}
