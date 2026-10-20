
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { DemoAuthProvider } from "./context/DemoAuthContext.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <DemoAuthProvider>
      <App />
    </DemoAuthProvider>
  </StrictMode>
);
