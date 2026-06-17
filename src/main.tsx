import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { IconContext } from "@phosphor-icons/react";
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
    {/* 全站图标默认 weight=regular（线性）；选中/激活/强调态用 weight="fill"（面型）。见 docs/TOKENS.md 图标小节 */}
    <IconContext.Provider value={{ weight: "regular" }}>
      <App />
    </IconContext.Provider>
  </StrictMode>
);
