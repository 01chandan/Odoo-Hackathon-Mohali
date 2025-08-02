import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { AlertProvider } from "./components/GlobalAlert/AlertContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AlertProvider>
        <AppRoutes />
      </AlertProvider>
    </BrowserRouter>
  </React.StrictMode>
);
