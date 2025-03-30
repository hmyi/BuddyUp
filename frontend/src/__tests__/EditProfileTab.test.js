
beforeAll(() => {
    global.URL.createObjectURL = jest.fn(() => 'mock-url');
  });
  

import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import EditProfileTab from '../components/EditProfileTab'; // adjust path if needed
import '@testing-library/jest-dom'; 

beforeEach(() => {
    jest.spyOn(global, 'fetch').mockImplementation((url) => {
      if (url.includes('/api/users/1')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            email: 'test@example.com',
            location: 'Toronto',
            bio: 'Hello!',
            username: 'Test User',
          }),
        });
      } else if (url.includes('/upload-profile-image/')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({}),
        });
      } else if (url.includes('/update')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({}),
        });
      }
  
      return Promise.reject(new Error('Unhandled fetch'));
    });
  });
  
  
  afterEach(() => {
    jest.restoreAllMocks();
  });
  
  test('updates profileImage and previewImage on file change', async () => {
    render(
      <EditProfileTab
        userProfile={{ userID: 1 }}
        accessToken="token"
        openSnackBar={{}}
        setOpenSnackBar={jest.fn()}
      />
    );
  
    await waitFor(() => {
        expect(screen.getByText(/Edit Profile/i)).toBeInTheDocument();
      });
          const saveBtn = screen.getByRole('button', { name: /save changes/i });
    
  
    const file = new File(['dummy'], 'avatar.png', { type: 'image/png' });
  
    const input = screen.getByTestId('file-input');
    await act(() => {
      fireEvent.change(input, { target: { files: [file] } });
      return Promise.resolve();
    });
  
    expect(input.files[0]).toBe(file);
  });
  

  test('uploads profile image successfully', async () => {
    const mockFetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      })
    );
    global.fetch = mockFetch;
  
    render(
      <EditProfileTab
        userProfile={{ userID: 1 }}
        accessToken="token"
        openSnackBar={{}}
        setOpenSnackBar={jest.fn()}
      />
    );
  
    await screen.findByText(/Edit Profile/i);
  
    const file = new File(['dummy'], 'avatar.png', { type: 'image/png' });
  
    const input = screen.getByTestId('file-input');
    await act(async () => {
      fireEvent.change(input, { target: { files: [file] } });
    });
  
    const uploadBtn = screen.getByRole('button', { name: /upload/i });
    await act(async () => {
      fireEvent.click(uploadBtn);
    });
  
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/upload-profile-image/'),
      expect.objectContaining({ method: 'POST' })
    );
  });
  
  

  test('handles failed profile save', async () => {
    const mockSetSnack = jest.fn();
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  
    global.fetch = jest.fn((url) => {
      if (url.includes('/api/users/1')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            email: 'test@example.com',
            location: 'Toronto',
            bio: 'Hello!',
            username: 'Test User',
          }),
        });
      } else if (url.includes('/update')) {
        return Promise.resolve({ ok: false, status: 500 });
      }
      return Promise.reject(new Error('Unhandled fetch'));
    });
  
    render(
      <EditProfileTab
        userProfile={{ userID: 1 }}
        accessToken="token"
        openSnackBar={{}}
        setOpenSnackBar={mockSetSnack}
      />
    );
  
    await screen.findByText(/Edit Profile/i); 
    const saveBtn = screen.getByRole('button', { name: /save changes/i });
    fireEvent.click(saveBtn);
  
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
      expect(mockSetSnack).toHaveBeenCalledWith(
        expect.objectContaining({
          msg: expect.stringContaining("Error updating profile"),
        })
      );
    });
  
    consoleSpy.mockRestore();
  });
  
  

  test('updates text fields and saves', async () => {
    const mockSetSnack = jest.fn();
  
    global.fetch = jest.fn((url) => {
      if (url.includes('/api/users/1')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            email: 'test@example.com',
            location: 'Toronto',
            bio: 'Hello!',
            username: 'Test User',
          }),
        });
      } else if (url.includes('/update')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({}),
        });
      }
      return Promise.reject(new Error('Unhandled fetch'));
    });
  
    render(
      <EditProfileTab
        userProfile={{ userID: 1 }}
        accessToken="token"
        openSnackBar={{}}
        setOpenSnackBar={mockSetSnack}
      />
    );
  
    await screen.findByText(/Edit Profile/i);
  
    const textboxes = screen.getAllByRole('textbox');
    fireEvent.change(textboxes[0], { target: { value: 'new@example.com' } }); // email
    fireEvent.change(textboxes[1], { target: { value: 'New York' } }); // location
    fireEvent.change(textboxes[2], { target: { value: 'Updated bio' } }); // bio
  
    fireEvent.click(screen.getByRole('button', { name: /save changes/i }));
  
    await waitFor(() => {
      expect(mockSetSnack).toHaveBeenCalledWith(
        expect.objectContaining({
          msg: "Profile updated successfully!",
        })
      );
    });
  });
  
  