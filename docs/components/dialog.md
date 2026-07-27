---
category: Components
group: 通用
title: Dialog
subtitle: 弹窗
description: 用于需要打断当前流程的模态内容。
source: src/components/ui/dialog.tsx
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

# Dialog 弹窗

用于需要打断当前流程的模态内容。

源码来自 shadcn/ui，进入项目后保持 open-code。公司视觉通过 `theme/fx-theme.css` 的语义 token 注入，不通过重新封装、硬编码颜色或手写状态样式实现。

AI 使用 Dialog 前必须先以 `src/components/ui/dialog.tsx` 为真实 API；本文档记录的是当前仓库源码能力，不是凭记忆推断的组件能力。

## 来源 {#source}

```txt
src/components/ui/dialog.tsx
```

## 使用方式 {#usage}

```tsx
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
```

```tsx
<Dialog>
  <DialogTrigger render={<Button />}>打开</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>编辑信息</DialogTitle>
      <DialogDescription>修改后请保存。</DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>
```

## 组件总览 {#overview}

- 类型：feedback
- 语义 DOM：data-slot="dialog"、data-slot="dialog-trigger"、data-slot="dialog-portal"、data-slot="dialog-close"、data-slot="dialog-overlay"、data-slot="dialog-content"、data-slot="dialog-header"、data-slot="dialog-footer"、data-slot="dialog-title"、data-slot="dialog-description"
- 原生/数据状态：hover、data-open、data-closed
- 变体：无独立 variant prop
- 尺寸：`DialogContent size="sm | md | lg"`，默认 `md`
- 导出项：Dialog、DialogClose、DialogContent、DialogDescription、DialogFooter、DialogHeader、DialogOverlay、DialogPortal、DialogTitle、DialogTrigger、dialogContentVariants

## 场景示例 {#examples}

### 推荐场景

- 使用意图：用于需要打断当前流程的模态内容。
- 规则：优先使用源码已有子组件、props、状态和 token，不复制内部 JSX 到业务页面里重写。

```tsx
<Dialog>
  <DialogTrigger render={<Button />}>打开</DialogTrigger>
  <DialogContent size="md">
    <DialogHeader>
      <DialogTitle>编辑信息</DialogTitle>
      <DialogDescription>修改后请保存。</DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>
```

### 不适合场景

- 不用 Dialog 承载它职责之外的语义。
- 不通过 `className` 硬覆盖组件内部颜色、圆角、边框、阴影和状态样式。
- 不发明源码里没有的 prop、variant、size 或状态。

## API {#api}

该组件以源码导出的子组件和原生 props 为准。使用前读取 `src/components/ui/dialog.tsx`，不要凭空发明 API。

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `Dialog.open / defaultOpen / onOpenChange` | Base UI Root props | — | 受控或非受控管理开关状态 |
| `DialogTrigger.render` | `ReactElement` | — | 把 Button 等真实交互元素作为触发器 |
| `DialogContent.size` | `"sm" \| "md" \| "lg"` | `"md"` | 控制主体最大宽度，不在调用处用 className 覆盖 |
| `DialogContent.showCloseButton` | `boolean` | `true` | 是否显示右上角关闭按钮 |
| `DialogClose.render` | `ReactElement` | — | 包裹取消/关闭操作并恢复触发器焦点 |
| `DialogTitle / DialogDescription` | 组件 | — | 对话框标题与说明的无障碍语义 |


## Semantic DOM {#semantic-dom}

| 部位 | 说明 |
| --- | --- |
| `data-slot="dialog"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="dialog-trigger"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="dialog-portal"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="dialog-close"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="dialog-overlay"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="dialog-content"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="dialog-header"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="dialog-footer"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="dialog-title"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="dialog-description"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |

## 状态标记 {#states}

| 状态 | 说明 |
| --- | --- |
| `hover` | 鼠标悬停反馈，来自源码状态样式 |
| `data-open` | 浮层或折叠内容打开态 |
| `data-closed` | 浮层或折叠内容关闭态 |
| `data-size` | DialogContent 的 `sm` / `md` / `lg` 受治理尺寸 |

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
- 必须提供 `DialogTitle`；只想视觉隐藏时使用 `className="sr-only"`。
- 宽度只通过 `DialogContent.size` 选择；不要在页面里用 `max-w-*` 覆盖。
- 使用 Dialog 前必须以 src/components/ui/dialog.tsx 为真实 API。
- 不要手写颜色、圆角、边框和状态样式；优先使用源码已有 prop、状态和 token。
- className 只用于布局、宽度或外部间距，不用于覆盖组件自身基础视觉。

## 正误示例 {#do-dont}

### 使用现有组件能力

不推荐：

```tsx
// 不要手写一个看起来像 Dialog 的 div，也不要硬编码 token 颜色。
<div className="custom-dialog">...</div>
```

推荐：

```tsx
<Dialog>
  <DialogTrigger render={<Button />}>打开</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>编辑信息</DialogTitle>
      <DialogDescription>修改后请保存。</DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>
```
