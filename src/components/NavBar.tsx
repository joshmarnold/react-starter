import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { SignInModal } from "../components/SignInModal";

export const NavBar: React.FC = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <AppBar position="static">
      <Toolbar>
        <SignInModal open={open} handleClose={handleClose} />

        <Typography variant="h6" style={{ flexGrow: 1 }}>
          My App
        </Typography>
      </Toolbar>
    </AppBar>
  );
};
