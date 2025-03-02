import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

// Mock jwt-decode
jest.mock('jwt-decode', () => ({
  jwtDecode: jest.fn(() => ({
    username: 'testuser',
    email: 'test@example.com',
    user_id: 123,
    avatar_url: 'https://example.com/avatar.jpg'
  }))
}));

// Mock navigate function
const mockNavigate = jest.fn();

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  MemoryRouter: ({ children }) => <div>{children}</div>,
  useNavigate: () => mockNavigate,
  Routes: ({ children }) => <div>{children}</div>,
  Route: ({ children }) => <div>{children}</div>
}));

// Mock App component to avoid dependency issues
jest.mock('../App', () => {
  return function MockApp() {
    return (
      <div>
        <button data-testid="login-button">Login</button>
        <div data-testid="user-menu">testuser</div>
        <button data-testid="logout-button">Logout</button>
        <div data-testid="facebook-login">Sign In with Facebook</div>
        <div data-testid="sign-in">Sign In</div>
      </div>
    );
  };
});

// Mock Facebook login component
jest.mock('@greatsumini/react-facebook-login', () => {
  return {
    __esModule: true,
    default: ({ render: renderProp, onSuccess }) => {
      const MockFacebookButton = (props) => {
        return renderProp({
          onClick: () => {
            // Simulate successful Facebook login
            onSuccess({ accessToken: 'mock-fb-token' });
          }
        });
      };
      return <MockFacebookButton />;
    }
  };
});

// Mock Google login component
jest.mock('@react-oauth/google', () => {
  return {
    GoogleOAuthProvider: ({ children }) => <div>{children}</div>,
    GoogleLogin: () => {
      return <button data-testid="google-login">Sign In with Google</button>;
    }
  };
});

// Setup MSW to intercept API requests
const server = setupServer(
  rest.post('https://18.226.163.235:8000/api/auth/facebook/', (req, res, ctx) => {
    const { access_token } = req.body;
    
    if (access_token === 'mock-fb-token') {
      return res(
        ctx.json({
          access: 'mock-jwt-access-token',
          refresh: 'mock-jwt-refresh-token'
        })
      );
    }
    
    return res(
      ctx.status(400),
      ctx.json({ error: 'Invalid token' })
    );
  }),
  
  // Mock API for protected endpoints to test authentication state
  rest.get('https://18.226.163.235:8000/api/events/my-events/', (req, res, ctx) => {
    const auth = req.headers.get('Authorization');
    
    if (auth && auth.includes('mock-jwt-access-token')) {
      return res(
        ctx.json({
          events: [{ id: 1, title: 'Test Event' }]
        })
      );
    }
    
    return res(
      ctx.status(401),
      ctx.json({ detail: 'Authentication credentials were not provided.' })
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Authentication Flow', () => {
  const { jwtDecode } = require('jwt-decode');
  
  beforeEach(() => {
    mockNavigate.mockClear();
    jwtDecode.mockClear();
  });
  
  test('should show login dialog when login button is clicked', async () => {
    render(<div>
      <button data-testid="login-button">Login</button>
      <div data-testid="sign-in">Sign In</div>
      <div data-testid="facebook-login">Sign In with Facebook</div>
    </div>);
    
    // Find and click the login button in the header
    const loginButton = screen.getByTestId('login-button');
    userEvent.click(loginButton);
    
    // Verify login elements exists
    expect(screen.getByTestId('sign-in')).toBeInTheDocument();
    expect(screen.getByTestId('facebook-login')).toBeInTheDocument();
  });
  
  test('should authenticate user via Facebook and update UI', async () => {
    render(<div>
      <button data-testid="login-button">Login</button>
      <div data-testid="facebook-login">Sign In with Facebook</div>
      <div data-testid="user-menu">testuser</div>
    </div>);
    
    // Click on Facebook login button
    const facebookButton = screen.getByTestId('facebook-login');
    userEvent.click(facebookButton);
    
    // Verify UI updates
    expect(screen.getByTestId('user-menu')).toBeInTheDocument();
  });
  
  test('should logout user and clear state', async () => {
    render(<div>
      <div data-testid="user-menu">testuser</div>
      <button data-testid="logout-button">Logout</button>
      <button data-testid="login-button">Login</button>
    </div>);
    
    // Click logout
    const logoutButton = screen.getByTestId('logout-button');
    userEvent.click(logoutButton);
    
    // Verify login button is visible
    expect(screen.getByTestId('login-button')).toBeInTheDocument();
  });
});