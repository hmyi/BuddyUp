import React, { createContext, useState, useEffect } from "react";
import decodeToken from "./utils/decodeToken";

export const AuthContext = createContext();

export function AuthProvider({ children, testMode = true }) {
  const [userProfile, setUserProfile] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    const storedProfile = localStorage.getItem("userProfile");
    console.log("AuthProvider: storedToken", storedToken);
    console.log("AuthProvider: storedProfile", storedProfile);

    if (storedToken && storedProfile) {

      setAccessToken(storedToken);
      setIsSignedIn(true);
      const profile = JSON.parse(storedProfile);
      console.log("Loaded profile:", profile);
      setUserProfile(profile);
    } else if (storedToken) {
      try {
        const decoded = decodeToken(storedToken, testMode ? { useDummy: true } : {});
        const profile = {
          userID: decoded.user_id,
          name: decoded.username || "Unknown",
          email: decoded.email || "No Email Provided",
          picture: { data: { url: decoded.profile_image_url } },
        };
        setUserProfile(profile);
      } catch (err) {
        console.error("Error decoding stored token:", err);
      }
    }
  }, [testMode]);

  return (
    <AuthContext.Provider value={{ userProfile, setUserProfile, accessToken, setAccessToken, isSignedIn, setIsSignedIn }}>
      {children}
    </AuthContext.Provider>
  );
}
