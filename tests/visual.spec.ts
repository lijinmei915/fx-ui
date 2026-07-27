import { test, expect } from "@playwright/test"
import fs from "node:fs"
import path from "node:path"

const playgroundManifest = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), "docs/data/component-playgrounds.manifest.json"), "utf8")) as {
  customPlaygrounds?: Record<string, { stories?: unknown[]; visual?: { route: string; selector: string; screenshot?: string } }>
  components?: Record<string, { stories?: unknown[]; visual?: { route: string; selector: string; screenshot?: string } }>
  autoVisuals?: Record<string, { route: string; selector: string; test: string }>
  pageVisuals?: Record<string, { route: string; selector: string; test: string }>
  baselineVisuals?: Record<string, { route: string; selector: string; test: string }>
  autoStories?: Record<string, unknown[]>
}

function visualConfig(group: "customPlaygrounds" | "components" | "autoStories" | "pageVisuals" | "baselineVisuals", id: string) {
  const config = group === "autoStories"
    ? playgroundManifest.autoVisuals?.[id]
    : group === "pageVisuals"
      ? playgroundManifest.pageVisuals?.[id]
      : group === "baselineVisuals"
        ? playgroundManifest.baselineVisuals?.[id]
        : playgroundManifest[group]?.[id]?.visual
  if (!config) throw new Error(`Missing visual config for ${group}.${id}`)
  return config
}

function storyCount(pointer: string) {
  const [group, id] = pointer.split(".")
  const entry = group === "customPlaygrounds"
    ? playgroundManifest.customPlaygrounds?.[id]
    : group === "autoStories"
      ? { stories: playgroundManifest.autoStories?.[id] }
      : playgroundManifest.components?.[id]
  return entry?.stories?.length ?? 0
}

function storyParameter(pointer: string, key: "intent") {
  const [group, id] = pointer.split(".")
  const entry = group === "customPlaygrounds" ? playgroundManifest.customPlaygrounds?.[id] : playgroundManifest.components?.[id]
  const story = entry?.stories?.[0] as { parameters?: Record<string, string> } | undefined
  return story?.parameters?.[key] ?? ""
}

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
  const visual = visualConfig("baselineVisuals", "top-bar")
  await page.goto(`/${visual.route}`)
  const bar = page.locator(visual.selector).first()
  await expect(bar).toBeVisible()
  await expect(bar).toHaveScreenshot("top-bar.png", {
    mask: [page.locator('[data-slot="avatar"]')],
  })
})

test("网站卡片容器", async ({ page }) => {
  const visual = visualConfig("baselineVisuals", "website-card")
  await page.goto(`/${visual.route}`)
  const card = page.locator('[data-website-card-container]').filter({ hasText: "内部区域" })
  await expect(card).toHaveCount(1)
  await expect(card).toBeVisible()
  await expect(card).toHaveScreenshot("website-card-container.png")
})

test("网站卡片容器跟随全局阴影", async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem("fx-ui-theme-config", JSON.stringify({ shadowLevel: "none" }))
  })
  const visual = visualConfig("baselineVisuals", "website-card-shadow")
  await page.goto(`/${visual.route}`)
  const card = page.locator('[data-website-card-container]').filter({ hasText: "内部区域" })
  await expect(card).toHaveCount(1)
  await expect(card).toHaveCSS("box-shadow", "none")
})

test("网站间距节奏组件", async ({ page }) => {
  const visual = visualConfig("baselineVisuals", "website-spacing-rhythm")
  await page.goto(`/${visual.route}`)
  const rhythm = page.locator(visual.selector)
  await expect(rhythm).toBeVisible()
  await expect(rhythm).toHaveScreenshot("website-spacing-rhythm.png")
})

test("网站规则面板组件", async ({ page }) => {
  const visual = visualConfig("baselineVisuals", "website-rule-panel")
  await page.goto(`/${visual.route}`)
  await page.getByRole("button", { name: "查看规则" }).first().click()
  const panel = page.locator(visual.selector).first().locator('[data-website-card-container]').first()
  await expect(panel).toBeVisible()
  await expect(panel).toHaveScreenshot("website-rule-panel.png")
})

test("网站 PageLead 组件", async ({ page }) => {
  const visual = visualConfig("baselineVisuals", "page-lead")
  await page.goto(`/${visual.route}`)
  const lead = page.locator(visual.selector).first()
  await expect(lead).toBeVisible()
  await expect(lead).toHaveScreenshot("page-lead.png")
})

test("网站 SectionLead 组件", async ({ page }) => {
  const visual = visualConfig("baselineVisuals", "section-lead")
  await page.goto(`/${visual.route}`)
  const lead = page.locator(visual.selector).first()
  await expect(lead).toBeVisible()
  await expect(lead).toHaveScreenshot("section-lead.png")
})

test("网站 PageHeader 组件", async ({ page }) => {
  const visual = visualConfig("baselineVisuals", "page-header")
  await page.goto(`/${visual.route}`)
  const component = page.locator(visual.selector).first()
  await expect(component).toBeVisible()
  await expect(component).toHaveScreenshot("page-header.png")
})

test("网站 SearchToolbar 组件", async ({ page }) => {
  const visual = visualConfig("baselineVisuals", "search-toolbar")
  await page.goto(`/${visual.route}`)
  const component = page.locator(visual.selector).first()
  await expect(component).toBeVisible()
  await expect(component).toHaveScreenshot("search-toolbar.png")
})

test("网站 ConfirmDangerDialog 组件", async ({ page }) => {
  const visual = visualConfig("baselineVisuals", "confirm-danger-dialog")
  await page.goto(`/${visual.route}`)
  const component = page.locator(visual.selector).first()
  await expect(component).toBeVisible()
  await component.getByRole("button").click()
  await expect(page.getByRole("alertdialog")).toBeVisible()
  await expect(page.getByRole("alertdialog")).toHaveScreenshot("confirm-danger-dialog.png")
})

test("网站 PageShell 组件", async ({ page }) => {
  const visual = visualConfig("baselineVisuals", "page-shell")
  await page.goto(`/${visual.route}`)
  const component = page.locator(visual.selector).first()
  await expect(component).toBeVisible()
  await expect(component).toHaveScreenshot("page-shell.png")
})

test("网站 ActionRow 组件", async ({ page }) => {
  const visual = visualConfig("baselineVisuals", "action-row")
  await page.goto(`/${visual.route}`)
  const component = page.locator(visual.selector).first()
  await expect(component).toBeVisible()
  await expect(component).toHaveScreenshot("action-row.png")
})

test("网站 PageActions 组件", async ({ page }) => {
  const visual = visualConfig("baselineVisuals", "page-actions")
  await page.goto(`/${visual.route}`)
  const component = page.locator(visual.selector).first()
  await expect(component).toBeVisible()
  await expect(component).toHaveScreenshot("page-actions.png")
})

test("网站 ComponentPlayground 组件", async ({ page }) => {
  const visual = visualConfig("baselineVisuals", "component-playground")
  await page.goto(`/${visual.route}`)
  const component = page.locator(visual.selector).first()
  await expect(component).toBeVisible()
  await expect(component).toHaveScreenshot("component-playground-baseline.png")
})

