const mockEvent = {
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



import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom"; 
import { MemoryRouter } from "react-router-dom";
import EventDetails from "../components/EventDetails"; 
import { AuthContext } from "../AuthContext";


test("MemoryRouter import test", () => {
  expect(MemoryRouter).toBeDefined();
});

describe("EventDetails component", () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockEvent),
      })
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

    test("renders EventDetails with valid event data from router state", async () => {
    render(
      <MemoryRouter
        initialEntries={[{ pathname: "/events/1", state: { event: mockEvent } }]}
      >
                <AuthContext.Provider value={{ userProfile: { userID: 1 }, accessToken: "dummy-token", isSignedIn: true }}>

          <EventDetails userProfile={{ userID: 1 }} accessToken="dummy-token" />
                  </AuthContext.Provider>

      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Sample Event/i)).toBeInTheDocument();
    });

    const cityElements = screen.getAllByText(/Toronto/i);
expect(cityElements.length).toBeGreaterThan(0);

  });
});
