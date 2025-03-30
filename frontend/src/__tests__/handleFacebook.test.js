import { act } from '@testing-library/react';
import { handleFacebookSuccess } from '../auth/handleFacebook';
import decodeToken from '../utils/decodeToken';

jest.mock('../utils/decodeToken');

describe('handleFacebookSuccess', () => {
  beforeEach(() => {
    localStorage.clear();
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('stores token in localStorage and calls provided functions when backend returns an access token', async () => {
    const fakeFBResponse = {
      accessToken: 'testFBAccessToken',
    };
    const fakeBackendResponse = {
      access: 'testAccessToken',
    };

    global.fetch.mockResolvedValue({
      json: () => Promise.resolve(fakeBackendResponse),
      status: 200,
    });

    const setIsSignedIn = jest.fn();
    const setAccessToken = jest.fn();
    const setUserProfile = jest.fn();
    const navigate = jest.fn();
    const setOpenLoginDialog = jest.fn();

    decodeToken.mockReturnValue({
      username: 'testUser',
      email: 'test@example.com',
      user_id: 456,
      profile_image_url: 'http://example.com/pic_fb.jpg',
    });

    await act(async () => {
      await handleFacebookSuccess(fakeFBResponse, {
        setIsSignedIn,
        setAccessToken,
        setUserProfile,
        navigate,
        setOpenLoginDialog,
      });
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(localStorage.getItem('accessToken')).toBe('testAccessToken');
    expect(setIsSignedIn).toHaveBeenCalledWith(true);
    expect(setAccessToken).toHaveBeenCalledWith('testAccessToken');
    
    expect(setUserProfile).toHaveBeenCalledWith({
      name: 'testUser',
      email: 'test@example.com',
      userID: 456,
      picture: {
        data: {
          url: 'http://example.com/pic_fb.jpg',
        },
      },
    });
    expect(localStorage.getItem('userProfile')).toEqual(
      JSON.stringify({
        name: 'testUser',
        email: 'test@example.com',
        userID: 456,
        picture: {
          data: {
            url: 'http://example.com/pic_fb.jpg',
          },
        },
      })
    );
    // The dialog is closed
    expect(setOpenLoginDialog).toHaveBeenCalledWith(false);
  });

  test('logs an error if the Facebook response has no access token', async () => {
    const noAccessFBResponse = {}; 

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    await act(async () => {
      await handleFacebookSuccess(noAccessFBResponse);
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      'No access token received! Response:',
      noAccessFBResponse
    );
    consoleSpy.mockRestore();
  });

  test('logs an error if API response has no `access` token', async () => {
    const fakeFBResponse = { accessToken: 'testFBAccessToken' };
    const fakeBackendResponse = {}; // missing "access"

    global.fetch.mockResolvedValue({
      json: () => Promise.resolve(fakeBackendResponse),
      status: 200,
    });

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    await act(async () => {
      await handleFacebookSuccess(fakeFBResponse);
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      "API Response does not contain 'access' token:",
      fakeBackendResponse
    );
    consoleSpy.mockRestore();
  });

  test('handles a fetch/network error gracefully', async () => {
    const fakeFBResponse = { accessToken: 'testFBAccessToken' };

    global.fetch.mockRejectedValue(new Error('Network Error'));

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    await act(async () => {
      await handleFacebookSuccess(fakeFBResponse);
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      'Error retrieving JWT:',
      expect.any(Error)
    );
    consoleSpy.mockRestore();
  });

  test('navigates to the same page if user is on an event detail page', async () => {
  
    Object.defineProperty(window, 'location', {
      value: {
        pathname: '/events/789',
        startsWith: (str) => window.location.pathname.startsWith(str),
      },
      writable: true,
    });

    const fakeFBResponse = { accessToken: 'testFBAccessToken' };
    global.fetch.mockResolvedValue({
      json: () => Promise.resolve({ access: 'testToken' }),
      status: 200,
    });

    const navigate = jest.fn();
    decodeToken.mockReturnValue({});

    await act(async () => {
      await handleFacebookSuccess(fakeFBResponse, { navigate });
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(navigate).toHaveBeenCalledWith('/events/789', { replace: true });
  });
});
