import { defineConfig, devices } from "@playwright/test"

// 视觉回归：构建产物 → vite preview → 截图与基线 diff。
// 基线图存 tests/visual.spec.ts-snapshots/，改 UI 后跑 `npm run test:visual:update` 刷新。
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: "list",
  use: {
    baseURL: "http://localhost:4173",
    // 关动画 + 统一时钟，截图稳定
    viewport: { width: 1280, height: 800 },
  },
  expect: {
    toHaveScreenshot: {
      // 容忍抗锯齿/字体微噪，只抓真实视觉漂移
      maxDiffPixelRatio: 0.01,
      animations: "disabled",
    },
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ],
  webServer: {
    command: "npm run build && npm run preview -- --port 4173 --strictPort",
    url: "http://localhost:4173",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
