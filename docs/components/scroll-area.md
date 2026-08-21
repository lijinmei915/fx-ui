---
category: Components
group: 数据展示
title: ScrollArea
subtitle: 滚动区域
description: 在稳定尺寸容器中提供一致的滚动体验。
source: src/components/ui/scroll-area.tsx
theme: theme/fx-theme.css
status: complete
---

# ScrollArea 滚动区域

shadcn open-code 滚动区域，底层使用 Base UI ScrollArea。

## 来源 {#source}

`src/components/ui/scroll-area.tsx`

## 使用方式 {#usage}

```tsx
<ScrollArea className="h-72">
  {content}
</ScrollArea>
```

## 组件总览 {#overview}

- 方向：vertical、horizontal
- 原生交互态：focus-visible
- 组合：ScrollArea、ScrollBar

## API {#api}

ScrollArea 透传 Base UI Root props；ScrollBar 支持 `orientation="vertical | horizontal"`。

## Semantic DOM {#semantic-dom}

- `data-slot="scroll-area"`
- `data-slot="scroll-area-viewport"`
- `data-slot="scroll-area-scrollbar"`
- `data-slot="scroll-area-thumb"`

## 状态标记 {#states}

focus-visible 在视口上使用 `--ring`；vertical 与 horizontal 由 ScrollBar orientation 选择。

## 主题变量 Design Token {#design-token}

使用 `--ring` 与 `--border`。

## AI Rules {#ai-rules}

根节点必须有稳定宽高；横向滚动显式添加 horizontal ScrollBar。

## 正误示例 {#do-dont}

推荐 `<ScrollArea className="h-72">`；不要用 `overflow-hidden` 隐藏真实内容。
