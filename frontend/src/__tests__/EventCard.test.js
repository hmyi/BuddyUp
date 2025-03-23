// src/__tests__/EventCard.test.js

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import EventCard from "../components/EventCard";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";

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
  test("renders event title, image, buttons, and correct status chip", () => {
    const history = createMemoryHistory();
    render(
      <Router location={history.location} navigator={history}>
        <EventCard
          userProfile={dummyUserProfile}
          accessToken={dummyAccessToken}
          event={dummyEvent}
        />
      </Router>
    );

    expect(screen.getByText("Test Event")).toBeInTheDocument();

    const image = screen.getByAltText("Test Event");
    expect(image).toHaveAttribute("src", "test.jpg");

    expect(screen.getByRole("button", { name: /Attend/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Share/i })).toBeInTheDocument();

    expect(screen.getByText(/available/i)).toBeInTheDocument();
  });

  test("renders 'full' chip when event status is 'full'", () => {
    const fullEvent = { ...dummyEvent, status: "full" };
    const history = createMemoryHistory();
    render(
      <Router location={history.location} navigator={history}>
        <EventCard
          userProfile={dummyUserProfile}
          accessToken={dummyAccessToken}
          event={fullEvent}
        />
      </Router>
    );

    expect(screen.getByText(/full/i)).toBeInTheDocument();
  });


  
  
});
