> **接手时间**：2026-06-09
> **项目根目录**：fx-ui
> **当前状态**：BI 图表色板落齐、8 种图表类型补完、fx-ui-report skill 完成
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

- 当前做到：BI 图表色板从 Figma「色彩的使用」规范落齐（各色系视觉均衡阶），ChartPage 补完 8 种图表类型，fx-ui-report skill 创建完成
- 当前阻塞：无
- 是否可继续：可以；下一步回到产品功能线

## 本次已完成

- **BI 图表色板**：`--chart-1~10` 从 Figma「BI常用颜色」规范取各色系视觉均衡阶（非统一06），修正了上一轮的错误映射；同步新增图标色、品牌交互四态、列表高亮色 token，`docs/TOKENS.md` 对应章节补齐
- **8 种图表类型**：ChartPage 在原有折线/柱/饼基础上补充面积图、组合图（柱+折线双Y轴）、散点图、雷达图、径向柱图，全部基于 shadcn chart + Recharts
- **fx-ui-report skill**：`skills/fx-ui-report/SKILL.md` + `example.html`，参照 open-design skill 格式，接受任意格式入参（HTML/JSON/Markdown/纯文字），输出严格对齐 fx-ui token 的报告 HTML；内含完整 token 值、8 个组件渲染规则、文字层级规则

## 风险与待确认

- `theme/fx-theme.css` 是 token 真相源，改它 = 全局换肤，动手前必须先告知用户
- 基础组件仍然必须从 shadcn 拉；公司组合组件可以写，但必须由 shadcn 组件组合而成，不能变成新的黑盒基础组件库
- `@theme inline` 不能用 `var()` 引用——Tailwind v4 编译时取不到运行时变量，必须直接写色值
- 必须 `@import "tailwindcss"`，否则 `shadcn/tailwind.css` 里所有 utility class 都不生效
- **新规矩**：新建 `docs/*.md` 必须同步在 `docs/DOCUMENTATION.md` 的 SSOT 路由表里登记一行，否则 `check-docs-routing.sh` 会在提交前拦截
- token 改动后若 `npm run check:tokens` 报漂移，要去同步 `docs/TOKENS.md` 的对应表格——脚本只查不自动改
- 新增组件文档页时优先复用 `StandardDocPage`，不要另起一套结构，否则又会变成"各页各写一套、容易漂移"

## 下一步

1. 回到产品功能线：把当前列表页 demo 拆成内部 Block 候选 `src/blocks/list-page/`
2. 继续做编辑页 / 详情页 / 设置页样板
3. 补 `docs/BLOCKS.md`，记录内部 Blocks 的使用方式（记得同步登记进路由表）
4. 跑 `bash scripts/build-project-graph.sh` 生成知识图谱（目前生成了但还没有消费方）

## 相关文件

| 文件 | 关系 |
|------|------|
| `PROJECT.md` | 项目全局状态（本文件只记当前轮次的交接信息） |
| `AGENTS.md` | AI 行为规则，含"第一版手搓组件被否决"的踩坑记录 |
| `PRODUCT.md` | 产品定义（避免交接时偏离 fx-ui 的产品意图） |
| `docs/ARCHITECTURE.md` | 三层体系（基础组件 / 公司组合组件 / 页面 Blocks）说明 |
