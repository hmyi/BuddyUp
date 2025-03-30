
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./AuthContext";  
import "./index.css";

function loadGoogleMapsScript() {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.maps) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_MAPS_EMBED_API_KEY}&libraries=places`;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = (e) => reject(e);
    document.body.appendChild(script);
  });
}


const root = ReactDOM.createRoot(document.getElementById("root"));
loadGoogleMapsScript()
  .then(() => {
    console.log("Google Maps script loaded!");
    root.render(
      <Router>
        <App />
      </Router>
    );
  })
  .catch((err) => {
    console.error("Failed to load Google Maps script", err);
root.render(
  <Router>
    <AuthProvider>
      <App />
    </AuthProvider>
  </Router>
  );
});