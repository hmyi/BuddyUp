jest.mock('@react-oauth/google', () => ({
  GoogleOAuthProvider: ({ children }) => <div>{children}</div>,
  GoogleLogin: ({ onSuccess, onError }) => (
    <button onClick={onError}>Google Login Button</button>
  ),
}));


import React from 'react';
import { render, screen, fireEvent, waitFor, act, within } from '@testing-library/react';
import InterestsTab from '../components/InterestsTab';
import SearchEventCard from '../components/SearchEventCard';
import { AuthContext } from '../AuthContext';
import { MemoryRouter } from 'react-router-dom';
import App from '../App.js';

process.env.REACT_APP_FACEBOOK_APP_ID = 'test_facebook_app_id';
process.env.REACT_APP_GOOGLE_CLIENT_ID = 'test_google_client_id';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
  const originalModule = jest.requireActual('react-router-dom');
  return {
    ...originalModule,
    useNavigate: () => mockNavigate,
  };
});

describe('InterestsTab Component', () => {
  test('renders error message when no userProfile or accessToken', async () => {
    render(<InterestsTab userProfile={null} accessToken={null} />);
    await waitFor(() => {
      expect(screen.getByText(/Failed to load user profile/i)).toBeInTheDocument();
    });
  });

  test('renders user interests after fetching data', async () => {
    render(<InterestsTab userProfile={{ userID: '123' }} accessToken="dummyToken" />);
    expect(screen.getByText(/Loading user interests/i)).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText(/Select Interests/i)).toBeInTheDocument();
    });
    expect(screen.getByText('Social')).toBeInTheDocument();
    expect(screen.getByText('Sports')).toBeInTheDocument();
  });

  test('toggles interest selection', async () => {
    render(<InterestsTab userProfile={{ userID: '123' }} accessToken="dummyToken" />);
    await waitFor(() => {
      expect(screen.getByText(/Select Interests/i)).toBeInTheDocument();
    });
    const socialChip = screen.getByText('Social');
    fireEvent.click(socialChip);
    fireEvent.click(socialChip);
  });

  test('saves interests on button click', async () => {
    render(<InterestsTab userProfile={{ userID: '123' }} accessToken="dummyToken" />);
    await waitFor(() => {
      expect(screen.getByText(/Select Interests/i)).toBeInTheDocument();
    });
    const foodChip = screen.getByText('Food');
    fireEvent.click(foodChip);
    const saveButton = screen.getByRole('button', { name: /Save Interests/i });
    fireEvent.click(saveButton);
    await waitFor(() => {
      expect(screen.getByText(/Interests saved successfully/i)).toBeInTheDocument();
    });
  });
});

describe('App Routing', () => {
  test('renders the HomePage by default ("/")', async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/search']}>
          <App />
        </MemoryRouter>
      );
    });
    
    expect(await screen.findByText(/Events near/i)).toBeInTheDocument();
  });

  test('navigates to SearchPage on "/search"', async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/search']}>
          <App />
        </MemoryRouter>
      );
    });
    
    expect(await screen.findByText(/Filter Events/i)).toBeInTheDocument();
  });

  test('redirects to HomePage for an unknown route', async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/some-unknown-route']}>
          <App />
        </MemoryRouter>
      );
    });
  
    expect(await screen.findByText(/Events near/i)).toBeInTheDocument();
  });
  
  



const now = new Date();
const thirtyMinutesLater = new Date(now.getTime() + 30 * 60 * 1000).toISOString();
const twoHoursLater = new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString();

const baseEvent = {
  id: 1,
  title: 'Test Event',
  start_time: thirtyMinutesLater,
  end_time: twoHoursLater,
  capacity: 100,
  participants: [],
  event_image_url: 'http://example.com/event.jpg',
  category: 'sports',
  city: 'Test City',
  description: "This is a test event description that is long enough to be truncated."
};

