import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import EventCard from "../components/EventCard";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import { AuthContext } from "../AuthContext";

const dummyEvent = {
  id: 1,
  title: "Test Event",
  category: "Food",
  event_image_url: "test.jpg",
  location: "Test Location",
  status: "available", 
};

const dummyUserProfile = { userID: 1 };
const dummyAccessToken = "dummy-access-token";

describe("EventCard component", () => {
  test("renders event title and image", () => {
    const history = createMemoryHistory();
    render(
      <AuthContext.Provider value={{ userProfile: dummyUserProfile }}>
        <Router location={history.location} navigator={history}>
          <EventCard event={dummyEvent} />
        </Router>
      </AuthContext.Provider>
    );

    expect(screen.getByText("Test Event")).toBeInTheDocument();

    const image = screen.getByAltText("Test Event");
    expect(image).toHaveAttribute("src", "test.jpg");

  });



  
});