---
layer: knowledge
type: spec
last_verified: 2026-08-28
teaches: "fx-ui Web 布局基础规范总览与栅格/布局专题路由"
use_when: "AI 要判断栅格与页面骨架分工，或查找布局专题文档时"
---

# fx-ui 布局规范

> 本文保留为布局规范总入口。栅格管内容区分栏，布局管整页骨架；两者不是同一层能力。

## 专题文档

| 专题 | Markdown | 负责范围 |
|------|----------|----------|
| 栅格 | [foundations/grid.md](foundations/grid.md) | 24 列、gutter、偏移、嵌套、响应式分栏 |
| 布局 | [foundations/layout.md](foundations/layout.md) | Header / Sider / Content / Footer 骨架、容器尺寸和页面节奏 |

## 使用边界

- 整页骨架使用 fx `Layout` 组件已验证的 API。
- 内容区分栏使用 Tailwind 24 列栅格工具类，不额外封装 Row / Col。
- 页面类型的具体 Block 和语义角色不属于本基础规范，统一从 [页面规范索引](pages/README.md) 进入。
