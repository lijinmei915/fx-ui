---
layer: knowledge
type: spec
last_verified: 2026-06-08
teaches: "fx-ui 的「对外报告/简报」渲染层是什么、和页面 Block 有什么区别、数据契约怎么对接"
use_when: "AI 要新建或修改报告类渲染页面、或判断某个产物该归 src/reports/ 还是 src/blocks/ 时"
---

# 报告 / 简报渲染层

> 用途：说明 `src/reports/` 是什么、为什么和 `src/blocks/` 分开、新增报告渲染页时该怎么做。
> 不要写什么：具体业务报告内容本身、外部 skill 的实现细节（那些归外部 skill 自己维护）。

## 这一层是什么

`src/reports/` 存放"对外输出的文档/报告"渲染页面，例如客户简报、团队报表。

它和 `src/blocks/`（页面 Block，如列表页/详情页/编辑页）是**两类不同的东西**：

| | `src/blocks/` 页面 Block | `src/reports/` 报告渲染层 |
|---|---|---|
| 使用方式 | app 内可点击、可交互、长期存在 | 生成一次、导出/分享给别人看，更像"打印出来的一张纸" |
| 生命周期 | 跟随产品长期维护 | 跟随某次报告需求，按数据渲染即可 |

不要把两者混进同一个目录，否则以后新人会分不清"这个文件夹里哪些是能点的页面、哪些是导出用的模板"。

## 为什么会有这一层

背景：销售场景下有一批 Claude Skill（如 `customer_briefing_standard_version`、`sales_manager_team_report`，存放在外部，不在本仓库）会生成客户简报、团队报表等 HTML 报告。这些 skill 自带的 HTML 渲染是临时拼的，配色和公司视觉脱节。

`src/reports/` 的目标：用 fx-ui **真正的组件和 token**（公司视觉真相源）渲染这些报告，让对外的报告产物和公司产品调性保持一致；以后公司换肤，这些报告会自动跟着变，不需要单独维护一份配色。

## 数据契约约定

报告渲染页**只负责"画"**，不负责"提炼内容"——内容由对应的外部 skill 产出结构化数据（如 YAML/JSON），渲染页按约定格式接收并渲染。

以 `customer-briefing` 为例：
- 数据契约对齐外部 `customer_briefing_standard_version` skill 的 `R01-R09` 规则输出契约
- TS 类型定义见 `src/reports/customer-briefing/types.ts`，字段细节需要和该 skill 的 `rules/R0x_*.md` 对照，保持同步
- 示例数据见 `src/reports/customer-briefing/mock-data.ts`，用于本地预览渲染效果

新增报告类型时，先确认对应 skill 的输出契约长什么样，再定义 TS 类型，不要凭空设计字段。

## 子目录结构

```
src/reports/
  └─ <report-name>/             ← 例如 customer-briefing
      ├─ <ReportName>Page.tsx   ← 渲染页本体
      ├─ types.ts               ← 数据契约的 TS 类型定义
      └─ mock-data.ts           ← 示例数据，用于本地预览
```

## 相关文件

| 文件 | 关系 |
|------|------|
| `docs/ARCHITECTURE.md` | 三层体系总览，`src/reports/` 是其中"页面 Blocks / 布局规范层"的近邻但不同类的概念 |
| `docs/LAYOUTS.md` | 页面 Block 的布局规范（不适用于报告渲染层） |
| `docs/TOKENS.md` | 报告渲染页的视觉必须用这里的公司 token，不另起配色 |
