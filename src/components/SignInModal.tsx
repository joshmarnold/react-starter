import React, { useEffect } from "react";
import { Modal, Box, Typography, Button } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "@store/store";
import { useAuth } from "../hooks/useAuth";

const style = {
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

interface SignInModalProps {
  open: boolean;
  handleClose: () => void;
}

export const SignInModal: React.FC<SignInModalProps> = ({
  open,
  handleClose,
}) => {
  const { login, logout } = useAuth();
  const userProfile = useSelector((state: RootState) => state.user.profile);

  useEffect(() => {
    console.log("User profile from Redux state:", userProfile);
  }, [userProfile]);

  const handleSignIn = async () => {
    await login();
    handleClose();
  };

  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        onClick={handleSignIn}
        sx={{ mt: 2 }}
      >
        Sign In with Google
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={logout}
        sx={{ mt: 2 }}
      >
        Sign Out
      </Button>
    </div>
  );
};
