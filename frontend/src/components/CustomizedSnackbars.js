import * as React from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

export default function CustomizedSnackbars({
  openSnackBar,
  setOpenSnackBar,
  children,
  severity = "success", 
  autoHideDuration = 3000, 
  anchorOrigin = { vertical: "bottom", horizontal: "center" }, // default position
}) {
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackBar(false);
  };

  return (
    <Snackbar
      open={openSnackBar}
      autoHideDuration={autoHideDuration}
      onClose={handleClose}
      anchorOrigin={anchorOrigin}
    >
      <Alert
        onClose={handleClose}
        severity={severity}
        variant="filled"
        sx={{
          width: "100%",
          borderRadius: 2,  
          boxShadow: 4,     
        }}
      >
        {children}
      </Alert>
    </Snackbar>
  );
}
