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

test("navigation: direct hash resolves the registered documentation page", async ({
  page,
}) => {
  await page.goto("/#tokens-colors");

  await expect(page).toHaveURL(/#tokens-colors$/);
  await expect(
    page.getByRole("heading", { name: "颜色", exact: true }),
  ).toBeVisible();
});

test("navigation: page builder is a top-level workspace beside Pages", async ({
  page,
}) => {
  await page.goto("/#page-builder");
  const headerNav = page.locator("header nav");
  await expect(
    headerNav.getByRole("link", { name: "页面", exact: true }),
  ).toBeVisible();
  await expect(
    headerNav.getByRole("link", { name: "搭建器", exact: true }),
  ).toHaveClass(/border-primary/);
  await expect(page.locator("#page-builder-workspace")).toBeVisible();
  await expect(page.locator('[data-slot="docs-sidebar"]')).toBeHidden();
  await expect(page.locator("#page-builder")).toHaveCount(0);
});

test("component page headings use the shared Chinese and English title pair", async ({
  page,
}) => {
  const componentItems = componentIndexSections.flatMap(
    (section) => section.items,
  );

  for (const item of componentItems) {
    await page.goto(`/${item.href}`);
    await expect(page.locator('[data-slot="page-lead-title"]')).toHaveText(
      item.label,
    );
    await expect(page.locator('[data-slot="page-lead-title-meta"]')).toHaveText(
      item.labelEn,
    );
  }
});

test("navigation: command palette search selects a hash route", async ({
  page,
}) => {
  await page.goto("/#intro");
  await page.getByRole("button", { name: "搜索文档" }).first().click();

  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await dialog.getByPlaceholder("搜索文档").fill("颜色");
  await dialog.getByRole("button", { name: /颜色/ }).first().click();

  await expect(page).toHaveURL(/#tokens-colors$/);
  await expect(
    page.getByRole("heading", { name: "颜色", exact: true }),
  ).toBeVisible();
});

test("state: customer list calibration only exposes declared frame and density variants", async ({
  page,
}) => {
  await page.goto("/#customer-list-calibration");

  const playground = page.locator("#customer-list-calibration-playground");
  const shell = playground.locator('[data-slot="crm-app-shell"]');
  const table = playground.locator('[data-slot="table"]');

  await expect(shell).toHaveAttribute("data-frame", "inset");
  await expect(table).toHaveAttribute("data-density", "default");

  await playground
    .getByRole("button", { name: "连续工作区", exact: true })
    .click();
  await expect(shell).toHaveAttribute("data-frame", "continuous");

  await playground.getByRole("button", { name: "紧凑", exact: true }).click();
  await expect(table).toHaveAttribute("data-density", "compact");
});

test("state: page builder only edits registered customer-list slots and properties", async ({
  page,
}) => {
  await page.goto("/#page-builder");

  const workspace = page.locator("#page-builder-workspace");
  const preview = workspace.locator('[data-slot="page-builder-preview"]');
  const builderHeader = workspace.locator('[data-slot="page-builder-header"]');
  await expect(builderHeader).toHaveCSS(
    "background-color",
    "rgb(255, 255, 255)",
  );
  await expect(builderHeader).toHaveCSS("border-bottom-width", "1px");
  await expect(builderHeader).toHaveCSS("border-bottom-style", "solid");
  await expect(
    builderHeader.getByRole("group", { name: "预览设备" }),
  ).toHaveCount(1);
  await expect(workspace.getByText("页面预览", { exact: true })).toHaveCount(0);
  await expect(preview).toHaveAttribute("data-preview-viewport", "web");
  await workspace.getByRole("button", { name: "移动端", exact: true }).click();
  await expect(preview).toHaveAttribute("data-preview-viewport", "mobile");
  await expect(preview).toHaveCSS("width", "390px");
  await workspace.getByRole("button", { name: "WEB端", exact: true }).click();
  await expect(preview).toHaveAttribute("data-preview-viewport", "web");
  const shell = preview.locator('[data-slot="crm-app-shell"]');
  await expect(shell).toHaveAttribute("data-frame", "inset");
  await expect(shell).toHaveAttribute("data-shape", "square");
  await expect(shell).toHaveCSS("border-radius", "0px");
  await expect(shell).toHaveCSS("background-color", "rgb(239, 241, 243)");
  await expect(
    preview.locator('[data-slot="crm-app-shell-content"]'),
  ).toHaveCSS("background-color", "rgb(255, 255, 255)");
  await expect(preview.locator('[data-slot="table"]')).toHaveAttribute(
    "data-density",
    "default",
  );
  const topBarBlock = preview.locator('[data-builder-block="topbar"]');
  await topBarBlock.click();
  await expect(topBarBlock).toHaveAttribute("data-selected", "true");
  await expect(workspace.getByText("顶栏配置", { exact: true })).toBeVisible();
  await topBarBlock.getByRole("button", { name: "删除顶栏" }).click();
  await expect(preview.locator('[data-slot="top-bar"]')).toHaveCount(0);
  await workspace.getByRole("button", { name: "顶栏", exact: true }).click();
  await expect(preview.locator('[data-slot="top-bar"]')).toBeVisible();

  const navigationBlock = preview.locator('[data-builder-block="navigation"]');
  await navigationBlock.focus();
  await navigationBlock.press("Delete");
  await expect(
    preview.locator('[data-builder-block="navigation"]'),
  ).toHaveCount(0);
  await workspace
    .getByRole("button", { name: "侧边导航", exact: true })
    .click();
  await expect(
    preview.locator('[data-builder-block="navigation"]'),
  ).toBeVisible();

  const customerListBlock = preview.locator(
    '[data-builder-block="customer-list"]',
  );
  await customerListBlock.hover();
  await expect
    .poll(() =>
      customerListBlock.evaluate(
        (element) => getComputedStyle(element, "::after").boxShadow,
      ),
    )
    .not.toBe("none");
  await expect
    .poll(() =>
      customerListBlock.evaluate(
        (element) => getComputedStyle(element, "::before").height,
      ),
    )
    .toBe("2px");
  await expect
    .poll(() =>
      customerListBlock.evaluate(
        (element) => getComputedStyle(element, "::before").backgroundColor,
      ),
    )
    .not.toBe("rgba(0, 0, 0, 0)");
  await customerListBlock.click();
  await expect(customerListBlock).toHaveAttribute("data-selected", "true");
  await expect(
    workspace.getByText("客户列表配置", { exact: true }),
  ).toBeVisible();
  await expect(customerListBlock.locator('[data-slot="table"]')).toBeVisible();
  await expect(
    customerListBlock.locator('[data-slot="pagination"]'),
  ).toBeVisible();
  await customerListBlock.getByRole("button", { name: "删除客户列表" }).click();
  await expect(preview.locator('[data-slot="table"]')).toHaveCount(0);
  await expect(preview.locator('[data-slot="pagination"]')).toHaveCount(0);
  await workspace
    .getByRole("button", { name: "客户列表", exact: true })
    .click();
  await expect(preview.locator('[data-slot="table"]')).toBeVisible();
  await expect(preview.locator('[data-slot="pagination"]')).toBeVisible();
  await preview.locator('[data-builder-block="customer-list"]').focus();
  await preview.locator('[data-builder-block="customer-list"]').press("Delete");
  await expect(
    preview.locator('[data-builder-block="customer-list"]'),
  ).toHaveCount(0);
  await workspace
    .getByRole("button", { name: "客户列表", exact: true })
    .click();
  await workspace
    .getByRole("button", { name: "客户列表页", exact: true })
    .click();

  await workspace.getByRole("tab", { name: "交互" }).click();
  await workspace.getByRole("button", { name: "连续", exact: true }).click();
  await expect(preview.locator('[data-slot="crm-app-shell"]')).toHaveAttribute(
    "data-frame",
    "continuous",
  );
  for (const block of [
    "顶栏",
    "侧边导航",
    "页面头部",
    "筛选工具栏",
    "客户列表",
  ]) {
    await expect(
      workspace.getByRole("button", { name: `删除${block}` }),
    ).toBeEnabled();
  }

  await workspace.getByRole("button", { name: "删除筛选工具栏" }).click();
  await expect(
    preview.getByRole("button", { name: "筛选", exact: true }),
  ).toHaveCount(0);
  await workspace.getByRole("tab", { name: "添加" }).click();
  await workspace.getByRole("button", { name: "添加筛选工具栏" }).click();
  await expect(
    preview.getByRole("button", { name: "筛选", exact: true }),
  ).toHaveCount(1);

  for (const block of [
    "顶栏",
    "侧边导航",
    "页面头部",
    "筛选工具栏",
    "客户列表",
  ]) {
    await workspace.getByRole("button", { name: `删除${block}` }).click();
  }
  await expect(
    preview.getByText("当前插入区尚无区块", { exact: true }),
  ).toBeVisible();
});

test("state: component review validates an external Agent candidate before Playground", async ({
  page,
}) => {
  await page.goto("/#page-builder");
  const workspace = page.locator("#page-builder-workspace");
  await workspace.getByLabel("搭建模式").click();
  await page.getByRole("option", { name: "基础组件评审", exact: true }).click();

  const builder = workspace.locator('[data-slot="component-builder"]');
  const preview = builder.locator('[data-slot="candidate-live-preview"]');
  const stateMatrix = builder.locator('[data-slot="candidate-state-matrix"]');
  await expect(builder).toBeVisible();
  await expect(
    builder.getByRole("button", { name: "选择候选 主操作按钮 v1" }),
  ).toBeVisible();
  await expect(preview.getByRole("button", { name: "主要操作" })).toHaveAttribute(
    "data-variant",
    "default",
  );
  await expect(builder.locator('[data-slot="component-playground"]')).toHaveCount(0);
  await expect(stateMatrix.getByText("未暴露", { exact: true })).toBeVisible();

  await builder.getByLabel("预览文字").fill("提交审批");
  await expect(preview.getByRole("button", { name: "提交审批" })).toBeVisible();
  await builder.getByRole("combobox", { name: "外观变体" }).click();
  await page.getByRole("option", { name: "次级按钮", exact: true }).click();
  await expect(preview.getByRole("button", { name: "提交审批" })).toHaveAttribute(
    "data-variant",
    "secondary",
  );
  await workspace.getByRole("button", { name: "撤销", exact: true }).click();
  await expect(preview.getByRole("button", { name: "提交审批" })).toHaveAttribute(
    "data-variant",
    "default",
  );
  await workspace.getByRole("button", { name: "重做", exact: true }).click();
  await expect(preview.getByRole("button", { name: "提交审批" })).toHaveAttribute(
    "data-variant",
    "secondary",
  );

  await builder.getByRole("checkbox", { name: "前置图标" }).click();
  await expect(stateMatrix.getByText("未暴露", { exact: true })).toHaveCount(0);
  await builder.getByLabel("给外部 Agent 的修改要求").fill("补充图标间距说明");
  await builder.getByRole("button", { name: "生成返工任务" }).click();
  await expect(builder.getByText("返工任务已生成", { exact: true })).toBeVisible();
  await expect(builder.getByText(/尚未执行代码修改/)).toBeVisible();

  const approve = builder.getByRole("button", { name: "确认进入 Playground" });
  await expect(approve).toBeDisabled();
  await builder.getByRole("button", { name: "运行验收" }).click();
  await expect(builder.getByText("治理检查已通过", { exact: true })).toBeVisible();
  await expect(builder.locator('[data-slot="candidate-checks"]')).toContainText("通过");
  await expect(approve).toBeEnabled();
  await approve.click();
  await expect(builder.getByText("候选已确认", { exact: true })).toBeVisible();
  await expect(builder.getByText(/尚未直接覆盖组件源码/)).toBeVisible();
});

test("state: business component builder starts blank, groups components, and publishes", async ({
  page,
}) => {
  test.setTimeout(60_000);
  await page.goto("/#page-builder");
  const workspace = page.locator("#page-builder-workspace");
  await workspace.getByLabel("搭建模式").click();
  await page.getByRole("option", { name: "业务组件搭建", exact: true }).click();

  const builder = workspace.locator('[data-slot="business-component-builder"]');
  const preview = builder.locator('[data-slot="business-component-preview"]');
  await expect(builder).toBeVisible();
  await expect(preview.getByText("从空白开始", { exact: true })).toBeVisible();

  const library = builder.locator("aside").first();
  await expect(
    library.getByText("搜索全量组件", { exact: true }),
  ).toBeVisible();
  await expect(
    library.locator('[data-slot="component-search-results"]'),
  ).toHaveCount(0);
  await library.getByPlaceholder("搜索组件").fill("对话框");
  await expect(
    library.locator('[data-slot="unsupported-component-summary"]'),
  ).toContainText("匹配组件暂未支持直接搭建");
  await expect(library.getByText("需适配", { exact: true })).toHaveCount(0);
  await library.getByPlaceholder("搜索组件").fill("选择器");
  await library.getByRole("button", { name: /选择器.*可添加/ }).click();
  await expect(preview.locator('[data-slot="select-trigger"]')).toHaveCount(1);
  await library.getByPlaceholder("搜索组件").fill("Slider");
  await library.getByRole("button", { name: /滑块.*可添加/ }).click();
  await expect(preview.locator('[data-slot="slider"]')).toHaveCount(1);
  await library.getByPlaceholder("搜索组件").fill("按钮");
  await library.getByRole("button", { name: /^按钮 可添加$/ }).dragTo(preview);
  await library.getByPlaceholder("搜索组件").fill("输入框");
  await library.getByRole("button", { name: /输入框.*可添加/ }).click();
  await expect(preview.locator("[data-builder-node]")).toHaveCount(4);
  await workspace.getByRole("button", { name: "撤销", exact: true }).click();
  await expect(preview.locator("[data-builder-node]")).toHaveCount(3);
  await workspace.getByRole("button", { name: "重做", exact: true }).click();

  await preview.locator('[data-node-type="button"]').click();
  await preview
    .locator('[data-node-type="input"]')
    .click({ modifiers: ["Shift"] });
  await expect(
    builder.locator('[data-slot="canvas-selection-toolbar"]'),
  ).toContainText("已选 2 项");
  await builder
    .locator('[data-slot="canvas-selection-toolbar"]')
    .getByRole("button", { name: "成组", exact: true })
    .click();
  await expect(preview.locator('[data-node-type="group"]')).toHaveCount(1);
  await builder.getByRole("tab", { name: "图层", exact: true }).click();
  await expect(
    builder.locator('[data-slot="composition-layer-tree"]'),
  ).toContainText("组合 2");
  await builder.getByRole("tab", { name: "组件", exact: true }).click();
  await library.getByPlaceholder("搜索组件").fill("分割线");
  await library.getByRole("button", { name: /分割线/ }).click();
  await expect(preview.locator('[data-slot="separator"]')).toHaveCount(1);

  await preview.click({ position: { x: 500, y: 180 } });
  await builder.getByLabel("组件间隔").click();
  await page
    .getByRole("listbox")
    .getByRole("option", { name: "大", exact: true })
    .focus();
  await page.keyboard.press("Enter");
  await expect(builder.getByLabel("组件间隔")).toContainText("大");

  await builder.getByLabel("组件名称").fill("客户快捷操作");
  await workspace
    .getByRole("button", { name: "发布组件", exact: true })
    .click();
  await expect(
    builder.getByText("个人组件已发布", { exact: true }),
  ).toBeVisible();
  await builder.getByLabel("发布位置").click();
  await page.getByRole("option", { name: "业务组件", exact: true }).click();
  await workspace
    .getByRole("button", { name: "发布组件", exact: true })
    .click();
  await expect(
    builder.getByText("已提交业务组件审核", { exact: true }),
  ).toBeVisible();
  await preview
    .locator('[data-node-type="group"]')
    .click({ position: { x: 2, y: 2 } });
  await builder
    .getByRole("button", { name: "删除所选组件", exact: true })
    .click();
  await expect(preview.locator("[data-builder-node]")).toHaveCount(2);
  await workspace.getByRole("button", { name: "撤销", exact: true }).click();
  await expect(preview.locator('[data-node-type="group"]')).toHaveCount(1);
});

test("state: business component builder edits real instance properties and publishes public props", async ({
  page,
}) => {
  test.setTimeout(60_000);
  await page.goto("/#page-builder");
  const workspace = page.locator("#page-builder-workspace");
  await workspace.getByLabel("搭建模式").click();
  await page.getByRole("option", { name: "业务组件搭建", exact: true }).click();

  const builder = workspace.locator('[data-slot="business-component-builder"]');
  const preview = builder.locator('[data-slot="business-component-preview"]');
  const library = builder.locator("aside").first();
  await library.getByPlaceholder("搜索组件").fill("按钮");
  await library.getByRole("button", { name: /^按钮 可添加$/ }).click();
  await preview.locator('[data-node-type="button"]').click();

  const properties = builder.locator(
    '[data-slot="component-instance-properties"]',
  );
  await expect(properties).toContainText(
    "组件源：src/components/ui/button.tsx#Button",
  );
  await expect(properties).toContainText(
    "属性契约：docs/data/component-playgrounds.manifest.json#customPlaygrounds.button",
  );

  await properties.getByLabel("内容属性").fill("提交");
  await expect(
    preview.getByRole("button", { name: "提交", exact: true }),
  ).toBeVisible();
  await properties.getByLabel("类型属性").click();
  await page.getByRole("option", { name: "描边", exact: true }).click();
  await expect(properties.getByLabel("类型属性")).toContainText("描边");

  await properties
    .getByRole("checkbox", { name: /公开内容为业务 Prop/ })
    .first()
    .click();
  const publicProps = builder.locator(
    '[data-slot="business-component-public-props"]',
  );
  await expect(publicProps).toContainText("业务 Props");
  const publicName = publicProps.getByLabel("业务 Prop 名称 text");
  await expect(publicName).toHaveValue("buttonText");
  await publicName.fill("actionLabel");
  await expect(publicProps).toContainText("text · 默认 提交");

  await properties.getByLabel("内容属性").fill("确认提交");
  await expect(publicProps).toContainText("text · 默认 确认提交");
  await workspace.getByRole("button", { name: "撤销", exact: true }).click();
  await expect(publicProps).toContainText("text · 默认 提交");
  await expect(
    preview.getByRole("button", { name: "提交", exact: true }),
  ).toBeVisible();
  await workspace.getByRole("button", { name: "重做", exact: true }).click();
  await expect(publicProps).toContainText("text · 默认 确认提交");

  await builder.getByLabel("组件名称").fill("客户提交操作");
  await workspace
    .getByRole("button", { name: "发布组件", exact: true })
    .click();
  await expect(
    builder.getByText("个人组件已发布", { exact: true }),
  ).toBeVisible();
  const published = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("fx-ui:personal-components") ?? "[]"),
  );
  expect(published.at(-1)).toMatchObject({
    name: "客户提交操作",
    publicProps: [
      {
        name: "actionLabel",
        property: "text",
        type: "text",
        defaultValue: "确认提交",
      },
    ],
  });
});