test("Icon 预览", async ({ page }) => {
  const visual = visualConfig("components", "icon")
  await page.goto(`/${visual.route}`)
  const pg = page.locator(visual.selector)
  await expect(pg).toBeVisible()
  await expect(pg.locator('[data-story-source="docs/data/component-playgrounds.manifest.json#components.icon"]')).toHaveCount(1)
  await expect(pg).toHaveScreenshot(visual.screenshot ?? "icon-playground.png")
})

test("客户列表页模板", async ({ page }) => {
  const visual = visualConfig("baselineVisuals", "customer-list")
  await page.goto(`/${visual.route}`)
  const frame = page.locator("#template-customer-list").locator("xpath=following-sibling::*[1]")
  await expect(frame).toBeVisible()
  await expect(frame).toHaveScreenshot("customer-list-template.png", {
    mask: [page.locator('[data-slot="avatar"]')],
  })
})

test("治理现状看板", async ({ page }) => {
  const visual = visualConfig("baselineVisuals", "governance-map")
  await page.goto(`/${visual.route}`)
  const cockpit = page.locator(visual.selector)
  await expect(cockpit).toBeVisible()
  await expect(cockpit).toHaveScreenshot("governance-map-status.png")
})

test("治理工程运行图", async ({ page }) => {
  const visual = visualConfig("baselineVisuals", "governance-system-map")
  await page.goto(`/${visual.route}`)
  const systemMap = page.locator(visual.selector)
  await expect(systemMap).toBeVisible()
  await expect(systemMap).toHaveScreenshot("governance-system-map.png")
})

test("客户简报报告", async ({ page }) => {
  const visual = visualConfig("baselineVisuals", "customer-briefing")
  await page.goto(`/${visual.route}`)
  const report = page.locator("[data-customer-briefing]")
  await expect(report).toBeVisible()
  const cards = report.locator('[data-website-card-container]')
  await expect(cards).toHaveCount(9)
  await expect(cards.first()).toHaveScreenshot("customer-briefing-profile.png", {
    mask: [page.locator('[data-slot="avatar"]')],
  })
  await expect(cards.last()).toHaveScreenshot("customer-briefing-risk-actions.png", {
    mask: [page.locator('[data-slot="avatar"]')],
  })
})

test("Button 交互调试台", async ({ page }) => {
  const visual = visualConfig("customPlaygrounds", "button")
  await page.goto(`/${visual.route}`)
  const pg = page.locator(visual.selector)
  await expect(pg).toBeVisible()
  await expect(pg.locator('[data-story-source="docs/data/component-playgrounds.manifest.json#customPlaygrounds.button"]')).toHaveCount(1)
  await expect(pg.locator('[data-slot="component-playground-stories"]')).toHaveCount(0)
  await expect(pg.locator(`[data-story-count="${storyCount("customPlaygrounds.button")}"]`)).toHaveCount(1)
  await expect(pg).toHaveScreenshot(visual.screenshot)
})

test("Tag 交互调试台", async ({ page }) => {
  const visual = visualConfig("components", "tag")
  await page.goto(`/${visual.route}`)
  const pg = page.locator(visual.selector)
  await expect(pg).toBeVisible()
  await expect(pg.locator('[data-story-source="docs/data/component-playgrounds.manifest.json#components.tag"]')).toHaveCount(1)
  await expect(pg.locator('[data-slot="component-playground-stories"]')).toHaveCount(1)
  await expect(pg.locator(`[data-story-count="${storyCount("components.tag")}"]`)).toHaveCount(1)
  await expect(pg).toHaveScreenshot(visual.screenshot)
})

test("Badge 交互调试台", async ({ page }) => {
  const visual = visualConfig("components", "badge")
  await page.goto(`/${visual.route}`)
  const pg = page.locator(visual.selector)
  await expect(pg).toBeVisible()
  await expect(page.locator("#badge-overview")).toHaveCount(0)
  await expect(page.locator("#badge-preview")).toHaveCount(0)
  await expect(page.locator("#badge-usage")).toHaveCount(0)
  await expect(pg.locator('[data-story-source="docs/data/component-playgrounds.manifest.json#components.badge"]')).toHaveCount(1)
  await expect(pg.locator('[data-slot="component-playground-stories"]')).toHaveCount(1)
  await expect(pg.locator(`[data-story-count="${storyCount("components.badge")}"]`)).toHaveCount(1)
  await expect(pg).toHaveScreenshot(visual.screenshot)
})

test("Tooltip Playground 主入口", async ({ page }) => {
  const visual = visualConfig("autoStories", "tooltip")
  await page.goto(`/${visual.route}`)
  const pg = page.locator(visual.selector)
  await expect(pg).toBeVisible()
  await expect(page.locator("#tooltip-overview")).toHaveCount(0)
  await expect(page.locator("#tooltip-preview")).toHaveCount(0)
  await expect(page.locator("#tooltip-usage")).toHaveCount(0)
  await expect(pg.locator('[data-story-source="docs/data/component-playgrounds.manifest.json#autoStories.tooltip"]')).toHaveCount(1)
  await expect(pg.locator(`[data-story-count="${storyCount("autoStories.tooltip")}"]`)).toHaveCount(1)
})

test("Avatar Playground 主入口", async ({ page }) => {
  const visual = visualConfig("autoStories", "avatar")
  await page.goto(`/${visual.route}`)
  const pg = page.locator(visual.selector)
  await expect(pg).toBeVisible()
  await expect(page.locator("#avatar-overview")).toHaveCount(0)
  await expect(page.locator("#avatar-preview")).toHaveCount(0)
  await expect(page.locator("#avatar-usage")).toHaveCount(0)
  await expect(pg.locator('[data-story-source="docs/data/component-playgrounds.manifest.json#components.avatar"]')).toHaveCount(1)
  await expect(pg.locator('[data-slot="component-playground-stories"]')).toHaveCount(1)
  await expect(pg.locator(`[data-story-count="${storyCount("components.avatar")}"]`)).toHaveCount(1)
  await expect(pg.getByText("结构示例", { exact: true })).toHaveCount(1)
  await expect(pg.getByText("场景预设", { exact: true })).toHaveCount(0)

  const stories = pg.locator('[data-slot="component-playground-stories"]')
  const contentControl = pg.locator("label").filter({ hasText: "内容" }).locator("..")
  const positionBelowHeader = () => pg.evaluate((element) => {
    const top = element.getBoundingClientRect().top + window.scrollY
    window.scrollTo(0, Math.max(0, top - 96))
  })
  const selectTextExample = async (storyName: string) => {
    const story = stories.getByRole("button", { name: storyName, exact: true })
    await story.click()
    await expect(story).toHaveClass(/bg-card/)
    const text = contentControl.getByRole("button", { name: "文字", exact: true })
    await text.click()
    await expect(text).toHaveClass(/bg-card/)
    await expect(pg.locator('[data-slot="avatar-image"]')).toHaveCount(0)
  }
  await selectTextExample("单个头像")
  await positionBelowHeader()
  await expect(pg).toHaveScreenshot("avatar-single-playground.png")
  await selectTextExample("头像组")
  await positionBelowHeader()
  await expect(pg).toHaveScreenshot("avatar-group-playground.png")
  await selectTextExample("群聊拼接")
  await positionBelowHeader()
  await expect(pg).toHaveScreenshot("avatar-composite-playground.png")
})

