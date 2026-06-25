---
layer: knowledge
type: spec
last_verified: 2026-06-26
teaches: "fx-ui 的三层生产体系：基础组件、公司组合组件、页面 Blocks（目录细节见 CODE_STRUCTURE，布局规范见 LAYOUTS）"
use_when: "AI 要判断某个能力归哪一层、三层之间如何分工时"
---

# fx-ui 架构方向

> 用途：记录 fx-ui 不只是组件库，而是公司级 AI 可读前端生产体系。

## 总目标

fx-ui 的目标不是重新手写一套 UI 组件库，而是建立一套公司级前端生产体系：

- 基础控件统一
- 公司视觉统一
- 页面可以快速生成
- 生成后的页面可以继续改造
- 高频页面模式可以沉淀成公司的布局规范和内部 Blocks
- Agent 回复可以通过受控 JSON 生成产品内 React UI

## 三层体系

### 1. 基础组件层：shadcn/ui

目录建议：`src/components/ui/`

这一层只放 shadcn/ui 拉下来的 open-code 组件。

- 通过 `npx shadcn@latest add <component>` 获取
- 不手写 Button / Input / Dialog / Table 等基础控件
- 不做黑盒封装
- 公司视觉通过 `theme/fx-theme.css` 注入 token
- shadcn 上游更新默认不自动同步；只有 bug、安全、可访问性或业务需要时，才按单个组件升级

这一层解决：基础控件统一、源码可读、AI 可消费。

#### shadcn 上游升级策略

shadcn 组件进入 `src/components/ui/` 后，就视为 fx-ui 的本地源码资产，不再跟官网自动同步。

升级已有组件时必须按下面流程：

1. 说明为什么要升级：bug、安全、可访问性或明确业务需要。
2. 只处理相关组件，不做全量覆盖。
3. 对比上游实现和本地 `src/components/ui/<component>.tsx`。
4. 保留 fx-ui 已接好的 token、Tailwind class、`data-slot` 语义和文档契约。
5. 同步 `docs/components/<component>.md` 与 `docs/data/components.manifest.json`。
6. 运行 `npm run check`。

不为了“官网出了新版”而升级；稳定优先。

### 2. 公司组合组件层：fx components

目录建议：`src/components/fx/`

这一层沉淀公司高频业务模式，但底层仍然由 shadcn 组件组合而成。

候选组件：

- `PageHeader`：页面标题、描述、面包屑、主操作
- `SearchToolbar`：筛选项、搜索框、查询、重置
- `EntityTable`：表格、分页、批量操作、行操作
- `FormSection`：表单分组、标题、说明、操作区
- `EmptyState`：空状态
- `ConfirmDangerDialog`：危险操作确认弹窗
- `PageShell`：后台页面外壳

这一层解决：公司业务组件统一、常见交互模式统一。

### 3. 页面 Blocks / Recipes / 布局规范层

目录：`src/components/recipes/`（已落地）、`docs/LAYOUTS.md`

这一层用于快速生成完整页面，并从真实页面里抽出公司的布局规范。**Recipe = 可搬运的成形组合范例**：把 ui/fx 组件按真实场景拼好的标准用法（含交互），落成一个组件。**搭页面时整段搬运 recipe、只换数据，禁止手写重拼**（见 `AGENTS.md` 红线 6）。

已落地 Recipes：

- `CrmShellNav`（`src/components/recipes/crm-shell-nav.tsx`）：CRM 应用外壳导航 = NavRail 一级应用栏 + NavMenu 二级菜单的规范组合，全套折叠/固定/hover/选中交互。
- `CrmAppShell`（`src/components/recipes/crm-app-shell.tsx`）：CRM 整页外壳 = TopBar 顶栏 + CrmShellNav 双层导航 + 内容卡插槽（灰底浮卡布局）。页面只往 children 塞内容，外壳 chrome 全复用。「客户列表页」模板即基于它。

候选 Blocks：

