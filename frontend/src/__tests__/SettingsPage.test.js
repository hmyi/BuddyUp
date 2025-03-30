import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import SettingsPage from "../components/SettingsPage";
import { AuthContext } from "../AuthContext";

describe("SettingsPage", () => {
  const mockAuthContextValue = {
    accessToken: "mock-access-token",
    userProfile: { username: "TestUser", profile_image_url: "/test.png" },
  };

  const mockToggleTheme = jest.fn();
  const mockOpenSnackBarFn = jest.fn();

  it("renders Edit Profile tab by default (tab index 0) when no URL param", () => {
    render(
      <MemoryRouter>
        <AuthContext.Provider value={mockAuthContextValue}>
          <SettingsPage
            toggleTheme={mockToggleTheme}
            mode="light"
            openSnackBar={{}}
            setOpenSnackBar={mockOpenSnackBarFn}
          />
        </AuthContext.Provider>
      </MemoryRouter>
    );


    expect(screen.getByText(/Edit Profile/i)).toBeInTheDocument();

  });

  it('switches to "Display Settings" tab and shows dark mode switch', () => {
    render(
      <MemoryRouter>
        <AuthContext.Provider value={mockAuthContextValue}>
          <SettingsPage
            toggleTheme={mockToggleTheme}
            mode="light"
            openSnackBar={{}}
            setOpenSnackBar={mockOpenSnackBarFn}
          />
        </AuthContext.Provider>
      </MemoryRouter>
    );


    const displaySettingsTab = screen.getByRole("tab", { name: /Display Settings/i });
    fireEvent.click(displaySettingsTab);

    expect(screen.getByLabelText(/Enable Dark Mode/i)).toBeInTheDocument();
  });

  it("reads ?tab=cookie param and sets active tab to 3 (though no content is displayed)", () => {
    render(
      <MemoryRouter initialEntries={["/settings?tab=cookie"]}>
        <AuthContext.Provider value={mockAuthContextValue}>
          <SettingsPage
            toggleTheme={mockToggleTheme}
            mode="light"
            openSnackBar={{}}
            setOpenSnackBar={mockOpenSnackBarFn}
          />
        </AuthContext.Provider>
      </MemoryRouter>
    );

    expect(screen.getByText(/Edit Profile/i)).toBeInTheDocument(); 
    expect(screen.queryByLabelText(/Enable Dark Mode/i)).not.toBeInTheDocument();
  });
});
