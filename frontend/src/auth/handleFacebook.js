import decodeToken from "../utils/decodeToken";

export const handleFacebookSuccess = (
    response,
    {
      setIsSignedIn = () => {},
      setAccessToken = () => {},
      setUserProfile = () => {},
      navigate = () => {},
      setOpenLoginDialog = () => {},
    } = {}
  ) => {
    console.log("HandleFacebookSuccess Called with:", response);
    if (!response || !response.accessToken) {
      console.error("No access token received! Response:", response);
      return;
    }
    const fbAccessToken = response.accessToken;
    console.log("Facebook Access Token Received:", fbAccessToken);
    fetch("https://18.226.163.235:8000/api/auth/facebook/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ access_token: fbAccessToken }),
    })
      .then((res) => res.json().then((data) => ({ status: res.status, data })))
      .then(({ status, data }) => {
        console.log("API Response Data:", data);
        if (!data.access) {
          console.error("API Response does not contain 'access' token:", data);
          return;
        }
        localStorage.setItem("accessToken", data.access);
        setIsSignedIn(true);
        setAccessToken(data.access);
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
        if (window.location.pathname.startsWith("/events/")) {
          navigate(window.location.pathname, { replace: true });
        }
      })
      .catch((error) => console.error("Error retrieving JWT:", error));
    setOpenLoginDialog(false);
  };