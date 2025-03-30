const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => {
  const original = jest.requireActual('react-router-dom');
  return {
    ...original,
    useNavigate: () => mockNavigate,
  };
});


import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MyEvents from '../components/MyEvents';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

import { act } from 'react-dom/test-utils';




describe('MyEvents Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    global.fetch = jest.fn();
  });

  const renderComponent = () =>
    render(
      <AuthContext.Provider value={{ accessToken: 'testToken', userProfile: {} }}>
        <MemoryRouter>
          <MyEvents />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    test('shows "Loading events..." if accessToken is null', async () => {
        render(
      <AuthContext.Provider value={{ accessToken: null }}>
        <MemoryRouter>
          <MyEvents />
        </MemoryRouter>
      </AuthContext.Provider>
    );
    await act(async () => {
        await waitFor(() => {
          expect(screen.getByText(/Loading Events/i)).toBeInTheDocument();
        });
      });
    });

  test('displays correct events for "Attending" by default', async () => {
    const attendingResponse = [
      { id: 101, title: 'AttendingEvent', status: 'active', cancelled: false, start_time: "2025-03-19T07:00:00Z", location: "Loc1", city: "City1", attendance: 10 }
    ];
    const hostingResponse = [];
    global.fetch.mockImplementation((url) => {
      if (url.includes('joined')) return Promise.resolve({ json: async () => attendingResponse });
      if (url.includes('created')) return Promise.resolve({ json: async () => hostingResponse });
      return Promise.resolve({ json: async () => [] });
    });
    renderComponent();
    await waitFor(() => {
      const eventText = screen.getByText((content) =>
        content.replace(/\s+/g, ' ').includes('AttendingEvent')
      );
      expect(eventText).toBeInTheDocument();
      expect(screen.queryByText((content) =>
        content.replace(/\s+/g, ' ').includes('HostingEvent')
      )).toBeNull();
    });
  });

  test('switching to "Hosting" shows hosting events', async () => {
    const attendingResponse = [];
    const hostingResponse = [
      { id: 202, title: 'MyHostedEvent', status: 'active', cancelled: false, start_time: "2025-03-21T09:00:00Z", location: "Loc3", city: "City3", attendance: 8 },
      { id: 203, title: 'CancelledHosted', status: 'active', cancelled: true, start_time: "2025-03-22T10:00:00Z", location: "Loc4", city: "City4", attendance: 3 }
    ];
    global.fetch.mockImplementation((url) => {
      if (url.includes('joined')) return Promise.resolve({ json: async () => attendingResponse });
      if (url.includes('created')) return Promise.resolve({ json: async () => hostingResponse });
      return Promise.resolve({ json: async () => [] });
    });
    renderComponent();
    await waitFor(() => {
      expect(screen.queryByText((content) =>
        content.replace(/\s+/g, ' ').includes('MyHostedEvent')
      )).toBeNull();
    });
    fireEvent.click(screen.getByText('Hosting'));
    await waitFor(() => {
      expect(screen.getByText((content) =>
        content.replace(/\s+/g, ' ').includes('MyHostedEvent')
      )).toBeInTheDocument();
      expect(screen.queryByText((content) =>
        content.replace(/\s+/g, ' ').includes('CancelledHosted')
      )).toBeNull();
    });
  });

  test('displays "Past" events correctly', async () => {
    const attendingResponse = [
      { id: 111, title: 'PastEventA', status: 'expire', cancelled: false, start_time: "2025-03-17T06:00:00Z", location: "Loc5", city: "City5", attendance: 12 }
    ];
    const hostingResponse = [
      { id: 112, title: 'PastEventB', status: 'expire', cancelled: false, start_time: "2025-03-16T05:00:00Z", location: "Loc6", city: "City6", attendance: 7 },
      { id: 113, title: 'ActiveEvent', status: 'active', cancelled: false, start_time: "2025-03-23T11:00:00Z", location: "Loc7", city: "City7", attendance: 20 }
    ];
    global.fetch.mockImplementation((url) => {
      if (url.includes('joined')) return Promise.resolve({ json: async () => attendingResponse });
      if (url.includes('created')) return Promise.resolve({ json: async () => hostingResponse });
      return Promise.resolve({ json: async () => [] });
    });
    renderComponent();
    fireEvent.click(screen.getByText('Past'));
    await waitFor(() => {
      expect(screen.getByText((content) =>
        content.replace(/\s+/g, ' ').includes('PastEventA')
      )).toBeInTheDocument();
      expect(screen.getByText((content) =>
        content.replace(/\s+/g, ' ').includes('PastEventB')
      )).toBeInTheDocument();
      expect(screen.queryByText((content) =>
        content.replace(/\s+/g, ' ').includes('ActiveEvent')
      )).toBeNull();
    });
  });

  test('displays "Cancelled" events correctly', async () => {
    const attendingResponse = [
      { id: 501, title: 'CancelledAttend', status: 'active', cancelled: true, start_time: "2025-03-15T04:00:00Z", location: "Loc8", city: "City8", attendance: 15 }
    ];
    const hostingResponse = [
      { id: 502, title: 'CancelledHost', status: 'active', cancelled: true, start_time: "2025-03-14T03:00:00Z", location: "Loc9", city: "City9", attendance: 9 },
      { id: 503, title: 'NormalHost', status: 'active', cancelled: false, start_time: "2025-03-24T12:00:00Z", location: "Loc10", city: "City10", attendance: 11 }
    ];
    global.fetch.mockImplementation((url) => {
      if (url.includes('joined')) return Promise.resolve({ json: async () => attendingResponse });
      if (url.includes('created')) return Promise.resolve({ json: async () => hostingResponse });
      return Promise.resolve({ json: async () => [] });
    });
    renderComponent();
    fireEvent.click(screen.getByText('Cancelled'));
    await waitFor(() => {
      expect(screen.getByText((content) =>
        content.replace(/\s+/g, ' ').includes('CancelledAttend')
      )).toBeInTheDocument();
      expect(screen.getByText((content) =>
        content.replace(/\s+/g, ' ').includes('CancelledHost')
      )).toBeInTheDocument();
      expect(screen.queryByText((content) =>
        content.replace(/\s+/g, ' ').includes('NormalHost')
      )).toBeNull();
    });
  });

  test('shows "No events found" when no matching events', async () => {
    global.fetch.mockImplementation(() => Promise.resolve({ json: async () => [] }));
    renderComponent();
    await waitFor(() => {
      expect(screen.getByText(/No events found/i)).toBeInTheDocument();
    });
  });

  test('clicking an event navigates to /events/:id', async () => {
    const attendingResponse = [
      { id: 555, title: 'TestEvent', status: 'active', cancelled: false, start_time: "2025-03-19T07:00:00Z", location: "Loc11", city: "City11", attendance: 22 }
    ];
    const hostingResponse = [];
    global.fetch.mockImplementation((url) => {
      if (url.includes('joined')) return Promise.resolve({ json: async () => attendingResponse });
      if (url.includes('created')) return Promise.resolve({ json: async () => hostingResponse });
      return Promise.resolve({ json: async () => [] });
    });
    render(
      <AuthContext.Provider value={{ accessToken: 'testToken', userProfile: {} }}>
        <MemoryRouter>
          <MyEvents />
        </MemoryRouter>
      </AuthContext.Provider>
    );
    await waitFor(() => {
      expect(screen.getByText((content) =>
        content.replace(/\s+/g, ' ').includes('TestEvent')
      )).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText((content) =>
      content.replace(/\s+/g, ' ').includes('TestEvent')
    ));
    expect(mockNavigate).toHaveBeenCalledWith('/events/555', {
      state: { event: attendingResponse[0], userProfile: {}, accessToken: 'testToken' },
    });
  });
});
