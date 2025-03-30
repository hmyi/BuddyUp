import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CityLocationAutocomplete from "../components/CityLocationAutoComplete";

jest.mock("react-places-autocomplete", () => {
  return ({ value, onChange, onSelect, children }) => {
    const suggestions = value
      ? [{ placeId: "123", description: "Test Place", active: false }]
      : [];
    const loading = false;
    const getInputProps = (props) => ({
      ...props,
      value,
      onChange: (e) => onChange(e.target.value),
    });
    const getSuggestionItemProps = (sugg, extra) => ({
      onClick: () => onSelect(sugg.description),
      style: extra.style,
    });

    return children({
      getInputProps,
      suggestions,
      getSuggestionItemProps,
      loading,
    });
  };
});

describe("CityLocationAutocomplete", () => {
  it("renders and updates location state on input", async () => {
    const setLocation = jest.fn();
    const setLocationError = jest.fn();

    render(
      <CityLocationAutocomplete
        city="TestCity"
        location=""
        setLocation={setLocation}
        locationError=""
        setLocationError={setLocationError}
      />
    );

    const input = screen.getByPlaceholderText(/Search location in TestCity/i);
    fireEvent.change(input, { target: { value: "Test Place" } });

    expect(setLocation).toHaveBeenCalledWith("Test Place");

    expect(await screen.findByText("Test Place")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Test Place"));
    expect(setLocation).toHaveBeenLastCalledWith("Test Place"); // again
  });
});
