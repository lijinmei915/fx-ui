import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { mountDevInspector } from "@lijinmei-810/dev-inspector";
import "@lijinmei-810/dev-inspector/style.css";
import "../theme/fx-theme.css";
import App from "./App";
import { devInspectorConfig } from "./dev-inspector.config";

if (import.meta.env.DEV) {
  mountDevInspector(devInspectorConfig);
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
