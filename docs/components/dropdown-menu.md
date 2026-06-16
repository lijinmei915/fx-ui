---
category: Components
group: 通用
title: DropdownMenu
subtitle: 下拉菜单
description: 用于从触发器打开一组命令或导航项。
source: src/components/ui/dropdown-menu.tsx
theme: theme/fx-theme.css
tokens:
  - foreground
  - popover
  - popover-foreground
  - muted
  - muted-foreground
  - accent
  - accent-foreground
  - destructive
  - border
  - ring
status: complete
---

# DropdownMenu 下拉菜单

用于从触发器打开一组命令或导航项。

源码来自 shadcn/ui，进入项目后保持 open-code。公司视觉通过 `theme/fx-theme.css` 的语义 token 注入，不通过重新封装、硬编码颜色或手写状态样式实现。

AI 使用 DropdownMenu 前必须先以 `src/components/ui/dropdown-menu.tsx` 为真实 API；本文档记录的是当前仓库源码能力，不是凭记忆推断的组件能力。

## 来源 {#source}

```txt
src/components/ui/dropdown-menu.tsx
```

## 使用方式 {#usage}

```tsx
import { DropdownMenu, DropdownMenuPortal, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuGroup, DropdownMenuLabel, DropdownMenuItem, DropdownMenuCheckboxItem, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent } from "@/components/ui/dropdown-menu"
```

```tsx
<DropdownMenu>
  <DropdownMenuTrigger render={<Button variant="outline" />}>更多</DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuGroup>
      <DropdownMenuItem>编辑</DropdownMenuItem>
      <DropdownMenuItem variant="destructive">删除</DropdownMenuItem>
    </DropdownMenuGroup>
  </DropdownMenuContent>
</DropdownMenu>
```

## 组件总览 {#overview}

- 类型：overlay
- 语义 DOM：data-slot="dropdown-menu"、data-slot="dropdown-menu-portal"、data-slot="dropdown-menu-trigger"、data-slot="dropdown-menu-content"、data-slot="dropdown-menu-group"、data-slot="dropdown-menu-label"、data-slot="dropdown-menu-item"、data-slot="dropdown-menu-sub"、data-slot="dropdown-menu-sub-trigger"、data-slot="dropdown-menu-sub-content"、data-slot="dropdown-menu-checkbox-item"、data-slot="dropdown-menu-checkbox-item-indicator"、data-slot="dropdown-menu-radio-group"、data-slot="dropdown-menu-radio-item"、data-slot="dropdown-menu-radio-item-indicator"、data-slot="dropdown-menu-separator"、data-slot="dropdown-menu-shortcut"
- 原生/数据状态：disabled、data-open、data-closed
- 变体：无独立 variant prop
- 导出项：DropdownMenu、DropdownMenuPortal、DropdownMenuTrigger、DropdownMenuContent、DropdownMenuGroup、DropdownMenuLabel、DropdownMenuItem、DropdownMenuCheckboxItem、DropdownMenuRadioGroup、DropdownMenuRadioItem、DropdownMenuSeparator、DropdownMenuShortcut、DropdownMenuSub、DropdownMenuSubTrigger、DropdownMenuSubContent

## 场景示例 {#examples}

### 推荐场景

- 使用意图：用于从触发器打开一组命令或导航项。
- 规则：优先使用源码已有子组件、props、状态和 token，不复制内部 JSX 到业务页面里重写。

```tsx
<DropdownMenu>
  <DropdownMenuTrigger render={<Button variant="outline" />}>更多</DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuGroup>
      <DropdownMenuItem>编辑</DropdownMenuItem>
      <DropdownMenuItem variant="destructive">删除</DropdownMenuItem>
    </DropdownMenuGroup>
  </DropdownMenuContent>
</DropdownMenu>
```

### 不适合场景

- 不用 DropdownMenu 承载它职责之外的语义。
- 不通过 `className` 硬覆盖组件内部颜色、圆角、边框、阴影和状态样式。
- 不发明源码里没有的 prop、variant、size 或状态。

## API {#api}

该组件以源码导出的子组件和原生 props 为准。使用前读取 `src/components/ui/dropdown-menu.tsx`，不要凭空发明 API。


## Semantic DOM {#semantic-dom}

| 部位 | 说明 |
| --- | --- |
| `data-slot="dropdown-menu"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="dropdown-menu-portal"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="dropdown-menu-trigger"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="dropdown-menu-content"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="dropdown-menu-group"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="dropdown-menu-label"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="dropdown-menu-item"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="dropdown-menu-sub"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="dropdown-menu-sub-trigger"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="dropdown-menu-sub-content"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="dropdown-menu-checkbox-item"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="dropdown-menu-checkbox-item-indicator"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="dropdown-menu-radio-group"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="dropdown-menu-radio-item"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="dropdown-menu-radio-item-indicator"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="dropdown-menu-separator"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="dropdown-menu-shortcut"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |

## 状态标记 {#states}

| 状态 | 说明 |
| --- | --- |
| `disabled` | 禁用态，阻止交互并降低视觉权重 |
| `data-open` | 浮层或折叠内容打开态 |
| `data-closed` | 浮层或折叠内容关闭态 |

## 主题变量 Design Token {#design-token}

| Token | 用途 |
| --- | --- |
| `--foreground` | 主要文字和图标 |
| `--popover` | 浮层背景 |
| `--popover-foreground` | 浮层文字和图标 |
| `--muted` | 弱化背景、hover 背景或低强调区域 |
| `--muted-foreground` | 辅助说明、placeholder 或弱化文字 |
| `--accent` | 菜单项 hover/focus 背景 |
| `--accent-foreground` | 菜单项 hover/focus 文字 |
| `--destructive` | 危险、错误或不可逆操作语义 |
| `--border` | 边框、分隔线和描边结构 |
| `--ring` | focus-visible 焦点环 |

完整 token 规则见 `docs/TOKENS.md`。

## AI Rules {#ai-rules}

- 浮层触发器使用源码提供的 Trigger / render 能力，不要手写绝对定位面板。
- 浮层内容使用源码提供的 Content / Portal / Positioner，不要手写 z-index。
- 需要标题的弹层必须提供 Title；视觉隐藏时使用 `sr-only`，不要省略可访问名称。
- 菜单项放进 `DropdownMenuGroup`，分隔用 `DropdownMenuSeparator`，不要用普通 div。
- 使用 DropdownMenu 前必须以 src/components/ui/dropdown-menu.tsx 为真实 API。
- 不要手写颜色、圆角、边框和状态样式；优先使用源码已有 prop、状态和 token。
- className 只用于布局、宽度或外部间距，不用于覆盖组件自身基础视觉。

## 正误示例 {#do-dont}

### 使用现有组件能力

不推荐：

```tsx
// 不要手写一个看起来像 DropdownMenu 的 div，也不要硬编码 token 颜色。
<div className="custom-dropdownmenu">...</div>
```

推荐：

```tsx
<DropdownMenu>
  <DropdownMenuTrigger render={<Button variant="outline" />}>更多</DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuGroup>
      <DropdownMenuItem>编辑</DropdownMenuItem>
      <DropdownMenuItem variant="destructive">删除</DropdownMenuItem>
    </DropdownMenuGroup>
  </DropdownMenuContent>
</DropdownMenu>
```
