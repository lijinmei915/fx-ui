---
category: Components
group: 通用
title: ButtonGroup
subtitle: 按钮组
description: 把多个相关按钮组织成一个连续操作组。
source: src/components/ui/button-group.tsx
theme: theme/fx-theme.css
tokens:
  - muted
  - border
  - input
status: complete
---

# ButtonGroup 按钮组

把多个相关按钮组织成一个连续操作组。

源码来自 shadcn/ui，进入项目后保持 open-code。公司视觉通过 `theme/fx-theme.css` 的语义 token 注入，不通过重新封装、硬编码颜色或手写状态样式实现。

AI 使用 ButtonGroup 前必须先以 `src/components/ui/button-group.tsx` 为真实 API；本文档记录的是当前仓库源码能力，不是凭记忆推断的组件能力。

## 来源 {#source}

```txt
src/components/ui/button-group.tsx
```

## 使用方式 {#usage}

```tsx
import { ButtonGroup, ButtonGroupSeparator, ButtonGroupText, buttonGroupVariants } from "@/components/ui/button-group"
```

```tsx
<ButtonGroup>
  <Button variant="outline">复制</Button>
  <Button variant="outline">剪切</Button>
</ButtonGroup>
```

## 组件总览 {#overview}

- 类型：action
- 语义 DOM：data-slot="button-group"、data-slot="button-group-separator"
- 原生/数据状态：focus-visible
- 变体：无独立 variant prop
- 导出项：ButtonGroup、ButtonGroupSeparator、ButtonGroupText、buttonGroupVariants

## 场景示例 {#examples}

### 推荐场景

- 使用意图：把多个相关按钮组织成一个连续操作组。
- 规则：优先使用源码已有子组件、props、状态和 token，不复制内部 JSX 到业务页面里重写。
- 实心按钮组会自动在相邻按钮之间保留 1px 反白分隔线；outline 按钮组继续复用相邻边框合并，不手写额外分隔。

```tsx
<ButtonGroup>
  <Button variant="outline">复制</Button>
  <Button variant="outline">剪切</Button>
</ButtonGroup>
```

### 不适合场景

- 不用 ButtonGroup 承载它职责之外的语义。
- 不通过 `className` 硬覆盖组件内部颜色、圆角、边框、阴影和状态样式。
- 不发明源码里没有的 prop、variant、size 或状态。

## API {#api}

该组件以源码导出的子组件和原生 props 为准。使用前读取 `src/components/ui/button-group.tsx`，不要凭空发明 API。


## Semantic DOM {#semantic-dom}

| 部位 | 说明 |
| --- | --- |
| `data-slot="button-group"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="button-group-separator"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |

## 状态标记 {#states}

| 状态 | 说明 |
| --- | --- |
| `focus-visible` | 键盘焦点态，必须保留可访问焦点环 |

## 键盘与焦点 {#keyboard-focus}

ButtonGroup 只提供 `role="group"` 和相邻控件的布局，不接管键盘事件。Tab 顺序、Enter/Space 激活和焦点环由组内真实 Button、Input、Select 等子控件提供；组容器本身不应成为额外 tab stop。

## 主题变量 Design Token {#design-token}

| Token | 用途 |
| --- | --- |
| `--muted` | 弱化背景、hover 背景或低强调区域 |
| `--border` | 边框、分隔线和描边结构 |
| `--input` | 表单控件边框、背景和 disabled 语义 |

完整 token 规则见 `docs/TOKENS.md`。

## AI Rules {#ai-rules}

- 动作组件表达可触发行为，状态或分类展示不要用动作组件伪装。
- 少量互斥/多选项优先使用 ToggleGroup，不要手写一排 Button 管 active。
- 使用 ButtonGroup 前必须以 src/components/ui/button-group.tsx 为真实 API。
- 不要手写颜色、圆角、边框和状态样式；优先使用源码已有 prop、状态和 token。
- 实心按钮组的内部 1px 反白分隔由 ButtonGroup 源码负责，不在调用处插入空白或覆盖边框。
- className 只用于布局、宽度或外部间距，不用于覆盖组件自身基础视觉。

## 正误示例 {#do-dont}

### 使用现有组件能力

不推荐：

```tsx
// 不要手写一个看起来像 ButtonGroup 的 div，也不要硬编码 token 颜色。
<div className="custom-buttongroup">...</div>
```

推荐：

```tsx
<ButtonGroup>
  <Button variant="outline">复制</Button>
  <Button variant="outline">剪切</Button>
</ButtonGroup>
```