const renderCard = (event, userProfile = { userID: 42 }) => {
  render(
    <AuthContext.Provider value={{ userProfile }}>
      <MemoryRouter>
        <SearchEventCard event={event} />
      </MemoryRouter>
    </AuthContext.Provider>
  );
};

describe('SearchEventCard Component', () => {
  test('renders event details', () => {
    renderCard(baseEvent);
    expect(screen.getByText('Test Event')).toBeInTheDocument();
    expect(screen.getByText(/going/i)).toBeInTheDocument();
    expect(screen.getByText(/spots left/i)).toBeInTheDocument();
    expect(screen.getByText('Test City')).toBeInTheDocument();
    expect(screen.getByText('sports')).toBeInTheDocument();
  });

  test('displays Attending badge when user is attending', () => {
    const event = { ...baseEvent, participants: [42, 50] };
    renderCard(event);
    expect(screen.getByText('Attending')).toBeInTheDocument();
  });

  test('displays Event Full badge when no spots left', () => {
    const event = { ...baseEvent, capacity: 2, participants: [10, 20] };
    renderCard(event);
    expect(screen.getByText('Event Full')).toBeInTheDocument();
  });

  test('displays Starting Soon badge when applicable', () => {
    const event = { ...baseEvent, participants: [] };
    renderCard(event);
    expect(screen.getByText('Starting Soon')).toBeInTheDocument();
  });

  test('navigates to event details on card click', () => {
    renderCard(baseEvent);
    fireEvent.click(screen.getByText('Test Event'));
    expect(mockNavigate).toHaveBeenCalledWith(`/events/${baseEvent.id}`, { state: { event: baseEvent } });
  });
});



test('opens and closes login dialog', async () => {
  render(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>
  );

  const loginButton = screen.getByRole('button', { name: /login/i });
  fireEvent.click(loginButton);

  expect(screen.getByText(/Sign In with Facebook/i)).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /Sign In/i })).toBeInTheDocument();

  const closeButton = screen.getByRole('button', { name: /Close/i });
  fireEvent.click(closeButton);

  await waitFor(() => {
    expect(screen.queryByText(/Sign In with Facebook/i)).not.toBeInTheDocument();
  });
});







});


test('calls Facebook login success handler', async () => {
  const mockSetIsSignedIn = jest.fn();
  const mockSetAccessToken = jest.fn();
  const mockSetUserProfile = jest.fn();
  const mockSetOpenLoginDialog = jest.fn();

  const mockResponse = { accessToken: 'test_token' };

  const { getByText } = render(
    <AuthContext.Provider value={{
      setIsSignedIn: mockSetIsSignedIn,
      setAccessToken: mockSetAccessToken,
      setUserProfile: mockSetUserProfile
    }}>
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    </AuthContext.Provider>
  );

  fireEvent.click(getByText(/Login/i));

  const fbBtn = await screen.findByRole('button', { name: /sign in with facebook/i });
  fireEvent.click(fbBtn);

});


test('calls Google login error handler', () => {
  const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

  render(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>
  );

  fireEvent.click(screen.getByRole('button', { name: /login/i }));

  fireEvent.click(screen.getByText(/Google Login Button/i));

  expect(consoleSpy).toHaveBeenCalledWith('Google Auth Error:', expect.anything());
  consoleSpy.mockRestore();
});


test('toggles theme and updates localStorage', () => {
  const originalSetItem = jest.spyOn(Storage.prototype, 'setItem');
  const originalGetItem = jest.spyOn(Storage.prototype, 'getItem');

  localStorage.setItem("userProfile", JSON.stringify({ userID: 1, name: "Test User" }));
  localStorage.setItem("accessToken", "dummy-token");
  localStorage.setItem("mode", "light");

  const { rerender } = render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );

  act(() => {
    localStorage.setItem("mode", "dark");
  });

  rerender(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );

  expect(originalSetItem).toHaveBeenCalledWith("mode", expect.any(String));

  originalSetItem.mockRestore();
  originalGetItem.mockRestore();
});




