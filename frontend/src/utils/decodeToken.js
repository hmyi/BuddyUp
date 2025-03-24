export default function decodeToken(token, options = {}) {
  // In test mode, return dummy data:
  if (options.useDummy) {
    return {
      username: "Farhan Hossein",
      email: "farhan.hossein@gmail.com",
      user_id: 1,
      profile_image_url: "/avatar.png",
    };
  }
  // Regular JWT decoding:
  const parts = token.split(".");
  if (parts.length < 2) {
    throw new Error("Invalid token");
  }
  const payload = parts[1];
  // Convert from base64url to base64
  const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = atob(base64);
  return JSON.parse(jsonPayload);
}
