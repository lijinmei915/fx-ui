---
category: Components
group: 组合组件
title: ComponentPlayground
subtitle: 组件调试台
description: fx 组合组件，用于组件文档里的通用交互调试与受控组件制作。
source: src/components/fx/component-playground.tsx
theme: theme/fx-theme.css
tokens:
  - card
  - muted
  - foreground
  - muted-foreground
  - border
  - primary
status: complete
---

# ComponentPlayground 组件调试台

fx 组合组件，用于组件文档里的通用交互调试台。默认保持普通调试视图；配置制作台能力后，用户点击“编辑组件”才展开结构树、节点属性、语义 Token 槽位与真实渲染验证。制作台使用独立临时草稿；点击“完成编辑”返回普通调试视图并恢复进入编辑前的实时属性。

调试台统一使用 Card 的 `size="lg"` 间距档，顶部属性与意图区四边内距为 16px；该尺寸只作用于 ComponentPlayground，不修改全局 `--fx-panel-padding`。

预览与代码 Tab 共用同一套工具栏按钮结构：左右内距使用 `--fx-control-px-md`（12px），图标与文字间距使用间距规范 `gap-2`（8px），两个图标统一为 18px；不得在单个组件页分别覆盖。

源码来自 fx-ui 公司组合组件，由 Button、Input 等现有 shadcn/ui 能力组合而成。公司视觉通过 `theme/fx-theme.css` 的语义 token 注入，不通过重新封装、硬编码颜色或手写状态样式实现。

AI 使用 ComponentPlayground 前必须先以 `src/components/fx/component-playground.tsx` 为真实 API；本文档记录的是当前仓库源码能力，不是凭记忆推断的组件能力。

## 来源 {#source}

```txt
src/components/fx/component-playground.tsx
```

## 使用方式 {#usage}

```tsx
import { ComponentPlayground, type ComponentPlaygroundConfig } from "@/components/fx/component-playground"
```

```tsx
const config: ComponentPlaygroundConfig = {
  storySource: "docs/data/component-playgrounds.manifest.json#components.example",
  props: [
    { key: "text", zh: "内容", en: "Text", propName: "children", type: "text" },
  ],
  initial: { text: "保存" },
  renderOne: (v) => <Button>{v.text}</Button>,
  genCode: (v) => `<Button>${v.text}</Button>`,
}

<ComponentPlayground config={config} lang="zh" />

// 搭建器需要共享撤销 / 重做历史时可使用受控值
<ComponentPlayground config={config} lang="zh" value={values} onValueChange={setValues} />
```

## 组件总览 {#overview}

- 类型：fx
- 语义 DOM：root、interactive-props、intent、recommended-code、preview、code、`data-slot="component-playground-structure"`、`data-slot="component-playground-state-assignments"`、`data-slot="component-playground-validation"`
- 原生/数据状态：preview-tab、code-tab、copied、scenario-selected、workbench-editing、workbench-node-selected、state-assignment-previewed
- 变体：无独立 variant prop；能力由 `ComponentPlaygroundConfig` 驱动
- 导出项：ComponentPlayground、ComponentPlaygroundConfig、`PlaygroundSegmentedControl`、`buildPlaygroundStories` 及相关类型

### Story 归一化

`buildPlaygroundStories(props, values)` 是 Playground 的统一 story 归一化入口。它只展开当前被选择为“全部”的、声明了 `hasAll` 的属性，返回稳定的 `id` 与真实组件值；`all` 只存在于矩阵预览，不会进入生成代码。组件页、视觉测试和 Agent 示例应复用这份 story 结构，不要另写一套矩阵组合逻辑。

组件 manifest 中若声明 `visualTests`，必须同时声明 `visual.route`、`visual.selector` 和 `visual.screenshot`。视觉测试从这些字段读取路由、定位器和基线文件，避免在测试代码里复制页面事实。

```tsx
import { buildPlaygroundStories } from "@/components/fx/component-playground"

const stories = buildPlaygroundStories(config.props, currentValues)
```

制作台模式仍由 `ComponentPlaygroundConfig` 驱动：结构事实、属性归属、Token 槽位、状态语义映射和检查项来自 `docs/data/component-playgrounds.manifest.json`；组件页只提供真实组件渲染和检查逻辑。存在 `workbench` 配置不代表默认展开，统一由调试台工具栏的“编辑组件 / 完成编辑”切换。

## 场景示例 {#examples}

