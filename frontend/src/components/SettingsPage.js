import React, { useState, useContext,useEffect } from "react";
import { Box, Tabs, Tab, Paper, Switch, FormControlLabel, Typography } from "@mui/material";
import EditProfileTab from "./EditProfileTab";
import InterestsTab from "./InterestsTab";
import { AuthContext } from "../AuthContext";

export default function SettingsPage({ toggleTheme, mode }) {
  const { accessToken, userProfile } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState(0);

  const [showEmail, setShowEmail] = useState(false);
  const [loadingEmailSetting, setLoadingEmailSetting] = useState(true);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  useEffect(() => {
      if (!accessToken) {
            setLoadingEmailSetting(false);
            return;
      }

      const fetchUserSetting = async () => {
          try {
              const res = await fetch(
                    `https://18.226.163.235:8000/api/users/${userProfile.userID}/`,
                    {
                        method:"GET",
                        headers:{
                            Authorization: `Bearer ${accessToken}`
                        }
                    });
              if (!res.ok) {
                    throw new Error(`Failed fetching user settings: ${res.status}`);
              }
              const data = await res.json();

              setShowEmail(data.show_email === true);
          } catch (error) {
              console.error("Error fetching user setting: ", error);
          } finally {
              setLoadingEmailSetting(false);
          }
      }
      fetchUserSetting();
      }, [accessToken, userProfile]);

  const handleShowEmailToggle = async (e) => {
      const newValue = e.target.checked;
      setShowEmail(newValue);
      try {
          const payload = {show_email: newValue};
          const res = await fetch("https://18.226.163.235:8000/api/users/update/",
              {
                  method:"POST",
                  headers:{
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${accessToken}`
                  },
                  body:JSON.stringify(payload)
              });
          if (!res.ok) {
              throw new Error(`Failed to update show_email ${res.status}`);
          }
      } catch (error) {
          console.error("Error to update show_email: ", error);
          setShowEmail(!newValue);
      }
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
          <Tab label="App Settings" />
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
          <Box>
            <FormControlLabel
              control={
                <Switch
                  checked={mode === "dark"}
                  onChange={toggleTheme}
                />
              }
              label="Enable Dark Mode"
            />
              <br />

              {loadingEmailSetting ? (
                  <Typography>Loading email setting...</Typography>
              ) : (
                  <FormControlLabel
                      control={
                          <Switch
                              checked={showEmail}
                              onChange={handleShowEmailToggle}
                              color={"primary"}
                          />
                      }
                      label = "Show Email on Profile"
                  />
              )}
          </Box>
        )}
      </Box>
    </Box>
  );
}