test("Breadcrumb Playground 主入口", async ({ page }) => {
  const visual = visualConfig("autoStories", "breadcrumb")
  await page.goto(`/${visual.route}`)
  const pg = page.locator(visual.selector)
  await expect(pg).toBeVisible()
  await expect(page.locator("#breadcrumb-overview")).toHaveCount(0)
  await expect(page.locator("#breadcrumb-preview")).toHaveCount(0)
  await expect(page.locator("#breadcrumb-usage")).toHaveCount(0)
  await expect(pg.locator('[data-story-source="docs/data/component-playgrounds.manifest.json#autoStories.breadcrumb"]')).toHaveCount(1)
  await expect(pg.locator(`[data-story-count="${storyCount("autoStories.breadcrumb")}"]`)).toHaveCount(1)
})

test("Field Playground 主入口", async ({ page }) => {
  const visual = visualConfig("autoStories", "field")
  await page.goto(`/${visual.route}`)
  const pg = page.locator(visual.selector)
  await expect(pg).toBeVisible()
  await expect(page.locator("#field-overview")).toHaveCount(0)
  await expect(page.locator("#field-preview")).toHaveCount(0)
  await expect(page.locator("#field-usage")).toHaveCount(0)
  await expect(pg.locator(`[data-story-count="${storyCount("autoStories.field")}"]`)).toHaveCount(1)
  await expect(pg).toHaveScreenshot("field-playground.png")
})

test("Label Playground 主入口", async ({ page }) => {
  const visual = visualConfig("autoStories", "label")
  await page.goto(`/${visual.route}`)
  const pg = page.locator(visual.selector)
  await expect(pg).toBeVisible()
  await expect(page.locator("#label-overview")).toHaveCount(0)
  await expect(page.locator("#label-preview")).toHaveCount(0)
  await expect(page.locator("#label-usage")).toHaveCount(0)
  await expect(pg.locator(`[data-story-count="${storyCount("autoStories.label")}"]`)).toHaveCount(1)
  await expect(pg).toHaveScreenshot("label-playground.png")
})

test("Table Playground 主入口", async ({ page }) => {
  const visual = visualConfig("components", "table")
  await page.goto(`/${visual.route}`)
  const pg = page.locator(visual.selector)
  await expect(pg).toBeVisible()
  await expect(pg.locator('[data-story-source="docs/data/component-playgrounds.manifest.json#components.table"]')).toHaveCount(1)
  await expect(pg.locator(`[data-story-count="${storyCount("components.table")}"]`)).toHaveCount(1)
  await expect(page.locator("#table-props")).toBeVisible()
  await expect(page.locator("#table-semantic-dom")).toBeVisible()
})

test("Table 成熟能力矩阵", async ({ page }) => {
  const visual = visualConfig("components", "table")
  await page.goto(`/${visual.route}`)
  const playground = page.locator(visual.selector)
  const stories = playground.locator('[data-slot="component-playground-stories"]')

  await stories.getByRole("button", { name: "基础数据表", exact: true }).click()
  await expect(playground.locator('[data-slot="table-container"]').first()).toHaveScreenshot("table-plain-default.png")

  await stories.getByRole("button", { name: "业务资源列表", exact: true }).click()
  await expect(playground.locator('[data-slot="table-container"]').first()).toHaveScreenshot("table-bordered-compact-business.png")

  await stories.getByRole("button", { name: "斑马纹汇总表", exact: true }).click()
  await expect(playground.locator('[data-slot="table-container"]').first()).toHaveScreenshot("table-striped-comfortable-summary.png")
})

test("AlertDialog Playground 主入口", async ({ page }) => {
  const visual = visualConfig("autoStories", "alert-dialog")
  await page.goto(`/${visual.route}`)
  const pg = page.locator(visual.selector)
  await expect(pg).toBeVisible()
  await expect(page.locator("#alert-dialog-overview")).toHaveCount(0)
  await expect(page.locator("#alert-dialog-preview")).toHaveCount(0)
  await expect(page.locator("#alert-dialog-usage")).toHaveCount(0)
  await expect(pg.locator('[data-story-source="docs/data/component-playgrounds.manifest.json#autoStories.alert-dialog"]')).toHaveCount(1)
  await expect(pg.locator(`[data-story-count="${storyCount("autoStories.alert-dialog")}"]`)).toHaveCount(1)
})

test("Sheet Playground 主入口", async ({ page }) => {
  const visual = visualConfig("autoStories", "sheet")
  await page.goto(`/${visual.route}`)
  const pg = page.locator(visual.selector)
  await expect(pg).toBeVisible()
  await expect(page.locator("#sheet-overview")).toHaveCount(0)
  await expect(page.locator("#sheet-preview")).toHaveCount(0)
  await expect(page.locator("#sheet-usage")).toHaveCount(0)
  await expect(pg.locator('[data-story-source="docs/data/component-playgrounds.manifest.json#autoStories.sheet"]')).toHaveCount(1)
  await expect(pg.locator(`[data-story-count="${storyCount("autoStories.sheet")}"]`)).toHaveCount(1)
})

test("Dialog / Sheet 成熟尺寸矩阵", async ({ page }) => {
  const dialogVisual = visualConfig("pageVisuals", "dialog")
  await page.goto(`/${dialogVisual.route}`)
  const dialogPlayground = page.locator(dialogVisual.selector)
  const dialogStories = dialogPlayground.locator('[data-slot="component-playground-stories"]')
  await dialogStories.getByRole("button", { name: "确认弹窗", exact: true }).click()
  await dialogPlayground.getByRole("button", { name: "发布版本", exact: true }).click()
  await expect(page.getByRole("dialog")).toHaveScreenshot("dialog-confirm-sm.png")
  await page.keyboard.press("Escape")
  await dialogStories.getByRole("button", { name: "宽版审阅弹窗", exact: true }).click()
  await dialogPlayground.getByRole("button", { name: "审阅发布内容", exact: true }).click()
  await expect(page.getByRole("dialog")).toHaveScreenshot("dialog-review-lg.png")
  await page.keyboard.press("Escape")

  const sheetVisual = visualConfig("autoStories", "sheet")
  await page.goto(`/${sheetVisual.route}`)
  const sheetPlayground = page.locator(sheetVisual.selector)
  const sheetStories = sheetPlayground.locator('[data-slot="component-playground-stories"]')
  await sheetStories.getByRole("button", { name: "宽版高级配置", exact: true }).click()
  await sheetPlayground.getByRole("button", { name: "高级配置", exact: true }).click()
  await expect(page.getByRole("dialog")).toHaveScreenshot("sheet-right-lg.png")
})

test("Skeleton Playground 主入口", async ({ page }) => {
  const visual = visualConfig("autoStories", "skeleton")
  await page.goto(`/${visual.route}`)
  const pg = page.locator(visual.selector)
  await expect(pg).toBeVisible()
  await expect(page.locator("#skeleton-overview")).toHaveCount(0)
  await expect(page.locator("#skeleton-preview")).toHaveCount(0)
  await expect(page.locator("#skeleton-usage")).toHaveCount(0)
  await expect(pg.locator('[data-story-source="docs/data/component-playgrounds.manifest.json#autoStories.skeleton"]')).toHaveCount(1)
  await expect(pg.locator(`[data-story-count="${storyCount("autoStories.skeleton")}"]`)).toHaveCount(1)
})

