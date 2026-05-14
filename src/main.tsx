import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import './app/styles/index.css';
import './i18n';
import { AccessibilityProvider } from './app/context/AccessibilityContext';

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* AccessibilityProvider wraps the entire app so every component
        can read and change accessibility modes via useAccessibility() */}
    <AccessibilityProvider>
      <App />
    </AccessibilityProvider>
  </React.StrictMode>
);