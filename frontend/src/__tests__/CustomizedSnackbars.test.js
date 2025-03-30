import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CustomizedSnackbars from '../components/CustomizedSnackbars';

describe('CustomizedSnackbars', () => {
  test('renders the snackbar with a message', async () => {
    render(
      <CustomizedSnackbars
        openSnackBar={{ open: true, msg: 'Success!' }}
        setOpenSnackBar={jest.fn()}
      />
    );

    expect(screen.getByText(/Success!/i)).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  test('calls setOpenSnackBar when closed manually', async () => {
    const setOpenMock = jest.fn();
    render(
      <CustomizedSnackbars
        openSnackBar={{ open: true, msg: 'Hello Snackbar' }}
        setOpenSnackBar={setOpenMock}
      />
    );

    const alert = screen.getByRole('alert');
    const closeButton = alert.querySelector('button');

    fireEvent.click(closeButton);

    await waitFor(() =>
      expect(setOpenMock).toHaveBeenCalledWith({ open: false, msg: 'Hello Snackbar' })
    );
  });

  test('does not close on clickaway', async () => {
    const setOpenMock = jest.fn();

    render(
      <CustomizedSnackbars
        openSnackBar={{ open: true, msg: 'Clickaway Test' }}
        setOpenSnackBar={setOpenMock}
      />
    );

    const event = new Event('click');
    event.reason = 'clickaway';

    fireEvent.click(document.body, event);

    expect(setOpenMock).not.toHaveBeenCalled();
  });
});
