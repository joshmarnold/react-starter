import React from "react";
import { Typography } from "@mui/material";

export const HomePage: React.FC = () => {
  return (
    <div>
      <Typography variant="h4" component="h1" gutterBottom>
        Home Page
      </Typography>
      <Typography variant="body1">Here you can find sound trees.</Typography>
    </div>
  );
};
