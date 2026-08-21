---
category: Components
group: 反馈
title: Empty
subtitle: 空状态
description: 数据为空、搜索无结果或尚未创建内容时给出下一步。
source: src/components/ui/empty.tsx
theme: theme/fx-theme.css
status: complete
---

# Empty 空状态

shadcn open-code 空状态组件，用于请求成功但没有内容的场景。

## 来源 {#source}

`src/components/ui/empty.tsx`

## 使用方式 {#usage}

```tsx
<Empty>
  <EmptyHeader>
    <EmptyTitle>暂无数据</EmptyTitle>
    <EmptyDescription>请先创建内容。</EmptyDescription>
  </EmptyHeader>
</Empty>
```

## 组件总览 {#overview}

- 组合：Empty、EmptyHeader、EmptyMedia、EmptyTitle、EmptyDescription、EmptyContent
- EmptyMedia 变体：default、icon

## API {#api}

`EmptyMedia.variant` 为 `default | icon`；其余属性透传各自原生元素。

## Semantic DOM {#semantic-dom}

- `data-slot="empty"`
- `data-slot="empty-header"`
- `data-slot="empty-icon"`
- `data-slot="empty-title"`
- `data-slot="empty-description"`
- `data-slot="empty-content"`

## 状态标记 {#states}

default 与 icon 只作用于媒体区域；业务空态原因由标题和说明表达。

## 主题变量 Design Token {#design-token}

使用 `--muted`、`--muted-foreground`、`--foreground` 与 `--primary`。

## AI Rules {#ai-rules}

空数据使用 Empty，不用 Skeleton 或临时居中文本替代。

## 正误示例 {#do-dont}

推荐 EmptyHeader + EmptyTitle + EmptyDescription；不要手写空状态卡片。
