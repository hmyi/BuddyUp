import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import AttendeesPage from '../components/AttendeesPage';

test('clicking back goes to previous route (real router)', async () => {
 render(
    <MemoryRouter initialEntries={['/', '/events/123/attendee']} initialIndex={1}>
      <Routes>
        <Route path="/" element={<h2>Home Page</h2>} />
        <Route path="/events/:id/attendee" element={<AttendeesPage />} />
      </Routes>
    </MemoryRouter>
  );

  const backButton = await screen.findByRole('button', { name: /Back/i });
  fireEvent.click(backButton);

  expect(await screen.findByText(/Home Page/i)).toBeInTheDocument();
});
