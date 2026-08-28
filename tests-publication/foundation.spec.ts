import { expect, test } from "@playwright/test"

test.beforeEach(async ({ page }) => {
  await page.clock.setFixedTime(new Date(2026, 7, 28, 12, 0, 0))
  await page.addInitScript(() => {
    const style = document.createElement("style")
    style.textContent = "*,*::before,*::after{transition:none!important;animation:none!important}"
    document.documentElement.appendChild(style)
  })
})

test("Foundation publication only exposes allowlisted navigation", async ({ page }) => {
  await page.goto("/")

  await expect(page).toHaveURL(/#tokens$/)
  await expect(page.getByRole("heading", { name: "FDS 设计令牌" })).toBeVisible()
  await expect(page.getByRole("navigation").first().getByRole("link", { name: "基础" })).toBeVisible()
  await expect(page.getByRole("link", { name: "图标", exact: true })).toBeVisible()
  await expect(page.getByRole("link", { name: "组件", exact: true })).toHaveCount(0)
  await expect(page.getByRole("link", { name: "页面", exact: true })).toHaveCount(0)
  await expect(page.getByRole("link", { name: "搭建器", exact: true })).toHaveCount(0)
  await expect(page.getByRole("link", { name: "治理中心", exact: true })).toHaveCount(0)
  await expect(page.getByText("组件 Styling Hooks", { exact: true })).toHaveCount(0)
  await expect(page).toHaveScreenshot("foundation-home.png")
})

test("Foundation publication exposes Markdown from the same source", async ({ page }) => {
  await page.goto("/#tokens-colors")
  await page.getByRole("button", { name: "更多页面操作" }).click()
  await expect(page.getByText("docs/foundations/colors.md", { exact: true })).toBeVisible()
  await page.getByRole("menuitem", { name: "Markdown" }).click()
  await expect(page.getByText("Markdown / docs/foundations/colors.md", { exact: true })).toBeVisible()
})

test("Foundation color preview accepts Hex input and semantic examples match their source", async ({ page }) => {
  await page.goto("/#tokens-colors")

  const seedInput = page.getByRole("textbox", { name: "主题种子色十六进制值" })
  await expect(seedInput).toHaveValue(/^[0-9A-F]{6}$/)
  await expect(seedInput.locator("xpath=..")).toContainText("#")
  await seedInput.fill("336699")
  const base90 = page.locator('[data-token-step="90"]')
  await expect(base90).toBeVisible()
  const derivedBase90 = await base90.evaluate(
    (element) => getComputedStyle(element).backgroundColor,
  )
  expect(derivedBase90).toBe("rgb(51, 102, 153)")

  await seedInput.fill("#AABBCC")
  await expect(seedInput).toHaveValue("AABBCC")
  await expect(base90).toHaveCSS("background-color", "rgb(170, 187, 204)")

  await seedInput.fill("33")
  await expect(page.getByText("请输入有效的十六进制色值。")).toBeVisible()
  await expect(base90).toHaveCSS("background-color", "rgb(170, 187, 204)")

  const hoverRow = page.locator('[data-token-row="primary-hover"]')
  const sourceColor = await hoverRow.locator('[data-slot="semantic-source-swatch"]').evaluate((element) => getComputedStyle(element).backgroundColor)
  const exampleColor = await hoverRow.locator('[data-slot="semantic-example"] > span').evaluate((element) => getComputedStyle(element).backgroundColor)
  expect(exampleColor).toBe(sourceColor)

  const warningForeground = await page.locator('[data-token-row="warning"] [data-slot="semantic-example"] > span').evaluate(
    (element) => getComputedStyle(element).color,
  )
  const lightForeground = await page.evaluate(() => {
    const probe = document.createElement("span")
    probe.style.color = "var(--fds-g-color-neutral-base-10)"
    document.body.appendChild(probe)
    const color = getComputedStyle(probe).color
    probe.remove()
    return color
  })
  expect(warningForeground).toBe(lightForeground)
})

test("Foundation publication exposes icon foundations without the component playground", async ({ page }) => {
  await page.goto("/#tokens-icons")

  await expect(page.getByRole("heading", { name: "图标", exact: true })).toBeVisible()
  await expect(page.getByRole("heading", { name: "尺寸档位" })).toBeVisible()
  await expect(page.getByRole("heading", { name: "线宽档位" })).toBeVisible()
  await expect(page.getByText("--fds-g-icon-stroke-175", { exact: true })).toBeVisible()
  await expect(page.getByText("调试台", { exact: true })).toHaveCount(0)
  await expect(page).toHaveScreenshot("foundation-icons-page.png")

  await page.getByRole("button", { name: "更多页面操作" }).click()
  await expect(page.getByText("docs/foundations/icons.md", { exact: true })).toBeVisible()
})

test("Foundation publication redirects a component route to its default page", async ({ page }) => {
  await page.goto("/#button")
  await expect(page).toHaveURL(/#tokens$/)
  await expect(page.getByRole("heading", { name: "FDS 设计令牌" })).toBeVisible()
  await expect(page.getByRole("heading", { name: "Button 按钮" })).toHaveCount(0)
})
