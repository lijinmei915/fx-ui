---
category: Maintain
group: 网站规范
title: PageActions
subtitle: 页面动作区
description: 网站规范项，用于维护本站文档页右上角页面级动作。
source: src/components/fx/page-actions.tsx
theme: theme/fx-theme.css
tokens:
  - foreground
  - muted-foreground
  - border
  - secondary
status: complete
---

# PageActions 页面动作区

网站规范项，用于维护本站文档页右上角页面级动作。

源码来自 fx-ui 公司组合组件，由 Button、ButtonGroup、DropdownMenu 组合而成。公司视觉通过 `theme/fx-theme.css` 的语义 token 注入，不通过重新封装、硬编码颜色或手写状态样式实现。

AI 使用 PageActions 前必须先以 `src/components/fx/page-actions.tsx` 为真实 API；本文档记录的是当前仓库源码能力，不是凭记忆推断的组件能力。

## 来源 {#source}

```txt
src/components/fx/page-actions.tsx
```

## 使用方式 {#usage}

```tsx
import { PageActions } from "@/components/fx/page-actions"
```

```tsx
<PageActions
  copyLabel="复制当前页"
  copyLinkLabel="复制链接"
  moreLabel="更多操作"
  previousLabel="上一篇"
  nextLabel="下一篇"
  previousHref="#intro"
  nextHref="#documentation"
/>
```

## 组件总览 {#overview}

- 类型：fx
- 语义 DOM：root、copy-action、more-menu、page-navigation
- 原生/数据状态：disabled、menu-open
- 变体：无独立 variant prop
- 导出项：PageActions、PageActionsShell、CopyPageAction、PageStepActions

## 场景示例 {#examples}

### 推荐场景

- 使用意图：文档站页面右上角的页面级工具。
- 放什么：复制当前页、复制链接、查看模式切换、上一篇 / 下一篇导航。
- 分层：主按钮放最高频动作；下拉只放同页次级动作；页间导航独立在右侧。
- 不放什么：组件示例内部操作、表格行操作、业务审批动作或危险操作。

```tsx
<PageActions
  copyLabel="复制当前页"
  copyLinkLabel="复制链接"
  moreLabel="更多操作"
  previousLabel="上一篇"
  nextLabel="下一篇"
  previousHref="#intro"
  nextHref="#documentation"
/>
```

## API {#api}

源码定义的 PageActionsProps：

| 属性 | 说明 |
| --- | --- |
| `copyLabel: string` | 主按钮文案 |
| `copyLinkLabel: string` | 更多菜单里的复制链接文案 |
| `moreLabel: string` | 更多按钮可访问名称 |
| `previousLabel: string` | 上一页按钮可访问名称 |
| `nextLabel: string` | 下一页按钮可访问名称 |
| `previousHref?: string` | 上一页链接；为空时按钮禁用 |
| `nextHref?: string` | 下一页链接；为空时按钮禁用 |
| `onCopyPage?: () => void` | 复制当前页回调 |
| `onCopyLink?: () => void` | 复制链接回调 |

## Semantic DOM {#semantic-dom}

| 部位 | 说明 |
| --- | --- |
| `root` | 页面动作区整体 |
| `copy-action` | 主复制动作 |
| `more-menu` | 更多动作菜单 |
| `page-navigation` | 上一页 / 下一页导航 |

## 状态标记 {#states}

| 状态 | 说明 |
| --- | --- |
| `disabled` | 没有上一页或下一页时禁用对应导航按钮 |
| `menu-open` | 更多菜单展开态，来自 DropdownMenu |

## 主题变量 Design Token {#design-token}

| Token | 用途 |
| --- | --- |
| `--foreground` | 主要文字 |
| `--muted-foreground` | 菜单辅助文字 |
| `--border` | 分隔线 |
| `--secondary` | 次级按钮背景 |

完整 token 规则见 `docs/TOKENS.md`。

## AI Rules {#ai-rules}

- PageActions 只放页面级工具，不承载业务操作。
- 主按钮放最高频动作；下拉只放同页次级动作；页间导航独立在右侧。
- 公司组合组件只组合现有 shadcn/ui 能力，不新增隐藏 API。
- 使用 PageActions 前必须以 src/components/fx/page-actions.tsx 为真实 API。
- 不要复制组件内部 JSX 到页面里再改样式。
- className 只用于布局、宽度或外部间距，不用于覆盖组件自身基础视觉。
