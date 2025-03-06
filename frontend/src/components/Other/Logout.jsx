import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';

const LogoutButton = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const handleConfirmLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const action = (
    <>
      <Button color="inherit" size="small" onClick={handleConfirmLogout}>
        Yes
      </Button>
      <Button color="inherit" size="small" onClick={handleClose}>
        No
      </Button>
    </>
  );

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleLogoutClick}>
        Logout
      </Button>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message="Are you sure you want to logout?"
        action={action}
      />
    </div>
  );
};

export default LogoutButton;
