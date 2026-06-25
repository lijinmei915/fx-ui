---
layer: knowledge
type: spec
last_verified: 2026-06-25
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

## 组件变体与组合规范（所有组件通用）

> 核心：一个组件 = 一组**正交轴**，靠 props 自由组合，**不为某种外观/组合单独建组件**。决策见 `docs/DECISIONS.md` DEC-019。

- **用正交轴定义可配置维度**，不堆组件。常见轴：
  - `variant` —— 语义/类型（如 default / outline / ghost / destructive / link / plain）
  - `size` —— 尺寸（xs / sm / default / lg / icon-*），管高度、内边距、字号、图标-文字 gap
  - `tone` / 语义色 —— 按组件而定（如 Button 的 plain 用 tone 分 中性/主色/危险；Badge 用 variant 表达 success/warning 等）
  - 状态 —— 原生或 data 态（`disabled` / `data-checked` / `data-state=open` 等）
- **轴之间正交**：任意 `variant × size × tone × 状态` 组合都合法，按需用 props 拼（如 `<Button variant="plain" size="sm" tone="danger">`），**不新建组合组件、不滥加 variant**。
- **视觉值全走 token**：变体只切换语义 token 槽（bg/text/border/disabled 等），不在组件层写死颜色/尺寸；交互态用 `*-hover / *-active / *-disabled` token，不用透明度伪装。
- **选择顺序**：先按语义选 `variant` → 按密度/场景选 `size` → 需要分色再选 `tone` → 状态按需加。
- **何时才真正新增 variant / 组件**：仅当出现现有轴**表达不了的新语义**时（如「无底色按钮 plain」是 ghost 之外的新语义）；新增必须同步 `components.manifest.json` + 组件文档 + 一条 DEC。
- **文档展示**：场景示例按轴（类型/尺寸/状态/图标）分 tab 展示，**不铺全矩阵**（组合爆炸）；组件总览并排展示各轴并体现"可正交组合"。

## 组件体检清单（逐个过审标准）

> 用途：复审/新增任何组件时，按这 14 条逐项核对，确保和已沉淀的规范一致。来源是 Dropdown/Table/Button/Badge 多轮打磨的经验。

**A. 设计规范与语义**
1. **公司 Figma 为准 + 主流交叉验证**：体检前先调 Figma 对照（MCP `get_design_context` / `get_variable_defs`，节点 URL 记在 manifest `figma` 字段），同时比对主流（shadcn/Ant/Linear）。**两者分歧时，先给出"公司 vs 主流 + 建议"再让人拍板**，不盲从任一方；落地配色全走我们 token
2. 职责单一不越界（Badge≠按钮、Tag≠角标、标记类不承载跳转）
3. 变体只留主流要的，删非主流（如 badge 的 ghost/link）

**B. 正交轴（DEC-019）**
4. variant/size/tone/state 正交，不为组合造组件
5. size 对所有 variant 生效；表单控件（Input/Select…）尺寸与 Button 同档（sm h-7 / default h-8 / lg h-9）

**C. 颜色与状态（DEC-005 / DEC-020）**
6. 颜色全走语义 token，无 hex / `color-mix`
7. hover/active/disabled 用 `*-hover/active/disabled` token，不用 `opacity-50` 伪装；禁用不写 `pointer-events-none`（会让 `cursor-not-allowed` 失效）。例外：focus-visible / aria-invalid 焦点环按无障碍惯例可用透明度
8. 三态完整且方向一致（hover 浅、active 深；到顶不能更深就回默认，别越点越亮）
9. 禁用保留语义色（危险淡红、链接淡蓝），中性才灰

**D. 结构细节**
10. 分割线/边框用对档（`border-subtle` / `border-faint`）、表头深线表体淡线
11. 容器默认无边框、框 opt-in；间距按尺寸适配

**E. 可达性**
12. 纯图标必有 `aria-label` + Tooltip

**F. 文档治理（DEC-002）**
13. 场景按轴分 tab、不铺全矩阵；示例别误导（带框/常开要符合真实默认）
14. 改组件必同步 `components.manifest.json` + 组件 md + DEC + check

过审流程：机器先扫硬伤（6/7/12 可脚本化）→ 人判软性项（1/2/3/8/13）→ 在 `docs/data/governance-status.json` 标记"已体检"，逐个勾掉。

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
