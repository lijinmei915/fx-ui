import { test, expect } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import { componentIndexSections } from "../src/lib/site-navigation";

type VisualConfig = { route: string; selector: string };
type QualityEntry = {
  name: string;
  interaction: "interactive" | "non-interactive";
};

const root = process.cwd();
const playgroundManifest = JSON.parse(
  fs.readFileSync(
    path.join(root, "docs/data/component-playgrounds.manifest.json"),
    "utf8",
  ),
) as {
  components?: Record<string, { visual?: VisualConfig }>;
  customPlaygrounds?: Record<string, { visual?: VisualConfig }>;
  autoVisuals?: Record<string, VisualConfig>;
  pageVisuals?: Record<string, VisualConfig>;
  baselineVisuals?: Record<string, VisualConfig>;
};
const qualityManifest = JSON.parse(
  fs.readFileSync(
    path.join(root, "docs/data/component-quality.manifest.json"),
    "utf8",
  ),
) as { components: QualityEntry[] };

function kebabCase(value: string) {
  return value.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

function camelCase(value: string) {
  return value.replace(/-([a-z])/g, (_, letter: string) =>
    letter.toUpperCase(),
  );
}

function visualFor(name: string): VisualConfig | undefined {
  const slug = kebabCase(name);
  const camel = camelCase(slug);
  return (
    playgroundManifest.components?.[slug]?.visual ??
    playgroundManifest.components?.[camel]?.visual ??
    playgroundManifest.components?.[name]?.visual ??
    playgroundManifest.customPlaygrounds?.[slug]?.visual ??
    playgroundManifest.customPlaygrounds?.[camel]?.visual ??
    playgroundManifest.customPlaygrounds?.[name]?.visual ??
    playgroundManifest.autoVisuals?.[slug] ??
    playgroundManifest.pageVisuals?.[slug] ??
    playgroundManifest.baselineVisuals?.[slug]
  );
}

test("navigation: direct hash resolves the registered documentation page", async ({ page }) => {
  await page.goto("/#tokens-colors");

  await expect(page).toHaveURL(/#tokens-colors$/);
  await expect(page.getByRole("heading", { name: "颜色", exact: true })).toBeVisible();
});

test("component page headings use the shared Chinese and English title pair", async ({
  page,
}) => {
  const componentItems = componentIndexSections.flatMap((section) => section.items);

  for (const item of componentItems) {
    await page.goto(`/${item.href}`);
    await expect(page.locator('[data-slot="page-lead-title"]')).toHaveText(item.label);
    await expect(page.locator('[data-slot="page-lead-title-meta"]')).toHaveText(item.labelEn);
  }
});

test("navigation: command palette search selects a hash route", async ({ page }) => {
  await page.goto("/#intro");
  await page.getByRole("button", { name: "搜索文档" }).first().click();

  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await dialog.getByPlaceholder("搜索文档").fill("颜色");
  await dialog.getByRole("button", { name: /颜色/ }).first().click();

  await expect(page).toHaveURL(/#tokens-colors$/);
  await expect(page.getByRole("heading", { name: "颜色", exact: true })).toBeVisible();
});

test("state: Icon browser only exposes registered line and filled exports", async ({
  page,
}) => {
  await page.goto("/#icon");
  const trigger = page.locator('[data-slot="icon-browser-trigger"]');
  await expect(trigger).toHaveAttribute("data-selected-icon", "HomeIcon");

  await trigger.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await dialog.getByPlaceholder("搜索已登记图标").fill("SearchIcon");
  await dialog.getByRole("button", { name: /SearchIcon/ }).click();

  await expect(dialog).toHaveCount(0);
  await expect(trigger).toHaveAttribute("data-selected-icon", "SearchIcon");
  await expect(page.locator('[data-slot="toggle-group"]')).toHaveCount(0);

  const playground = page.locator("#icon-playground");
  await playground.getByRole("button", { name: "代码", exact: true }).click();
  await expect(playground.locator("pre code")).toContainText(
    'import { SearchIcon } from "@/lib/icons"',
  );

  await trigger.click();
  await dialog.getByPlaceholder("搜索已登记图标").fill("HomeIcon");
  await dialog.getByRole("button", { name: /HomeIcon/ }).click();
  await expect(trigger).toHaveAttribute("data-selected-icon", "HomeIcon");

  const exportToggle = page.locator('[data-slot="toggle-group"]');
  await expect(exportToggle).toHaveCount(1);
  await exportToggle.getByRole("button", { name: "面型", exact: true }).click();
  await expect(trigger).toHaveAttribute("data-selected-icon", "HomeFilledIcon");

  await playground.getByRole("button", { name: "代码", exact: true }).click();
  await expect(playground.locator("pre code")).toContainText(
    'import { HomeFilledIcon } from "@/lib/icons"',
  );
});

test("state: Separator exposes orientation semantics and dimensions", async ({
  page,
}) => {
  await page.goto("/#separator");
  const playground = page.locator("#separator-playground");
  const orientationControl = playground.locator("label").filter({ hasText: "方向" }).locator("..");

  await orientationControl.getByRole("button", { name: "水平", exact: true }).click();
  const horizontal = playground.locator('[data-slot="separator"]').first();
  await expect(horizontal).toHaveRole("separator");
  await expect(horizontal).toHaveAttribute("aria-orientation", "horizontal");
  await expect(horizontal).toHaveAttribute("data-orientation", "horizontal");
  await expect(horizontal).toHaveCSS("height", "1px");

  await orientationControl.getByRole("button", { name: "垂直", exact: true }).click();
  const vertical = playground.locator('[data-slot="separator"]').first();
  await expect(vertical).toHaveRole("separator");
  await expect(vertical).toHaveAttribute("aria-orientation", "vertical");
  await expect(vertical).toHaveAttribute("data-orientation", "vertical");
  await expect(vertical).toHaveCSS("width", "1px");
});

for (const component of qualityManifest.components.filter(
  (entry) => entry.interaction === "interactive",
)) {
  test(`behavior: ${component.name} keyboard focus`, async ({ page }) => {
    const visual = visualFor(component.name);
    test.skip(!visual, `No manifest visual route for ${component.name}`);

    await page.goto(`/${visual!.route}`);
    const surface =
      component.name === "WebsiteRulePanel"
        ? page.getByRole("button", { name: "查看规则" }).first()
        : page.locator(visual!.selector).first();
    await expect(surface).toBeVisible();

    const isFocusable = await surface.evaluate((element) => {
      const node = element as HTMLElement;
      return node.matches(
        "button, a[href], input, textarea, select, [tabindex]:not([tabindex='-1'])",
      );
    });
    const target = isFocusable
      ? surface
      : surface
          .locator(
            "button, a[href], input, textarea, select, [tabindex]:not([tabindex='-1'])",
          )
          .filter({ visible: true })
          .first();
    await expect(target).toBeVisible();
    await expect(target).toBeEnabled();
    await target.focus();
    await expect(target).toBeFocused();

    await page.keyboard.press("Tab");
    await expect
      .poll(() =>
        page.evaluate(() => document.activeElement?.tagName ?? "BODY"),
      )
      .not.toBe("BODY");
  });
}

test("state: Button disabled loading", async ({ page }) => {
  await page.goto("/#button");
  const playground = page.locator("#playground");
  await expect(playground).toBeVisible();
  const previewButton = playground
    .locator('[data-slot="component-playground"] > div')
    .last()
    .getByRole("button")
    .first();
  const loadingControl = playground
    .locator("label")
    .filter({ hasText: "加载" })
    .locator("..");
  await loadingControl.getByRole("button", { name: "是", exact: true }).click();
  await expect(previewButton).toBeDisabled();
  await expect(
    previewButton.getByRole("status", { name: "Loading" }),
  ).toBeVisible();
  await loadingControl.getByRole("button", { name: "否", exact: true }).click();
  const disabledControl = playground
    .locator("label")
    .filter({ hasText: "禁用" })
    .locator("..");
  await disabledControl
    .getByRole("button", { name: "是", exact: true })
    .click();
  await expect(previewButton).toBeDisabled();
});

test("state: Input disabled error", async ({ page }) => {
  await page.goto("/#input");
  const playground = page.locator("#input-playground");
  const preview = playground.locator('[data-slot="input-workbench-preview"]');
  const input = preview.locator('[data-slot="input"]');
  const disabledControl = playground
    .locator("label")
    .filter({ hasText: "禁用" })
    .locator("..");
  await disabledControl
    .getByRole("button", { name: "是", exact: true })
    .click();
  await expect(input).toBeDisabled();
  await disabledControl
    .getByRole("button", { name: "否", exact: true })
    .click();
  const invalidControl = playground
    .locator("label")
    .filter({ hasText: "报错" })
    .locator("..");
  await invalidControl.getByRole("button", { name: "是", exact: true }).click();
  await expect(input).toHaveAttribute("aria-invalid", "true");
});

test("state: Link real, disabled, and icon semantics", async ({ page }) => {
  await page.goto("/#link");
  const playground = page.locator("#link-playground");
  const previewLink = playground.locator('[data-slot="link"]');
  const disabledControl = playground
    .locator("label")
    .filter({ hasText: "禁用" })
    .locator("..");
  await disabledControl.getByRole("button", { name: "是", exact: true }).click();
  await expect(previewLink).not.toHaveAttribute("href");
  await expect(previewLink).toHaveAttribute("aria-disabled", "true");
  await expect(previewLink).toHaveAttribute("tabindex", "-1");
  await previewLink.click();
  await expect(previewLink).not.toHaveAttribute("data-activated");

  await disabledControl.getByRole("button", { name: "否", exact: true }).click();
  await expect(previewLink).toHaveAttribute("href", "#link");
  await previewLink.click();
  await expect(previewLink).toHaveAttribute("data-activated", "true");

  const iconControl = playground
    .locator("label")
    .filter({ hasText: "图标" })
    .locator("..");
  await iconControl.getByRole("button", { name: "前置", exact: true }).click();
  await expect(previewLink.locator('[data-icon="inline-start"]')).toHaveCount(1);
  await iconControl.getByRole("button", { name: "后置", exact: true }).click();
  await expect(previewLink.locator('[data-icon="inline-end"]')).toHaveCount(1);
});

test("state: Avatar fallback, sizes, presence, group, and composite contracts", async ({
  page,
}) => {
  await page.route("**/avatars/*.jpg", (route) => route.abort());
  await page.goto("/#avatar");
  const playground = page.locator("#avatar-playground");
  const stories = playground.locator(
    '[data-slot="component-playground-stories"]',
  );
  const control = (label: string) =>
    playground.locator("label").filter({ hasText: label }).locator("..");

  await stories.getByRole("button", { name: "单个头像", exact: true }).click();
  const avatar = playground.locator('[data-slot="avatar"]').last();
  const fallback = avatar.locator('[data-slot="avatar-fallback"]');
  await expect(fallback).toBeVisible();

  await control("内容").getByRole("button", { name: "文字", exact: true }).click();
  await expect(fallback).toHaveText("陈昊");

  for (const [label, pixels] of [
    ["超小20", 20],
    ["小24", 24],
    ["默认32", 32],
    ["大40", 40],
    ["超大48", 48],
  ] as const) {
    await control("尺寸").getByRole("button", { name: label, exact: true }).click();
    await expect(avatar).toHaveCSS("width", `${pixels}px`);
    await expect(avatar).toHaveCSS("height", `${pixels}px`);
  }

  for (const [label, status] of [
    ["在线", "online"],
    ["离开", "away"],
    ["忙碌", "busy"],
    ["离线", "offline"],
  ] as const) {
    await control("状态").getByRole("button", { name: label, exact: true }).click();
    await expect(avatar.locator('[data-slot="avatar-badge"]')).toHaveAttribute(
      "data-status",
      status,
    );
  }

  await stories.getByRole("button", { name: "头像组", exact: true }).click();
  const overflow = playground.getByRole("button", { name: /剩余成员/ });
  await expect(overflow).toHaveText("+3");
  await overflow.focus();
  await expect(overflow).toBeFocused();

  await stories.getByRole("button", { name: "群聊拼接", exact: true }).click();
  const composite = playground.locator('[data-slot="avatar-composite"]');
  for (const [label, count] of [
    ["2 个", "2"],
    ["3 个", "3"],
    ["4 个", "4"],
  ] as const) {
    await control("拼接数量").getByRole("button", { name: label, exact: true }).click();
    await expect(composite).toHaveAttribute("data-count", count);
    await expect(composite.locator('[data-slot="avatar-composite-cell"]')).toHaveCount(
      Number(count),
    );
  }

  for (const [label, pixels] of [
    ["默认32", 32],
    ["大40", 40],
    ["超大48", 48],
  ] as const) {
    await control("尺寸").getByRole("button", { name: label, exact: true }).click();
    await expect(composite).toHaveCSS("width", `${pixels}px`);
    await expect(composite).toHaveCSS("height", `${pixels}px`);
  }
  await expect(control("尺寸").getByRole("button", { name: "超小20", exact: true })).toHaveCount(0);
  await expect(control("尺寸").getByRole("button", { name: "小24", exact: true })).toHaveCount(0);
});

test("state: Link size variants use distinct typography tokens", async ({ page }) => {
  await page.goto("/#link");
  const playground = page.locator("#link-playground");
  const previewLink = playground.locator('[data-slot="link"]');
  const sizeControl = playground
    .locator("label")
    .filter({ hasText: "尺寸" })
    .locator("..");

  await sizeControl.getByRole("button", { name: "小12", exact: true }).click();
  await expect(previewLink).toHaveCSS("font-size", "12px");
  await sizeControl.getByRole("button", { name: "默认14", exact: true }).click();
  await expect(previewLink).toHaveCSS("font-size", "14px");
  await sizeControl.getByRole("button", { name: "大16", exact: true }).click();
  await expect(previewLink).toHaveCSS("font-size", "16px");
});

test("state: Card interactive render semantics", async ({ page }) => {
  await page.goto("/#card");
  const playground = page.locator("#card-playground");
  const stories = playground.locator(
    '[data-slot="component-playground-stories"]',
  );

  await stories.getByRole("button", { name: "整卡跳转", exact: true }).click();
  const linkCard = playground.locator('[data-card-interactive="link"]');
  await expect(linkCard).toHaveRole("link");
  await linkCard.focus();
  await expect(linkCard).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#card-props$/);

  await page.goto("/#card");
  await stories.getByRole("button", { name: "整卡操作", exact: true }).click();
  const buttonCard = playground.locator('[data-card-interactive="button"]');
  await expect(buttonCard).toHaveRole("button");
  await buttonCard.focus();
  await expect(buttonCard).toBeFocused();
  await page.keyboard.press("Space");
  await expect(buttonCard).toHaveAttribute("data-activated", "true");
});

test("state: CardMedia is a first-child structural media slot", async ({ page }) => {
  await page.goto("/#card");
  const playground = page.locator("#card-playground");
  await playground
    .locator('[data-slot="component-playground-stories"]')
    .getByRole("button", { name: "媒体内容", exact: true })
    .click();

  const card = playground.locator('[data-slot="card"]').first();
  const media = card.locator('[data-slot="card-media"]');
  await expect(media).toBeVisible();
  await expect(media).toHaveAttribute("data-slot", "card-media");
  await expect(media.locator("img")).toHaveAttribute("alt", "客户会话预览");
  await expect(card.locator(":scope > :first-child")).toHaveAttribute(
    "data-slot",
    "card-media",
  );
});

test("state: Table sorting filtering and selection semantics", async ({
  page,
}) => {
  await page.goto("/#table");
  const playground = page.locator("#table-playground");
  const stories = playground.locator(
    '[data-slot="component-playground-stories"]',
  );
  await stories
    .getByRole("button", { name: "业务资源列表", exact: true })
    .click();

  const amountHeader = playground.getByRole("columnheader", { name: /金额/ });
  const sortButton = amountHeader.getByRole("button", { name: /金额/ });
  await expect(amountHeader).toHaveAttribute("aria-sort", "none");
  await sortButton.focus();
  await expect(sortButton).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(amountHeader).toHaveAttribute("aria-sort", "ascending");

  const filterButton = playground.getByLabel("列筛选", { exact: true });
  await filterButton.focus();
  await expect(filterButton).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByPlaceholder("在筛选项中搜索")).toBeVisible();
  await page.keyboard.press("Escape");

  const rowCheckbox = playground
    .getByRole("checkbox", { name: /^选择 / })
    .first();
  await rowCheckbox.click();
  await expect(rowCheckbox.locator("xpath=ancestor::tr")).toHaveAttribute(
    "data-state",
    "selected",
  );
});

test("state: Tabs vertical keyboard navigation keeps disabled tabs inactive", async ({
  page,
}) => {
  await page.goto("/#tabs");
  const playground = page.locator("#tabs-playground");
  const stories = playground.locator(
    '[data-slot="component-playground-stories"]',
  );
  await stories
    .getByRole("button", { name: "垂直设置导航", exact: true })
    .click();

  const profile = playground.getByRole("tab", { name: "个人资料" });
  const security = playground.getByRole("tab", { name: "安全设置" });
  const notifications = playground.getByRole("tab", { name: "通知" });
  await expect(profile).toHaveAttribute("aria-selected", "true");
  await expect(notifications).toBeDisabled();

  await profile.focus();
  await page.keyboard.press("ArrowDown");
  await expect(security).toBeFocused();
  await expect(security).toHaveAttribute("aria-selected", "true");

  await page.keyboard.press("ArrowDown");
  await expect(notifications).toBeFocused();
  await expect(notifications).toHaveAttribute("aria-selected", "false");

  await page.keyboard.press("ArrowDown");
  await expect(profile).toBeFocused();
  await expect(profile).toHaveAttribute("aria-selected", "true");
});

test("state: Select search, error, and disabled", async ({ page }) => {
  await page.goto("/#select");
  let playground = page.locator("#select-playground");
  await expect(
    playground.locator('[data-slot="select-value"]'),
  ).toHaveText("请选择角色");
  const searchControl = playground
    .locator("label")
    .filter({ hasText: "搜索" })
    .locator("..");
  await searchControl.getByRole("button", { name: "有", exact: true }).click();
  await playground.locator('[data-slot="select-trigger"]').click();
  const search = page.getByPlaceholder("搜索选项", { exact: true });
  await search.fill("成员");
  await expect(page.getByRole("option", { name: "成员", exact: true })).toBeVisible();
  await expect(page.getByRole("option", { name: "管理员", exact: true })).toHaveCount(0);
  await search.fill("不存在");
  await expect(page.getByText("无匹配结果", { exact: true })).toBeVisible();

  await page.reload();
  playground = page.locator("#select-playground");
  const semanticControl = playground
    .locator("label")
    .filter({ hasText: "状态" })
    .locator("..");
  await semanticControl.getByRole("button", { name: "报错", exact: true }).click();
  await expect(
    playground.locator('[data-slot="select-trigger"]'),
  ).toHaveAttribute("aria-invalid", "true");
  await expect(
    playground.locator('[data-slot="select-value"]'),
  ).toHaveText("请选择角色");
  await semanticControl.getByRole("button", { name: "禁用", exact: true }).click();
  await expect(
    playground.locator('[data-slot="select-trigger"]'),
  ).toBeDisabled();
});

test("state: TimePicker wheel supports seconds and confirm", async ({ page }) => {
  await page.goto("/#time-picker");
  const playground = page.locator("#time-picker-playground");
  await playground.getByRole("button", { name: "任意时间", exact: true }).click();
  await playground.getByRole("button", { name: "时:分:秒", exact: true }).click();
  await playground.getByRole("button", { name: "请选择时间", exact: true }).click();

  const lists = page.getByRole("listbox");
  const listCount = await lists.count();
  expect(listCount).toBe(3);
  await lists.nth(0).getByRole("option", { name: "17", exact: true }).click();
  await lists.nth(1).getByRole("option", { name: "10", exact: true }).click();
  await lists.nth(2).getByRole("option", { name: "33", exact: true }).click();
  await page.getByRole("button", { name: "确定", exact: true }).click();
  await expect(playground.locator('[data-slot="time-picker-value"]')).toHaveText("17:10:33");
});

test("state: TimePicker trigger uses 8px horizontal spacing", async ({ page }) => {
  await page.goto("/#time-picker");
  const trigger = page.locator('#time-picker-playground [data-slot="time-picker"]');

  await expect(trigger).toHaveCount(1);
  await expect(trigger).toHaveCSS("padding-left", "8px");
  await expect(trigger).toHaveCSS("padding-right", "8px");
  await expect(trigger).toHaveCSS("gap", "8px");
});

test("state: data entry controls use 8px control spacing", async ({ page }) => {
  await page.goto("/#input");
  const input = page.locator('#input-playground [data-slot="input-workbench-preview"] [data-slot="input"]');
  await expect(input).toHaveCount(1);
  await expect(input).toHaveCSS("padding-left", "8px");
  await expect(input).toHaveCSS("padding-right", "8px");

  await page.goto("/#select");
  const select = page.locator('#select-playground [data-slot="select-trigger"]');
  await expect(select).toHaveCount(1);
  await expect(select).toHaveCSS("padding-left", "8px");
  await expect(select).toHaveCSS("padding-right", "8px");
  await expect(select).toHaveCSS("gap", "8px");

  await page.goto("/#date-picker");
  const datePicker = page.locator('#date-picker-playground [data-slot="date-picker"]');
  const dateTrigger = page.locator('#date-picker-playground [data-slot="date-picker-trigger"]');
  await expect(datePicker).toHaveCount(1);
  await expect(datePicker).toHaveCSS("padding-left", "8px");
  await expect(datePicker).toHaveCSS("padding-right", "8px");
  await expect(datePicker).toHaveCSS("gap", "8px");
  await expect(dateTrigger).toHaveCSS("gap", "8px");

  await page.goto("/#textarea");
  const textarea = page.locator('#textarea-playground [data-slot="textarea"]');
  await expect(textarea).toHaveCount(1);
  await expect(textarea).toHaveCSS("padding-left", "8px");
  await expect(textarea).toHaveCSS("padding-right", "8px");
});

test("state: DatePicker range uses one trigger and one calendar popover", async ({ page }) => {
  await page.goto("/#date-picker");
  const playground = page.locator("#date-picker-playground");
  await playground.getByRole("button", { name: "日期范围", exact: true }).click();

  await expect(playground.locator('[data-slot="date-picker"]')).toHaveCount(1);
  const trigger = playground.locator('[data-slot="date-picker-trigger"]');
  await expect(trigger).toHaveCount(1);
  await trigger.click();
  await expect(page.locator('[data-slot="calendar"]')).toHaveCount(1);
});

test("state: DatePicker range stays open while replacing an existing range", async ({ page }) => {
  await page.goto("/#date-picker");
  const playground = page.locator("#date-picker-playground");
  await playground.getByRole("button", { name: "日期范围", exact: true }).click();

  const trigger = playground.locator('[data-slot="date-picker-trigger"]');
  await trigger.click();
  const calendar = page.locator('[data-slot="calendar"]');
  const replacementDate = calendar.locator('[data-day="2026/7/25"]');
  await expect(replacementDate).toHaveCount(1);
  await calendar.locator('[data-day="2026/7/15"]').click();
  await calendar.locator('[data-day="2026/7/21"]').click();
  await expect(playground.locator('[data-slot="date-picker-value"]')).toContainText("2026/07/15");
  await expect(playground.locator('[data-slot="date-picker-value"]')).toContainText("2026/07/21");
  await replacementDate.click();
  await expect(calendar).toBeVisible();
  await expect(playground.locator('[data-slot="date-picker-value"]')).toContainText("2026/07/25");
  await expect(playground.locator('[data-slot="date-picker-value"]')).toContainText("结束日期");
});

test("state: Calendar defaults to Chinese locale", async ({ page }) => {
  await page.goto("/#date-picker");
  const playground = page.locator("#date-picker-playground");
  await playground.locator('[data-slot="date-picker-trigger"]').click();

  const calendar = page.locator('[data-slot="calendar"]');
  await expect(calendar.getByRole("status")).toHaveText("2026年7月");
  await expect(calendar.getByRole("status")).toHaveCSS("font-size", "14px");
  await expect(calendar.getByRole("grid", { name: "七月 2026", exact: true })).toHaveCount(1);
  const today = calendar.locator('[data-today="true"]');
  await expect(today).toHaveCount(1);
  expect(await today.getAttribute("class")).toContain("border-primary");
});

test("state: date controls reveal their clear action on hover", async ({ page }) => {
  await page.goto("/#date-picker");
  const datePlayground = page.locator("#date-picker-playground");
  const datePicker = datePlayground.locator('[data-slot="date-picker"]');
  const dateClear = datePicker.locator('[data-slot="date-picker-clear"]');
  await datePicker.locator('[data-slot="date-picker-trigger"]').click();
  await page.getByRole("button", { name: "2026年7月15日 星期三", exact: true }).click();
  await expect(dateClear).toBeHidden();
  await datePicker.hover();
  await expect(dateClear).toBeVisible();

  await page.goto("/#date-time-picker");
  const dateTimePlayground = page.locator("#date-time-picker-playground");
  const dateTimePicker = dateTimePlayground.locator('[data-slot="date-time-picker"]');
  const dateTimeClear = dateTimePicker.locator('[data-slot="date-time-picker-clear"]');
  await dateTimePicker.locator('[data-slot="date-time-picker-trigger"]').click();
  await page.getByRole("button", { name: "2026年7月15日 星期三", exact: true }).click();
  await expect(dateTimeClear).toBeHidden();
  await dateTimePicker.hover();
  await expect(dateTimeClear).toBeVisible();
});

test("state: DateTimePicker keeps its trigger in sync while selecting", async ({ page }) => {
  await page.goto("/#date-time-picker");
  const playground = page.locator("#date-time-picker-playground");
  const trigger = playground.locator('[data-slot="date-time-picker-trigger"]');
  await expect(trigger).toHaveCount(1);
  await trigger.click();

  await expect(page.locator('[data-slot="date-time-picker-panel"]')).toHaveCount(1);
  await expect(page.locator('[data-slot="calendar"]')).toHaveCount(1);
  const timePanel = page.locator('[data-slot="date-time-picker-time-panel"]');
  await expect(timePanel).toHaveCount(1);
  await page.waitForTimeout(120);
  const panelsAreAligned = await timePanel.evaluate((node) => {
    const calendarNode = node.parentElement?.querySelector('[data-slot="calendar"]');
    if (!calendarNode) return false;
    const timePanelRect = node.getBoundingClientRect();
    const calendarRect = calendarNode.getBoundingClientRect();
    return Math.abs(calendarRect.height - timePanelRect.height) <= 16;
  });
  expect(panelsAreAligned).toBe(true);
  const wheelsFillPanel = await timePanel.evaluate((node) => {
    const panelRect = node.getBoundingClientRect();
    const listboxes = [...node.querySelectorAll('[role="listbox"]')];
    return listboxes.length === 3 && listboxes.every((listbox) => {
      const listboxRect = listbox.getBoundingClientRect();
      return Math.abs(panelRect.bottom - listboxRect.bottom - 8) < 1;
    });
  });
  expect(wheelsFillPanel).toBe(true);
  await page.getByRole("button", { name: "2026年7月15日 星期三", exact: true }).click();
  const lists = page.getByRole("listbox");
  await expect(lists).toHaveCount(3);
  await lists.nth(0).getByRole("option", { name: "17", exact: true }).click();
  await lists.nth(1).getByRole("option", { name: "10", exact: true }).click();
  await lists.nth(2).getByRole("option", { name: "33", exact: true }).click();
  await expect(playground.locator('[data-slot="date-time-picker-value"]')).toHaveText(/2026\/07\/15 17:10:33/);
  await page.getByRole("button", { name: "确定", exact: true }).click();
  await expect(playground.locator('[data-slot="date-time-picker-value"]')).toHaveText(/2026\/07\/15 17:10:33/);
});

test("state: DateTimePicker cancel restores the value from before the panel opened", async ({ page }) => {
  await page.goto("/#date-time-picker");
  const playground = page.locator("#date-time-picker-playground");
  const trigger = playground.locator('[data-slot="date-time-picker-trigger"]');
  await trigger.click();

  await page.getByRole("button", { name: "2026年7月15日 星期三", exact: true }).click();
  await page.getByRole("button", { name: "确定", exact: true }).click();
  await trigger.click();
  await page.getByRole("listbox").nth(0).getByRole("option", { name: "17", exact: true }).click();
  await expect(playground.locator('[data-slot="date-time-picker-value"]')).toHaveText(/17:00:00/);
  await page.getByRole("button", { name: "取消", exact: true }).click();
  await expect(playground.locator('[data-slot="date-time-picker-value"]')).toHaveText(/00:00:00/);
});

test("state: DateTimePicker uses four arrow buttons for calendar navigation", async ({ page }) => {
  await page.goto("/#date-time-picker");
  const playground = page.locator("#date-time-picker-playground");
  const trigger = playground.locator('[data-slot="date-time-picker-trigger"]');
  await expect(trigger).toHaveCount(1);
  await trigger.click();

  const calendar = page.locator('[data-slot="calendar"]');
  await expect(calendar.getByRole("button", { name: "上一年", exact: true })).toHaveCount(1);
  await expect(calendar.getByRole("button", { name: "上一月", exact: true })).toHaveCount(1);
  await expect(calendar.getByRole("button", { name: "下一月", exact: true })).toHaveCount(1);
  await expect(calendar.getByRole("button", { name: "下一年", exact: true })).toHaveCount(1);
  const navigation = calendar.locator("nav");
  await expect(navigation).toHaveCount(1);
  await expect(navigation).toHaveCSS("height", "28px");
  const navigationAligned = await navigation.evaluate((node) => {
    const caption = node.parentElement?.querySelector(".rdp-month_caption");
    if (!caption) return false;
    const navRect = node.getBoundingClientRect();
    const captionRect = caption.getBoundingClientRect();
    return Math.abs(navRect.top + navRect.height / 2 - (captionRect.top + captionRect.height / 2)) < 0.1;
  });
  expect(navigationAligned).toBe(true);
  const navigationButtons = calendar.locator('[data-variant="plain"]');
  await expect(navigationButtons).toHaveCount(4);
  for (const index of [0, 1, 2, 3]) {
    await expect(navigationButtons.nth(index)).toHaveCSS("width", "16px");
    await expect(navigationButtons.nth(index)).toHaveCSS("height", "16px");
    await expect(navigationButtons.nth(index)).toHaveCSS("gap", "0px");
  }
  await expect(calendar.getByRole("combobox")).toHaveCount(0);

  await calendar.getByRole("button", { name: "下一月", exact: true }).click();
  await expect(calendar.getByRole("grid", { name: "八月 2026", exact: true })).toHaveCount(1);
  await calendar.getByRole("button", { name: "下一年", exact: true }).click();
  await expect(calendar.getByRole("grid", { name: "八月 2027", exact: true })).toHaveCount(1);
});

test("state: DateTimePicker range edits start and end in sequence", async ({ page }) => {
  await page.goto("/#date-time-picker");
  const playground = page.locator("#date-time-picker-playground");
  await playground.getByRole("button", { name: "日期时间范围", exact: true }).click();

  const trigger = playground.locator('[data-slot="date-time-picker-trigger"]');
  await expect(trigger).toHaveCount(1);
  await trigger.click();
  await expect(page.locator('[data-slot="calendar"]')).toHaveCount(1);
  await expect(page.locator('[data-slot="date-time-picker-panel"]')).toHaveCount(1);
  const lists = page.getByRole("listbox");
  await expect(lists).toHaveCount(3);
  await page.getByRole("button", { name: "2026年7月15日 星期三", exact: true }).click();
  await lists.nth(0).getByRole("option", { name: "10", exact: true }).click();
  await page.getByRole("button", { name: "确定", exact: true }).click();
  await expect(page.locator('[data-slot="date-time-picker-panel"]')).toBeVisible();
  await expect(playground.locator('[data-slot="date-time-picker-value"]')).toContainText("2026/07/15 10:00:00");
  await expect(playground.locator('[data-slot="date-time-picker-value"]')).toContainText("结束日期时间");
  await page.getByRole("button", { name: "2026年7月21日 星期二", exact: true }).click();
  await lists.nth(0).getByRole("option", { name: "18", exact: true }).click();
  await page.getByRole("button", { name: "确定", exact: true }).click();
  await expect(page.locator('[data-slot="date-time-picker-panel"]')).toHaveCount(0);
  await expect(playground.locator('[data-slot="date-time-picker-value"]')).toHaveText(/2026\/07\/15 10:00:00.*2026\/07\/21 18:00:00/);
});

test("state: TimePicker range uses one trigger and one dual-wheel popover", async ({ page }) => {
  await page.goto("/#time-picker");
  const playground = page.locator("#time-picker-playground");
  await playground.getByRole("button", { name: "时间范围", exact: true }).click();

  const trigger = playground.locator('[data-slot="time-picker"]');
  await expect(trigger).toHaveCount(1);
  await trigger.click();

  const lists = page.getByRole("listbox");
  await expect(lists).toHaveCount(4);
  await lists.nth(0).getByRole("option", { name: "09", exact: true }).click();
  await lists.nth(1).getByRole("option", { name: "30", exact: true }).click();
  await lists.nth(2).getByRole("option", { name: "18", exact: true }).click();
  await lists.nth(3).getByRole("option", { name: "00", exact: true }).click();
  await page.getByRole("button", { name: "确定", exact: true }).click();
  await expect(playground.locator('[data-slot="time-picker-value"]')).toHaveText(/09:30.*18:00/);

  await playground.getByRole("button", { name: "固定间隔", exact: true }).click();
  await trigger.click();
  await expect(page.getByRole("button", { name: "取消", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "确定", exact: true })).toBeVisible();
});

test("state: Select clear-all appears on hover or focus", async ({ page }) => {
  await page.goto("/#select");
  const playground = page.locator("#select-playground");
  const typeControl = playground.locator("label").filter({ hasText: "类型" }).locator("..");
  await typeControl.getByRole("button", { name: "多选", exact: true }).click();
  const clearControl = playground.locator("label").filter({ hasText: "清除" }).locator("..");
  await clearControl.getByRole("button", { name: "有", exact: true }).click();
  await expect(playground.locator('[data-slot="component-playground-stories"]')).toHaveCount(0);

  const trigger = playground.locator('[data-slot="select-trigger"]');
  await trigger.click();
  await page.getByRole("option", { name: "管理员", exact: true }).click();

  const clearAll = playground.getByRole("button", {
    name: "清除选择",
    exact: true,
  });
  const selectControl = playground.locator('[data-slot="select-control"]');
  await expect(clearAll).toBeHidden();
  await selectControl.hover();
  await expect(clearAll).toBeVisible();
  await playground.locator('[data-slot="select-trigger"]').click();
  await expect(clearAll).toBeVisible();
});

test("state: Select multiple defaults to outline and scales value tags", async ({ page }) => {
  await page.goto("/#select");
  const playground = page.locator("#select-playground");
  const typeControl = playground.locator("label").filter({ hasText: "类型" }).locator("..");
  await typeControl.getByRole("button", { name: "多选", exact: true }).click();

  const trigger = playground.locator('[data-slot="select-trigger"]');
  await expect(trigger).toHaveAttribute("data-variant", "outline");
  const sizeControl = playground.locator("label").filter({ hasText: "尺寸" }).locator("..");
  await sizeControl.getByRole("button", { name: "超小24", exact: true }).click();
  await trigger.click();
  await page.getByRole("option", { name: "管理员", exact: true }).click();
  await page.getByRole("option", { name: "成员", exact: true }).click();
  await page.getByRole("option", { name: "审计员", exact: true }).click();
  await page.getByRole("option", { name: "访客", exact: true }).click();
  await page.keyboard.press("Escape");
  await page.waitForTimeout(100);
  const valueTags = trigger.locator('[data-slot="tag"]');
  await expect(valueTags).toHaveCount(4);
  await expect(valueTags).toHaveText(["管理员", "成员", "审计员", "访客"]);
  await expect(trigger.locator('[data-slot="select-overflow-count"]')).toHaveCount(0);
  await expect(valueTags.first()).toHaveCSS("height", "16px");
  await expect(valueTags.first()).toHaveCSS("font-size", "12px");
  await expect(valueTags.first().locator("svg")).toHaveCSS("width", "10px");
  await sizeControl.getByRole("button", { name: "默认28", exact: true }).click();
  await page.waitForTimeout(100);
  await expect(valueTags).toHaveCount(3);
  await expect(valueTags).toHaveText(["管理员", "成员", "审计员"]);
  await expect(trigger.locator('[data-slot="select-overflow-count"]')).toHaveText("+1");
  await expect(valueTags.first()).toHaveCSS("height", "20px");
  await expect(valueTags.first().locator("svg")).toHaveCSS("width", "12px");
  await sizeControl.getByRole("button", { name: "中32", exact: true }).click();
  await expect(valueTags).toHaveCount(2);
  await expect(valueTags).toHaveText(["管理员", "成员"]);
  await expect(trigger.locator('[data-slot="select-overflow-count"]')).toHaveText("+2");
  await expect(valueTags.first()).toHaveCSS("height", "24px");
  await expect(valueTags.first()).toHaveCSS("font-size", "14px");
  await expect(valueTags.first().locator("svg")).toHaveCSS("width", "14px");
  const mdVerticalGap = await trigger.evaluate((node) => {
    const tag = node.querySelector('[data-slot="tag"]');
    if (!tag) return null;
    const triggerRect = node.getBoundingClientRect();
    const tagRect = tag.getBoundingClientRect();
    return {
      top: tagRect.top - triggerRect.top,
      bottom: triggerRect.bottom - tagRect.bottom,
    };
  });
  expect(mdVerticalGap?.top).toBeCloseTo(4, 1);
  expect(mdVerticalGap?.bottom).toBeCloseTo(4, 1);
  await playground.evaluate((node) => node.style.setProperty("--fx-control-md-height", "30px"));
  await expect(trigger).toHaveCSS("height", "30px");
  await expect(valueTags.first()).toHaveCSS("height", "22px");
  const compactMdVerticalGap = await trigger.evaluate((node) => {
    const tag = node.querySelector('[data-slot="tag"]');
    if (!tag) return null;
    const triggerRect = node.getBoundingClientRect();
    const tagRect = tag.getBoundingClientRect();
    return {
      top: tagRect.top - triggerRect.top,
      bottom: triggerRect.bottom - tagRect.bottom,
    };
  });
  expect(compactMdVerticalGap?.top).toBeCloseTo(4, 1);
  expect(compactMdVerticalGap?.bottom).toBeCloseTo(4, 1);
  await sizeControl.getByRole("button", { name: "超小24", exact: true }).click();
  await sizeControl.getByRole("button", { name: "中32", exact: true }).click();
  await page.waitForTimeout(100);
  const compactOverflowBoundary = await trigger.locator('[data-slot="select-multi-value"]').evaluate((node) => {
    const lastItem = node.lastElementChild;
    if (!lastItem) return null;
    return {
      containerRight: node.getBoundingClientRect().right,
      lastItemRight: lastItem.getBoundingClientRect().right,
    };
  });
  expect(compactOverflowBoundary).not.toBeNull();
  expect(compactOverflowBoundary!.lastItemRight).toBeLessThanOrEqual(compactOverflowBoundary!.containerRight + 0.5);
  await playground.evaluate((node) => node.style.removeProperty("--fx-control-md-height"));
  await sizeControl.getByRole("button", { name: "超小24", exact: true }).click();
  await page.waitForTimeout(100);
  await expect(valueTags).toHaveCount(3);
  await expect(valueTags).toHaveText(["管理员", "成员", "审计员"]);
  await expect(trigger.locator('[data-slot="select-overflow-count"]')).toHaveText("+1");
});

test("state: Field invalid disabled", async ({ page }) => {
  await page.goto("/#field");
  const playground = page.locator("#field-playground");
  await playground
    .getByRole("button", { name: "报错字段", exact: true })
    .click();
  await expect(
    playground.locator('[data-slot="field"][data-invalid]'),
  ).toBeVisible();
  await expect(playground.locator('[data-slot="field-error"]')).toHaveAttribute(
    "role",
    "alert",
  );
  await playground
    .getByRole("button", { name: "禁用字段", exact: true })
    .click();
  await expect(
    playground.locator('[data-slot="field"][data-disabled]'),
  ).toBeVisible();
  await expect(playground.locator('[data-slot="field"] input')).toBeDisabled();
});

test("state: form control Field compositions preserve labels and semantics", async ({
  page,
}) => {
  await page.goto("/#checkbox");
  const checkboxPlayground = page.locator("#checkbox-playground");
  await expect(
    checkboxPlayground.getByRole("checkbox", { name: "同意条款", exact: true }),
  ).toBeVisible();
  await checkboxPlayground
    .getByRole("button", { name: "禁用状态", exact: true })
    .click();
  await expect(
    checkboxPlayground.getByRole("checkbox", { name: "不可编辑", exact: true }),
  ).toBeDisabled();

  await page.goto("/#switch");
  const switchPlayground = page.locator("#switch-playground");
  await expect(
    switchPlayground.getByRole("switch", { name: "接收消息通知", exact: true }),
  ).toBeVisible();
  await switchPlayground
    .getByRole("button", { name: "禁用状态", exact: true })
    .click();
  await expect(
    switchPlayground.getByRole("switch", {
      name: "该选项不可更改",
      exact: true,
    }),
  ).toBeDisabled();

  await page.goto("/#textarea");
  const textareaPlayground = page.locator("#textarea-playground");
  await textareaPlayground
    .getByRole("button", { name: "校验失败", exact: true })
    .click();
  await expect(
    textareaPlayground.getByRole("textbox", { name: "备注", exact: true }),
  ).toHaveAttribute("aria-invalid", "true");
  await expect(
    textareaPlayground.locator('[data-slot="field-error"]'),
  ).toHaveAttribute("role", "alert");

  await page.goto("/#radio-group");
  const radioPlayground = page.locator("#radio-group-playground");
  const crm = radioPlayground.getByRole("radio", { name: "CRM", exact: true });
  const bi = radioPlayground.getByRole("radio", { name: "BI", exact: true });
  await crm.focus();
  await page.keyboard.press("ArrowDown");
  await expect(bi).toBeFocused();
  await expect(bi).toBeChecked();
});

test("state: EditFormBlock validation focuses first error", async ({
  page,
}) => {
  await page.goto("/#template-edit-form");
  const block = page.locator('[data-slot="edit-form-block"]');
  await block.getByRole("button", { name: "保存", exact: true }).click();
  await expect(block.locator('[data-slot="field-error"]')).toHaveCount(2);
  await expect(block.locator("#edit-form-name")).toBeFocused();
});

test("state: Dialog open focus restore", async ({ page }) => {
  await page.goto("/#dialog");
  const playground = page.locator("#dialog-playground");
  const trigger = playground
    .getByRole("button", { name: "新建项目", exact: true })
    .first();
  await trigger.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByRole("dialog")).toHaveAttribute("data-size", "md");
  await expect(page.getByRole("dialog").getByRole("textbox")).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(trigger).toBeFocused();
});

test("state: AlertDialog closes on Escape and restores trigger focus", async ({
  page,
}) => {
  await page.goto("/#alert-dialog");
  const playground = page.locator("#alert-dialog-playground");
  const trigger = playground.getByRole("button", {
    name: "删除项目",
    exact: true,
  });
  await trigger.click();
  const dialog = page.getByRole("alertdialog");
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
});

test("state: Toast semantic feedback and undo action", async ({ page }) => {
  await page.goto("/#toast");
  const playground = page.locator("#toast-playground");
  await playground
    .getByRole("button", { name: "成功提示", exact: true })
    .click();
  await expect(page.getByText("已保存", { exact: true })).toBeVisible();
  await playground
    .locator('[data-slot="component-playground-stories"]')
    .getByRole("button", { name: "带撤销操作", exact: true })
    .click();
  await playground.getByRole("button", { name: "带撤销", exact: true }).click();
  const undo = page.getByRole("button", { name: "撤销", exact: true });
  await expect(undo).toBeVisible();
  await undo.click();
  await expect(page.getByText("已撤销", { exact: true })).toBeVisible();
});

test("state: Sheet side size and focus restore", async ({ page }) => {
  await page.goto("/#sheet");
  const playground = page.locator("#sheet-playground");
  const stories = playground.locator(
    '[data-slot="component-playground-stories"]',
  );
  await stories
    .getByRole("button", { name: "宽版高级配置", exact: true })
    .click();

  const trigger = playground.getByRole("button", {
    name: "高级配置",
    exact: true,
  });
  await trigger.click();
  const sheet = page.getByRole("dialog");
  await expect(sheet).toBeVisible();
  await expect(sheet).toHaveAttribute("data-side", "right");
  await expect(sheet).toHaveAttribute("data-size", "lg");
  await expect(sheet.getByRole("textbox").first()).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(sheet).toHaveCount(0);
  await expect(trigger).toBeFocused();
});

test("state: Popover size and focus restore", async ({ page }) => {
  await page.goto("/#popover");
  const playground = page.locator("#popover-playground");
  const stories = playground.locator(
    '[data-slot="component-playground-stories"]',
  );
  await stories.getByRole("button", { name: "宽版筛选", exact: true }).click();

  const trigger = playground.getByRole("button", {
    name: "筛选条件",
    exact: true,
  });
  await trigger.click();
  const popover = page.locator('[data-slot="popover-content"]');
  await expect(popover).toBeVisible();
  await expect(popover).toHaveAttribute("data-size", "lg");
  await page.keyboard.press("Escape");
  await expect(popover).toHaveCount(0);
  await expect(trigger).toBeFocused();
});

test("state: DropdownMenu keyboard navigation and focus restore", async ({
  page,
}) => {
  await page.goto("/#dropdown-menu");
  const playground = page.locator("#dropdown-menu-playground");
  const stories = playground.locator(
    '[data-slot="component-playground-stories"]',
  );
  await stories.getByRole("button", { name: "有子级", exact: true }).click();

  const trigger = playground.getByRole("button", { name: "操作", exact: true });
  await trigger.focus();
  await page.keyboard.press("Enter");
  const menu = page.getByRole("menu").first();
  await expect(menu).toBeVisible();
  await expect(
    page.getByRole("menuitem", { name: "重命名", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("ArrowDown");
  await expect(
    page.getByRole("menuitem", { name: "移动到", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(menu).toHaveCount(0);
  await expect(trigger).toBeFocused();
});

test("website cards inherit the shared shadow token", async ({ page }) => {
  await page.goto("/#website-standards");
  const cards = page.locator("[data-website-card-container]");
  await expect(cards.first()).toBeVisible();
  const cardShadowState = await cards.evaluateAll((elements) =>
    elements.map((element) => {
      const node = element as HTMLElement;
      return {
        hasTokenClass: node.classList.contains("shadow-l1"),
        boxShadow: getComputedStyle(node).boxShadow,
      };
    }),
  );
  expect(cardShadowState.length).toBeGreaterThan(0);
  expect(
    cardShadowState.every(
      ({ hasTokenClass, boxShadow }) => hasTokenClass && boxShadow !== "none",
    ),
  ).toBe(true);
});