- `ListPageBlock`：列表页，含筛选、表格、分页、批量操作
- `EditFormBlock`：新建/编辑表单页
- `DetailPageBlock`：详情页
- `DashboardBlock`：数据看板页
- `AuthBlock`：登录/注册页
- `SettingsBlock`：设置页
- `MasterDetailBlock`：主从结构页

这一层解决：页面快速起步、页面模式复用、公司布局规范沉淀。

### 4. Agent UI 层：受控生成式界面

目录建议：`src/components/fx/agent-surface.tsx`、`docs/AGENT_UI.md`、`docs/data/agent-ui.manifest.json`

这一层用于公司 Agent 在对话里生成卡片、对象信息、文件信息和操作按钮。

- Agent 只生成 JSON 意图，不生成 React、HTML、CSS 或 JS
- 前端只渲染 manifest 登记的 block 白名单
- action 只作为事件回传宿主应用，不作为代码执行
- 未知 block type 走安全兜底，不动态 import、不 eval、不 innerHTML

这一层解决：Agent 回复可以生成产品内真实 React UI，同时保持安全、可控和可检查。

## 模块职责

| 目录 / 文件 | 职责 | 备注 |
|-------------|------|------|
| `src/components/ui/` | shadcn 原子组件，CLI 拉取 | 不手写，open-code 可读可改 |
| `src/components/fx/` | 公司组合组件 | 必须由 shadcn 组件组合而成，不做黑盒 |
| `src/blocks/` | 公司页面模板 | 从真实页面里抽出来，不预先设计 |
| `src/layouts/` | 页面壳、侧边栏、主内容布局 | |
| `src/components/fx/agent-surface.tsx` | Agent UI 渲染面 | 受控 JSON -> 本地 React 组件 |
| `docs/AGENT_UI.md` | Agent UI 生成式界面协议 | 定义 block、action 和安全红线 |
| `docs/data/agent-ui.manifest.json` | Agent UI 机器事实表 | 给 AI 和检查脚本读取 |
| `theme/fx-theme.css` | 公司 token 真相源 | 改它 = 全局换肤 |
| `registry/fx-theme.json` | shadcn 官方 `registry:theme` 分发格式 | 对外分发主题用 |
| `docs/components/` | 组件文档资产 | 给人和 AI 共同消费 |
| `docs/LAYOUTS.md` | 布局规范 | 来自真实页面沉淀 |

## 目录边界

三层体系如何落到具体目录，见 `docs/CODE_STRUCTURE.md`（实际目录结构、新文件该放哪的真相源）。本文件只定义层的职责，不复述目录树。

## 落地路线

第一阶段先做一个小闭环：

1. 继续拉 shadcn 基础组件：`card input dialog table form tabs badge separator`
2. 做一个标准后台列表页 demo：标题区 + 筛选区 + 表格区 + 新建弹窗
3. 从 demo 里抽出 `PageHeader`、`SearchToolbar`、`ConfirmDangerDialog`、`PageShell`
4. 把页面间距、标题区、筛选区、表格区、操作区规则写入 `docs/LAYOUTS.md`
5. 再扩展详情页、编辑页、设置页、Dashboard 等内部 Blocks

## 关键原则

- 基础组件不手写，优先从 shadcn 拉
- shadcn 上游更新默认不自动同步，按需单组件评估升级
- 页面不从零写，优先从 shadcn Blocks / v0 / 内部 Blocks 起步
- 公司组合组件可以写，但必须是 shadcn 组件的可读组合
- Agent UI 可以生成界面，但只能生成受控 JSON 意图，不执行 LLM 生成代码
- token 真相源仍然是 `theme/fx-theme.css`
- 对外分发主题时使用 shadcn 官方 `registry:theme` 格式：`registry/fx-theme.json`
- 布局规范来自真实页面沉淀，不凭空制定

## 相关文件

| 文件 | 关系 |
|------|------|
| `PRODUCT.md` | 产品定位决定架构方向 |
| `PROJECT.md` | 当前进度（本文件只记长期方向，不记当前做到哪） |
| `docs/LAYOUTS.md` | 三层体系第三层的具体布局规范产出 |
| `docs/TOKENS.md` | token 真相源的具体取值表 |
