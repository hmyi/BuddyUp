import * as React from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

export default function CustomizedSnackbars({ openSnackBar, setOpenSnackBar }) {
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackBar({ ...openSnackBar, open: false });
  };

  return (
    <div>
      <Snackbar
        open={openSnackBar?.open}

        autoHideDuration={3000}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {openSnackBar?.msg}

        </Alert>
      </Snackbar>
    </div>
  );
}
