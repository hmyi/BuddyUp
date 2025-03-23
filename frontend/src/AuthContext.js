import React, { createContext, useState, useEffect } from "react";
import decodeToken from "./utils/decodeToken";

export const AuthContext = createContext();

export function AuthProvider({ children, testMode = true }) {
  const [userProfile, setUserProfile] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    console.log("Stored token in AuthContext:", storedToken);

    if (storedToken) {
      setAccessToken(storedToken);
      setIsSignedIn(true);
      try {
        // Pass dummy flag if testMode is true
        const decoded = decodeToken(storedToken, testMode ? { useDummy: true } : {});
        setUserProfile({
          userID: decoded.user_id,
          name: decoded.username || "Unknown",
          email: decoded.email || "No Email Provided",
          picture: { data: { url: decoded.profile_image_url } },
        });
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
