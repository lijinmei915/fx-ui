---
category: Components
group: 组合组件
title: ComponentPlayground
subtitle: 组件调试台
description: fx 组合组件，用于组件文档里的通用交互调试台。
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

fx 组合组件，用于组件文档里的通用交互调试台。

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
  props: [
    { key: "text", zh: "内容", en: "Text", propName: "children", type: "text" },
  ],
  initial: { text: "保存" },
  renderOne: (v) => <Button>{v.text}</Button>,
  genCode: (v) => `<Button>${v.text}</Button>`,
}

<ComponentPlayground config={config} lang="zh" />
```

## 组件总览 {#overview}

- 类型：fx
- 语义 DOM：root、interactive-props、intent、recommended-code、preview、code
- 原生/数据状态：preview-tab、code-tab、copied、scenario-selected
- 变体：无独立 variant prop；能力由 `ComponentPlaygroundConfig` 驱动
- 导出项：ComponentPlayground、ComponentPlaygroundConfig 及相关类型

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
| `scenarios?` | 可选场景预设 |
| `guidanceKey?` | 用于展示使用意图的属性 key |
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
- `renderOne` 与 `genCode` 必须保持同一组值。
- ComponentPlayground 只用于文档站组件示例调试，不替代业务表单或真实配置面板。
- 使用 ComponentPlayground 前必须以 src/components/fx/component-playground.tsx 为真实 API。
- className 只用于布局、宽度或外部间距，不用于覆盖组件自身基础视觉。
