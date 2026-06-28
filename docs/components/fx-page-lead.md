---
category: Maintain
group: 网站规范
title: PageLead
subtitle: 文档页标题区
description: 网站规范项，用于维护本站文档页标题区的复用模式。
source: src/components/fx/page-lead.tsx
theme: theme/fx-theme.css
tokens:
  - foreground
  - muted-foreground
  - border
status: complete
---

# PageLead 文档页标题区

网站规范项，用于维护本站文档页标题区的复用模式。

源码来自 fx-ui 公司组合组件，进入项目后保持 open-code。公司视觉通过 `theme/fx-theme.css` 的语义 token 注入，不通过重新封装、硬编码颜色或手写状态样式实现。

AI 使用 PageLead 前必须先以 `src/components/fx/page-lead.tsx` 为真实 API；本文档记录的是当前仓库源码能力，不是凭记忆推断的组件能力。

## 来源 {#source}

```txt
src/components/fx/page-lead.tsx
```

## 使用方式 {#usage}

```tsx
import { PageLead } from "@/components/fx/page-lead"
```

```tsx
<PageLead
  crumb="Components / Buttons"
  title="Button 按钮"
  lead="用于触发即时操作。支持多种尺寸、状态和视觉变体。"
  actions={<Button variant="secondary">复制当前页</Button>}
/>
```

## 组件总览 {#overview}

- 类型：fx
- 语义 DOM：root
- 原生/数据状态：root
- 变体：无独立 variant prop
- 导出项：PageLead

## 取值逻辑 {#value-rules}

- `crumb`：写页面所属层级，用 ` / ` 分隔；最后一段是当前页，显示为正文色。中文界面使用中文层级，例如 `组件 / Avatar 头像`、`设计 Tokens / 圆角`。
- `title`：写当前页唯一主标题，不自动拆分中英文；组件页可用 `Avatar 头像`，token 页用 `圆角`、`颜色` 这类中文主标题。
- `lead`：写一句页面说明，说明这个页面或组件解决什么问题，不重复标题。
- `actions`：只放页面级动作，例如复制当前页、更多菜单、上一篇 / 下一篇；不要放组件示例自己的操作。
- `separator`：默认不显示。只有页面需要明确分组时才显式开启。

## 场景示例 {#examples}

### 推荐场景

- 使用意图：文档站、官网或内容页顶部介绍区，承载面包屑、标题、说明和页面级操作。
- 规则：网站规范页只做枚举展示；业务后台页面标题区优先使用 PageHeader。

```tsx
<PageLead
  crumb="Components / Buttons"
  title="Button 按钮"
  lead="用于触发即时操作。支持多种尺寸、状态和视觉变体。"
  actions={<Button variant="secondary">复制当前页</Button>}
/>
```

### 不适合场景

- 不用 PageLead 代替业务后台页面的 PageHeader。
- 不复制组件内部 JSX 到页面里再改间距、字号或分隔线。
- 不通过 `className` 硬覆盖组件内部颜色、圆角、边框、阴影和状态样式。

## API {#api}

源码定义的 PageLeadProps：

| 属性 | 说明 |
| --- | --- |
| `crumb: string` | 面包屑文本，用 ` / ` 分隔层级 |
| `title: string` | 主标题，按传入文本完整显示 |
| `lead: ReactNode` | 页面说明 |
| `actions: ReactNode` | 右侧页面级操作 |
| `separator?: boolean` | 是否显示标题区后的分隔线，默认 `false` |

## Semantic DOM {#semantic-dom}

| 部位 | 说明 |
| --- | --- |
| `root` | 组件根节点；源码没有更细 data-slot 时按根节点理解 |

## 状态标记 {#states}

| 状态 | 说明 |
| --- | --- |
| `root` | 无额外交互状态，按根节点语义理解 |

## 主题变量 Design Token {#design-token}

| Token | 用途 |
| --- | --- |
| `--foreground` | 主要文字 |
| `--muted-foreground` | 面包屑和说明 |
| `--border` | 可选分隔线 |

完整 token 规则见 `docs/TOKENS.md`。

## AI Rules {#ai-rules}

- 公司组合组件只组合现有 shadcn/ui 能力，不新增隐藏 API。
- 文档站、官网或内容页优先复用 PageLead，业务后台页面标题区优先复用 PageHeader。
- 不要复制组件内部 JSX 到页面里再改样式。
- 使用 PageLead 前必须以 src/components/fx/page-lead.tsx 为真实 API。
- 不要手写颜色、圆角、边框和状态样式；优先使用源码已有 prop、状态和 token。
- className 只用于布局、宽度或外部间距，不用于覆盖组件自身基础视觉。

## 正误示例 {#do-dont}

### 使用现有组件能力

不推荐：

```tsx
// 不要在页面里手写一个看起来像 PageLead 的 div。
<div className="doc-page-lead">...</div>
```

推荐：

```tsx
<PageLead
  crumb="Components / Buttons"
  title="Button 按钮"
  lead="用于触发即时操作。支持多种尺寸、状态和视觉变体。"
  actions={<Button variant="secondary">复制当前页</Button>}
/>
```
