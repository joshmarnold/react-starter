import React from "react";
import { Typography } from "@mui/material";

export const LandingPage: React.FC = () => {
  return (
    <div>
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome to the Landing Page
      </Typography>
      <Typography variant="body1">
        This is the marketing page for your application.
      </Typography>
    </div>
  );
};
