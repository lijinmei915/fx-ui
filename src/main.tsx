import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { IconContext } from "@phosphor-icons/react";
import { mountDevInspector } from "@lijinmei-810/dev-inspector";
import "@lijinmei-810/dev-inspector/style.css";
// 自托管开源字体（OFL，无版权困扰，跨平台一致）：Inter 管西文/数字，Noto Sans SC(=思源黑体简体) 管中文
import "@fontsource-variable/inter/wght.css";
import "@fontsource/noto-sans-sc/400.css";
import "@fontsource/noto-sans-sc/500.css";
import "@fontsource/noto-sans-sc/700.css";
import "../theme/fx-theme.css";
import App from "./App";
import { Toaster } from "./components/ui/sonner";
import { devInspectorConfig } from "./dev-inspector.config";

if (import.meta.env.DEV) {
  mountDevInspector(devInspectorConfig);
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* 全站图标默认 weight=regular（线性）；选中/激活/强调态用 weight="fill"（面型）。见 docs/TOKENS.md 图标小节 */}
    <IconContext.Provider value={{ weight: "regular" }}>
      <App />
      <Toaster />
    </IconContext.Provider>
  </StrictMode>
);
