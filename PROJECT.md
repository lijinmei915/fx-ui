---
layer: knowledge
type: status
last_verified: 2026-06-17
teaches: "fx-ui 当前进度、当前优先级和已知边界（定位/技术栈/架构见各自专文）"
use_when: "AI 需要判断 fx-ui 现在做到哪、下一步该做什么时"
---

# 项目状态 — fx-ui

> 用途：回答 fx-ui **现在做到哪、下一步做什么**。
> 定位/产品看 `PRODUCT.md`，技术栈看 `docs/TECH_STACK.md`，架构看 `docs/ARCHITECTURE.md`——本文件不复述。

## 一句话

公司的 **AI 可读前端生产体系**——基础组件用现成 shadcn/ui，公司视觉靠 token，页面从 Blocks 起步并沉淀布局规范。（详见 `PRODUCT.md`）

## 当前进度

- 已完成：公司 token 扒取 + 映射到 shadcn 语义槽（`theme/fx-theme.css`）
- 已完成：Vite + React + TS + Tailwind v4 + shadcn 工程搭建、token 注入、换肤验证
- 已完成：拉取并验证全部 30 个 shadcn 基础组件 + 中文文档页（六段式 + `StandardDocPage` 骨架），覆盖率 100%
- 已完成：标准后台列表页 demo（标题/筛选/表格/新建弹窗/删除确认）
- 已完成：第一批公司组合组件（`PageShell`、`PageHeader`、`SearchToolbar`、`ConfirmDangerDialog`、`AgentSurface`）+ 布局规范 `docs/LAYOUTS.md`
- 已完成：`src/reports/` 报告渲染层（客户简报 `customer-briefing`），详见 `docs/REPORTS.md`
- 已完成：Agent UI 第一阶段（协议 + 视觉规范 + Mock Playground），详见 `docs/AGENT_UI.md`
- 已完成：**颜色 token 系统大整顿**——单一真相、单套中性灰、统一交互阶梯、状态/链接/文字语义理顺，全接入三件套检查（详见 `HANDOFF.md`）
- 已完成：工程文件治理——清孤岛脚本、文档新鲜度自动维护

## 当前优先级

1. 把仍用 `/透明度`、旧 `bg-muted` hover 的组件（toggle/table/tabs/sidebar）收敛到新交互 token（DEC-005 尾巴）
2. 逐个精修组件文档和组件索引页，保证页面结构、导航、示例数据和源码 API 对齐
3. 继续基于列表页 demo 抽内部 Blocks，补详情页 / 编辑页 / 设置页样板

## 已知边界

- 暂不扫老 Element 库（二期再说）
- token 真相源是 `theme/fx-theme.css`，改它影响全局
- 当前交互阶梯仅浅色模式，深色模式未定
