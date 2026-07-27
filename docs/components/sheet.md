---
category: Components
group: 通用
title: Sheet
subtitle: 抽屉
description: 从屏幕边缘滑出的辅助面板。
source: src/components/ui/sheet.tsx
theme: theme/fx-theme.css
tokens:
  - foreground
  - popover
  - popover-foreground
  - muted
  - muted-foreground
  - border
status: complete
---

# Sheet 抽屉

从屏幕边缘滑出的辅助面板。

源码来自 shadcn/ui，进入项目后保持 open-code。公司视觉通过 `theme/fx-theme.css` 的语义 token 注入，不通过重新封装、硬编码颜色或手写状态样式实现。

AI 使用 Sheet 前必须先以 `src/components/ui/sheet.tsx` 为真实 API；本文档记录的是当前仓库源码能力，不是凭记忆推断的组件能力。

## 来源 {#source}

```txt
src/components/ui/sheet.tsx
```

## 使用方式 {#usage}

```tsx
import { Sheet, SheetTrigger, SheetClose, SheetContent, SheetHeader, SheetFooter, SheetTitle, SheetDescription } from "@/components/ui/sheet"
```

```tsx
<Sheet>
  <SheetTrigger render={<Button variant="outline" />}>打开面板</SheetTrigger>
  <SheetContent>
    <SheetHeader>
      <SheetTitle>筛选条件</SheetTitle>
      <SheetDescription>调整列表筛选。</SheetDescription>
    </SheetHeader>
  </SheetContent>
</Sheet>
```

## 组件总览 {#overview}

- 类型：overlay
- 语义 DOM：data-slot="sheet"、data-slot="sheet-trigger"、data-slot="sheet-close"、data-slot="sheet-portal"、data-slot="sheet-overlay"、data-slot="sheet-content"、data-slot="sheet-header"、data-slot="sheet-footer"、data-slot="sheet-title"、data-slot="sheet-description"
- 原生/数据状态：data-side、data-starting-style、data-ending-style
- 变体：无独立 variant prop
- 尺寸：`SheetContent size="sm | md | lg"`，默认 `md`，仅控制左右侧栏宽度
- 导出项：Sheet、SheetTrigger、SheetClose、SheetContent、SheetHeader、SheetFooter、SheetTitle、SheetDescription、sheetContentVariants

## 场景示例 {#examples}

### 推荐场景

- 使用意图：从屏幕边缘滑出的辅助面板。
- 规则：优先使用源码已有子组件、props、状态和 token，不复制内部 JSX 到业务页面里重写。

```tsx
<Sheet>
  <SheetTrigger render={<Button variant="outline" />}>打开面板</SheetTrigger>
  <SheetContent side="right" size="md">
    <SheetHeader>
      <SheetTitle>筛选条件</SheetTitle>
      <SheetDescription>调整列表筛选。</SheetDescription>
    </SheetHeader>
  </SheetContent>
</Sheet>
```

### 不适合场景

- 不用 Sheet 承载它职责之外的语义。
- 不通过 `className` 硬覆盖组件内部颜色、圆角、边框、阴影和状态样式。
- 不发明源码里没有的 prop、variant、size 或状态。

## API {#api}

该组件以源码导出的子组件和原生 props 为准。使用前读取 `src/components/ui/sheet.tsx`，不要凭空发明 API。

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `Sheet.open / defaultOpen / onOpenChange` | Base UI Root props | — | 受控或非受控管理开关状态 |
| `SheetTrigger.render` | `ReactElement` | — | 把 Button 等真实交互元素作为触发器 |
| `SheetContent.side` | `"top" \| "right" \| "bottom" \| "left"` | `"right"` | 面板从哪个边缘滑出 |
| `SheetContent.size` | `"sm" \| "md" \| "lg"` | `"md"` | 控制左右侧栏最大宽度；顶部/底部保持满宽 |
| `SheetContent.showCloseButton` | `boolean` | `true` | 是否显示右上角关闭按钮 |
| `SheetClose.render` | `ReactElement` | — | 包裹取消/关闭操作并恢复触发器焦点 |
| `SheetTitle / SheetDescription` | 组件 | — | 面板标题与说明的无障碍语义 |


## Semantic DOM {#semantic-dom}

| 部位 | 说明 |
| --- | --- |
| `data-slot="sheet"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="sheet-trigger"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="sheet-close"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="sheet-portal"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="sheet-overlay"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="sheet-content"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="sheet-header"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="sheet-footer"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="sheet-title"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="sheet-description"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |

## 状态标记 {#states}

| 状态 | 说明 |
| --- | --- |
| `data-side` | top / right / bottom / left 的面板方向 |
| `data-size` | 左右侧栏的 sm / md / lg 受治理宽度 |
| `data-starting-style` | 滑入动画起始态 |
| `data-ending-style` | 滑出动画结束态 |

## 主题变量 Design Token {#design-token}

| Token | 用途 |
| --- | --- |
| `--foreground` | 主要文字和图标 |
| `--popover` | 浮层背景 |
| `--popover-foreground` | 浮层文字和图标 |
| `--muted` | 弱化背景、hover 背景或低强调区域 |
| `--muted-foreground` | 辅助说明、placeholder 或弱化文字 |
| `--border` | 边框、分隔线和描边结构 |

完整 token 规则见 `docs/TOKENS.md`。

## AI Rules {#ai-rules}

- 浮层触发器使用源码提供的 Trigger / render 能力，不要手写绝对定位面板。
- 左右侧栏宽度只通过 `SheetContent.size` 选择；不要在页面里用 `max-w-*` 覆盖。
- 浮层内容使用源码提供的 Content / Portal / Positioner，不要手写 z-index。
- 需要标题的弹层必须提供 Title；视觉隐藏时使用 `sr-only`，不要省略可访问名称。
- 必须提供 `SheetTitle`；抽屉适合辅助流程，不适合替代全页面编辑。
- 使用 Sheet 前必须以 src/components/ui/sheet.tsx 为真实 API。
- 不要手写颜色、圆角、边框和状态样式；优先使用源码已有 prop、状态和 token。
- className 只用于布局、宽度或外部间距，不用于覆盖组件自身基础视觉。

## 正误示例 {#do-dont}

### 使用现有组件能力

不推荐：

```tsx
// 不要手写一个看起来像 Sheet 的 div，也不要硬编码 token 颜色。
<div className="custom-sheet">...</div>
```

推荐：

```tsx
<Sheet>
  <SheetTrigger render={<Button variant="outline" />}>打开面板</SheetTrigger>
  <SheetContent>
    <SheetHeader>
      <SheetTitle>筛选条件</SheetTitle>
      <SheetDescription>调整列表筛选。</SheetDescription>
    </SheetHeader>
  </SheetContent>
</Sheet>
```