test("Pagination Playground 主入口", async ({ page }) => {
  const visual = visualConfig("autoStories", "pagination")
  await page.goto(`/${visual.route}`)
  const pg = page.locator(visual.selector)
  await expect(pg).toBeVisible()
  await expect(page.locator("#pagination-overview")).toHaveCount(0)
  await expect(page.locator("#pagination-preview")).toHaveCount(0)
  await expect(page.locator("#pagination-usage")).toHaveCount(0)
  await expect(pg.locator('[data-story-source="docs/data/component-playgrounds.manifest.json#autoStories.pagination"]')).toHaveCount(1)
  await expect(pg.locator(`[data-story-count="${storyCount("autoStories.pagination")}"]`)).toHaveCount(1)
})

test("Card Playground 主入口", async ({ page }) => {
  const visual = visualConfig("components", "card")
  await page.goto(`/${visual.route}`)
  const pg = page.locator(visual.selector)
  await expect(pg).toBeVisible()
  await expect(pg.locator('[data-story-source="docs/data/component-playgrounds.manifest.json#components.card"]')).toHaveCount(1)
  await expect(pg.locator('[data-slot="component-playground-stories"]')).toHaveCount(1)
  await expect(pg.locator(`[data-story-count="${storyCount("components.card")}"]`)).toHaveCount(1)
  await expect(page.locator("#card-overview")).toHaveCount(0)
  await expect(page.locator("#card-preview")).toHaveCount(0)
  await expect(page.locator("#card-usage")).toHaveCount(0)
})

test("Card 成熟能力矩阵", async ({ page }) => {
  const visual = visualConfig("components", "card")
  await page.goto(`/${visual.route}`)
  const playground = page.locator(visual.selector)
  const stories = playground.locator('[data-slot="component-playground-stories"]')

  await stories.getByRole("button", { name: "数据概览", exact: true }).click()
  await expect(playground.locator('[data-slot="card"]').first()).toHaveScreenshot("card-outline-md.png")

  await stories.getByRole("button", { name: "信息说明", exact: true }).click()
  await expect(playground.locator('[data-slot="card"]').first()).toHaveScreenshot("card-subtle-sm.png")

  await stories.getByRole("button", { name: "可操作项", exact: true }).click()
  await expect(playground.locator('[data-slot="card"]').first()).toHaveScreenshot("card-elevated-lg.png")

  await stories.getByRole("button", { name: "媒体内容", exact: true }).click()
  await expect(playground.locator('[data-slot="card"]').first()).toHaveScreenshot("card-media-outline-md.png")
})

test("Checkbox Playground 主入口", async ({ page }) => {
  const visual = visualConfig("autoStories", "checkbox")
  await page.goto(`/${visual.route}`)
  const pg = page.locator(visual.selector)
  await expect(pg).toBeVisible()
  await expect(page.locator("#checkbox-overview")).toHaveCount(0)
  await expect(page.locator("#checkbox-preview")).toHaveCount(0)
  await expect(page.locator("#checkbox-usage")).toHaveCount(0)
  await expect(pg.locator('[data-story-source="docs/data/component-playgrounds.manifest.json#autoStories.checkbox"]')).toHaveCount(1)
  await expect(pg.locator(`[data-story-count="${storyCount("autoStories.checkbox")}"]`)).toHaveCount(1)
})

test("Switch Playground 主入口", async ({ page }) => {
  const visual = visualConfig("autoStories", "switch")
  await page.goto(`/${visual.route}`)
  const pg = page.locator(visual.selector)
  await expect(pg).toBeVisible()
  await expect(page.locator("#switch-overview")).toHaveCount(0)
  await expect(page.locator("#switch-preview")).toHaveCount(0)
  await expect(page.locator("#switch-usage")).toHaveCount(0)
  await expect(pg.locator('[data-story-source="docs/data/component-playgrounds.manifest.json#autoStories.switch"]')).toHaveCount(1)
  await expect(pg.locator(`[data-story-count="${storyCount("autoStories.switch")}"]`)).toHaveCount(1)
})

test("Textarea Playground 主入口", async ({ page }) => {
  const visual = visualConfig("autoStories", "textarea")
  await page.goto(`/${visual.route}`)
  const pg = page.locator(visual.selector)
  await expect(pg).toBeVisible()
  await expect(page.locator("#textarea-overview")).toHaveCount(0)
  await expect(page.locator("#textarea-preview")).toHaveCount(0)
  await expect(page.locator("#textarea-usage")).toHaveCount(0)
  await expect(pg.locator('[data-story-source="docs/data/component-playgrounds.manifest.json#autoStories.textarea"]')).toHaveCount(1)
  await expect(pg.locator(`[data-story-count="${storyCount("autoStories.textarea")}"]`)).toHaveCount(1)
})

test("Separator Playground 主入口", async ({ page }) => {
  const visual = visualConfig("components", "separator")
  await page.goto(`/${visual.route}`)
  const pg = page.locator(visual.selector)
  await expect(pg).toBeVisible()
  const pageLead = pg.locator(':scope > [data-slot="section-lead"]')
  await expect(pageLead.getByRole("heading", { name: "调试台", exact: true })).toHaveCount(1)
  await expect(pageLead.getByText("实时调真实属性，预览随之变化，写法可一键复制。", { exact: true })).toHaveCount(1)
  await expect(page.locator('a[href="#separator-playground"]')).toHaveCount(1)
  await expect(page.locator("#separator-overview")).toHaveCount(0)
  await expect(page.locator("#separator-preview")).toHaveCount(0)
  await expect(page.locator("#separator-usage")).toHaveCount(0)
  await expect(page.locator('a[href="#separator-overview"], a[href="#separator-preview"], a[href="#separator-usage"]')).toHaveCount(0)
  await expect(pg.locator('[data-story-source="docs/data/component-playgrounds.manifest.json#components.separator"]')).toHaveCount(1)
  await expect(pg.locator('[data-slot="component-playground-stories"]')).toHaveCount(0)
  const orientationControl = pg.locator("label").filter({ hasText: "方向" }).locator("..")
  await expect(orientationControl.getByRole("button", { name: "水平", exact: true })).toHaveCount(1)
  await expect(orientationControl.getByRole("button", { name: "垂直", exact: true })).toHaveCount(1)
  await expect(pg).toHaveScreenshot("separator-playground.png")
})

test("Spinner Playground 主入口", async ({ page }) => {
  const visual = visualConfig("autoStories", "spinner")
  await page.goto(`/${visual.route}`)
  const pg = page.locator(visual.selector)
  await expect(pg).toBeVisible()
  await expect(pg.locator('[data-story-source="docs/data/component-playgrounds.manifest.json#autoStories.spinner"]')).toHaveCount(1)
  await expect(pg.locator(`[data-story-count="${storyCount("autoStories.spinner")}"]`)).toHaveCount(1)
  await expect(pg).toHaveScreenshot("spinner-playground.png")
})

test("Collapsible Playground 主入口", async ({ page }) => {
  const visual = visualConfig("autoStories", "collapsible")
  await page.goto(`/${visual.route}`)
  const pg = page.locator(visual.selector)
  await expect(pg).toBeVisible()
  await expect(pg.locator('[data-story-source="docs/data/component-playgrounds.manifest.json#autoStories.collapsible"]')).toHaveCount(1)
  await expect(pg.locator(`[data-story-count="${storyCount("autoStories.collapsible")}"]`)).toHaveCount(1)
  await expect(pg).toHaveScreenshot("collapsible-playground.png")
})

