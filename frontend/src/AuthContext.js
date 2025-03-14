import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [userProfile, setUserProfile] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    if (storedToken) {
      setAccessToken(storedToken);
      setIsSignedIn(true);
      try {
        const decoded = jwtDecode(storedToken);
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
  }, []);

  return (
    <AuthContext.Provider value={{ userProfile, setUserProfile, accessToken, setAccessToken, isSignedIn, setIsSignedIn }}>
      {children}
    </AuthContext.Provider>
  );
}