test("state: page builder creates a blank page and adds the first registered block", async ({
  page,
}) => {
  await page.goto("/#page-builder");

  const workspace = page.locator("#page-builder-workspace");
  const preview = workspace.locator('[data-slot="page-builder-preview"]');
  await workspace
    .getByRole("button", { name: "增加空白页", exact: true })
    .click();

  await expect(
    preview.getByText("从空白页开始", { exact: true }),
  ).toBeVisible();
  await expect(preview.locator('[data-slot="crm-app-shell"]')).toHaveCount(0);
  await expect(
    workspace.getByRole("button", { name: "删除页面头部" }),
  ).toHaveCount(0);

  await preview.getByRole("button", { name: "手动搭建", exact: true }).click();
  await expect(
    preview.getByText("选择页面骨架", { exact: true }),
  ).toBeVisible();
  await preview.getByRole("button", { name: /单栏页面/ }).click();
  await expect(preview).toHaveAttribute("data-builder-stage", "editing");
  await expect(preview.getByText("主要内容", { exact: true })).toBeVisible();
  await workspace
    .getByRole("button", { name: "页面头部", exact: true })
    .click();
  await expect(preview.locator('[data-slot="crm-app-shell"]')).toBeVisible();
  await expect(preview).toContainText("未命名页面");
  await expect(
    workspace.getByRole("button", { name: "删除页面头部" }),
  ).toHaveCount(2);
});

