---
layer: knowledge
type: spec
last_verified: 2026-08-28
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
- Agent 回复可以通过受控 JSON 交给当前 React 适配器生成产品内 UI

## 三层体系

### 1. 基础组件层：shadcn/ui

目录建议：`src/components/ui/`

这一层以 shadcn/ui 拉下来的 open-code 组件为主体。shadcn 没有等价能力时，只允许 `components.manifest.json#nativeSemanticComponents` 白名单登记、绑定架构决策且能由机器检查的原生语义组件例外；当前只有 Link。

已有 shadcn 组件缺少主流基础能力时，可以在用户逐项审核后继续补齐在同一个 open-code 组件中，不因上游能力不全被迫拆到 fx 层；这类组件必须以 `origin: shadcn-extended` 登记 upstream、DEC 和扩展清单。只有跨组件的业务模式才进入 fx 层。

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

### 3. 页面 Block（区块）/ 布局规范层

目录：`src/components/recipes/`（已落地，文件夹历史名沿用）、`docs/LAYOUTS.md`

> **术语统一**：本项目把这一层叫 **Block（区块）**，对齐 shadcn "blocks"。文件夹名 `recipes/` 是历史遗留、不改（改动大），**"recipe" 与 "block" 在本项目同义**。注意：Panda/Chakra 体系里 "recipe" 指单组件的样式变体（cva 那种），跟我们说的"页面区块"不是一回事。

这一层用于快速生成完整页面，并从真实页面里抽出公司的布局规范。**Block = 可搬运的成形组合区块**：把 ui/fx 组件按真实场景拼好的标准用法（含交互），落成一个组件。**搭页面时整段搬运 block、只换数据，禁止手写重拼**（见 `AGENTS.md` 红线 6）。

已落地 Block：

- `CrmShellNav`（`src/components/recipes/crm-shell-nav.tsx`）：CRM 应用外壳导航 = NavRail 一级应用栏 + NavMenu 二级菜单的规范组合，全套折叠/固定/hover/选中交互。
- `CrmAppShell`（`src/components/recipes/crm-app-shell.tsx`）：CRM 整页外壳 = TopBar 顶栏 + CrmShellNav 双层导航 + 内容卡插槽（无圆角的灰底应用画布）。普通页面只往 children 塞内容并默认显示完整 chrome；搭建器可通过 `topBar`、`navigation` 与 `renderChrome` 声明式控制既有 chrome 区块，不复制其结构。`frame` 仅开放已校准的 `inset` / `continuous` 工作区层级。「客户列表页」模板即基于它。
- `DataTable`（`src/components/recipes/data-table.tsx`）：薄表格区块 = 表格 + 勾选(全选/半选) + 行操作；中间列由 `columns`（每列 `cell` render）驱动，受控，不引 TanStack；`density` 透传基础 Table 的已验证行高档。
- `ListToolbar`（`src/components/recipes/list-toolbar.tsx`）：列表页工具栏 = 筛选 + 复合搜索(scope+input) + 视图切换 + 右侧额外动作，全受控配置化。
- `ListPageHeader`（`src/components/recipes/list-page-header.tsx`）：列表页紧凑标题栏 = 标题 + 可选视图下拉(`views?`) + 操作插槽(`actions`，0..N 动态)。三轴变体由 props/slot 决定。
- `EditFormBlock`（`src/components/recipes/edit-form-block.tsx`）：schema 驱动的编辑表单区块 = Field + Input/Textarea + Button；内置必填校验、错误聚焦、提交 loading 和脏状态取消。
- `DetailPageBlock`（`src/components/recipes/detail-page-block.tsx`）：对象详情区块 = 身份头、字段网格、Tabs、活动时间线、关联记录和空态；页面只注入对象数据与动作。
- `PageBuilder`（`src/components/recipes/page-builder.tsx`）：受控页面/区块搭建工作台 = 已登记预设、Block slot、受限属性和真实预览；只消费 `docs/data/page-builder.manifest.json`，不接受任意 JSX/CSS。
- `BusinessComponentBuilder`（`src/components/recipes/business-component-builder.tsx`）：受控基础/业务组件组合工作台 = 默认容器或空白画布 + 组件/图层切换 + 拖放插入 + 画布多选成组 + Token 约束 Auto Layout + 真实实例属性 + 业务 Props 绑定 + 新建/更新发布目标。基础组件搭建与业务组件搭建复用同一工作台；基础组件固定为单根容器，第一个容器是默认白底的最外层容器，后续容器只作为它的直接子项。左侧以海报编辑器式可视素材块提供容器、文字、图标、分割线和结构预设，整块支持点击与拖拽。布局、颜色、间距和交互状态不是可插入节点，只在选中资产后的右侧属性中配置；全局不再重复暴露 Auto Layout 或外边距。属性页只保留当前资产的属性标题和真实控件，不重复展示 Token 标签、选中说明或基础资产来源。业务组件因允许多个根节点，继续保留整体 Auto Layout，并保留组件来源与契约提示。基础组件以实时画布作为唯一预览，直接发布当前受控草稿，不再设置重复的“生成候选 / 预览验收”确认门。可编辑属性从 `component-playgrounds.manifest.json` 的真实 Playground contract 派生，搭建器只声明经过评审的键；实例值和公开 Prop 默认值共同进入草稿、撤销历史与发布产物，不复制选项或发明组件 API。旧 `ComponentBuilder` 保留为外部 Agent 候选契约的内部适配参考，不再作为用户可切换模式。

