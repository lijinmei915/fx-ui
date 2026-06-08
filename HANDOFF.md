> **接手时间**：2026-06-08
> **项目根目录**：fx-ui
> **当前状态**：本地拉到的全部 28 个 shadcn 基础组件已补齐中文文档页，组件文档覆盖率到 100%
> **下一步**：回到产品功能线——把列表页 demo 拆成内部 Block 候选，继续补编辑页 / 详情页样板
> **风险**：`theme/fx-theme.css` 是 token 真相源，改动影响全局；基础组件必须从 shadcn 拉，不能手写；新建文档必须同步登记 `docs/DOCUMENTATION.md` 的路由表，否则会被 pre-commit 钩子拦截

---
layer: knowledge
type: status
last_verified: 2026-06-08
teaches: "fx-ui 上一轮做了什么、当前能不能继续、风险是什么、下一步具体干什么"
use_when: "新的 AI 会话接手 fx-ui 时"
depends_on: [PROJECT.md]
---

# 当前交接 — fx-ui

> 新 AI 接手 fx-ui，先读这里。

## 当前状态

- 当前做到：把 `src/components/ui/` 下本地拉取的全部 28 个 shadcn 基础组件都建好了中文文档页（`src/App.tsx`），统一走"组件总览/场景示例/使用方式/API/语义 DOM/正误示例"六段结构，导航菜单同步重新分组
- 当前阻塞：无
- 是否可继续：可以；组件文档线告一段落，下一步该回到产品功能线（列表页 → Block 拆分）

## 本次已完成

- **补全文档页**：新增 Avatar、Breadcrumb、Button Group、Calendar、Collapsible、Dropdown Menu、Popover、Separator、Sheet、Sidebar、Skeleton、Spinner、Tabs、Toggle、Toggle Group 等 14 个组件文档页，加上此前已完成的（Typography/Input/Select/Checkbox/Switch/Textarea/Table/Card/Badge/Tooltip/Dialog/Alert Dialog），现在 28 个 shadcn 组件全部有中文文档
- **抽出公共骨架 `StandardDocPage`**：避免十几页重复同一套六段结构模板代码，新组件页只需准备数据数组（`xxxAnchors`/`xxxScenarioExamples`/`xxxPropRows`/`xxxSemanticDomRows`/`xxxDoDontRows`）和场景预览渲染函数即可接入
- **导航菜单重新分组**：新增"导航"分组（面包屑/标签页/下拉菜单/侧边栏），把分隔线、头像、日历等也归类到对应分组，避免菜单项堆在"通用"里
- **补提交遗漏文件**：`src/components/ui/checkbox.tsx`、`switch.tsx`（此前拉取后忘记提交）

## 风险与待确认

- `theme/fx-theme.css` 是 token 真相源，改它 = 全局换肤，动手前必须先告知用户
- 基础组件仍然必须从 shadcn 拉；公司组合组件可以写，但必须由 shadcn 组件组合而成，不能变成新的黑盒基础组件库
- `@theme inline` 不能用 `var()` 引用——Tailwind v4 编译时取不到运行时变量，必须直接写色值
- 必须 `@import "tailwindcss"`，否则 `shadcn/tailwind.css` 里所有 utility class 都不生效
- **新规矩**：新建 `docs/*.md` 必须同步在 `docs/DOCUMENTATION.md` 的 SSOT 路由表里登记一行，否则 `check-docs-routing.sh` 会在提交前拦截
- token 改动后若 `npm run check:tokens` 报漂移，要去同步 `docs/TOKENS.md` 的对应表格——脚本只查不自动改
- 新增组件文档页时优先复用 `StandardDocPage`，不要另起一套结构，否则又会变成"各页各写一套、容易漂移"

## 下一步

1. 回到产品功能线：把当前列表页 demo 拆成内部 Block 候选 `src/blocks/list-page/`
2. 继续做编辑页 / 详情页 / 设置页样板
3. 补 `docs/BLOCKS.md`，记录内部 Blocks 的使用方式（记得同步登记进路由表）
4. 跑 `bash scripts/build-project-graph.sh` 生成知识图谱（目前生成了但还没有消费方）

## 相关文件

| 文件 | 关系 |
|------|------|
| `PROJECT.md` | 项目全局状态（本文件只记当前轮次的交接信息） |
| `AGENTS.md` | AI 行为规则，含"第一版手搓组件被否决"的踩坑记录 |
| `PRODUCT.md` | 产品定义（避免交接时偏离 fx-ui 的产品意图） |
| `docs/ARCHITECTURE.md` | 三层体系（基础组件 / 公司组合组件 / 页面 Blocks）说明 |