test("Tabs Playground 主入口", async ({ page }) => {
  const visual = visualConfig("autoStories", "tabs")
  await page.goto(`/${visual.route}`)
  const pg = page.locator(visual.selector)
  await expect(pg).toBeVisible()
  await expect(pg.locator('[data-story-source="docs/data/component-playgrounds.manifest.json#autoStories.tabs"]')).toHaveCount(1)
  await expect(pg.locator(`[data-story-count="${storyCount("autoStories.tabs")}"]`)).toHaveCount(1)
  await expect(pg).toHaveScreenshot("tabs-playground.png")
  const stories = pg.locator('[data-slot="component-playground-stories"]')
  await stories.getByRole("button", { name: "默认样式切页", exact: true }).click()
  await expect(pg.locator('[data-slot="tabs"]').first()).toHaveScreenshot("tabs-default-md.png")
  await stories.getByRole("button", { name: "下划线样式", exact: true }).click()
  await expect(pg.locator('[data-slot="tabs"]').first()).toHaveScreenshot("tabs-line-sm.png")
  await stories.getByRole("button", { name: "垂直设置导航", exact: true }).click()
  await expect(pg.locator('[data-slot="tabs"]').first()).toHaveScreenshot("tabs-vertical-lg.png")
})

test("Popover Playground 主入口", async ({ page }) => {
  const visual = visualConfig("autoStories", "popover")
  await page.goto(`/${visual.route}`)
  const pg = page.locator(visual.selector)
  await expect(pg).toBeVisible()
  await expect(pg.locator('[data-story-source="docs/data/component-playgrounds.manifest.json#autoStories.popover"]')).toHaveCount(1)
  await expect(pg.locator(`[data-story-count="${storyCount("autoStories.popover")}"]`)).toHaveCount(1)
  await expect(pg).toHaveScreenshot("popover-playground.png")
})

test("Popover 成熟尺寸矩阵", async ({ page }) => {
  const visual = visualConfig("autoStories", "popover")
  await page.goto(`/${visual.route}`)
  const playground = page.locator(visual.selector)
  const stories = playground.locator('[data-slot="component-playground-stories"]')
  await stories.getByRole("button", { name: "信息说明卡", exact: true }).click()
  await playground.getByRole("button", { name: "说明", exact: true }).click()
  await expect(page.locator('[data-slot="popover-content"]')).toHaveScreenshot("popover-info-sm.png")
  await page.keyboard.press("Escape")
  await stories.getByRole("button", { name: "宽版筛选", exact: true }).click()
  await playground.getByRole("button", { name: "筛选条件", exact: true }).click()
  await expect(page.locator('[data-slot="popover-content"]')).toHaveScreenshot("popover-filter-lg.png")
})

test("Sidebar Playground 主入口", async ({ page }) => {
  const visual = visualConfig("autoStories", "sidebar")
  await page.goto(`/${visual.route}`)
  const pg = page.locator(visual.selector)
  await expect(pg).toBeVisible()
  await expect(pg.locator('[data-story-source="docs/data/component-playgrounds.manifest.json#autoStories.sidebar"]')).toHaveCount(1)
  await expect(pg.locator(`[data-story-count="${storyCount("autoStories.sidebar")}"]`)).toHaveCount(1)
  await expect(pg).toHaveScreenshot("sidebar-playground.png")
})

test("Command Playground 主入口", async ({ page }) => {
  const visual = visualConfig("autoStories", "command")
  await page.goto(`/${visual.route}`)
  const pg = page.locator(visual.selector)
  await expect(pg).toBeVisible()
  await expect(pg.locator('[data-story-source="docs/data/component-playgrounds.manifest.json#autoStories.command"]')).toHaveCount(1)
  await expect(pg.locator(`[data-story-count="${storyCount("autoStories.command")}"]`)).toHaveCount(1)
  await expect(pg).toHaveScreenshot("command-playground.png")
})

test("ToggleGroup Playground 主入口", async ({ page }) => {
  const visual = visualConfig("autoStories", "toggle-group")
  await page.goto(`/${visual.route}`)
  const pg = page.locator(visual.selector)
  await expect(pg).toBeVisible()
  await expect(pg.locator('[data-story-source="docs/data/component-playgrounds.manifest.json#autoStories.toggle-group"]')).toHaveCount(1)
  await expect(pg.locator(`[data-story-count="${storyCount("autoStories.toggle-group")}"]`)).toHaveCount(1)
  await expect(pg).toHaveScreenshot("toggle-group-playground.png")
})

test("Toast Playground 主入口", async ({ page }) => {
  const visual = visualConfig("autoStories", "toast")
  await page.goto(`/${visual.route}`)
  const pg = page.locator(visual.selector)
  await expect(pg).toBeVisible()
  await expect(pg.locator('[data-story-source="docs/data/component-playgrounds.manifest.json#autoStories.toast"]')).toHaveCount(1)
  await expect(pg.locator(`[data-story-count="${storyCount("autoStories.toast")}"]`)).toHaveCount(1)
  await expect(pg).toHaveScreenshot("toast-playground.png")
})

test("RadioGroup Playground 主入口", async ({ page }) => {
  const visual = visualConfig("autoStories", "radio-group")
  await page.goto(`/${visual.route}`)
  const pg = page.locator(visual.selector)
  await expect(pg).toBeVisible()
  await expect(pg.locator('[data-story-source="docs/data/component-playgrounds.manifest.json#autoStories.radio-group"]')).toHaveCount(1)
  await expect(pg.locator(`[data-story-count="${storyCount("autoStories.radio-group")}"]`)).toHaveCount(1)
  await expect(pg).toHaveScreenshot("radio-group-playground.png")
})

test("DropdownMenu Playground 主入口", async ({ page }) => {
  const visual = visualConfig("autoStories", "dropdown-menu")
  await page.goto(`/${visual.route}`)
  const pg = page.locator(visual.selector)
  await expect(pg).toBeVisible()
  await expect(pg.locator('[data-story-source="docs/data/component-playgrounds.manifest.json#autoStories.dropdown-menu"]')).toHaveCount(1)
  await expect(pg.locator(`[data-story-count="${storyCount("autoStories.dropdown-menu")}"]`)).toHaveCount(1)
  await expect(pg).toHaveScreenshot("dropdown-menu-playground.png")
})

test("DropdownMenu 真实键盘菜单", async ({ page }) => {
  const visual = visualConfig("autoStories", "dropdown-menu")
  await page.goto(`/${visual.route}`)
  const playground = page.locator(visual.selector)
  const stories = playground.locator('[data-slot="component-playground-stories"]')
  await stories.getByRole("button", { name: "有子级", exact: true }).click()
  await playground.getByRole("button", { name: "操作", exact: true }).click()
  await expect(page.getByRole("menu").first()).toHaveScreenshot("dropdown-menu-submenu-root.png")
})

test("Link Playground 主入口", async ({ page }) => {
  const visual = visualConfig("components", "link")
  await page.goto(`/${visual.route}`)
  const pg = page.locator(visual.selector)
  await expect(pg).toBeVisible()
  await expect(pg.locator('[data-story-source="docs/data/component-playgrounds.manifest.json#components.link"]')).toHaveCount(1)
  await expect(pg.locator('[data-slot="component-playground-stories"]')).toHaveCount(0)
  await expect(pg.getByText("场景预设", { exact: true })).toHaveCount(0)
  await expect(pg).toHaveScreenshot(visual.screenshot)
})

