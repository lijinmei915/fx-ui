---
layer: knowledge
type: spec
last_verified: 2026-06-07
teaches: "fx-ui 当前的 UI 规则、token 使用方式和设计边界"
use_when: "做 UI/视觉相关改动前，判断该走哪条规则、参考哪份文档"
---

# 设计规范

> 本文件回答：当前项目的 UI 规则、token 使用方式和设计边界。
> 本文件不重复列内容，只做"规则总览 + 指向真相源"，具体值看被指向的文档。

## 当前状态

- 是否已有设计系统：有——公司 token 已映射进 shadcn 语义槽（`theme/fx-theme.css`），Button 验证换肤成功（公司橙 ✅）
- 是否已有组件库：有——基于 shadcn/ui 的 open-code 组件（`src/components/ui/`），公司组合组件正在沉淀（`src/components/fx/`）
- 当前视觉基调：克制、专业、AI 友好（结构化优先于花哨视觉），详见 `PRODUCT.md`

## 基本规则

- 不手写基础组件，一律 `npx shadcn add` 拉取（见 `docs/DECISIONS.md` DEC-001）
- 颜色、字号、间距、圆角、阴影一律走 token，不在组件层面单独定义视觉值
- token 真相源是 `theme/fx-theme.css`，查表看 `docs/TOKENS.md`
- 布局规则从真实页面沉淀，记在 `docs/LAYOUTS.md`，不凭空制定
- `@theme inline` 不能用 `var()` 引用具体色值（Tailwind v4 编译期限制），必须直写色值——这条踩坑记录见 `HANDOFF.md`

## 参考文档

- `docs/TOKENS.md` —— token 查询表（颜色/圆角/间距/阴影/焦点环具体取值）
- `docs/LAYOUTS.md` —— 布局规范（页面间距、标题区、筛选区、表格区规则）
- `docs/ARCHITECTURE.md` —— 三层组件体系与目录边界

## 相关文件

| 文件 | 关系 |
|------|------|
| `PRODUCT.md` | 产品定位和品牌调性（设计方向的源头） |
| `docs/TOKENS.md` | token 真相源的查询表 |
| `docs/DECISIONS.md` | "不手写组件"等设计相关决策的原因 |
