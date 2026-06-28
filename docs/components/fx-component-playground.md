---
category: Maintain
group: 网站规范
title: ComponentPlayground
subtitle: 组件调试台
description: 网站规范项，用于维护本站组件文档里的交互调试台。
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

网站规范项，用于维护本站组件文档里的交互调试台。

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