test("ButtonGroup Playground 主入口", async ({ page }) => {
  const visual = visualConfig("components", "buttonGroup")
  await page.goto(`/${visual.route}`)
  const pg = page.locator(visual.selector)
  await expect(pg).toBeVisible()
  await expect(pg.locator('[data-story-source="docs/data/component-playgrounds.manifest.json#components.buttonGroup"]')).toHaveCount(1)
  await expect(pg.locator('[data-slot="component-playground-stories"]')).toHaveCount(1)
  await expect(pg.getByText("结构示例", { exact: true })).toHaveCount(1)
  await expect(pg.getByText("组合方式", { exact: true })).toHaveCount(0)
  await expect(pg.locator(`[data-story-count="${storyCount("components.buttonGroup")}"]`)).toHaveCount(1)
  await expect(pg).toHaveScreenshot(visual.screenshot)
})

test("Input 组件制作台", async ({ page }) => {
  await page.goto("/#input")
  const workbench = page.locator("#input-playground")
  await expect(workbench).toBeVisible()
  await expect(workbench.locator('[data-story-source="docs/data/component-playgrounds.manifest.json#components.input"]')).toHaveCount(1)
  await expect(workbench.locator('[data-slot="component-playground-stories"]')).toHaveCount(0)
  await expect(workbench.getByRole("treeitem")).toHaveCount(0)
  await expect(workbench.locator("label")).toHaveText(["占位文字", "输入类型", "前置内容", "后置内容", "尺寸", "禁用", "报错"])
  await expect(workbench.getByText("交互状态", { exact: true })).toHaveCount(0)
  await expect(workbench).toContainText("录入普通文本。")
  const leadingControl = workbench.locator("label").filter({ hasText: "前置内容" }).locator("..")
  const trailingControl = workbench.locator("label").filter({ hasText: "后置内容" }).locator("..")
  await leadingControl.getByRole("button", { name: "符号", exact: true }).click()
  await trailingControl.getByRole("button", { name: "符号", exact: true }).click()
  await expect(workbench.locator('[data-slot="input-group"]')).toHaveCount(1)
  await expect(workbench.locator('[data-slot="input-affix"]')).toHaveCount(2)
  await expect(workbench.locator('[data-slot="input-workbench-preview"]')).toContainText("%")
  await leadingControl.getByRole("button", { name: "无", exact: true }).click()
  await trailingControl.getByRole("button", { name: "无", exact: true }).click()
  await leadingControl.getByRole("button", { name: "标签", exact: true }).click()
  const inputGroup = workbench.locator('[data-slot="input-workbench-preview"] [data-slot="input-group"]')
  const inputAddon = workbench.locator('[data-slot="input-workbench-preview"] [data-slot="input-addon"]')
  await expect(inputAddon).toHaveCount(1)
  const groupBackground = await inputGroup.evaluate((element) => getComputedStyle(element).backgroundColor)
  const addonBackground = await inputAddon.evaluate((element) => getComputedStyle(element).backgroundColor)
  const groupBorder = await inputGroup.evaluate((element) => getComputedStyle(element).borderColor)
  const addonDivider = await inputAddon.evaluate((element) => getComputedStyle(element).borderRightColor)
  expect(addonBackground).toBe(groupBackground)
  expect(addonDivider).toBe(groupBorder)
  await leadingControl.getByRole("button", { name: "无", exact: true }).click()
  await workbench.locator("label").filter({ hasText: "输入类型" }).locator("..").getByRole("button", { name: "搜索", exact: true }).click()
  const searchInput = workbench.locator('[data-slot="input-workbench-preview"] [data-slot="input"]')
  await expect(searchInput).toHaveAttribute("type", "search")
  await expect(leadingControl.getByRole("button", { name: "搜索图标", exact: true })).toBeVisible()
  await expect(workbench.locator('[data-slot="input-workbench-preview"] [data-slot="input-affix"]')).toHaveCount(1)
  await expect(leadingControl.getByRole("button", { name: "邮箱图标", exact: true })).toHaveCount(0)
  await expect(trailingControl.getByRole("button", { name: "显示密码", exact: true })).toHaveCount(0)
  await trailingControl.getByRole("button", { name: "搜索图标", exact: true }).click()
  const searchAffix = workbench.locator('[data-slot="input-workbench-preview"] [data-slot="input-affix"]')
  await expect(searchAffix).toHaveCount(1)
  await expect(searchAffix).toHaveAttribute("data-side", "end")
  await workbench.locator("label").filter({ hasText: "输入类型" }).locator("..").getByRole("button", { name: "文本", exact: true }).click()
  await workbench.locator("label").filter({ hasText: "输入类型" }).locator("..").getByRole("button", { name: "搜索", exact: true }).click()
  await expect(searchAffix).toHaveAttribute("data-side", "start")
  await expect(workbench.locator('[data-slot="input-workbench-preview"] [data-slot="input-action"]')).toHaveCount(0)
  await searchInput.fill("客户")
  const clearSearch = workbench.locator('[data-slot="input-workbench-preview"] [data-slot="input-action"]')
  await expect(clearSearch).toHaveAttribute("aria-label", "清除搜索")
  await clearSearch.click()
  await expect(searchInput).toHaveValue("")
  await expect(clearSearch).toHaveCount(0)
  await expect(trailingControl.getByRole("button", { name: "清除", exact: true })).toHaveCount(0)
  await trailingControl.getByRole("button", { name: "无", exact: true }).click()
  await workbench.locator("label").filter({ hasText: "输入类型" }).locator("..").getByRole("button", { name: "文本", exact: true }).click()
  const workbenchCard = workbench.locator(':scope > [data-slot="component-playground"]')
  await workbenchCard.evaluate((element) => {
    element.scrollIntoView()
    window.scrollBy(0, -72)
  })
  await expect(workbenchCard).toHaveScreenshot("input-playground-default.png")
  await workbench.locator("label").filter({ hasText: "输入类型" }).locator("..").getByRole("button", { name: "数字", exact: true }).click()
  const numberInput = workbench.locator('[data-slot="input-workbench-preview"] [data-slot="input"]')
  await expect(numberInput).toHaveAttribute("type", "number")
  await expect(numberInput).toHaveScreenshot("input-number.png")
  await workbench.locator("label").filter({ hasText: "输入类型" }).locator("..").getByRole("button", { name: "搜索", exact: true }).click()
  await trailingControl.getByRole("button", { name: "主搜索", exact: true }).click()
  const primaryAction = workbench.locator('[data-slot="input-workbench-preview"] [data-slot="input-action"]')
  await expect(primaryAction).toHaveAttribute("data-variant", "primary")
  await expect(primaryAction).toHaveText("搜索")
  await expect(workbench.locator('[data-slot="input-workbench-preview"]')).toHaveScreenshot("input-primary-action.png")
  await trailingControl.getByRole("button", { name: "无", exact: true }).click()
  await workbench.locator("label").filter({ hasText: "输入类型" }).locator("..").getByRole("button", { name: "邮箱", exact: true }).click()
  await expect(leadingControl.getByRole("button", { name: "搜索图标", exact: true })).toHaveCount(0)
  await expect(trailingControl.getByRole("button", { name: "清除", exact: true })).toHaveCount(0)
  await expect(leadingControl.getByRole("button", { name: "邮箱图标", exact: true })).toBeVisible()
  await expect(workbench.locator('[data-slot="input-workbench-preview"] [data-slot="input-group"]')).toHaveCount(1)
  await expect(workbench.locator('[data-slot="input-workbench-preview"] [data-slot="input-affix"]')).toHaveCount(1)
  const emailInput = workbench.locator('[data-slot="input-workbench-preview"] [data-slot="input"]')
  await emailInput.fill("invalid-email")
  expect(await emailInput.evaluate((element) => (element as HTMLInputElement).validity.typeMismatch)).toBe(true)
  await emailInput.press("Tab")
  await expect(emailInput).toHaveAttribute("aria-invalid", "true")
  await expect(workbench.getByText("请输入有效的邮箱地址。", { exact: true })).toHaveCount(0)
  await emailInput.fill("name@example.com")
  await expect(emailInput).not.toHaveAttribute("aria-invalid", "true")
  await expect(workbench.getByText("请输入有效的邮箱地址。", { exact: true })).toHaveCount(0)
  await expect(workbench.getByRole("button", { name: "校验格式", exact: true })).toHaveCount(0)
  await workbench.getByRole("button", { name: "编辑组件", exact: true }).click()
  const fieldControl = workbench.locator("label").filter({ hasText: "字段包装" }).locator("..")
  await fieldControl.getByRole("button", { name: "字段", exact: true }).click()
  const wrappedEmailInput = workbench.locator('[data-slot="input-workbench-preview"] [data-slot="input"]')
  await wrappedEmailInput.fill("invalid-email")
  await wrappedEmailInput.press("Tab")
  await expect(wrappedEmailInput).toHaveAttribute("aria-invalid", "true")
  await expect(workbench.getByText("字段名称", { exact: true })).toBeVisible()
  await expect(workbench.getByText("请输入有效的邮箱地址。", { exact: true })).toBeVisible()
  await workbench.getByRole("button", { name: "完成编辑", exact: true }).click()
  await workbench.locator("label").filter({ hasText: "输入类型" }).locator("..").getByRole("button", { name: "密码", exact: true }).click()
  const passwordInput = workbench.locator('[data-slot="input-workbench-preview"] [data-slot="input"]')
  await expect(passwordInput).toHaveAttribute("type", "password")
  const passwordToggle = workbench.locator('[data-slot="input-workbench-preview"] [data-slot="input-action"]')
  await expect(passwordToggle).toHaveAttribute("aria-label", "显示密码")
  await passwordToggle.click()
  await expect(passwordInput).toHaveAttribute("type", "text")
  await expect(passwordToggle).toHaveAttribute("aria-label", "隐藏密码")
  await workbench.locator("label").filter({ hasText: "输入类型" }).locator("..").getByRole("button", { name: "文本", exact: true }).click()
  await workbench.locator("label").filter({ hasText: "禁用" }).locator("..").getByRole("button", { name: "是", exact: true }).click()
  await expect(workbench.locator('[data-slot="input-workbench-preview"] [data-slot="input"]')).toBeDisabled()
  await workbench.locator("label").filter({ hasText: "禁用" }).locator("..").getByRole("button", { name: "否", exact: true }).click()
  await workbench.locator("label").filter({ hasText: "报错" }).locator("..").getByRole("button", { name: "是", exact: true }).click()
  await expect(workbench.locator('[data-slot="input-workbench-preview"] [data-slot="input"]')).toHaveAttribute("aria-invalid", "true")
  await workbench.locator("label").filter({ hasText: "报错" }).locator("..").getByRole("button", { name: "否", exact: true }).click()
  await workbench.locator("label").filter({ hasText: "输入类型" }).locator("..").getByRole("button", { name: "文本", exact: true }).click()
  await workbench.getByRole("button", { name: "编辑组件", exact: true }).click()
  await expect(workbench.getByRole("treeitem")).toHaveCount(4)

  const editingLeadingControl = workbench.locator("label").filter({ hasText: "前置内容" }).locator("..")
  await editingLeadingControl.getByRole("button", { name: "标签", exact: true }).click()
  await expect(workbench.locator('[data-slot="input-group"]')).toBeVisible()
  await expect(workbench.locator('[data-slot="input-addon"]')).toHaveCount(1)

  await workbench.getByRole("treeitem", { name: /输入框/ }).click()
  const placeholderControl = workbench.locator("label").filter({ hasText: "占位文字" }).locator("..")
  await placeholderControl.getByRole("textbox").fill("搜索客户")
  await expect(workbench.getByPlaceholder("搜索客户", { exact: true })).toBeVisible()

  await workbench.getByRole("treeitem", { name: /语义 Token/ }).click()
  const preview = workbench.locator('[data-slot="input-workbench-preview"]')
  const defaultBackground = await preview.locator('[data-slot="input-group"]').evaluate((element) => getComputedStyle(element).backgroundColor)
  await workbench.getByRole("button", { name: "弱化表面", exact: true }).click()
  await expect(preview).toHaveAttribute("data-surface-token", "muted")
  const mutedBackground = await preview.locator('[data-slot="input-group"]').evaluate((element) => getComputedStyle(element).backgroundColor)
  expect(mutedBackground).not.toBe(defaultBackground)

  await workbench.getByRole("button", { name: "代码", exact: true }).click()
  await expect(workbench.locator("code")).toContainText('"--surface": "var(--muted)"')
  await workbench.getByRole("button", { name: "预览", exact: true }).click()

  await workbench.getByRole("treeitem", { name: /状态语义/ }).click()
  const stateAssignments = workbench.locator('[data-slot="component-playground-state-assignments"]')
  await expect(stateAssignments.getByRole("button")).toHaveCount(6)
  await expect(stateAssignments).toContainText("input")
  await expect(stateAssignments).toContainText("primary")
  await expect(stateAssignments).toContainText("destructive")
  await expect(stateAssignments).toContainText("neutrals-07")
  await expect(stateAssignments).toContainText("brand-09")
  await expect(stateAssignments).toContainText("neutrals-03")
  await expect(stateAssignments).toContainText("red-09")
  await expect(stateAssignments).not.toContainText("oklch(")
  await expect(stateAssignments).not.toContainText("rgb(")
  const normalAssignment = stateAssignments.getByRole("button", { name: /正常.*边框.*input/ })
  const normalTokenColor = await normalAssignment.locator('[aria-hidden="true"]').evaluate((element) => getComputedStyle(element).backgroundColor)
  const normalBorder = await preview.locator('[data-slot="input-group"]').evaluate((element) => getComputedStyle(element).borderColor)
  expect(normalBorder).toBe(normalTokenColor)
  const invalidAssignment = stateAssignments.getByRole("button", { name: /错误.*边框.*destructive/ })
  const invalidTokenColor = await invalidAssignment.locator('[aria-hidden="true"]').evaluate((element) => getComputedStyle(element).backgroundColor)
  await invalidAssignment.click()
  await expect(preview.locator('[data-slot="input"]')).toHaveAttribute("aria-invalid", "true")
  await expect(preview.locator('[data-slot="input-group"]')).toHaveCSS("border-color", invalidTokenColor)
  await expect(workbench.locator('[data-slot="component-playground-validation"]')).toContainText(`border: ${invalidTokenColor}`)
  const invalidBorder = await preview.locator('[data-slot="input-group"]').evaluate((element) => getComputedStyle(element).borderColor)
  expect(invalidBorder).not.toBe(normalBorder)
  expect(invalidBorder).toBe(invalidTokenColor)
  await workbenchCard.evaluate((element) => {
    element.scrollIntoView()
    window.scrollBy(0, -72)
  })
  await expect(workbenchCard).toHaveScreenshot("input-workbench.png")

  await workbench.getByRole("button", { name: "完成编辑", exact: true }).click()
  await expect(workbench.getByRole("treeitem")).toHaveCount(0)
  await expect(preview).toHaveAttribute("data-surface-token", "surface")
  await expect(preview.locator('[data-slot="input-group"]')).toHaveCount(0)
  await expect(preview.locator('[data-slot="input-affix"]')).toHaveCount(0)
  await expect(preview.locator('[data-slot="input-addon"]')).toHaveCount(0)
  await expect(workbench.getByPlaceholder("请输入", { exact: true })).toBeVisible()
  await expect(preview.locator('[data-slot="input"]')).not.toHaveAttribute("aria-invalid", "true")
  await expect(workbench.locator("label")).toHaveText(["占位文字", "输入类型", "前置内容", "后置内容", "尺寸", "禁用", "报错"])
})

