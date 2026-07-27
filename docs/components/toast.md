---
category: Components
group: 反馈
title: Toast
subtitle: 轻提示
description: 操作完成后弹出的轻量、自动消失的反馈，不打断当前流程。
source: src/components/ui/sonner.tsx
theme: theme/fx-theme.css
tokens:
  - --popover
  - --popover-foreground
  - --border
status: complete
---

# Toast 轻提示

操作完成后弹出的轻量、自动消失的反馈，不打断当前流程。基于 sonner（shadcn 官方 toast 方案），命令式调用 `toast()`。

源码来自 shadcn/ui（sonner），进入项目后保持 open-code：已去掉 next-themes、图标改走 `@/lib/icons`（Tabler）、浮层阴影套公司档 `shadow-l1`、圆角用 `--radius-lg`。公司视觉通过 `theme/fx-theme.css` 的语义 token 注入。

AI 使用 Toast 前必须先以 `src/components/ui/sonner.tsx` 为真实 API。

## 来源 {#source}

```txt
src/components/ui/sonner.tsx
```

## 使用方式 {#usage}

```tsx
import { toast } from "sonner"
```

```tsx
toast.success("已保存")
toast.error("保存失败", { description: "网络异常，请重试" })
toast("已删除 1 项", {
  action: { label: "撤销", onClick: () => restore() },
})
```

`<Toaster />` 全局只挂一次（已在 `src/main.tsx` 根节点），业务代码无需再挂，直接 `toast()` 即可。

## 组件总览 {#overview}

- 类型：feedback
- 语义 DOM：`className="toaster group"`、`toast: "cn-toast shadow-l1"`
- 原生/数据状态：root
- 变体：toast / toast.success / toast.error / toast.warning / toast.info / toast.loading
- 导出项：Toaster（容器，从本文件导出）；toast（命令式 API，从 "sonner" 导入）

## 场景示例 {#examples}

### 推荐场景

- 使用意图：保存/提交/复制成功、请求失败、可逆操作后的撤销入口。
- 规则：用语义变体让图标和含义对应；可逆操作给 `action` 撤销而不是先弹确认框打断。

```tsx
toast.success("已保存")
```

### 不适合场景

- 不用 Toast 承载需要用户确认的关键决策（用 AlertDialog / ConfirmDangerDialog）。
- 不通过 `className` 硬覆盖组件内部颜色、圆角、边框、阴影。
- 不发明源码里没有的 API。

## API {#api}

该组件以源码导出和 sonner 的原生 API 为准。使用前读取 `src/components/ui/sonner.tsx`，不要凭空发明 API。

## Semantic DOM {#semantic-dom}

| 部位 | 说明 |
| --- | --- |
| `className="toaster group"` | Toaster 容器的本地 class 配置，挂在页面根节点 |
| `toast: "cn-toast shadow-l1"` | Sonner 单条 toast 的本地 class 配置，注入公司层级阴影 |

## 状态标记 {#states}

| 状态 | 说明 |
| --- | --- |
| `root` | 提示自动计时消失，无需手动管理交互状态 |

## 主题变量 Design Token {#design-token}

| Token | 用途 |
| --- | --- |
| `--popover` | toast 背景 |
| `--popover-foreground` | toast 文字 |
| `--border` | toast 边框 |

完整 token 规则见 `docs/TOKENS.md`。

## AI Rules {#ai-rules}

- 反馈组件要表达明确状态，不要只靠颜色让用户猜语义。
- 危险确认使用 AlertDialog 或 ConfirmDangerDialog，不要用 Toast 代替。
- 全局只挂一个 Toaster，不要在多个页面重复挂导致提示重复弹。
- 使用 Toast 前必须以 src/components/ui/sonner.tsx 为真实 API。
- 不要手写颜色、圆角、边框和状态样式；优先使用源码已有 API 和 token。

## 正误示例 {#do-dont}

### 用语义变体

不推荐：

```tsx
// 不要全用默认 toast()，成功失败长一个样
toast("保存失败")
```

推荐：

```tsx
toast.success("已保存")
toast.error("保存失败", { description: "网络异常，请重试" })
```
