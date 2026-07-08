---
category: Maintain
group: 网站规范
title: PageActions
subtitle: 页面动作区
description: 网站规范项，用于维护业务操作区按钮排列与本站文档页右上角页面级动作。
source: src/components/fx/page-actions.tsx
theme: theme/fx-theme.css
tokens:
  - foreground
  - muted-foreground
  - border
  - secondary
status: complete
---

# PageActions / ActionRow 动作区

网站规范项，用于维护两类动作区：

- `ActionRow`：业务操作区按钮排列，表达主操作、次级操作、更多操作的布局关系。
- `PageActions`：本站文档页右上角页面级动作，只放复制、更多菜单和页间导航。

源码来自 fx-ui 公司组合组件，由 Button、ButtonGroup、DropdownMenu 组合而成。公司视觉通过 `theme/fx-theme.css` 的语义 token 注入，不通过重新封装、硬编码颜色或手写状态样式实现。

AI 使用 ActionRow / PageActions 前必须先以 `src/components/fx/page-actions.tsx` 为真实 API；本文档记录的是当前仓库源码能力，不是凭记忆推断的组件能力。

## 来源 {#source}

```txt
src/components/fx/page-actions.tsx
```

## 使用方式 {#usage}

```tsx
import { ActionRow, PageActions } from "@/components/fx/page-actions"
```

```tsx
<ActionRow
  primary={
    <Button>
      <PlusIcon data-icon="inline-start" />
      新建
    </Button>
  }
  secondary={[
    <Button key="smart-form" variant="outline">智能表单</Button>,
    <Button key="import" variant="outline">导入</Button>,
  ]}
  more={
    <Button variant="outline" size="icon-sm" aria-label="更多操作">
      <MoreHorizontalIcon />
    </Button>
  }
/>
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
- 语义 DOM：action-row、action-row-secondary、action-row-more、root、copy-action、more-menu、page-navigation
- 原生/数据状态：disabled、menu-open
- 变体：无独立 variant prop
- 导出项：ActionRow、PageActions、PageActionsShell、CopyPageAction、PageStepActions

## 场景示例 {#examples}

### ActionRow 业务操作区

- 使用意图：页面头部、列表工具栏和业务操作区的按钮排列。
- 放什么：一个主操作、若干次级操作；当操作增长到 4 个时，把低频动作收进更多操作入口。
- 分层：主操作直接使用 Button 的 `default`；次级操作通常使用 `outline`；更多操作使用 `outline + icon-sm + aria-label`。
- 不放什么：连续贴合的一组按钮；这种视觉上合成一个控件的情况使用 ButtonGroup。

数量判断：

| 数量 | 推荐结构 | 说明 |
| --- | --- | --- |
| 2 个 | `primary + secondary[1]` | 最轻量的操作区，两个按钮直接可见 |
| 3 个 | `primary + secondary[2]` | 常规操作区，三个按钮仍可直接平铺 |
| 4 个 | `primary + secondary[2] + more` | 第四个入口收成更多，不继续横向堆叠 |

```tsx
<ActionRow
  primary={
    <Button>
      <PlusIcon data-icon="inline-start" />
      新建
    </Button>
  }
  secondary={[
    <Button key="smart-form" variant="outline">智能表单</Button>,
    <Button key="import" variant="outline">导入</Button>,
  ]}
  more={
    <Button variant="outline" size="icon-sm" aria-label="更多操作">
      <MoreHorizontalIcon />
    </Button>
  }
/>
```

### PageActions 文档页动作

- 使用意图：文档站页面右上角的页面级工具。
- 放什么：复制当前页、复制链接、查看模式切换、上一篇 / 下一篇导航。
- 分层：复制、更多与页间导航都用 `secondary` 承载页面级次级动作；页间导航独立在右侧，用 `toolbar-icon` 保持 28px 热区。
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

源码定义的 ActionRowProps：

| 属性 | 说明 |
| --- | --- |
| `primary: React.ReactNode` | 主操作，通常传一个 `Button` |
| `secondary?: React.ReactNode[]` | 次级操作列表，通常传 `variant="outline"` 的 Button |
| `more?: React.ReactNode` | 更多操作入口，通常传 `variant="outline" size="icon-sm"` 的 Button，并提供 `aria-label` |

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
| `action-row` | 业务操作区按钮排列整体 |
| `action-row-secondary` | 次级操作插槽 |
| `action-row-more` | 更多操作插槽 |
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
| `--secondary` | 次级按钮背景 |
| `--fx-control-gap` | ActionRow 独立按钮之间的间距 |

完整 token 规则见 `docs/TOKENS.md`。

## AI Rules {#ai-rules}

- ActionRow 用于业务操作区按钮排列，不用于连续贴合按钮；连续贴合按钮使用 ButtonGroup。
- ActionRow 只管理排列关系，不改变 Button 的 variant、size、tone 或交互态。
- ActionRow 主操作通常放一个 `default` Button；次级操作通常使用 `outline`；4 个动作时低频动作收进 `more`，更多操作使用 `outline + icon-sm + aria-label`。
- PageActions 只放页面级工具，不承载业务操作。
- 复制、更多与页间导航统一用 `secondary`；页间导航用 `toolbar-icon`，不要在调用处覆盖成自定义底色。
- 公司组合组件只组合现有 shadcn/ui 能力，不新增隐藏 API。
- 使用 PageActions 前必须以 src/components/fx/page-actions.tsx 为真实 API。
- 不要复制组件内部 JSX 到页面里再改样式。
- className 只用于布局、宽度或外部间距，不用于覆盖组件自身基础视觉。
