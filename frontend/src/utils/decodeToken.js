export default function decodeToken(token) {
    const [header, payload] = token.split(".");
    if (!payload) {
      throw new Error("Invalid token");
    }
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = atob(base64);
    return JSON.parse(jsonPayload);
  }
  