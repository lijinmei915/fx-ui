> **接手时间**：2026-06-09
> **项目根目录**：fx-ui
> **当前状态**：Figma 色彩规范完整色板已同步到 token 层和文档，Badge 新增 success variant 修正状态语义
> **下一步**：回到产品功能线——把列表页 demo 拆成内部 Block 候选，继续补编辑页 / 详情页样板
> **风险**：`theme/fx-theme.css` 是 token 真相源，改动影响全局；基础组件必须从 shadcn 拉，不能手写；新建文档必须同步登记 `docs/DOCUMENTATION.md` 的路由表，否则会被 pre-commit 钩子拦截

---
layer: knowledge
type: status
last_verified: 2026-06-09
teaches: "fx-ui 上一轮做了什么、当前能不能继续、风险是什么、下一步具体干什么"
use_when: "新的 AI 会话接手 fx-ui 时"
depends_on: [PROJECT.md]
---

# 当前交接 — fx-ui

> 新 AI 接手 fx-ui，先读这里。

## 当前状态

- 当前做到：Figma 色彩规范完整色板已补入 `theme/fx-theme.css`（11 色系 × 11 阶 + 中性色 19 阶 + 特殊色 4 个），设计 Tokens 页新增色板可视化展示，Badge 补 `success` variant 修正状态语义错用
- 当前阻塞：无
- 是否可继续：可以；token / 组件语义修正已告一段落，下一步该回到产品功能线

## 本次已完成

- **Figma 色板同步**：从 Figma「全局规范」节点读取完整色彩规范，补入 `theme/fx-theme.css`：11 色系（Orange / Magenta / Red / Yellow / Orange Warning / Yellow Green / Green / Teal / Blue / Dark Blue / Purple）× 00–10 阶、中性色 `--fx-neutrals-01~19`、特殊色 `--fx-special-01~04`；`docs/TOKENS.md` 同步追加色板速查表，通过 pre-commit token 漂移检查
- **设计 Tokens 页色板展示**：`src/App.tsx` 颜色 section 新增三块可视化区域：11 色系横向色阶（06 加高亮圈）、中性色 19 格、特殊色卡片，悬停可见变量名和色值
- **Badge success variant**：`badge.tsx` 新增 `success` variant（`bg-success/10 text-success`，风格与 `destructive` 对齐）；文档示例、表格渲染、variant 说明表均从 `default` 改为 `success`；`default` 回归品牌橙/强调语义

## 风险与待确认

- `theme/fx-theme.css` 是 token 真相源，改它 = 全局换肤，动手前必须先告知用户
- 基础组件仍然必须从 shadcn 拉；公司组合组件可以写，但必须由 shadcn 组件组合而成，不能变成新的黑盒基础组件库
- `@theme inline` 不能用 `var()` 引用——Tailwind v4 编译时取不到运行时变量，必须直接写色值
- 必须 `@import "tailwindcss"`，否则 `shadcn/tailwind.css` 里所有 utility class 都不生效
- **新规矩**：新建 `docs/*.md` 必须同步在 `docs/DOCUMENTATION.md` 的 SSOT 路由表里登记一行，否则 `check-docs-routing.sh` 会在提交前拦截
- token 改动后若 `npm run check:tokens` 报漂移，要去同步 `docs/TOKENS.md` 的对应表格——脚本只查不自动改
- 新增组件文档页时优先复用 `StandardDocPage`，不要另起一套结构，否则又会变成"各页各写一套、容易漂移"

## 下一步

1. **fx-ui 报告美化 skill**：在 `skills/fx-ui-report/` 创建两个文件
   - `SKILL.md`：照 open-design data-report 格式，正文写 fx-ui token + 组件规则 + 禁止事项
   - `example.html`：用商机预测报告（`~/Desktop/商机预测报告-风格demo/opportunity_forecast_fx-ui.html`）作为完整示例
   - 前置条件：先把报告 HTML 样式调整满意，再用最终版做 example
2. 回到产品功能线：把当前列表页 demo 拆成内部 Block 候选 `src/blocks/list-page/`
3. 继续做编辑页 / 详情页 / 设置页样板
4. 补 `docs/BLOCKS.md`，记录内部 Blocks 的使用方式（记得同步登记进路由表）
5. 跑 `bash scripts/build-project-graph.sh` 生成知识图谱（目前生成了但还没有消费方）

## 相关文件

| 文件 | 关系 |
|------|------|
| `PROJECT.md` | 项目全局状态（本文件只记当前轮次的交接信息） |
| `AGENTS.md` | AI 行为规则，含"第一版手搓组件被否决"的踩坑记录 |
| `PRODUCT.md` | 产品定义（避免交接时偏离 fx-ui 的产品意图） |
| `docs/ARCHITECTURE.md` | 三层体系（基础组件 / 公司组合组件 / 页面 Blocks）说明 |
