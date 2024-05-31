import React from "react";
import { Button, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { useAuth } from "../hooks/useAuth";
import { RootState } from "../store/store";

export const NavBar: React.FC = () => {
  const { login, logout } = useAuth();
  const userProfile = useSelector((state: RootState) => state.user.profile);

  const isLoggedIn = userProfile !== null;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "10px",
      }}
    >
      <Typography variant="h6" style={{ flexGrow: 1 }}>
        My App
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={isLoggedIn ? logout : login}
      >
        {isLoggedIn ? "Sign Out" : "Sign In With Google"}
      </Button>
    </div>
  );
};