test("Chart 页面按需加载", async ({ page }) => {
  const visual = visualConfig("pageVisuals", "chart")
  await page.goto(`/${visual.route}`)
  await expect(page.locator(visual.selector)).toBeVisible()
  await expect(page.locator("svg.recharts-surface").first()).toBeVisible()
})

test("NavMenu 页面模块", async ({ page }) => {
  const visual = visualConfig("pageVisuals", "nav-menu")
  await page.goto(`/${visual.route}`)
  await expect(page.locator("#nav-menu-playground")).toBeVisible()
  await expect(page.locator("#nav-menu-overview")).toBeVisible()
  await expect(page.locator("#nav-menu-props")).toBeVisible()
  await expect(page.locator("#nav-menu-semantic-dom")).toBeVisible()
  await expect(page.locator("#nav-menu-do-dont")).toBeVisible()
})

test("Icon 页面模块", async ({ page }) => {
  const visual = visualConfig("pageVisuals", "icon")
  await page.goto(`/${visual.route}`)
  await expect(page.locator("#icon-library")).toBeVisible()
  await expect(page.locator("#icon-playground")).toBeVisible()
  await expect(page.locator("#icon-props")).toBeVisible()
  await expect(page.locator("#icon-semantic-dom")).toBeVisible()
  await expect(page.locator("#icon-do-dont")).toBeVisible()
})

