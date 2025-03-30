import decodeToken from "../utils/decodeToken";


export const handleGoogleSuccess = (
    response,
    { setIsSignedIn, setAccessToken, setUserProfile, setOpenLoginDialog, navigate } = {}
  ) => {
    console.log("Google Auth Success:", response);
    fetch("https://18.226.163.235:8000/api/auth/google/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_token: response.credential }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.access) {
          console.error("No access token received from backend", data);
          return;
        }
        localStorage.setItem("accessToken", data.access);
        if (setIsSignedIn) setIsSignedIn(true);
        if (setOpenLoginDialog) setOpenLoginDialog(false);
  
        try {
          const decodedToken = decodeToken(data.access);
          const profile = {
            name: decodedToken.username || "Unknown",
            email: decodedToken.email || "No Email Provided",
            userID: decodedToken.user_id,
            picture: {
              data: {
                url: decodedToken.profile_image_url,
              },
            },
          };
          setUserProfile(profile);
          localStorage.setItem("userProfile", JSON.stringify(profile));
        } catch (err) {
          console.error("Error decoding token:", err);
        }
  
        if (navigate) navigate("/");
      })
      .catch((error) => console.error("Error during Google login:", error));
  };
  
  export const handleGoogleFailure = (error) => {
    console.error("Google Auth Error:", error);
  };