import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import FilterMenu from "../components/FilterMenu";

describe("FilterMenu component", () => {
  const cities = ["Waterloo", "Kitchener", "Toronto"];
  const categories = [
    "Social",
    "Entertainment",
    "Sports",
    "Food",
    "Outdoor",
    "Gaming",
    "Carpool",
  ];

  test("renders city and category select fields", () => {
    render(
      <FilterMenu
        city="Waterloo"
        setCity={() => {}}
        category="Social"
        setCategory={() => {}}
      />
    );
    expect(screen.getByLabelText(/City/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Category/i)).toBeInTheDocument();
  });

  test("displays all city options when the City select is opened", () => {
    render(
      <FilterMenu
        city="Waterloo"
        setCity={() => {}}
        category="Social"
        setCategory={() => {}}
      />
    );
    fireEvent.mouseDown(screen.getByLabelText(/City/i));
        const cityOptions = screen.getAllByRole("option");
    cities.forEach((city) => {
      expect(cityOptions.some(option => option.textContent === city)).toBe(true);
    });
  });
  

  test("calls setCity when a new city is selected", () => {
    const mockSetCity = jest.fn();
    render(
      <FilterMenu
        city="Waterloo"
        setCity={mockSetCity}
        category="Social"
        setCategory={() => {}}
      />
    );
    fireEvent.mouseDown(screen.getByLabelText(/City/i));
    fireEvent.click(screen.getByText("Toronto"));
    expect(mockSetCity).toHaveBeenCalledWith("Toronto");
  });
  

  test("calls setCategory when a new category is selected", () => {
    const mockSetCategory = jest.fn();
    render(
      <FilterMenu
        city="Waterloo"
        setCity={() => {}}
        category="Social"
        setCategory={mockSetCategory}
      />
    );
    fireEvent.mouseDown(screen.getByLabelText(/Category/i));
    fireEvent.click(screen.getByText("Food"));
    expect(mockSetCategory).toHaveBeenCalledWith("Food");
  });

  
});