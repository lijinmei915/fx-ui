---
category: Components
group: 通用
title: Icon
subtitle: 图标
description: fx-ui 统一使用 Tabler 作为图标库，从 @/lib/icons 导入。
source: src/lib/icons.ts
config: components.json
library: "@tabler/icons-react"
iconLibrary: tabler
status: complete
---

# Icon 图标

fx-ui 统一使用 **Tabler**（`@tabler/icons-react`）作为图标库（见 `docs/DECISIONS.md` DEC-009）：线性默认、线宽可调、并有成套 `*Filled` 实心变体。业务一律从 `@/lib/icons` 按需导入，不直连 `@tabler/icons-react`；图标出口与 `docs/data/icons.manifest.json` 由 `npm run build:icons` 联动生成，缺图标只需在 `src/lib/icons.ts` 增加映射后重建注册表。

图标不是公司封装组件，不进入 `src/components/ui/`。它作为基础视觉语言，被 shadcn 组件、页面 blocks 和业务组合组件直接消费。

## 图标库 {#icon-library}

| 项目 | 当前值 |
| --- | --- |
| 底层库 | Tabler（`@tabler/icons-react`） |
| 导入入口 | `@/lib/icons`（统一出口） |
| 导入方式 | 按需命名导入 |
| 线宽 | 全局 `.tabler-icon { stroke-width: 1.75 }` 一处控制（含自定义线型 SVG） |
| 面型 | `*Filled` 变体（如 `HomeFilledIcon`） |
| 颜色策略 | 默认 `currentColor`，跟随父级文字色 |

## 代码演示 {#icon-examples}

```tsx
import { SearchIcon, HomeFilledIcon } from "@/lib/icons"

// 普通图标：尺寸 size-*、颜色用语义 text-*
<SearchIcon className="size-4 text-muted-foreground" />

// 按钮内图标：data-icon 标位，尺寸交给 Button
<Button variant="outline"><SearchIcon data-icon="inline-start" />搜索</Button>

// 纯图标按钮：必须 aria-label
<Button size="icon-sm" variant="outline" aria-label="打开设置"><SettingsIcon /></Button>
```

## 图标颜色规范 {#icon-color}

图标颜色一律走 `currentColor` + **语义 token**，不写死十六进制、不直引色板原始值（`var(--fx-*)`）。按用途分四类：

| 类型 | 用色 | 说明 |
| --- | --- | --- |
| 单色（默认） | `text-foreground` / `text-muted-foreground` / `text-foreground-disabled` | 跟随文字层级：主图标 foreground，次要 muted，禁用 disabled |
| 彩色 | `text-primary` / `text-success` / `text-warning` / `text-destructive` / `text-info` | 表达状态或品牌强调，只用语义色 token |
| 面型（`*Filled`） | 同上语义色 | 选中 / 激活 / 强调时用 `*Filled` 变体 + 语义色 |
| 反白 | 容器 `bg-primary`（或语义底色）+ 图标 `text-primary-foreground` | 圆 / 矩形色块承托，图标用前景反白色 |

**交互边界**：图标自身不承载裸 `onClick` 或 `cursor-pointer`。操作必须由 Button 或 Link 承担，交互态和禁用态也跟随该组件；纯装饰图标使用 `aria-hidden`，独立有语义的图标提供 `title` 或等价可访问名称。

## 使用规则 {#icon-rules}

| 场景 | 规则 |
| --- | --- |
| 普通说明图标 | 用 `size-*` 控尺寸、`text-*` 语义色控颜色 |
| Button 内图标 | 用 `data-icon="inline-start | inline-end"`，不手写尺寸 |
| 背景图标 | 容器用 `bg-primary` + `text-primary-foreground`；背景随图标尺寸缩放，例如 `size-5` 图标配 `size-9` 背景，不使用固定大色块 |
| 纯图标按钮 | 必须提供 `aria-label` |
| 独立语义图标 | 提供 `title` 或等价可访问名称；纯装饰图标保持 `aria-hidden` |
| 状态 / 强调图标 | 颜色走语义 token，不写硬编码颜色、不直引 `var(--fx-*)` |
| 业务图标 | 优先选通用语义图标，不为单个页面临时换一套风格 |

## AI Rules {#icon-ai-rules}

- 统一从 `@/lib/icons` 按需导入；不直连 `@tabler/icons-react`，不混用第二个图标库（lucide / phosphor 等已迁走）。
- 线宽由全局 `.tabler-icon` 一处控制，不逐个图标硬调 `stroke-width` 或加描边。
- 颜色用 `currentColor` + 语义 `text-*`；主题色用 `text-primary` / `bg-primary`，禁止写死颜色或直引色板原始值。
- 面型 / 选中态用 `*Filled` 变体，不手写 SVG 填充。
- 图标放进 Button 用 `data-icon`；纯图标按钮必须 `aria-label`。
- 不给图标本身加裸 `onClick`、`cursor-pointer` 或禁用样式；交互和禁用状态交给 Button / Link。