候选 Blocks：

- `ListPageBlock`：列表页，含筛选、表格、分页、批量操作
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

## 跨框架边界

上述生产层是当前 React 参考适配器的实现结构。它们上方共享一套框架无关核心契约：Token 与语义槽、组件身份和受治理选项、图标语义 ID、页面类型/数据契约、搭建操作协议和 Agent UI 协议。

FDS Token 架构为 `Primitive / Seed -> Map -> Semantic -> Component`，并以 `--fds-g-*` / `--fds-c-*` Styling Hooks 区分 Global 与受准入组件公开面。当前迁移阶段是 `fds-primary`：Foundation、Semantic、首批 Button/Input/Table Component Hooks、React runtime、公开装配与 portable contract 均使用 FDS 主名称；旧 `--fx-*` 只由生成兼容层保留至至少 v2.0.0。其余组件仍默认直接消费 Global Semantic，不批量开放 Hook。完整语法和迁移门见 `docs/TOKEN_NAMING.md`。

共享核心不是新的组件运行时，也不把 React JSX 翻译成其他框架。`docs/data/framework-core.manifest.json` 只从现有真相源生成 portable 投影；React 组件、Base UI 绑定、Tabler React 绑定、hooks、ref/event 约定和 Blocks renderer 都留在 React 适配器。Vue 2 当前只登记为 `planned`，没有实现目录或可用能力。详细边界和准入门见 `docs/FRAMEWORK_ADAPTERS.md`。

## 模块职责