test("state: page builder Agent operations share undo and redo history", async ({
  page,
}) => {
  await page.goto("/#page-builder");
  const workspace = page.locator("#page-builder-workspace");
  const preview = workspace.locator('[data-slot="page-builder-preview"]');
  await workspace
    .getByLabel("Agent 指令")
    .fill("标题改成重点客户，使用紧凑密度，隐藏筛选工具栏");
  await workspace.getByRole("button", { name: "Agent 生成" }).click();
  await expect(workspace.getByText(/Agent 将对.*执行/)).toBeVisible();
  await workspace
    .getByRole("button", { name: "应用修改", exact: true })
    .click();
  await expect(preview).toContainText("重点客户");
  await expect(preview.locator('[data-slot="table"]')).toHaveAttribute(
    "data-density",
    "compact",
  );
  await expect(
    workspace.getByRole("button", { name: "删除筛选工具栏" }),
  ).toHaveCount(0);
  await workspace.getByRole("button", { name: "撤销" }).click();
  await expect(preview).toContainText("客户");
  await workspace.getByRole("button", { name: "重做" }).click();
  await expect(preview).toContainText("重点客户");
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

test("state: IconPicker derives Figma runtime states from data and interaction", async ({
  page,
}) => {
  await page.goto("/#icon-picker");
  const playground = page.locator("#icon-picker-playground");
  const picker = playground.locator('[data-slot="icon-picker"]');
  const search = picker.getByRole("textbox", { name: "搜索图标名称或 ID" });

  await expect(picker).toHaveAttribute("data-mode", "select");
  await search.fill("用户");
  await expect(picker).toHaveAttribute("data-mode", "search");
  await search.press("Enter");
  await expect(picker.locator('[data-icon-value="user"]')).toHaveAttribute(
    "aria-pressed",
    "true",
  );

  await search.fill("");
  await picker.locator('[data-icon-value="home"]').focus();
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("Enter");
  await expect(picker.locator('[data-icon-value="user"]')).toHaveAttribute(
    "aria-pressed",
    "true",
  );

  await page.evaluate(() => {
    Math.random = () => 0.2;
  });
  await picker.getByRole("button", { name: "随机分配" }).click();
  await expect(picker.locator('[aria-pressed="true"]')).not.toHaveAttribute(
    "data-icon-value",
    "user",
  );

  await playground.getByRole("button", { name: "无结果", exact: true }).click();
  await expect(picker).toHaveAttribute("data-mode", "search-empty");
  await expect(picker.locator('[data-slot="icon-picker-empty"]')).toBeVisible();

  await playground.getByRole("button", { name: "加载中", exact: true }).click();
  await expect(picker).toHaveAttribute("data-mode", "loading");
  await expect(
    picker.locator('[data-slot="icon-picker-loading"]'),
  ).toBeVisible();

  await playground
    .getByRole("button", { name: "加载失败", exact: true })
    .click();
  await expect(picker).toHaveAttribute("data-mode", "error");
  await expect(picker.locator('[data-slot="icon-picker-error"]')).toBeVisible();
  await expect(picker.getByRole("button", { name: "刷新" })).toBeEnabled();

  await playground.getByRole("button", { name: "上传", exact: true }).click();
  await expect(picker).toHaveAttribute("data-mode", "upload");
  await expect(picker.getByRole("tab", { name: "自定义上传" })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await expect(picker.locator('input[type="file"]')).toBeEnabled();
});

test("state: Transfer selects, filters, moves, and exposes runtime semantics", async ({
  page,
}) => {
  await page.goto("/#transfer");
  const playground = page.locator("#transfer-playground");
  const transfer = playground.locator('[data-slot="transfer"]');
  const source = transfer.locator(
    '[data-slot="transfer-list"][data-direction="left"]',
  );
  const target = transfer.locator(
    '[data-slot="transfer-list"][data-direction="right"]',
  );

  await expect(source.locator('[data-slot="transfer-item"]')).toHaveCount(6);
  await source.locator('[data-key="product"]').click();
  await expect(source.locator('[data-key="product"]')).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await transfer.getByRole("button", { name: "移至目标列表" }).click();
  await expect(target.locator('[data-key="product"]')).toBeVisible();
  await expect(source.locator('[data-key="product"]')).toHaveCount(0);

  await playground.getByRole("button", { name: "开启", exact: true }).click();
  const sourceSearch = source.getByRole("textbox", { name: "可选部门搜索" });
  await sourceSearch.fill("研发");
  await expect(source.locator('[data-slot="transfer-item"]')).toHaveCount(1);
  await expect(source.locator('[data-key="engineering"]')).toBeVisible();

  await playground.getByRole("button", { name: "单向", exact: true }).click();
  await expect(transfer).toHaveAttribute("data-one-way", "true");
  await expect(
    transfer.getByRole("button", { name: "移回源列表" }),
  ).toHaveCount(0);

  await playground
    .getByRole("button", { name: "是", exact: true })
    .last()
    .click();
  await expect(transfer).toHaveAttribute("data-loading", "true");
  await expect(transfer.locator('[data-slot="transfer-loading"]')).toHaveCount(
    2,
  );

  await playground
    .getByRole("button", { name: "否", exact: true })
    .last()
    .click();
  await expect(transfer).not.toHaveAttribute("data-loading", "true");

  await playground.getByRole("button", { name: "错误", exact: true }).click();
  await expect(transfer).toHaveAttribute("data-status", "error");
});

test("state: ConditionBuilder edits rules and OR groups with runtime semantics", async ({
  page,
}) => {
  await page.goto("/#condition-builder");
  const playground = page.locator("#condition-builder-playground");
  const builder = playground.locator('[data-slot="condition-builder"]');

  await expect(builder.locator('[data-slot="condition-group"]')).toHaveCount(1);
  await expect(builder.locator('[data-slot="condition-rule"]')).toHaveCount(2);

  await builder
    .locator('[data-slot="condition-rule"]')
    .first()
    .locator('[data-slot="select-trigger"]')
    .first()
    .click();
  await page.getByRole("option", { name: "客户名称" }).click();
  const firstRule = builder.locator('[data-slot="condition-rule"]').first();
  await expect(
    firstRule.locator('[data-slot="select-trigger"]').nth(1),
  ).toContainText("包含");
  await expect(firstRule.locator('[data-slot="input"]')).toHaveValue("");
  await firstRule.locator('[data-slot="input"]').fill("科技");
  await expect(firstRule.locator('[data-slot="input"]')).toHaveValue("科技");

  await builder.getByRole("button", { name: "添加条件", exact: true }).click();
  await expect(builder.locator('[data-slot="condition-rule"]')).toHaveCount(3);

  await builder
    .locator('[data-slot="condition-rule"]')
    .last()
    .getByRole("button", { name: "删除条件" })
    .click();
  await expect(builder.locator('[data-slot="condition-rule"]')).toHaveCount(2);

  await builder
    .getByRole("button", { name: "添加条件组", exact: true })
    .click();
  await expect(builder.locator('[data-slot="condition-group"]')).toHaveCount(2);
  await expect(
    builder.locator('[data-slot="condition-builder-or"]'),
  ).toHaveCount(1);

  const exposed = builder
    .getByText("外露", { exact: true })
    .first()
    .locator("..")
    .getByRole("checkbox");
  await exposed.click();
  await expect(exposed).not.toBeChecked();

  await playground
    .getByRole("button", { name: "是", exact: true })
    .first()
    .click();
  await expect(builder).toHaveAttribute("data-disabled", "true");
  await expect(
    builder.getByRole("button", { name: "添加条件组" }),
  ).toBeDisabled();
});

test("state: Separator exposes orientation semantics and dimensions", async ({
  page,
}) => {
  await page.goto("/#separator");
  const playground = page.locator("#separator-playground");
  const orientationControl = playground
    .locator("label")
    .filter({ hasText: "方向" })
    .locator("..");

  await orientationControl
    .getByRole("button", { name: "水平", exact: true })
    .click();
  const horizontal = playground.locator('[data-slot="separator"]').first();
  await expect(horizontal).toHaveRole("separator");
  await expect(horizontal).toHaveAttribute("aria-orientation", "horizontal");
  await expect(horizontal).toHaveAttribute("data-orientation", "horizontal");
  await expect(horizontal).toHaveCSS("height", "1px");

  await orientationControl
    .getByRole("button", { name: "垂直", exact: true })
    .click();
  const vertical = playground.locator('[data-slot="separator"]').first();
  await expect(vertical).toHaveRole("separator");
  await expect(vertical).toHaveAttribute("aria-orientation", "vertical");
  await expect(vertical).toHaveAttribute("data-orientation", "vertical");
  await expect(vertical).toHaveCSS("width", "1px");
});

test("state: Slider exposes value shape, keyboard input, geometry, and disabled semantics", async ({
  page,
}) => {
  await page.goto("/#slider");
  const playground = page.locator("#slider-playground");
  const slider = playground.locator('[data-slot="slider"]').first();
  const track = slider.locator('[data-slot="slider-track"]');
  const thumb = slider.locator('[data-slot="slider-thumb"]').first();
  const input = thumb.locator('input[type="range"]');

  await expect(slider).toHaveAttribute("data-orientation", "horizontal");
  await expect(track).toHaveCSS("height", "6px");
  await expect(thumb).toHaveCSS("width", "16px");
  await expect(thumb).toHaveCSS("height", "16px");
  await expect(input).toHaveAccessibleName("完成度");
  await input.focus();
  await page.keyboard.press("ArrowRight");
  await expect(playground.locator("output")).toHaveText("21");

  await playground.getByRole("button", { name: "范围", exact: true }).click();
  await expect(slider.locator('[data-slot="slider-thumb"]')).toHaveCount(2);

  await playground.getByRole("button", { name: "垂直", exact: true }).click();
  await expect(slider).toHaveAttribute("data-orientation", "vertical");
  await expect(slider).toHaveCSS("height", "160px");

  await playground.getByRole("button", { name: "是", exact: true }).click();
  await expect(slider).toHaveAttribute("data-disabled", "");
  await expect(slider.locator('input[type="range"]').first()).toBeDisabled();
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
  await disabledControl
    .getByRole("button", { name: "是", exact: true })
    .click();
  await expect(previewLink).not.toHaveAttribute("href");
  await expect(previewLink).toHaveAttribute("aria-disabled", "true");
  await expect(previewLink).toHaveAttribute("tabindex", "-1");
  await previewLink.click();
  await expect(previewLink).not.toHaveAttribute("data-activated");

  await disabledControl
    .getByRole("button", { name: "否", exact: true })
    .click();
  await expect(previewLink).toHaveAttribute("href", "#link");
  await previewLink.click();
  await expect(previewLink).toHaveAttribute("data-activated", "true");

  const iconControl = playground
    .locator("label")
    .filter({ hasText: "图标" })
    .locator("..");
  await iconControl.getByRole("button", { name: "前置", exact: true }).click();
  await expect(previewLink.locator('[data-icon="inline-start"]')).toHaveCount(
    1,
  );
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

  await control("内容")
    .getByRole("button", { name: "文字", exact: true })
    .click();
  await expect(fallback).toHaveText("陈昊");

  for (const [label, pixels] of [
    ["超小20", 20],
    ["小24", 24],
    ["默认32", 32],
    ["大40", 40],
    ["超大48", 48],
  ] as const) {
    await control("尺寸")
      .getByRole("button", { name: label, exact: true })
      .click();
    await expect(avatar).toHaveCSS("width", `${pixels}px`);
    await expect(avatar).toHaveCSS("height", `${pixels}px`);
  }

  for (const [label, status] of [
    ["在线", "online"],
    ["离开", "away"],
    ["忙碌", "busy"],
    ["离线", "offline"],
  ] as const) {
    await control("状态")
      .getByRole("button", { name: label, exact: true })
      .click();
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
    await control("拼接数量")
      .getByRole("button", { name: label, exact: true })
      .click();
    await expect(composite).toHaveAttribute("data-count", count);
    await expect(
      composite.locator('[data-slot="avatar-composite-cell"]'),
    ).toHaveCount(Number(count));
  }

  for (const [label, pixels] of [
    ["默认32", 32],
    ["大40", 40],
    ["超大48", 48],
  ] as const) {
    await control("尺寸")
      .getByRole("button", { name: label, exact: true })
      .click();
    await expect(composite).toHaveCSS("width", `${pixels}px`);
    await expect(composite).toHaveCSS("height", `${pixels}px`);
  }
  await expect(
    control("尺寸").getByRole("button", { name: "超小20", exact: true }),
  ).toHaveCount(0);
  await expect(
    control("尺寸").getByRole("button", { name: "小24", exact: true }),
  ).toHaveCount(0);
});

test("state: Link size variants use distinct typography tokens", async ({
  page,
}) => {
  await page.goto("/#link");
  const playground = page.locator("#link-playground");
  const previewLink = playground.locator('[data-slot="link"]');
  const sizeControl = playground
    .locator("label")
    .filter({ hasText: "尺寸" })
    .locator("..");

  await sizeControl.getByRole("button", { name: "小12", exact: true }).click();
  await expect(previewLink).toHaveCSS("font-size", "12px");
  await sizeControl
    .getByRole("button", { name: "默认14", exact: true })
    .click();
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

test("state: CardMedia is a first-child structural media slot", async ({
  page,
}) => {
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
  const selectedRow = rowCheckbox.locator("xpath=ancestor::tr");
  const accentBackground = await page.evaluate(() => {
    const probe = document.createElement("span");
    probe.style.backgroundColor = "var(--accent)";
    document.body.append(probe);
    const background = getComputedStyle(probe).backgroundColor;
    probe.remove();
    return background;
  });
  await expect
    .poll(() =>
      selectedRow.evaluate(
        (element) => getComputedStyle(element).backgroundColor,
      ),
    )
    .toBe(accentBackground);
  const accentHoverBackground = await page.evaluate(() => {
    const probe = document.createElement("span");
    probe.style.backgroundColor = "var(--accent-hover)";
    document.body.append(probe);
    const background = getComputedStyle(probe).backgroundColor;
    probe.remove();
    return background;
  });
  await selectedRow.hover();
  await expect
    .poll(() =>
      selectedRow.evaluate(
        (element) => getComputedStyle(element).backgroundColor,
      ),
    )
    .toBe(accentHoverBackground);
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
  await expect(playground.locator('[data-slot="select-value"]')).toHaveText(
    "请选择角色",
  );
  const searchControl = playground
    .locator("label")
    .filter({ hasText: "搜索" })
    .locator("..");
  await searchControl.getByRole("button", { name: "有", exact: true }).click();
  await playground.locator('[data-slot="select-trigger"]').click();
  const search = page.getByPlaceholder("搜索选项", { exact: true });
  await search.fill("成员");
  await expect(
    page.getByRole("option", { name: "成员", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("option", { name: "管理员", exact: true }),
  ).toHaveCount(0);
  await search.fill("不存在");
  await expect(page.getByText("无匹配结果", { exact: true })).toBeVisible();

  await page.reload();
  playground = page.locator("#select-playground");
  const semanticControl = playground
    .locator("label")
    .filter({ hasText: "状态" })
    .locator("..");
  await semanticControl
    .getByRole("button", { name: "报错", exact: true })
    .click();
  await expect(
    playground.locator('[data-slot="select-trigger"]'),
  ).toHaveAttribute("aria-invalid", "true");
  await expect(playground.locator('[data-slot="select-value"]')).toHaveText(
    "请选择角色",
  );
  await semanticControl
    .getByRole("button", { name: "禁用", exact: true })
    .click();
  await expect(
    playground.locator('[data-slot="select-trigger"]'),
  ).toBeDisabled();
});

test("state: Combobox searches, selects, clears, supports multiple, empty, and disabled", async ({
  page,
}) => {
  await page.goto("/#combobox");
  const playground = page.locator("#combobox-playground");
  const input = playground.locator('[data-slot="combobox-input"]');

  await expect(input).toHaveValue("React");
  await playground.locator('[data-slot="combobox-clear"]').click();
  await expect(input).toHaveValue("");
  await input.fill("Sve");
  await expect(
    page.getByRole("option", { name: "Svelte", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("option", { name: "React", exact: true }),
  ).toHaveCount(0);
  await page.getByRole("option", { name: "Svelte", exact: true }).click();
  await expect(input).toHaveValue("Svelte");

  const selectionControl = playground
    .locator("label")
    .filter({ hasText: "选择类型" })
    .locator("..");
  await selectionControl
    .getByRole("button", { name: "多选", exact: true })
    .click();
  await expect(playground.locator('[data-slot="combobox-chip"]')).toHaveCount(
    2,
  );
  const chipInput = playground.locator('[data-slot="combobox-chip-input"]');
  await chipInput.fill("Ang");
  await expect(
    page.getByRole("option", { name: "Angular", exact: true }),
  ).toBeVisible();
  await page.getByRole("option", { name: "Angular", exact: true }).click();
  await expect(playground.locator('[data-slot="combobox-chip"]')).toHaveCount(
    3,
  );

  const dataControl = playground
    .locator("label")
    .filter({ hasText: "候选数据" })
    .locator("..");
  await dataControl
    .getByRole("button", { name: "空数据", exact: true })
    .click();
  await chipInput.fill("React");
  await expect(page.getByText("无匹配结果", { exact: true })).toBeVisible();
  await page.keyboard.press("Escape");

  const stateControl = playground
    .locator("label")
    .filter({ hasText: "状态" })
    .locator("..");
  await stateControl.getByRole("button", { name: "禁用", exact: true }).click();
  await expect(
    playground.locator('[data-slot="combobox-chip-input"]'),
  ).toBeDisabled();
});

test("state: TimePicker wheel supports seconds and confirm", async ({
  page,
}) => {
  await page.goto("/#time-picker");
  const playground = page.locator("#time-picker-playground");
  await playground
    .getByRole("button", { name: "任意时间", exact: true })
    .click();
  await playground
    .getByRole("button", { name: "时:分:秒", exact: true })
    .click();
  await playground
    .getByRole("button", { name: "请选择时间", exact: true })
    .click();

  const lists = page.getByRole("listbox");
  const listCount = await lists.count();
  expect(listCount).toBe(3);
  await lists.nth(0).getByRole("option", { name: "17", exact: true }).click();
  await lists.nth(1).getByRole("option", { name: "10", exact: true }).click();
  await lists.nth(2).getByRole("option", { name: "33", exact: true }).click();
  await page.getByRole("button", { name: "确定", exact: true }).click();
  await expect(
    playground.locator('[data-slot="time-picker-value"]'),
  ).toHaveText("17:10:33");
});

test("state: TimePicker trigger uses 8px horizontal spacing", async ({
  page,
}) => {
  await page.goto("/#time-picker");
  const trigger = page.locator(
    '#time-picker-playground [data-slot="time-picker"]',
  );

  await expect(trigger).toHaveCount(1);
  await expect(trigger).toHaveCSS("padding-left", "8px");
  await expect(trigger).toHaveCSS("padding-right", "8px");
  await expect(trigger).toHaveCSS("gap", "8px");
});

test("state: data entry controls use 8px control spacing", async ({ page }) => {
  await page.goto("/#input");
  const input = page.locator(
    '#input-playground [data-slot="input-workbench-preview"] [data-slot="input"]',
  );
  await expect(input).toHaveCount(1);
  await expect(input).toHaveCSS("padding-left", "8px");
  await expect(input).toHaveCSS("padding-right", "8px");

  await page.goto("/#select");
  const select = page.locator(
    '#select-playground [data-slot="select-trigger"]',
  );
  await expect(select).toHaveCount(1);
  await expect(select).toHaveCSS("padding-left", "8px");
  await expect(select).toHaveCSS("padding-right", "8px");
  await expect(select).toHaveCSS("gap", "8px");

  await page.goto("/#date-picker");
  const datePicker = page.locator(
    '#date-picker-playground [data-slot="date-picker"]',
  );
  const dateTrigger = page.locator(
    '#date-picker-playground [data-slot="date-picker-trigger"]',
  );
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

test("state: DatePicker range uses one trigger and one calendar popover", async ({
  page,
}) => {
  await page.goto("/#date-picker");
  const playground = page.locator("#date-picker-playground");
  await playground
    .getByRole("button", { name: "日期范围", exact: true })
    .click();

  await expect(playground.locator('[data-slot="date-picker"]')).toHaveCount(1);
  const trigger = playground.locator('[data-slot="date-picker-trigger"]');
  await expect(trigger).toHaveCount(1);
  await trigger.click();
  await expect(page.locator('[data-slot="calendar"]')).toHaveCount(1);
});

test("state: DatePicker range stays open while replacing an existing range", async ({
  page,
}) => {
  await page.goto("/#date-picker");
  const playground = page.locator("#date-picker-playground");
  await playground
    .getByRole("button", { name: "日期范围", exact: true })
    .click();

  const trigger = playground.locator('[data-slot="date-picker-trigger"]');
  await trigger.click();
  const calendar = page.locator('[data-slot="calendar"]');
  const replacementDate = calendar.locator('[data-day="2026/7/25"]');
  await expect(replacementDate).toHaveCount(1);
  await calendar.locator('[data-day="2026/7/15"]').click();
  await calendar.locator('[data-day="2026/7/21"]').click();
  await expect(
    playground.locator('[data-slot="date-picker-value"]'),
  ).toContainText("2026-07-15");
  await expect(
    playground.locator('[data-slot="date-picker-value"]'),
  ).toContainText("2026-07-21");
  await replacementDate.click();
  await expect(calendar).toBeVisible();
  await expect(
    playground.locator('[data-slot="date-picker-value"]'),
  ).toContainText("2026-07-25");
  await expect(
    playground.locator('[data-slot="date-picker-value"]'),
  ).toContainText("结束日期");
});

test("state: Calendar defaults to Chinese locale", async ({ page }) => {
  await page.goto("/#date-picker");
  const playground = page.locator("#date-picker-playground");
  await playground.locator('[data-slot="date-picker-trigger"]').click();

  const calendar = page.locator('[data-slot="calendar"]');
  await expect(calendar.getByRole("status")).toHaveText("2026年7月");
  await expect(calendar.getByRole("status")).toHaveCSS("font-size", "14px");
  await expect(
    calendar.getByRole("grid", { name: "七月 2026", exact: true }),
  ).toHaveCount(1);
  const today = calendar.locator('[data-today="true"]');
  await expect(today).toHaveCount(1);
  expect(await today.getAttribute("class")).toContain("border-primary");
});

test("state: date controls reveal their clear action on hover", async ({
  page,
}) => {
  await page.goto("/#date-picker");
  const datePlayground = page.locator("#date-picker-playground");
  const datePicker = datePlayground.locator('[data-slot="date-picker"]');
  const dateClear = datePicker.locator('[data-slot="date-picker-clear"]');
  await datePicker.locator('[data-slot="date-picker-trigger"]').click();
  await page
    .getByRole("button", { name: "2026年7月15日 星期三", exact: true })
    .click();
  await expect(dateClear).toBeHidden();
  await datePicker.hover();
  await expect(dateClear).toBeVisible();

  await page.goto("/#date-time-picker");
  const dateTimePlayground = page.locator("#date-time-picker-playground");
  const dateTimePicker = dateTimePlayground.locator(
    '[data-slot="date-time-picker"]',
  );
  const dateTimeClear = dateTimePicker.locator(
    '[data-slot="date-time-picker-clear"]',
  );
  await dateTimePicker
    .locator('[data-slot="date-time-picker-trigger"]')
    .click();
  await page
    .getByRole("button", { name: "2026年7月15日 星期三", exact: true })
    .click();
  await expect(dateTimeClear).toBeHidden();
  await dateTimePicker.hover();
  await expect(dateTimeClear).toBeVisible();
});

test("state: DateTimePicker keeps its trigger in sync while selecting", async ({
  page,
}) => {
  await page.goto("/#date-time-picker");
  const playground = page.locator("#date-time-picker-playground");
  const trigger = playground.locator('[data-slot="date-time-picker-trigger"]');
  await expect(trigger).toHaveCount(1);
  await trigger.click();

  await expect(
    page.locator('[data-slot="date-time-picker-panel"]'),
  ).toHaveCount(1);
  await expect(page.locator('[data-slot="calendar"]')).toHaveCount(1);
  const timePanel = page.locator('[data-slot="date-time-picker-time-panel"]');
  await expect(timePanel).toHaveCount(1);
  await page.waitForTimeout(120);
  const panelsAreAligned = await timePanel.evaluate((node) => {
    const calendarNode = node.parentElement?.querySelector(
      '[data-slot="calendar"]',
    );
    if (!calendarNode) return false;
    const timePanelRect = node.getBoundingClientRect();
    const calendarRect = calendarNode.getBoundingClientRect();
    return Math.abs(calendarRect.height - timePanelRect.height) <= 16;
  });
  expect(panelsAreAligned).toBe(true);
  const wheelsFillPanel = await timePanel.evaluate((node) => {
    const panelRect = node.getBoundingClientRect();
    const listboxes = [...node.querySelectorAll('[role="listbox"]')];
    return (
      listboxes.length === 3 &&
      listboxes.every((listbox) => {
        const listboxRect = listbox.getBoundingClientRect();
        return Math.abs(panelRect.bottom - listboxRect.bottom - 8) < 1;
      })
    );
  });
  expect(wheelsFillPanel).toBe(true);
  await page
    .getByRole("button", { name: "2026年7月15日 星期三", exact: true })
    .click();
  const lists = page.getByRole("listbox");
  await expect(lists).toHaveCount(3);
  await lists.nth(0).getByRole("option", { name: "17", exact: true }).click();
  await lists.nth(1).getByRole("option", { name: "10", exact: true }).click();
  await lists.nth(2).getByRole("option", { name: "33", exact: true }).click();
  await expect(
    playground.locator('[data-slot="date-time-picker-value"]'),
  ).toHaveText(/2026-07-15 17:10:33/);
  await page.getByRole("button", { name: "确定", exact: true }).click();
  await expect(
    playground.locator('[data-slot="date-time-picker-value"]'),
  ).toHaveText(/2026-07-15 17:10:33/);
});

test("state: DateTimePicker cancel restores the value from before the panel opened", async ({
  page,
}) => {
  await page.goto("/#date-time-picker");
  const playground = page.locator("#date-time-picker-playground");
  const trigger = playground.locator('[data-slot="date-time-picker-trigger"]');
  await trigger.click();

  await page
    .getByRole("button", { name: "2026年7月15日 星期三", exact: true })
    .click();
  await page.getByRole("button", { name: "确定", exact: true }).click();
  await trigger.click();
  await page
    .getByRole("listbox")
    .nth(0)
    .getByRole("option", { name: "17", exact: true })
    .click();
  await expect(
    playground.locator('[data-slot="date-time-picker-value"]'),
  ).toHaveText(/17:00:00/);
  await page.getByRole("button", { name: "取消", exact: true }).click();
  await expect(
    playground.locator('[data-slot="date-time-picker-value"]'),
  ).toHaveText(/00:00:00/);
});

test("state: DateTimePicker uses four arrow buttons for calendar navigation", async ({
  page,
}) => {
  await page.goto("/#date-time-picker");
  const playground = page.locator("#date-time-picker-playground");
  const trigger = playground.locator('[data-slot="date-time-picker-trigger"]');
  await expect(trigger).toHaveCount(1);
  await trigger.click();

  const calendar = page.locator('[data-slot="calendar"]');
  await expect(
    calendar.getByRole("button", { name: "上一年", exact: true }),
  ).toHaveCount(1);
  await expect(
    calendar.getByRole("button", { name: "上一月", exact: true }),
  ).toHaveCount(1);
  await expect(
    calendar.getByRole("button", { name: "下一月", exact: true }),
  ).toHaveCount(1);
  await expect(
    calendar.getByRole("button", { name: "下一年", exact: true }),
  ).toHaveCount(1);
  const navigation = calendar.locator("nav");
  await expect(navigation).toHaveCount(1);
  await expect(navigation).toHaveCSS("height", "28px");
  const navigationAligned = await navigation.evaluate((node) => {
    const caption = node.parentElement?.querySelector(".rdp-month_caption");
    if (!caption) return false;
    const navRect = node.getBoundingClientRect();
    const captionRect = caption.getBoundingClientRect();
    return (
      Math.abs(
        navRect.top +
          navRect.height / 2 -
          (captionRect.top + captionRect.height / 2),
      ) < 0.1
    );
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
  await expect(
    calendar.getByRole("grid", { name: "八月 2026", exact: true }),
  ).toHaveCount(1);
  await calendar.getByRole("button", { name: "下一年", exact: true }).click();
  await expect(
    calendar.getByRole("grid", { name: "八月 2027", exact: true }),
  ).toHaveCount(1);
});

test("state: DateTimePicker range edits start and end in sequence", async ({
  page,
}) => {
  await page.goto("/#date-time-picker");
  const playground = page.locator("#date-time-picker-playground");
  await playground
    .getByRole("button", { name: "日期时间范围", exact: true })
    .click();

  const trigger = playground.locator('[data-slot="date-time-picker-trigger"]');
  await expect(trigger).toHaveCount(1);
  await trigger.click();
  await expect(page.locator('[data-slot="calendar"]')).toHaveCount(1);
  await expect(
    page.locator('[data-slot="date-time-picker-panel"]'),
  ).toHaveCount(1);
  const lists = page.getByRole("listbox");
  await expect(lists).toHaveCount(3);
  await page
    .getByRole("button", { name: "2026年7月15日 星期三", exact: true })
    .click();
  await lists.nth(0).getByRole("option", { name: "10", exact: true }).click();
  await page.getByRole("button", { name: "确定", exact: true }).click();
  await expect(
    page.locator('[data-slot="date-time-picker-panel"]'),
  ).toBeVisible();
  await expect(
    playground.locator('[data-slot="date-time-picker-value"]'),
  ).toContainText("2026-07-15 10:00:00");
  await expect(
    playground.locator('[data-slot="date-time-picker-value"]'),
  ).toContainText("结束日期时间");
  await page
    .getByRole("button", { name: "2026年7月21日 星期二", exact: true })
    .click();
  await lists.nth(0).getByRole("option", { name: "18", exact: true }).click();
  await page.getByRole("button", { name: "确定", exact: true }).click();
  await expect(
    page.locator('[data-slot="date-time-picker-panel"]'),
  ).toHaveCount(0);
  await expect(
    playground.locator('[data-slot="date-time-picker-value"]'),
  ).toHaveText(/2026-07-15 10:00:00.*2026-07-21 18:00:00/);
});

test("state: TimePicker range uses one trigger and one dual-wheel popover", async ({
  page,
}) => {
  await page.goto("/#time-picker");
  const playground = page.locator("#time-picker-playground");
  await playground
    .getByRole("button", { name: "时间范围", exact: true })
    .click();

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
  await expect(
    playground.locator('[data-slot="time-picker-value"]'),
  ).toHaveText(/09:30.*18:00/);

  await playground
    .getByRole("button", { name: "固定间隔", exact: true })
    .click();
  await trigger.click();
  await expect(
    page.getByRole("button", { name: "取消", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "确定", exact: true }),
  ).toBeVisible();
});

test("state: Select clear-all appears on hover or focus", async ({ page }) => {
  await page.goto("/#select");
  const playground = page.locator("#select-playground");
  const typeControl = playground
    .locator("label")
    .filter({ hasText: "类型" })
    .locator("..");
  await typeControl.getByRole("button", { name: "多选", exact: true }).click();
  const clearControl = playground
    .locator("label")
    .filter({ hasText: "清除" })
    .locator("..");
  await clearControl.getByRole("button", { name: "有", exact: true }).click();
  await expect(
    playground.locator('[data-slot="component-playground-stories"]'),
  ).toHaveCount(0);

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

test("state: Select multiple defaults to outline and scales value tags", async ({
  page,
}) => {
  await page.goto("/#select");
  const playground = page.locator("#select-playground");
  const typeControl = playground
    .locator("label")
    .filter({ hasText: "类型" })
    .locator("..");
  await typeControl.getByRole("button", { name: "多选", exact: true }).click();

  const trigger = playground.locator('[data-slot="select-trigger"]');
  await expect(trigger).toHaveAttribute("data-variant", "outline");
  const sizeControl = playground
    .locator("label")
    .filter({ hasText: "尺寸" })
    .locator("..");
  await sizeControl
    .getByRole("button", { name: "超小24", exact: true })
    .click();
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
  await expect(
    trigger.locator('[data-slot="select-overflow-count"]'),
  ).toHaveCount(0);
  await expect(valueTags.first()).toHaveCSS("height", "16px");
  await expect(valueTags.first()).toHaveCSS("font-size", "12px");
  await expect(valueTags.first().locator("svg")).toHaveCSS("width", "10px");
  await sizeControl
    .getByRole("button", { name: "默认28", exact: true })
    .click();
  await page.waitForTimeout(100);
  await expect(valueTags).toHaveCount(3);
  await expect(valueTags).toHaveText(["管理员", "成员", "审计员"]);
  await expect(
    trigger.locator('[data-slot="select-overflow-count"]'),
  ).toHaveText("+1");
  await expect(valueTags.first()).toHaveCSS("height", "20px");
  await expect(valueTags.first().locator("svg")).toHaveCSS("width", "12px");
  await sizeControl.getByRole("button", { name: "中32", exact: true }).click();
  await expect(valueTags).toHaveCount(2);
  await expect(valueTags).toHaveText(["管理员", "成员"]);
  await expect(
    trigger.locator('[data-slot="select-overflow-count"]'),
  ).toHaveText("+2");
  await expect(valueTags.first()).toHaveCSS("height", "24px");
  await expect(valueTags.first()).toHaveCSS("font-size", "16px");
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
  await playground.evaluate((node) =>
    node.style.setProperty("--fx-control-md-height", "30px"),
  );
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
  await sizeControl
    .getByRole("button", { name: "超小24", exact: true })
    .click();
  await sizeControl.getByRole("button", { name: "中32", exact: true }).click();
  await page.waitForTimeout(100);
  const compactOverflowBoundary = await trigger
    .locator('[data-slot="select-multi-value"]')
    .evaluate((node) => {
      const lastItem = node.lastElementChild;
      if (!lastItem) return null;
      return {
        containerRight: node.getBoundingClientRect().right,
        lastItemRight: lastItem.getBoundingClientRect().right,
      };
    });
  expect(compactOverflowBoundary).not.toBeNull();
  expect(compactOverflowBoundary!.lastItemRight).toBeLessThanOrEqual(
    compactOverflowBoundary!.containerRight + 0.5,
  );
  await playground.evaluate((node) =>
    node.style.removeProperty("--fx-control-md-height"),
  );
  await sizeControl
    .getByRole("button", { name: "超小24", exact: true })
    .click();
  await page.waitForTimeout(100);
  await expect(valueTags).toHaveCount(3);
  await expect(valueTags).toHaveText(["管理员", "成员", "审计员"]);
  await expect(
    trigger.locator('[data-slot="select-overflow-count"]'),
  ).toHaveText("+1");
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
    checkboxPlayground.getByRole("checkbox", {
      name: "我已阅读并同意服务条款",
      exact: true,
    }),
  ).toBeVisible();
  await checkboxPlayground
    .getByRole("button", { name: "禁用", exact: true })
    .click();
  await expect(
    checkboxPlayground.getByRole("checkbox", {
      name: "我已阅读并同意服务条款",
      exact: true,
    }),
  ).toBeDisabled();

  await page.goto("/#switch");
  const switchPlayground = page.locator("#switch-playground");
  await expect(
    switchPlayground.getByRole("switch", { name: "接收消息通知", exact: true }),
  ).toBeVisible();
  await switchPlayground
    .getByRole("button", { name: "禁用", exact: true })
    .click();
  await expect(
    switchPlayground.getByRole("switch", { name: "接收消息通知", exact: true }),
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
  const customer = radioPlayground.getByRole("radio", {
    name: "客户资料",
    exact: true,
  });
  const orders = radioPlayground.getByRole("radio", {
    name: "订单权限",
    exact: true,
  });
  await customer.focus();
  await page.keyboard.press("ArrowDown");
  await expect(orders).toBeFocused();
  await expect(orders).toBeChecked();
});

test("Checkbox 调试台：全选与半选状态联动", async ({ page }) => {
  await page.goto("/#checkbox");
  const playground = page.locator("#checkbox-playground");
  await playground
    .getByRole("button", { name: "全选联动", exact: true })
    .click();

  const selectAll = playground.getByRole("checkbox", {
    name: "全选",
    exact: true,
  });
  await expect(selectAll).toHaveAttribute("aria-checked", "mixed");
  await playground
    .getByRole("checkbox", { name: "客户资料", exact: true })
    .click();
  await expect(selectAll).toHaveAttribute("aria-checked", "false");
  await selectAll.click();
  await expect(selectAll).toHaveAttribute("aria-checked", "true");
  await expect(
    playground.getByRole("checkbox", { name: "订单权限", exact: true }),
  ).toHaveAttribute("aria-checked", "true");
});

test("Checkbox 调试台：尺寸、布局、悬停与已选禁用状态", async ({ page }) => {
  await page.goto("/#checkbox");
  const playground = page.locator("#checkbox-playground");
  const single = playground.getByRole("checkbox", {
    name: "我已阅读并同意服务条款",
    exact: true,
  });

  await single.hover();
  await expect(single).toHaveCSS("border-top-color", "rgb(255, 128, 0)");

  const primaryHover = await page.evaluate(() => {
    const probe = document.createElement("span");
    probe.style.backgroundColor = "var(--fx-primary-hover)";
    document.body.append(probe);
    const background = getComputedStyle(probe).backgroundColor;
    probe.remove();
    return background;
  });
  await playground.getByRole("button", { name: "已选", exact: true }).click();
  await single.hover();
  await expect(single).toHaveCSS("background-color", primaryHover);

  await playground.getByRole("button", { name: "半选", exact: true }).click();
  await single.hover();
  await expect(single).toHaveCSS("background-color", primaryHover);

  const label = playground.getByText("我已阅读并同意服务条款", { exact: true });
  const [checkboxBox, labelBox] = await Promise.all([
    single.boundingBox(),
    label.boundingBox(),
  ]);
  expect(checkboxBox).not.toBeNull();
  expect(labelBox).not.toBeNull();
  expect(
    Math.abs(
      checkboxBox!.y +
        checkboxBox!.height / 2 -
        (labelBox!.y + labelBox!.height / 2),
    ),
  ).toBeLessThanOrEqual(0.5);

  await playground.getByRole("button", { name: "小12", exact: true }).click();
  await expect(single).toHaveAttribute("data-size", "sm");
  await expect(single).toHaveCSS("width", "12px");
  await expect(label).toHaveCSS("font-size", "12px");
  await expect(single.locator("svg")).toHaveCSS("stroke-width", "3px");

  await playground.getByRole("button", { name: "默认14", exact: true }).click();
  await expect(single).toHaveAttribute("data-size", "default");
  await expect(single).toHaveCSS("width", "14px");
  await expect(label).toHaveCSS("font-size", "14px");
  await expect(single.locator("svg")).toHaveCSS("stroke-width", "2.4px");

  await playground.getByRole("button", { name: "大16", exact: true }).click();
  await expect(single).toHaveAttribute("data-size", "lg");
  await expect(single).toHaveCSS("width", "16px");
  await expect(label).toHaveCSS("font-size", "16px");
  await expect(single.locator("svg")).toHaveCSS("stroke-width", "2px");

  await playground
    .getByRole("button", { name: "已选禁用", exact: true })
    .click();
  await expect(single).toBeDisabled();
  await expect(single).toHaveAttribute("aria-checked", "true");
  await expect(single).toHaveCSS(
    "background-color",
    "oklch(0.955994 0.000447309 52.9792)",
  );

  await playground.getByRole("button", { name: "复选组", exact: true }).click();
  await expect(
    playground.getByRole("button", { name: "列表选择", exact: true }),
  ).toHaveCount(0);
  await expect(
    playground.getByRole("button", { name: "报错", exact: true }),
  ).toHaveCount(0);
  await expect(playground.locator('[data-slot="field-legend"]')).toHaveCount(0);
  await expect(playground.getByText("可配置模块", { exact: true })).toHaveCount(
    0,
  );
  const group = playground.locator(
    '[data-slot="field-group"][data-orientation="horizontal"]',
  );
  await expect(group).toHaveCSS("flex-direction", "row");
  await expect(group).toHaveCSS("column-gap", "16px");
  await expect(group).toHaveCSS("row-gap", "8px");
});

test("RadioGroup 调试台：尺寸、布局、悬停与已选禁用状态", async ({ page }) => {
  await page.goto("/#radio-group");
  const playground = page.locator("#radio-group-playground");
  const radio = playground.getByRole("radio", {
    name: "客户资料",
    exact: true,
  });
  const label = playground.getByText("客户资料", { exact: true });
  const legend = playground.getByText("选择默认工作台", { exact: true });
  await expect(legend).toHaveClass(/sr-only/);
  const legendBox = await legend.boundingBox();
  expect(legendBox).not.toBeNull();
  expect(legendBox!.width).toBeLessThanOrEqual(1);
  expect(legendBox!.height).toBeLessThanOrEqual(1);
  await expect(playground.getByText("默认工作台", { exact: true })).toHaveCount(
    0,
  );

  await radio.hover();
  await expect(radio).toHaveCSS("border-top-color", "rgb(255, 128, 0)");
  await expect(radio).toHaveAttribute("aria-checked", "false");

  await playground.getByRole("button", { name: "已选", exact: true }).click();
  await expect(radio).toHaveAttribute("aria-checked", "true");

  const [radioBox, labelBox] = await Promise.all([
    radio.boundingBox(),
    label.boundingBox(),
  ]);
  expect(radioBox).not.toBeNull();
  expect(labelBox).not.toBeNull();
  expect(
    Math.abs(
      radioBox!.y + radioBox!.height / 2 - (labelBox!.y + labelBox!.height / 2),
    ),
  ).toBeLessThanOrEqual(0.5);

  await playground.getByRole("button", { name: "小12", exact: true }).click();
  await expect(radio).toHaveAttribute("data-size", "sm");
  await expect(radio).toHaveCSS("width", "12px");
  await expect(label).toHaveCSS("font-size", "12px");

  await playground.getByRole("button", { name: "默认14", exact: true }).click();
  await expect(radio).toHaveAttribute("data-size", "default");
  await expect(radio).toHaveCSS("width", "14px");
  await expect(label).toHaveCSS("font-size", "14px");

  await playground.getByRole("button", { name: "大16", exact: true }).click();
  await expect(radio).toHaveAttribute("data-size", "lg");
  await expect(radio).toHaveCSS("width", "16px");
  await expect(label).toHaveCSS("font-size", "16px");

  await playground
    .getByRole("button", { name: "已选禁用", exact: true })
    .click();
  await expect(radio).toBeDisabled();
  await expect(radio).toHaveAttribute("aria-checked", "true");
  await expect(radio).toHaveCSS(
    "background-color",
    "oklch(0.955994 0.000447309 52.9792)",
  );

  await playground.getByRole("button", { name: "横向", exact: true }).click();
  await expect(
    playground.getByRole("button", { name: "单选组", exact: true }),
  ).toHaveCount(0);
  await expect(
    playground.getByRole("button", { name: "列表单选", exact: true }),
  ).toHaveCount(0);
  const group = playground.locator(
    '[data-slot="field-set"] > [data-slot="radio-group"] > [data-slot="field-group"]',
  );
  await expect(group).toHaveCSS("flex-direction", "row");
  await expect(group).toHaveCSS("column-gap", "16px");
  await expect(group).toHaveCSS("row-gap", "8px");

  await expect(
    playground.getByRole("button", { name: "报错", exact: true }),
  ).toHaveCount(0);
});

test("Switch 调试台：类型、值、状态与四档尺寸", async ({ page }) => {
  await page.goto("/#switch");
  const playground = page.locator("#switch-playground");
  const control = playground.getByRole("switch", {
    name: "接收消息通知",
    exact: true,
  });

  await expect(control).toHaveAttribute("data-size", "small");
  await expect(control).toHaveCSS("width", "42px");
  await expect(control).toHaveCSS("height", "22px");
  await control.click();
  await expect(control).toHaveAttribute("aria-checked", "true");

  await playground.getByRole("button", { name: "微型12", exact: true }).click();
  await expect(control).toHaveAttribute("data-size", "micro");
  await expect(control).toHaveCSS("width", "20px");
  await expect(control).toHaveCSS("height", "12px");

  await playground.getByRole("button", { name: "文字", exact: true }).click();
  await expect(control.locator('[data-slot="switch-content"]')).toBeVisible();
  await expect(control).toContainText("开");
  await expect(control).toContainText("关");

  await playground.getByRole("button", { name: "开", exact: true }).click();
  await playground.getByRole("button", { name: "加载", exact: true }).click();
  await expect(control).toBeDisabled();
  await expect(control).toHaveAttribute("aria-busy", "true");
  await expect(control).toHaveAttribute("aria-checked", "true");
  await expect(
    control.locator('[data-slot="switch-thumb"] [role="status"]'),
  ).toHaveCount(1);

  await playground.getByRole("button", { name: "中32", exact: true }).click();
  await expect(control).toHaveCSS("width", "70px");
  await expect(control).toHaveCSS("height", "32px");

  await playground
    .getByRole("button", { name: "默认", exact: true })
    .nth(1)
    .click();
  await playground.getByRole("button", { name: "图标", exact: true }).click();
  await expect(control.locator('[data-slot="switch-content"] svg')).toHaveCount(
    2,
  );
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

test("state: Upload file selection, removal, and disabled semantics", async ({
  page,
}) => {
  await page.goto("/#upload");
  const playground = page.locator("#upload-playground");
  await playground.getByRole("button", { name: "显示", exact: true }).click();
  await playground.getByRole("button", { name: "拖拽", exact: true }).click();
  const upload = playground.locator('[data-slot="upload"]').first();
  const input = upload.locator('input[type="file"]');

  await input.setInputFiles({
    name: "报价单.pdf",
    mimeType: "application/pdf",
    buffer: Buffer.from("fx-ui upload"),
  });
  await expect(upload.getByText("报价单.pdf", { exact: true })).toBeVisible();

  await upload.getByRole("button", { name: "删除 报价单.pdf" }).click();
  await expect(upload.getByText("报价单.pdf", { exact: true })).toHaveCount(0);

  await playground.getByRole("button", { name: "禁用", exact: true }).click();
  await expect(upload).toHaveAttribute("data-disabled", "true");
  await expect(input).toBeDisabled();
  await expect(upload.locator('[data-slot="upload-dropzone"]')).toHaveAttribute(
    "aria-disabled",
    "true",
  );
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

test("state: PeoplePicker search, multi-select, and department drill-down", async ({
  page,
}) => {
  await page.goto("/#people-picker");
  const playground = page.locator("#people-picker-playground");
  const picker = playground.locator('[data-slot="people-picker"]');
  await expect(picker).toHaveAttribute("data-size", "normal");
  await expect(picker).toHaveAttribute("data-tab", "recent");

  const search = picker.getByRole("combobox", {
    name: "搜索人员、部门或用户组",
  });
  await search.fill("周雨晴");
  await expect(picker.getByRole("option", { name: /周雨晴/ })).toBeVisible();
  await expect(picker.getByRole("option", { name: /陈嘉明/ })).toHaveCount(0);
  await search.fill("");

  await picker.getByRole("checkbox", { name: "全选当前列表" }).click();
  await expect(picker.getByText("已选 7", { exact: true })).toBeVisible();

  await picker.getByRole("tab", { name: "部门", exact: true }).click();
  await expect(picker).toHaveAttribute("data-tab", "departments");
  await expect(picker.getByText("包含子部门", { exact: true })).toBeVisible();
  await picker.getByRole("button", { name: "进入产品与设计中心" }).click();
  await expect(picker.getByText("体验设计部", { exact: true })).toBeVisible();
  await expect(picker.getByText("产品管理部", { exact: true })).toBeVisible();
  await picker
    .getByRole("button", { name: "产品与设计中心", exact: true })
    .click();
  await expect(
    picker.getByRole("button", { name: "进入研发中心" }),
  ).toBeVisible();
});
