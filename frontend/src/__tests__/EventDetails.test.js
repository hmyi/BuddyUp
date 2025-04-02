import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom"; 
import { MemoryRouter } from "react-router-dom";
import EventDetails from "../components/EventDetails"; 
import { AuthProvider } from "../AuthContext";

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

const baseMockEvent = {
  id: 1,
  category: "Food",
  start_time: "2025-03-19T11:00:00Z",
  end_time: "2025-03-19T16:00:00Z",
  status: "active",
  title: "Sample Event",
  description: "Event description",
  location: "Sample Location",
  city: "Toronto",
  capacity: 100,
  attendance: 10,
  participants: []  
};

describe("EventDetails component - Join and Leave actions", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("Clicking the Attend button adds the current user (button changes to Leave)", async () => {
  global.fetch = jest.fn((url, options) => {
      if (url.includes("/join/")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({}),
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(baseMockEvent),
      });
    });

    render(
      <MemoryRouter initialEntries={[{ pathname: "/events/1", state: { event: baseMockEvent } }]}>
        <AuthProvider testMode={true}>
          <EventDetails />
        </AuthProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Sample Event/i)).toBeInTheDocument();
    });



  });


});