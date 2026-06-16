---
category: Components
group: 业务组合
title: ConfirmDangerDialog
subtitle: 危险确认弹窗
description: 公司组合组件，用于危险操作二次确认。
source: src/components/fx/confirm-danger-dialog.tsx
theme: theme/fx-theme.css
tokens:
  - destructive
  - ring
status: complete
---

# ConfirmDangerDialog 危险确认弹窗

公司组合组件，用于危险操作二次确认。

源码来自 fx-ui 公司组合组件，进入项目后保持 open-code。公司视觉通过 `theme/fx-theme.css` 的语义 token 注入，不通过重新封装、硬编码颜色或手写状态样式实现。

AI 使用 ConfirmDangerDialog 前必须先以 `src/components/fx/confirm-danger-dialog.tsx` 为真实 API；本文档记录的是当前仓库源码能力，不是凭记忆推断的组件能力。

## 来源 {#source}

```txt
src/components/fx/confirm-danger-dialog.tsx
```

## 使用方式 {#usage}

```tsx
import { ConfirmDangerDialog } from "@/components/fx/confirm-danger-dialog"
```

```tsx
<ConfirmDangerDialog
  trigger={<Button variant="destructive">删除</Button>}
  title="确认删除？"
  description="该操作不可撤销。"
/>
```

## 组件总览 {#overview}

- 类型：fx
- 语义 DOM：root
- 原生/数据状态：root
- 变体：无独立 variant prop
- 导出项：ConfirmDangerDialog

## 场景示例 {#examples}

### 推荐场景

- 使用意图：公司组合组件，用于危险操作二次确认。
- 规则：优先使用源码已有子组件、props、状态和 token，不复制内部 JSX 到业务页面里重写。

```tsx
<ConfirmDangerDialog
  trigger={<Button variant="destructive">删除</Button>}
  title="确认删除？"
  description="该操作不可撤销。"
/>
```

### 不适合场景

- 不用 ConfirmDangerDialog 承载它职责之外的语义。
- 不通过 `className` 硬覆盖组件内部颜色、圆角、边框、阴影和状态样式。
- 不发明源码里没有的 prop、variant、size 或状态。

## API {#api}

源码定义的 ConfirmDangerDialogProps：

| 属性 | 说明 |
| --- | --- |
| `trigger: ReactElement` | 以源码类型为准；这里只记录真实存在的公开属性 |
| `title: string` | 以源码类型为准；这里只记录真实存在的公开属性 |
| `description: string` | 以源码类型为准；这里只记录真实存在的公开属性 |
| `confirmText?: string` | 以源码类型为准；这里只记录真实存在的公开属性 |
| `cancelText?: string` | 以源码类型为准；这里只记录真实存在的公开属性 |


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
| `--destructive` | 危险、错误或不可逆操作语义 |
| `--ring` | focus-visible 焦点环 |

完整 token 规则见 `docs/TOKENS.md`。

## AI Rules {#ai-rules}

- 公司组合组件只组合现有 shadcn/ui 能力，不新增隐藏 API。
- 业务页面优先复用组合组件，局部差异通过 props 和 children 注入。
- 不要复制组件内部 JSX 到页面里再改样式。
- 使用 ConfirmDangerDialog 前必须以 src/components/fx/confirm-danger-dialog.tsx 为真实 API。
- 不要手写颜色、圆角、边框和状态样式；优先使用源码已有 prop、状态和 token。
- className 只用于布局、宽度或外部间距，不用于覆盖组件自身基础视觉。

## 正误示例 {#do-dont}

### 使用现有组件能力

不推荐：

```tsx
// 不要手写一个看起来像 ConfirmDangerDialog 的 div，也不要硬编码 token 颜色。
<div className="custom-confirmdangerdialog">...</div>
```

推荐：

```tsx
<ConfirmDangerDialog
  trigger={<Button variant="destructive">删除</Button>}
  title="确认删除？"
  description="该操作不可撤销。"
/>
```
