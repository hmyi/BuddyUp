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

function CookiePreferencesTab() {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Cookie Preferences
      </Typography>
      <Typography paragraph>
        Currently, this site does not use analytics or marketing cookies. We only rely on
        essential cookies or local storage for login and basic functionality. No other cookies
        are tracked or stored.
      </Typography>
      <Typography paragraph>
        If that changes in the future (e.g., adding analytics), we will update this page so
        you can manage those preferences.
      </Typography>
    </Box>
  );
}

export default function SettingsPage({ toggleTheme, mode }) {
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
          <Tab label="Cookie Preferences" />
        </Tabs>
      </Paper>

      <Box sx={{ flex: 1, p: 2 }}>
        {activeTab === 0 && (
          <EditProfileTab userProfile={userProfile} accessToken={accessToken} />
        )}
        {activeTab === 1 && (
          <InterestsTab userProfile={userProfile} accessToken={accessToken} />
        )}
        {activeTab === 2 && (
          <DisplaySettingsTab mode={mode} toggleTheme={toggleTheme} />
        )}
        {activeTab === 3 && <CookiePreferencesTab />}
      </Box>
    </Box>
  );
}
