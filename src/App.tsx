import React from "react";
import { Routes, Route } from "react-router-dom";
import { Container } from "@mui/material";
import { NavBar } from "./components/NavBar";
import { LandingPage } from "./pages/LandingPage";
import { HomePage } from "./pages/HomePage";

export const App: React.FC = () => {
  return (
    <Container>
      <NavBar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<HomePage />} />
      </Routes>
    </Container>
  );
};
