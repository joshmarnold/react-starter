import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Provider } from "react-redux";
import { App } from "./App";
import { store } from "./store/store";
import { NotificationProvider } from "./components/NotificationContext";

const theme = createTheme();

const container = document.getElementById("root");
const root = createRoot(container!); // Create a root.

root.render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <NotificationProvider>
      <Provider store={store}>
        <Router>
          <App />
        </Router>
      </Provider>
    </NotificationProvider>
  </ThemeProvider>
);
