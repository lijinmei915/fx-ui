---
category: Components
group: 通用
title: Avatar
subtitle: 头像
description: 展示用户、团队或实体身份，必须提供 fallback。
source: src/components/ui/avatar.tsx
theme: theme/fx-theme.css
tokens:
  - primary
  - primary-foreground
  - background
  - foreground
  - muted
  - muted-foreground
  - border
  - ring
status: complete
---

# Avatar 头像

展示用户、团队或实体身份，必须提供 fallback。

源码来自 shadcn/ui，进入项目后保持 open-code。公司视觉通过 `theme/fx-theme.css` 的语义 token 注入，不通过重新封装、硬编码颜色或手写状态样式实现。

AI 使用 Avatar 前必须先以 `src/components/ui/avatar.tsx` 为真实 API；本文档记录的是当前仓库源码能力，不是凭记忆推断的组件能力。

## 来源 {#source}

```txt
src/components/ui/avatar.tsx
```

## 使用方式 {#usage}

```tsx
import { Avatar, AvatarImage, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarBadge } from "@/components/ui/avatar"
```

```tsx
<Avatar>
  <AvatarImage src="/avatar.png" alt="张三" />
  <AvatarFallback>张</AvatarFallback>
</Avatar>
```

## 组件总览 {#overview}

- 类型：display
- 语义 DOM：data-slot="avatar"、data-slot="avatar-image"、data-slot="avatar-fallback"、data-slot="avatar-badge"、data-slot="avatar-group"、data-slot="avatar-group-count"
- 原生/数据状态：root
- 变体：无独立 variant prop
- 导出项：Avatar、AvatarImage、AvatarFallback、AvatarGroup、AvatarGroupCount、AvatarBadge

## 场景示例 {#examples}

### 推荐场景

- 使用意图：展示用户、团队或实体身份，必须提供 fallback。
- 规则：优先使用源码已有子组件、props、状态和 token，不复制内部 JSX 到业务页面里重写。

```tsx
<Avatar>
  <AvatarImage src="/avatar.png" alt="张三" />
  <AvatarFallback>张</AvatarFallback>
</Avatar>
```

### 不适合场景

- 不用 Avatar 承载它职责之外的语义。
- 不通过 `className` 硬覆盖组件内部颜色、圆角、边框、阴影和状态样式。
- 不发明源码里没有的 prop、variant、size 或状态。

## API {#api}

该组件以源码导出的子组件和原生 props 为准。使用前读取 `src/components/ui/avatar.tsx`，不要凭空发明 API。


## Semantic DOM {#semantic-dom}

| 部位 | 说明 |
| --- | --- |
| `data-slot="avatar"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="avatar-image"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="avatar-fallback"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="avatar-badge"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="avatar-group"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="avatar-group-count"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |

## 状态标记 {#states}

| 状态 | 说明 |
| --- | --- |
| `root` | 无额外交互状态，按根节点语义理解 |

## 主题变量 Design Token {#design-token}

| Token | 用途 |
| --- | --- |
| `--primary` | 品牌强调色、选中态或主语义强调 |
| `--primary-foreground` | 主色背景上的文字和图标 |
| `--background` | 页面或控件的基础背景 |
| `--foreground` | 主要文字和图标 |
| `--muted` | 弱化背景、hover 背景或低强调区域 |
| `--muted-foreground` | 辅助说明、placeholder 或弱化文字 |
| `--border` | 边框、分隔线和描边结构 |
| `--ring` | focus-visible 焦点环 |

完整 token 规则见 `docs/TOKENS.md`。

## AI Rules {#ai-rules}

- 展示组件只负责呈现数据或身份，不承载提交类动作。
- 状态语义优先用现有 variant 或组合组件，不手写颜色。
- `AvatarFallback` 必须存在，图片失败或用户无头像时仍有可读身份。
- 头像尺寸用外层 `className` 的布局尺寸控制，不改内部图片裁切逻辑。
- 使用 Avatar 前必须以 src/components/ui/avatar.tsx 为真实 API。
- 不要手写颜色、圆角、边框和状态样式；优先使用源码已有 prop、状态和 token。
- className 只用于布局、宽度或外部间距，不用于覆盖组件自身基础视觉。

## 正误示例 {#do-dont}

### 使用现有组件能力

不推荐：

```tsx
// 不要手写一个看起来像 Avatar 的 div，也不要硬编码 token 颜色。
<div className="custom-avatar">...</div>
```

推荐：

```tsx
<Avatar>
  <AvatarImage src="/avatar.png" alt="张三" />
  <AvatarFallback>张</AvatarFallback>
</Avatar>
```
