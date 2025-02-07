import React from "react";
import { IconButton, Avatar, Menu, MenuItem, Button } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";

function Header({
  isSignedIn,
  userProfile,
  handleLogout,
  anchorEl,
  handleMenuOpen,
  handleMenuClose,
  handleOpenLoginDialog
}) {
  return (
    <header className="header">
      <div className="header-left">
        <span className="logo">BuddyUp</span>
      </div>

      <div className="search-bar">
        <input type="text" placeholder="Search for groups or events" />
        <button>Search</button>
      </div>

      <div className="header-right">
        {isSignedIn ? (
          <div className="profile-section">
            <IconButton
              onClick={handleMenuOpen}
              aria-controls={anchorEl ? "profile-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={anchorEl ? "true" : undefined}
              sx={{ padding: 0, position: "relative" }}
            >
              <Avatar
                src={userProfile?.picture?.data?.url}
                sx={{ width: 40, height: 40, border: "2px solid #fff", boxShadow: 1 }}
              />
            </IconButton>

    const handleMenuClose = () => {
        setAnchorEl(null);
    };


    return (
        <header className="header">
            <div className="header-left">
                <span className="logo" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>BuddyUp</span>
            </div>

            <div className="search-bar">
                <input type="text" placeholder="Search for groups or events" />
                <button>Search</button>
            </div>

            <div className="header-right">
                {isSignedIn ? (
                    <div className="profile-section">
                        <IconButton
                            onClick={handleMenuOpen}
                            aria-controls={anchorEl ? 'profile-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={anchorEl ? 'true' : undefined}
                            sx={{
                                padding: 0,
                                "&:hover": { backgroundColor: "transparent" },
                                position: 'relative'
                            }}
                        >   <Avatar
                            src={userProfile?.picture?.data?.url}
                            sx={{
                                bgcolor: "primary.main",
                                width: 40,
                                height: 40,
                                border: "2px solid #fff",
                                boxShadow: 1,
                            }}
                        />
                        </IconButton>

                        <Menu
                            id="profile-menu"
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                            keepMounted
                            anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "right",
                            }}
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "right",
                            }}
                            sx={{
                                "& .MuiPaper-root": {
                                    mt: 1.5,
                                    minWidth: 200,
                                    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.15)",
                                    borderRadius: "8px",
                                },
                            }}
                        >
                            <MenuItem onClick={handleMenuClose}>
                                <SettingsIcon sx={{ mr: 2 }} fontSize="small" />
                                Settings
                            </MenuItem>
                            <MenuItem onClick={() => navigate("/profile", { state: { userProfile } })}>
                                <AccountCircleIcon sx={{ mr: 2 }} fontSize="small"/>
                                View profile
                            </MenuItem>
                            <MenuItem onClick={() => { handleLogout(); handleMenuClose(); }}>
                                <LogoutIcon sx={{ mr: 2 }} fontSize="small" />
                                Sign Out
                            </MenuItem>
                        </Menu>
                    </div>
                ) : (
                    <FacebookLogin
                        appId="508668852260570"
                        onSuccess={handleSuccess}
                        onFail={handleFailure}
                        usePopup
                        initParams={{
                            version: "v19.0",
                            xfbml: true,
                            cookie: true,
                        }}
                        loginOptions={{
                            scope: "public_profile,email",
                            return_scopes: true,
                        }}
                        render={({ onClick }) => (
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={onClick}
                                sx={{
                                    textTransform: "none",
                                    fontWeight: "bold",
                                    borderRadius: "20px",
                                    padding: "8px 20px",
                                }}
                            >
                                Sign In with Facebook
                            </Button>
                        )}
                    />
                )}
            </div>
        </header>
    );
}

export default Header;
