---
category: Components
group: 通用
title: Sidebar
subtitle: 侧边栏
description: 承载应用导航、工作区切换和可折叠菜单。
source: src/components/ui/sidebar.tsx
theme: theme/fx-theme.css
tokens:
  - background
  - foreground
  - accent
  - accent-foreground
  - border
  - input
  - ring
  - sidebar
  - sidebar-foreground
  - sidebar-accent
  - sidebar-border
status: complete
---

# Sidebar 侧边栏

承载应用导航、工作区切换和可折叠菜单。

源码来自 shadcn/ui，进入项目后保持 open-code。公司视觉通过 `theme/fx-theme.css` 的语义 token 注入，不通过重新封装、硬编码颜色或手写状态样式实现。

AI 使用 Sidebar 前必须先以 `src/components/ui/sidebar.tsx` 为真实 API；本文档记录的是当前仓库源码能力，不是凭记忆推断的组件能力。

## 来源 {#source}

```txt
src/components/ui/sidebar.tsx
```

## 使用方式 {#usage}

```tsx
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupAction, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarInput, SidebarInset, SidebarMenu, SidebarMenuAction, SidebarMenuBadge, SidebarMenuButton, SidebarMenuItem, SidebarMenuSkeleton, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, SidebarProvider, SidebarRail, SidebarSeparator, SidebarTrigger, useSidebar } from "@/components/ui/sidebar"
```

```tsx
<SidebarProvider>
  <Sidebar>{/* navigation */}</Sidebar>
  <SidebarInset>{/* page */}</SidebarInset>
</SidebarProvider>
```

## 组件总览 {#overview}

- 类型：navigation
- 语义 DOM：data-slot="sidebar-wrapper"、data-slot="sidebar"、data-slot="sidebar-gap"、data-slot="sidebar-container"、data-slot="sidebar-inner"、data-slot="sidebar-trigger"、data-slot="sidebar-rail"、data-slot="sidebar-inset"、data-slot="sidebar-input"、data-slot="sidebar-header"、data-slot="sidebar-footer"、data-slot="sidebar-separator"、data-slot="sidebar-content"、data-slot="sidebar-group"、data-slot="sidebar-group-content"、data-slot="sidebar-menu"、data-slot="sidebar-menu-item"、data-slot="sidebar-menu-badge"、data-slot="sidebar-menu-skeleton"、data-slot="sidebar-menu-sub"、data-slot="sidebar-menu-sub-item"
- 原生/数据状态：hover、active、focus-visible、disabled、aria-expanded、data-active、data-state、data-open
- 变体：default、outline
- 导出项：Sidebar、SidebarContent、SidebarFooter、SidebarGroup、SidebarGroupAction、SidebarGroupContent、SidebarGroupLabel、SidebarHeader、SidebarInput、SidebarInset、SidebarMenu、SidebarMenuAction、SidebarMenuBadge、SidebarMenuButton、SidebarMenuItem、SidebarMenuSkeleton、SidebarMenuSub、SidebarMenuSubButton、SidebarMenuSubItem、SidebarProvider、SidebarRail、SidebarSeparator、SidebarTrigger、useSidebar

## 场景示例 {#examples}

### 推荐场景

- 使用意图：承载应用导航、工作区切换和可折叠菜单。
- 规则：优先使用源码已有子组件、props、状态和 token，不复制内部 JSX 到业务页面里重写。

```tsx
<SidebarProvider>
  <Sidebar>{/* navigation */}</Sidebar>
  <SidebarInset>{/* page */}</SidebarInset>
</SidebarProvider>
```

### 不适合场景

- 不用 Sidebar 承载它职责之外的语义。
- 不通过 `className` 硬覆盖组件内部颜色、圆角、边框、阴影和状态样式。
- 不发明源码里没有的 prop、variant、size 或状态。

## API {#api}

该组件以源码导出的子组件和原生 props 为准。使用前读取 `src/components/ui/sidebar.tsx`，不要凭空发明 API。


| 属性 | 说明 | 类型 |
| --- | --- | --- |
| `variant` | 源码存在的视觉/语义变体 | `default` \| `outline` |

## Semantic DOM {#semantic-dom}

| 部位 | 说明 |
| --- | --- |
| `data-slot="sidebar-wrapper"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="sidebar"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="sidebar-gap"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="sidebar-container"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="sidebar-inner"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="sidebar-trigger"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="sidebar-rail"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="sidebar-inset"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="sidebar-input"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="sidebar-header"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="sidebar-footer"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="sidebar-separator"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="sidebar-content"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="sidebar-group"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="sidebar-group-content"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="sidebar-menu"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="sidebar-menu-item"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="sidebar-menu-badge"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="sidebar-menu-skeleton"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="sidebar-menu-sub"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="sidebar-menu-sub-item"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |

## 状态标记 {#states}

| 状态 | 说明 |
| --- | --- |
| `hover` | 鼠标悬停反馈，来自源码状态样式 |
| `active` | 当前激活或按下状态 |
| `focus-visible` | 键盘焦点态，必须保留可访问焦点环 |
| `disabled` | 禁用态，阻止交互并降低视觉权重 |
| `aria-expanded` | 展开态语义，常用于触发器 |
| `data-active` | 当前/激活项 |
| `data-state` | 组件内部状态标记 |
| `data-open` | 浮层或折叠内容打开态 |

## 主题变量 Design Token {#design-token}

| Token | 用途 |
| --- | --- |
| `--background` | 页面或控件的基础背景 |
| `--foreground` | 主要文字和图标 |
| `--accent` | 菜单项 hover/focus 背景 |
| `--accent-foreground` | 菜单项 hover/focus 文字 |
| `--border` | 边框、分隔线和描边结构 |
| `--input` | 表单控件边框、背景和 disabled 语义 |
| `--ring` | focus-visible 焦点环 |
| `--sidebar` | 侧边栏背景 |
| `--sidebar-foreground` | 侧边栏文字和图标 |
| `--sidebar-accent` | 侧边栏菜单项强调背景 |
| `--sidebar-border` | 侧边栏边框 |

完整 token 规则见 `docs/TOKENS.md`。

## AI Rules {#ai-rules}

- 导航组件只表达位置和切换，不承载提交类动作。
- 当前项使用源码支持的 active/current 语义，不要只改颜色。
- 层级关系用组件结构表达，不用缩进和文字伪造。
- SidebarProvider 包裹 Sidebar 和 SidebarInset；不要只复制内部菜单项。
- 使用 Sidebar 前必须以 src/components/ui/sidebar.tsx 为真实 API。
- 不要手写颜色、圆角、边框和状态样式；优先使用源码已有 prop、状态和 token。
- className 只用于布局、宽度或外部间距，不用于覆盖组件自身基础视觉。

## 正误示例 {#do-dont}

### 使用现有组件能力

不推荐：

```tsx
// 不要手写一个看起来像 Sidebar 的 div，也不要硬编码 token 颜色。
<div className="custom-sidebar">...</div>
```

推荐：

```tsx
<SidebarProvider>
  <Sidebar>{/* navigation */}</Sidebar>
  <SidebarInset>{/* page */}</SidebarInset>
</SidebarProvider>
```