### 推荐场景

- 使用意图：组件文档里的实时属性调试、预览、使用意图和复制代码。
- 放什么：源码真实存在的 prop、推荐写法、预览态。
- 不放什么：业务配置表单、后台筛选面板、和组件源码不一致的临时选项。

### 文案口径

- 使用意图：写“何时用 / 为什么用”，说明这个选项解决的场景或目的，不写实现细节。
- 约束：写“必须怎么按源码组装 / 禁止什么”，说明真实 API、组合边界和不要发明的能力。
- `实时属性`、`使用意图`、`约束` 三块都必须优先使用当前界面语言：中文界面先写友好的中文能力名和人能读懂的规则，必要的源码名、prop 名、组件名放在句末括号或代码里补充；不要用英文 API 拼成中文句子的主体。
- 每个可点击的 segment 选项都必须同时提供使用意图和约束；不允许切换后右侧说明为空。
- 同一选项在调试台和场景示例里使用同一套意图与约束文案，避免上下两处口径漂移。

### 实时属性标题

- 标题写“调的是谁的哪个能力”，优先对应源码 prop 名或稳定组合能力。
- 中文界面优先使用中文组件名和中文能力名，标题尽量不出现英文；页面标题和调试项标题默认只写中文，例如写“按钮组”“尺寸”，不写“Button Group 按钮组”“内部 Button 尺寸”。
- 组件自身 prop 直接写能力名，如“类型”“尺寸”“方向”；按钮 `variant` 这类视觉变体在中文标题里统一叫“类型”，约束或代码里再对应真实 prop。
- 组合组件标题优先精简；如果上下文已经是某组件调试台，不重复写“内部按钮”，例如按钮组的 `Button.size` 写“尺寸”，`Button.variant` 写“类型”。
- 不把取值写进标题；标题负责维度，下面的 tab 负责取值。
- 不写业务场景词，如“表格模式”“详情模式”；业务场景应进入使用意图或场景示例。

### 实时属性分组与场景准入

新建或改造 Playground 时，实时属性按固定顺序分组：**内容 → 结构 → 外观 → 行为 → 语义**。各组只展示组件源码的真实 API 或已声明组合能力：内容是用户可见数据；结构是 header、leading、trailing、footer 等真实槽位；外观是 variant、size、tone 等视觉 API；行为是 loading 等交互/组合态；语义是 type、required、readOnly、aria-* 等原生 HTML 或无障碍能力。没有对应能力的组不渲染，禁止用布局宽度、外层间距或页面覆盖类凑控制项。

结构示例与场景预设都不属于实时属性，且都要求至少两条可切换 story。`examples` 只展示不同的真实组件结构，不得伪称业务场景；`presets` 必须同时满足“改变结构”、“需要联动多个真实 props 或状态”以及“具备已验证的使用意图与约束”。两者都排在实时属性之前，让用户先选完整场景，再按内容、结构、外观、行为、语义微调。仅改变一个 prop、可由面板独立配置的 props 组合、或仅覆盖布局的内容不得创建 story。这些规则的机器事实见 `docs/data/component-playgrounds.manifest.json#controlPanelContract`，由 `check-playground-contract.mjs` 校验。

### Tab 选项文案

- Tab 文案写短值名，2-5 个字为主，整组保持同一语法层级。
- 视觉/API 取值可用设计语言翻译，如 `default` 写“实心”或“主按钮”，`outline` 写“描边”；必要时在约束里补真实 prop。
- 尺寸 tab 中文必须写“语义 + 数值”，如“超小20 / 小24 / 默认32 / 中32 / 大40 / 超大48”；不直接暴露 `xs/sm/lg/xl`，也不写 `px`，英文界面再保留真实 size 名和 px。
- 不在 tab 文案里写说明句、括号说明或实现细节；这些放到使用意图和约束。
- 有“全部”时只用于矩阵预览；会破坏真实单一取值或组合语义的属性不提供“全部”。
- 任意维度选中“全部”时，调试台只展示预览，不展示代码 tab 和复制按钮；需要复制代码时必须先选回一个具体取值。

## API {#api}

源码定义的 ComponentPlaygroundConfig：

