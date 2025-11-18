// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { LanguageProvider } from "./contexts/LanguageContext";
import { LoginPopupProvider } from "./contexts/LoginPopupContext";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <LanguageProvider>
      <LoginPopupProvider>
        <App />
      </LoginPopupProvider>
    </LanguageProvider>
  </React.StrictMode>
);
