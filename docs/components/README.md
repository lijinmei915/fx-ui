---
layer: knowledge
type: convention
last_verified: 2026-06-06
teaches: "fx-ui 组件文档资产的 Markdown 结构，参考 Ant Design 但适配 shadcn open-code 和 AI 生成规则"
use_when: "AI 要新增组件文档、补组件 API、或让页面从 Markdown 文档资产生成时"
---

# 组件文档规范

> 用途：每个基础组件都应该有一份 Markdown 文档资产，供前端工程师、AI 和文档页面共同消费。

fx-ui 参考 Ant Design 的组件 Markdown 结构，但不复制 Ant 的 API。基础组件 API 必须来自本项目 `src/components/ui/` 的真实源码。

## 推荐结构

```md
---
category: Components
group: 通用
title: Button
subtitle: 按钮
description: 用于触发即时操作。
source: src/components/ui/button.tsx
theme: theme/fx-theme.css
tokens:
  - primary
  - primary-foreground
  - ring
---

## 何时使用
## 代码演示
## API
## Semantic DOM
## 主题变量 Design Token
## AI Rules
## FAQ
```

## 写作规则

- API 表必须从本项目真实源码推导，不照搬 Ant、Element 或 shadcn 官网旧版本。
- 示例代码必须能在本项目里运行。
- 基础组件文档只能说明 shadcn open-code 组件，不引导二次封装黑盒组件。
- 颜色、圆角、状态只能引用语义 token，不写死十六进制。
- `AI Rules` 要明确告诉 AI 什么时候用哪个 variant、size 和 token。
