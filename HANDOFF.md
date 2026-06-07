> **接手时间**：2026-06-07
> **项目根目录**：fx-ui
> **当前状态**：组件库工程已搭建，Button 组件文档站基本成型（场景示例 + 组件总览 + API + 语义 DOM 全部覆盖），首批公司组合组件和布局规范已沉淀
> **下一步**：把列表页 demo 拆成内部 Block 候选，继续补编辑页 / 详情页样板
> **风险**：`theme/fx-theme.css` 是 token 真相源，改动影响全局；基础组件必须从 shadcn 拉，不能手写

---
layer: knowledge
type: status
last_verified: 2026-06-07
teaches: "fx-ui 上一轮做了什么、当前能不能继续、风险是什么、下一步具体干什么"
use_when: "新的 AI 会话接手 fx-ui 时"
depends_on: [PROJECT.md]
---

# 当前交接 — fx-ui

> 新 AI 接手 fx-ui，先读这里。

## 当前状态

- 当前做到：Button 组件文档站基本成型（场景示例、组件总览、API 属性、语义 DOM、设计 token、正误示例全部跑通）；项目已纳入 git 管理并推到远程仓库
- 当前阻塞：无
- 是否可继续：可以，按"下一步"清单继续推进即可

## 本次已完成

- 搭建 Vite + React + TS + Tailwind v4 + shadcn 工程，公司 token 注入并验证 Button 换肤成功（公司橙 ✅）
- 拉取并整理了一批 shadcn 基础组件（Card / Input / Dialog / Table / Tabs / Badge / Select / Alert Dialog / Dropdown Menu / Textarea / ButtonGroup 等）
- 完成标准后台列表页 demo，并抽出第一批公司组合组件：`PageShell`、`PageHeader`、`SearchToolbar`、`ConfirmDangerDialog`
- 沉淀第一版布局规范 `docs/LAYOUTS.md`
- 重做 Button 文档页：场景示例补全六大类型 + 尺寸 + 状态 + 图标 + 按钮组合，组件总览矩阵改为从场景数据派生，避免两边数量漏同步
- 初始化 git 仓库并推到 GitHub（`lijinmei915/fx-ui`，私有）
- 新增 `PRODUCT.md`（面向 AI/工程师的产品定义，非传统 PM 视角）

## 风险与待确认

- `theme/fx-theme.css` 是 token 真相源，改它 = 全局换肤，动手前必须先告知用户
- 基础组件仍然必须从 shadcn 拉；公司组合组件可以写，但必须由 shadcn 组件组合而成，不能变成新的黑盒基础组件库
- `@theme inline` 不能用 `var()` 引用——Tailwind v4 编译时取不到运行时变量，必须直接写色值
- 必须 `@import "tailwindcss"`，否则 `shadcn/tailwind.css` 里所有 utility class 都不生效

## 下一步

1. 把当前列表页 demo 拆成内部 Block 候选：`src/blocks/list-page/`
2. 继续做编辑页 / 详情页 / 设置页样板
3. 补 `docs/BLOCKS.md`，记录内部 Blocks 的使用方式
4. 接 Project OS：跑 build-project-graph 生成 fx-ui 的知识图谱

## 相关文件

| 文件 | 关系 |
|------|------|
| `PROJECT.md` | 项目全局状态（本文件只记当前轮次的交接信息） |
| `AGENTS.md` | AI 行为规则，含"第一版手搓组件被否决"的踩坑记录 |
| `PRODUCT.md` | 产品定义（避免交接时偏离 fx-ui 的产品意图） |
| `docs/ARCHITECTURE.md` | 三层体系（基础组件 / 公司组合组件 / 页面 Blocks）说明 |
