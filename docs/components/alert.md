---
category: Components
group: 反馈
title: Alert
subtitle: 提示
description: 持续展示需要用户注意的信息或错误。
source: src/components/ui/alert.tsx
theme: theme/fx-theme.css
status: complete
---

# Alert 提示

shadcn open-code 提示组件。使用 `default` 展示普通信息，使用 `destructive` 展示错误或危险信息。

## 来源 {#source}

`src/components/ui/alert.tsx`

## 使用方式 {#usage}

```tsx
<Alert>
  <AlertTitle>配置尚未完成</AlertTitle>
  <AlertDescription>补齐必要信息后即可发布。</AlertDescription>
</Alert>
```

## 组件总览 {#overview}

- 状态/变体：default、destructive
- 组合：Alert、AlertTitle、AlertDescription、AlertAction

## API {#api}

`variant` 为 `default | destructive`。其余属性透传根 `div`。

## Semantic DOM {#semantic-dom}

- `data-slot="alert"`
- `data-slot="alert-title"`
- `data-slot="alert-description"`
- `data-slot="alert-action"`

## 状态标记 {#states}

default 与 destructive 由 `variant` 选择；组件根节点具有 `role="alert"`。

## 主题变量 Design Token {#design-token}

使用 `--card`、`--card-foreground`、`--destructive` 与 `--muted-foreground`。

## AI Rules {#ai-rules}

提示使用 Alert，不手写带颜色、边框和圆角的提示容器。

## 正误示例 {#do-dont}

推荐使用 `<Alert variant="destructive">`；不要用调用处 className 手写错误色。