test("AgentSurface 页面模块", async ({ page }) => {
  const visual = visualConfig("pageVisuals", "agent-surface")
  await page.goto(`/${visual.route}`)
  await expect(page.locator("#agent-surface-overview")).toBeVisible()
  await expect(page.locator("#agent-surface-playground")).toBeVisible()
  await expect(page.locator("#agent-surface-demo")).toBeVisible()
  await expect(page.locator("#agent-surface-schema")).toBeVisible()
  await expect(page.locator("#agent-surface-safety")).toBeVisible()
})

test("DatePicker Playground 主入口", async ({ page }) => {
  const visual = visualConfig("customPlaygrounds", "datePicker")
  await page.goto(`/${visual.route}`)
  const pg = page.locator(visual.selector)
  await expect(pg).toBeVisible()
  await expect(pg.locator('[data-story-source="docs/data/component-playgrounds.manifest.json#customPlaygrounds.datePicker"]')).toHaveCount(1)
  await expect(pg.locator('[data-slot="component-playground-stories"]')).toHaveCount(1)
  await expect(pg.locator(`[data-story-count="${storyCount("customPlaygrounds.datePicker")}"]`)).toHaveCount(1)
  await expect(pg).toHaveScreenshot(visual.screenshot)
})

test("DatePicker 日期选择器", async ({ page }) => {
  const visual = visualConfig("pageVisuals", "date-picker")
  await page.goto(`/${visual.route}`)
  const picker = page.locator(visual.selector).first()
  await expect(picker).toBeVisible()
  await expect(picker).toContainText("2026/07/15")
  const trigger = picker.locator('[data-slot="date-picker-trigger"]')
  await trigger.click()
  await expect(page.locator('[data-slot="calendar"]')).toBeVisible()
  await expect(picker).toHaveScreenshot("date-picker.png")
})

test("TimePicker Playground 主入口", async ({ page }) => {
  const visual = visualConfig("pageVisuals", "time-picker")
  await page.goto(`/${visual.route}`)
  const pg = page.locator(visual.selector)
  await expect(pg).toBeVisible()
  await expect(pg.locator('[data-story-source="docs/data/component-playgrounds.manifest.json#customPlaygrounds.timePicker"]')).toHaveCount(1)
  await expect(pg.locator(`[data-story-count="${storyCount("customPlaygrounds.timePicker")}"]`)).toHaveCount(1)
  await expect(pg).toHaveScreenshot("time-picker-playground.png")
})

test("Calendar Playground 主入口", async ({ page }) => {
  const visual = visualConfig("pageVisuals", "calendar")
  await page.goto(`/${visual.route}`)
  await expect(page.locator(visual.selector)).toBeVisible()
})

test("Dialog Playground 主入口", async ({ page }) => {
  const visual = visualConfig("pageVisuals", "dialog")
  await page.goto(`/${visual.route}`)
  await expect(page.locator(visual.selector)).toBeVisible()
})

test("Select Playground 主入口", async ({ page }) => {
  const visual = visualConfig("pageVisuals", "select")
  await page.goto(`/${visual.route}`)
  const pg = page.locator(visual.selector)
  await expect(pg).toBeVisible()
  await expect(pg.locator('[data-story-source="docs/data/component-playgrounds.manifest.json#components.select"]')).toHaveCount(1)
  await expect(pg.locator(`[data-story-count="${storyCount("components.select")}"]`)).toHaveCount(1)
})

test("Toggle Playground 主入口", async ({ page }) => {
  const visual = visualConfig("pageVisuals", "toggle")
  await page.goto(`/${visual.route}`)
  await expect(page.locator(visual.selector)).toBeVisible()
})

test("Layout 页面模块", async ({ page }) => {
  const visual = visualConfig("pageVisuals", "layout")
  await page.goto(`/${visual.route}`)
  const section = page.locator(visual.selector)
  await expect(section).toBeVisible()
  await expect(page.getByText("页面布局容器")).toBeVisible()
  await expect(page.locator('[data-website-card-container]')).toHaveCount(7)
  await expect(page.locator('[data-website-card-container]').first()).toHaveScreenshot("layout-page.png")
})

test("EditFormBlock 页面模块", async ({ page }) => {
  const visual = visualConfig("pageVisuals", "edit-form")
  await page.goto(`/${visual.route}`)
  const block = page.locator(visual.selector)
  await expect(block).toBeVisible()
  await expect(block).toHaveScreenshot("edit-form-block.png")
})

test("DetailPageBlock 页面模块", async ({ page }) => {
  const visual = visualConfig("pageVisuals", "detail-page")
  await page.goto(`/${visual.route}`)
  const block = page.locator(visual.selector)
  await expect(block).toBeVisible()
  await expect(block).toHaveScreenshot("detail-page-block.png")
})