| 属性 | 说明 |
| --- | --- |
| `props` | 调试属性列表，支持 segment 和 text |
| `initial` | 初始值 |
| `leadingControls?` | 可选的结构化前置实时属性；由调试台统一渲染双语标签和控件排列，适合图标导出等无法由 segment/text 表达的真实选择能力 |
| `PlaygroundSegmentedControl` | 前置实时属性需要分段选择时复用的统一控件，视觉和普通 segment 属性一致 |
| `storySource?` | 可选 manifest/story 来源指针，同时写入根节点 `data-story-source`，供视觉测试和 Agent 审计 |
| `stories?` | Storybook-lite 风格的结构示例或场景预设；两条及以上才显示切换控件。每项包含 `id`、`name`、`nameEn`、`args` 和 `parameters` |
| `storyPresentation?` | `examples` 显示“结构示例”；`presets` 显示“场景预设” |
| `guidanceKey?` | 用于展示使用意图的属性 key |
| `workbench?` | 可选制作台配置：结构节点、状态语义映射、真实 DOM 检查目标和验证项 |
| `value?` | 可选受控实时属性值；用于搭建器历史和 Agent 操作 |
| `onValueChange?` | 受控值变更回调；手动属性与 Agent 必须共用它 |
| `renderOne` | 根据当前值渲染预览 |
| `genCode` | 根据当前值生成复制代码 |

## 主题变量 Design Token {#design-token}

| Token | 用途 |
| --- | --- |
| `--card` | 调试台主体背景 |
| `--muted` | 属性区和工具栏背景 |
| `--foreground` | 主要文字 |
| `--muted-foreground` | 辅助文字 |
| `--border` | 分隔线和边框 |
| `--primary` | 当前标签、强调态 |

完整 token 规则见 `docs/TOKENS.md`。

## AI Rules {#ai-rules}

- 每个调试项必须来自组件源码真实 prop，不发明不存在的 prop。
- `leadingControls` 只承载真实组件或导出选择能力，仍属于实时属性；不得用它放页面操作、说明或任意样式配置。
- 新建或改造 Playground 必须按 controlPanelContract 的五组顺序声明实时属性；场景预设必须通过其准入规则，不能作为重复属性的快捷入口。
- 结构示例与场景预设承载组合级切换；如果 stories 之间只由一个配置维度区分，该维度不得再作为实时属性重复展示。
- `renderOne` 与 `genCode` 必须保持同一组值。
- 制作台选中结构节点后，只展示归属于该节点的真实 props；节点增删由 manifest 中的结构插槽控制，不发明组件 prop。
- 默认进入普通调试视图，只展示组件的常用根属性；制作台结构和 Token 必须在用户点击“编辑组件”后才显示。进入编辑时快照普通调试值，编辑期间只修改临时草稿，完成编辑后恢复快照，不能污染普通实时属性。
- 带制作台的组件必须用 `defaultVisible/defaultOrder` 明确声明普通调试视图的调用属性；`owner` 只表达编辑态节点归属，不能再被当作默认可见性的替代判断。普通视图不展示 hover/focus 等不可调用状态或结构槽位。
- Token 面板只展示组件契约声明的语义 Token；预览通过局部 CSS 变量映射验证效果，生成内容是组件作者草稿，不能作为页面调用处的样式覆盖。
- Token 选项默认显示面向协作者的用途语义，真实 Token 作为稳定 value 和悬停提示保留；展示文案不能成为第二套 Token 真相源。
- 当槽位选择自身默认 Token 时必须省略局部 CSS 变量覆盖；禁止生成 `--input: var(--input)` 这类自引用，否则浏览器会把该变量判为无效。
- 状态语义映射只声明源码真实存在的组件状态；点击映射可切换真实预览。状态行展示语义 Token、当前主题色块和从 `design-tokens.json` 自动派生的色板名称，不展示 `oklch/rgb` 原始值，也不把色板名称开放为可编辑配置。
- 状态映射统一按“组件用法（组件/属性/状态）→ 语义 Token → 基础色板”表达；当前 `componentUsage` 不是独立组件 Token 层。默认让组件直接消费 shadcn 语义槽，只有满足 DEC-037 准入条件时才新增组件 Token。
- 生效确认必须同时展示真实 `data-slot`、计算高度/颜色、结构检查、可访问性检查和代码同源状态。
- ComponentPlayground 只用于文档站组件示例调试，不替代业务表单或真实配置面板。
- 使用 ComponentPlayground 前必须以 src/components/fx/component-playground.tsx 为真实 API。
- className 只用于布局、宽度或外部间距，不用于覆盖组件自身基础视觉。
