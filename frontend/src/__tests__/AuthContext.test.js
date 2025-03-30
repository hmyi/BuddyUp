const dummyHeader = btoa(JSON.stringify({ alg: "none", typ: "JWT" })).replace(/=+$/, "");
const dummyPayload = btoa(
  JSON.stringify({
    username: "Farhan Hossein",
    email: "farhan.hossein@gmail.com",
    user_id: 1,
    profile_image_url: "/avatar.png"
  })
).replace(/=+$/, "");
const dummyToken = `${dummyHeader}.${dummyPayload}.`;

localStorage.setItem("accessToken", dummyToken);

import React from "react";
import { render, waitFor } from "@testing-library/react";
import { AuthProvider, AuthContext } from "../AuthContext";

test("AuthProvider calls decodeToken and sets userProfile", async () => {
  let contextValue;
  function TestComponent() {
    const value = React.useContext(AuthContext);
    contextValue = value;
    return null;
  }

  render(
    <AuthProvider testMode={true}>
      <TestComponent />
    </AuthProvider>
  );

  await waitFor(() => {
    expect(contextValue.isSignedIn).toBe(true);
    + expect(contextValue.userProfile).toEqual({
         userID: 1,
         name: "Farhan Hossein",
         email: "farhan.hossein@gmail.com",
         picture: { data: { url: "/avatar.png" } }
      });
  });
});
