---
category: Components
group: 通用
title: AlertDialog
subtitle: 警告弹窗
description: 用于危险、不可逆或需要用户明确确认的二次确认流程。
source: src/components/ui/alert-dialog.tsx
theme: theme/fx-theme.css
tokens:
  - foreground
  - popover
  - popover-foreground
  - muted
  - muted-foreground
  - border
  - ring
status: complete
---

# AlertDialog 警告弹窗

用于危险、不可逆或需要用户明确确认的二次确认流程。

源码来自 shadcn/ui，进入项目后保持 open-code。公司视觉通过 `theme/fx-theme.css` 的语义 token 注入，不通过重新封装、硬编码颜色或手写状态样式实现。

AI 使用 AlertDialog 前必须先以 `src/components/ui/alert-dialog.tsx` 为真实 API；本文档记录的是当前仓库源码能力，不是凭记忆推断的组件能力。

## 来源 {#source}

```txt
src/components/ui/alert-dialog.tsx
```

## 使用方式 {#usage}

```tsx
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogMedia, AlertDialogOverlay, AlertDialogPortal, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
```

```tsx
<AlertDialog>
  <AlertDialogTrigger render={<Button variant="destructive" />}>删除</AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>确认删除？</AlertDialogTitle>
      <AlertDialogDescription>该操作不可撤销。</AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>取消</AlertDialogCancel>
      <AlertDialogAction variant="destructive">删除</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

## 组件总览 {#overview}

- 类型：feedback
- 语义 DOM：data-slot="alert-dialog"、data-slot="alert-dialog-trigger"、data-slot="alert-dialog-portal"、data-slot="alert-dialog-overlay"、data-slot="alert-dialog-content"、data-slot="alert-dialog-header"、data-slot="alert-dialog-footer"、data-slot="alert-dialog-media"、data-slot="alert-dialog-title"、data-slot="alert-dialog-description"、data-slot="alert-dialog-action"、data-slot="alert-dialog-cancel"
- 原生/数据状态：hover、data-open、data-closed
- 变体：无独立 variant prop
- 导出项：AlertDialog、AlertDialogAction、AlertDialogCancel、AlertDialogContent、AlertDialogDescription、AlertDialogFooter、AlertDialogHeader、AlertDialogMedia、AlertDialogOverlay、AlertDialogPortal、AlertDialogTitle、AlertDialogTrigger

## 场景示例 {#examples}

### 推荐场景

- 使用意图：用于危险、不可逆或需要用户明确确认的二次确认流程。
- 规则：优先使用源码已有子组件、props、状态和 token，不复制内部 JSX 到业务页面里重写。

```tsx
<AlertDialog>
  <AlertDialogTrigger render={<Button variant="destructive" />}>删除</AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>确认删除？</AlertDialogTitle>
      <AlertDialogDescription>该操作不可撤销。</AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>取消</AlertDialogCancel>
      <AlertDialogAction variant="destructive">删除</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

### 不适合场景

- 不用 AlertDialog 承载它职责之外的语义。
- 不通过 `className` 硬覆盖组件内部颜色、圆角、边框、阴影和状态样式。
- 不发明源码里没有的 prop、variant、size 或状态。

## API {#api}

该组件以源码导出的子组件和原生 props 为准。使用前读取 `src/components/ui/alert-dialog.tsx`，不要凭空发明 API。


## Semantic DOM {#semantic-dom}

| 部位 | 说明 |
| --- | --- |
| `data-slot="alert-dialog"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="alert-dialog-trigger"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="alert-dialog-portal"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="alert-dialog-overlay"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="alert-dialog-content"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="alert-dialog-header"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="alert-dialog-footer"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="alert-dialog-media"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="alert-dialog-title"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="alert-dialog-description"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="alert-dialog-action"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="alert-dialog-cancel"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |

## 状态标记 {#states}

| 状态 | 说明 |
| --- | --- |
| `hover` | 鼠标悬停反馈，来自源码状态样式 |
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
| `--border` | 边框、分隔线和描边结构 |
| `--ring` | focus-visible 焦点环 |

完整 token 规则见 `docs/TOKENS.md`。

## AI Rules {#ai-rules}

- 反馈组件要表达明确状态，不要只靠颜色让用户猜语义。
- 危险确认使用 AlertDialog 或 ConfirmDangerDialog，不要用普通 Dialog 代替。
- 加载态优先用 Skeleton 或 Spinner 组合，不要手写 animate-pulse 占位块。
- 必须提供 `AlertDialogTitle` 和 `AlertDialogDescription`；确认按钮语义要清楚。
- 使用 AlertDialog 前必须以 src/components/ui/alert-dialog.tsx 为真实 API。
- 不要手写颜色、圆角、边框和状态样式；优先使用源码已有 prop、状态和 token。
- className 只用于布局、宽度或外部间距，不用于覆盖组件自身基础视觉。

## 正误示例 {#do-dont}

### 使用现有组件能力

不推荐：

```tsx
// 不要手写一个看起来像 AlertDialog 的 div，也不要硬编码 token 颜色。
<div className="custom-alertdialog">...</div>
```

推荐：

```tsx
<AlertDialog>
  <AlertDialogTrigger render={<Button variant="destructive" />}>删除</AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>确认删除？</AlertDialogTitle>
      <AlertDialogDescription>该操作不可撤销。</AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>取消</AlertDialogCancel>
      <AlertDialogAction variant="destructive">删除</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```
