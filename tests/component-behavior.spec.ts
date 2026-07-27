import { test, expect } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

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

test("state: Select loading error disabled", async ({ page }) => {
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
  const feedbackControl = playground
    .locator("label")
    .filter({ hasText: "选项状态" })
    .locator("..");
  await feedbackControl.getByRole("button", { name: "加载", exact: true }).click();
  await playground.locator('[data-slot="select-trigger"]').click();
  await expect(page.getByText("正在加载", { exact: true })).toBeVisible();

  await page.reload();
  playground = page.locator("#select-playground");
  const semanticControl = playground
    .locator("label")
    .filter({ hasText: "控件状态" })
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

test("state: Select clear-all stays visible while open", async ({ page }) => {
  await page.goto("/#select");
  const playground = page.locator("#select-playground");
  const singlePreset = playground.getByRole("button", { name: "单选", exact: true }).first();
  await singlePreset.click();
  const appearanceControl = playground
    .locator("label")
    .filter({ hasText: "外观" })
    .locator("..");
  await appearanceControl.getByRole("button", { name: "无边框", exact: true }).click();
  await expect(singlePreset).toHaveClass(/bg-card/);

  await playground.getByRole("button", { name: "多选", exact: true }).first().click();

  const clearAll = playground.getByRole("button", {
    name: "清除选择",
    exact: true,
  });
  await expect(clearAll).toBeVisible();
  await playground.locator('[data-slot="select-trigger"]').click();
  await expect(clearAll).toBeVisible();
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
