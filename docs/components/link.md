---
category: Components
group: 通用
title: Link
subtitle: 链接
description: 用于页面内跳转或外部导航的文字链接，支持类型、语义色与尺寸。
source: src/components/ui/link.tsx
theme: theme/fx-theme.css
tokens:
  - link
  - link-hover
  - link-active
  - foreground-secondary
  - primary
  - success
  - success-hover
  - success-active
  - warning
  - warning-hover
  - warning-active
  - destructive
  - destructive-hover
  - destructive-active
  - ring
status: complete
---

# Link 链接

用于页面内跳转或外部导航的文字链接，支持两种类型（基础 / 下划线）、六种语义色与三档尺寸。

源码来自项目内 open-code 实现，公司视觉通过 `theme/fx-theme.css` 的语义 token 注入，不通过重新封装、硬编码颜色或手写状态样式实现。

AI 使用 Link 前必须先以 `src/components/ui/link.tsx` 为真实 API；本文档记录的是当前仓库源码能力，不是凭记忆推断的组件能力。

## 来源 {#source}

```txt
src/components/ui/link.tsx
```

## 使用方式 {#usage}

```tsx
import { Link } from "@/components/ui/link"
```

```tsx
<Link href="/docs">打开文档</Link>
```

## 组件总览 {#overview}

- 类型：navigation
- 语义 DOM：data-slot="link"
- 原生/数据状态：hover、active、focus-visible、disabled
- 变体：tone（standard / default / primary / success / warning / danger）、underline（hover / always）、size（sm / default / lg）
- 导出项：Link、linkVariants

## 场景示例 {#examples}

### 推荐场景

- 使用意图：用于页面内跳转或外部导航，行内文本里的轻量跳转。
- 规则：用 tone 表达语义色、underline 区分基础/下划线类型、size 控制档位；优先使用源码已有 props、状态和 token，不复制内部样式到业务页面里重写。

```tsx
<Link href="/docs">打开文档</Link>
<Link href="/docs" underline="always">下划线链接</Link>
<Link href="/delete" tone="danger">删除说明</Link>
```

### 不适合场景

- 需要"按钮"语义的强操作不用 Link 承载，改用 `Button variant="link"` 或实体按钮。
- 复制 / 分享等交互行为靠组合实现（Tooltip 提示 + clipboard + Toast 反馈），不进 Link 自身；Link 里的图标只是视觉，不自带行为。
- 不通过 `className` 硬覆盖组件内部颜色、下划线和状态样式。
- 不发明源码里没有的 prop、tone、size 或状态。

## API {#api}

该组件以源码导出的子组件和原生 props 为准。使用前读取 `src/components/ui/link.tsx`，不要凭空发明 API。

| 属性 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `tone` | `"standard" \| "default" \| "primary" \| "success" \| "warning" \| "danger"` | `"standard"` | 语义色档，对应链接的语义场景 |
| `underline` | `"hover" \| "always"` | `"hover"` | 类型：基础链接（悬停出下划线）或下划线链接（常驻下划线） |
| `size` | `"sm" \| "default" \| "lg"` | `"default"` | 尺寸档（12 / 14 / 16px），图标随字号缩放 |
| `disabled` | `boolean` | `false` | 禁用态，去 href 阻止跳转、cursor-not-allowed 禁止光标、降透明度 |

图标用 `data-icon="inline-start"` / `inline-end"` 标位，前后置均可（如复制、外链图标），尺寸随字号缩放。

## Semantic DOM {#semantic-dom}

| 部位 | 说明 |
| --- | --- |
| `data-slot="link"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |

## 状态标记 {#states}

| 状态 | 说明 |
| --- | --- |
| `hover` | 悬停时变色，并按 underline 设置显示下划线 |
| `active` | 按下时使用更深的语义色 |
| `focus-visible` | 键盘聚焦时显示焦点环 |
| `disabled` | 禁用态，去 href 阻止跳转、悬停显示禁止光标、降透明度 |

## 主题变量 Design Token {#design-token}

| Token | 用途 |
| --- | --- |
| `--link` / `--link-hover` / `--link-active` | standard tone 的常规 / 悬停 / 按下色 |
| `--foreground-secondary` / `--primary` | default tone 的中性常规色与悬停转主色 |
| `--primary` | primary tone 的常规色（悬停/按下走品牌 hover/active 类） |
| `--success` / `--success-hover` / `--success-active` | success tone 的语义色 |
| `--warning` / `--warning-hover` / `--warning-active` | warning tone 的语义色 |
| `--destructive` / `--destructive-hover` / `--destructive-active` | danger tone 的语义色 |
| `--ring` | 键盘聚焦环 |

完整 token 规则见 `docs/TOKENS.md`。

## AI Rules {#ai-rules}

- 导航类文字跳转用 Link，不要手写 `<a>` 再贴一堆颜色类。
- 强操作（提交、删除按钮）不用 Link 伪装，改用 Button。
- 使用 Link 前必须以 src/components/ui/link.tsx 为真实 API。
- 不要手写颜色、下划线和状态样式；优先使用源码已有 prop、状态和 token。
- className 只用于布局、宽度或外部间距，不用于覆盖组件自身基础视觉。

## 正误示例 {#do-dont}

### 使用现有组件能力

不推荐：

```tsx
// 不要手写一个看起来像 Link 的 a，也不要硬编码 token 颜色。
<a className="text-[#0c6cff] hover:underline">打开文档</a>
```

推荐：

```tsx
<Link href="/docs">打开文档</Link>
```