| 目录 / 文件                           | 职责                                  | 备注                                                                     |
| ------------------------------------- | ------------------------------------- | ------------------------------------------------------------------------ |
| `src/components/ui/`                  | shadcn 原子组件，CLI 拉取             | open-code 可读可改；仅含 manifest 白名单的原生语义例外                   |
| `src/components/fx/`                  | 公司组合组件                          | 必须由 shadcn 组件组合而成，不做黑盒                                     |
| `src/components/recipes/`             | 已验证的 Block（历史目录名）          | 由真实页面提炼，整段复用、只换数据                                       |
| `src/pages/docs/<domain>/`            | 文档页及页面专属预览                  | 按 components / foundations / getting-started / governance / tokens 归位 |
| `src/pages/templates/`                | 已验证完整页面模板                    | 列表、编辑表单、详情页等页面级范例                                       |
| `src/app/`                            | 文档站壳、导航搜索与 hash 路由适配    | `App.tsx` 只保留运行时状态和页面组合                                     |
| `src/lib/`                            | 跨领域运行时、注册表和文档工具        | 不再承载具体页面模块                                                     |
| `src/components/fx/agent-surface.tsx` | Agent UI 渲染面                       | 受控 JSON -> 本地 React 组件                                             |
| `docs/AGENT_UI.md`                    | Agent UI 生成式界面协议               | 定义 block、action 和安全红线                                            |
| `docs/data/agent-ui.manifest.json`    | Agent UI 机器事实表                   | 给 AI 和检查脚本读取                                                     |
| `docs/data/framework-adapters.manifest.json` | 框架适配器状态真相源           | React ready；Vue 2 planned                                               |
| `docs/data/framework-core.manifest.json` | 跨框架核心派生契约                 | 不含框架源码、包绑定或渲染约定                                           |
| `docs/data/token-naming.manifest.json` | FDS Token 命名机器合同              | 四层、前缀、词典、公开边界、组件准入与迁移阶段 SSOT                       |
| `tokens/source/primitive.tokens.json` | DTCG Primitive 真相源                 | 仅 Foundation 维护者可改                                                 |
| `tokens/source/map.tokens.json`       | Map 算法、色阶与例外真相源            | 仅 Foundation 维护者可改；生成式，禁止手填派生结果                       |
| `theme/foundation.css`                | Foundation 运行时生成产物             | 由 `build:fds-foundation` 输出，禁止手改                                  |
| `theme/fds-semantic.css`              | Global Semantic 运行时生成产物        | 由 `build:fds-semantic` 输出，禁止手改                                    |
| `theme/fds-components.css`            | Component Styling Hooks 运行时生成产物 | 由 `build:fds-components` 输出，禁止手改                                  |
| `theme/fx-theme.css`                  | 运行时唯一公开装配入口                | 固定导入 Foundation/Semantic；组件只消费这里暴露的语义槽                  |
| `registry/fx-theme.css` / `registry/fx-theme.contract.json` | 框架无关主题发布产物 | 同版本 CSS 与机器合同，由 Preset Contract 派生                           |
| `registry/fx-theme.json`              | shadcn 官方 `registry:theme` 分发格式 | 由真实 CSS 解析生成 light/dark，不手填                                   |
| `registry/fx-theme.release.json`      | 主题版本发布清单                       | 绑定 CSS/JSON/审计/portable core 哈希与适配器状态                         |
| `docs/data/theme-audit.manifest.json` | 主题发布质量证据                       | Chromium 审计预设/自定义样本的对比度、状态与失效变量                     |
| `docs/components/`                    | 组件文档资产                          | 给人和 AI 共同消费                                                       |
| `docs/LAYOUTS.md`                     | 布局规范                              | 来自真实页面沉淀                                                         |

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
- FDS Token 链路固定为 `tokens/source Primitive / Seed → Map generator → Semantic → Component`；迁移前后都不允许反向引用、循环引用或复制物理值
- 跨框架只共享语义契约，不共享或翻译框架运行时代码
- `planned` 适配器不等于已支持；通过独立准入门后才能升级状态
- 对外分发主题时使用 shadcn 官方 `registry:theme` 格式：`registry/fx-theme.json`
- 布局规范来自真实页面沉淀，不凭空制定

## 相关文件

| 文件              | 关系                                           |
| ----------------- | ---------------------------------------------- |
| `PRODUCT.md`      | 产品定位决定架构方向                           |
| `PROJECT.md`      | 当前进度（本文件只记长期方向，不记当前做到哪） |
| `docs/LAYOUTS.md` | 三层体系第三层的具体布局规范产出               |
| `docs/TOKENS.md`  | token 真相源的具体取值表                       |
| `docs/FRAMEWORK_ADAPTERS.md` | 跨框架核心与适配器准入边界             |
