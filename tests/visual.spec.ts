import { test, expect } from "@playwright/test"

// 视觉回归：渲染关键界面 → 与基线截图 diff。像素漂移超阈值即 fail 并出对比图。
// 截组件局部（定位器）比整页更稳；头像图片用 mask 屏蔽（异步加载、非视觉契约）。

test.beforeEach(async ({ page }) => {
  // 关 CSS 过渡/动画，避免截图抓到中间帧
  await page.addInitScript(() => {
    const style = document.createElement("style")
    style.textContent = "*,*::before,*::after{transition:none!important;animation:none!important}"
    document.documentElement.appendChild(style)
  })
})

test("顶栏 TopBar", async ({ page }) => {
  await page.goto("/#top-bar")
  const bar = page.locator('[data-slot="top-bar"]').first()
  await expect(bar).toBeVisible()
  await expect(bar).toHaveScreenshot("top-bar.png", {
    mask: [page.locator('[data-slot="avatar"]')],
  })
})

test("客户列表页模板", async ({ page }) => {
  await page.goto("/#template-customer-list")
  const frame = page.locator("#template-customer-list").locator("xpath=following-sibling::*[1]")
  await expect(frame).toBeVisible()
  await expect(frame).toHaveScreenshot("customer-list-template.png", {
    mask: [page.locator('[data-slot="avatar"]')],
  })
})

test("Button 组件总览", async ({ page }) => {
  await page.goto("/#button")
  const overview = page.locator("#overview")
  await expect(overview).toBeVisible()
  await expect(overview).toHaveScreenshot("button-overview.png")
})
