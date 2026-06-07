---
layer: knowledge
type: status
last_verified: 2026-06-07
teaches: "fx-ui 的项目定位、技术栈、当前进度和下一步"
use_when: "AI 需要判断 fx-ui 现在该做什么、处于什么阶段时"
---

# 项目状态 — fx-ui

> 用途：回答 fx-ui 现在是什么、做到哪、下一步做什么。

## 项目定位

- 项目名：`fx-ui`
- 一句话定位：公司的 **AI 可读前端生产体系**——基础组件用现成 shadcn/ui，公司视觉靠 token，页面从 Blocks 起步并沉淀布局规范
- 不是什么：不是又一个手写的 UI 组件库

## 为什么这么做

公司原有组件库（Element 改造，多年老库）是个黑盒，AI 消费不了。fx-ui 不在老地基上修补，而是：
- 底层换到 AI 友好的 shadcn/ui（组件即源码）
- 只迁移公司视觉（token），组件用现成的
- 页面用 shadcn Blocks / v0 / 内部 Blocks 快速起步
- 从真实页面里沉淀公司自己的组合组件和布局规范
- 让整个体系 AI 可读可消费

## 技术栈

React + TypeScript + Tailwind CSS v4 + shadcn/ui

## 长期架构方向

详见 `docs/ARCHITECTURE.md`。当前方向分三层：

1. 基础组件层：`src/components/ui/`，只放 shadcn/ui 拉下来的 open-code 组件。
2. 公司组合组件层：`src/components/fx/`，沉淀 `PageHeader`、`SearchToolbar`、`EntityTable` 等高频业务模式。
3. 页面 Blocks / 布局规范层：`src/blocks/`、`src/layouts/`、`docs/LAYOUTS.md`，用于快速生成页面并沉淀公司布局规范。

## 当前进度

- 已完成：公司 token 扒取 + 映射到 shadcn 语义槽（`theme/fx-theme.css`）
- 已完成：Vite + React + TS + Tailwind v4 + shadcn 工程搭建
- 已完成：公司 token 注入，Button 组件拉取并验证换肤（公司橙 ✅）
- 已完成：Button 演示页（`src/App.tsx`），展示全部变体/尺寸/状态
- 已完成：记录三层体系方向（基础组件 / 公司组合组件 / 页面 Blocks）
- 已完成：拉取 Card / Input / Dialog / Table / Tabs / Badge / Select / Alert Dialog 等 shadcn 基础组件
- 已完成：标准后台列表页 demo（标题区 + 筛选区 + 表格区 + 新建弹窗 + 删除确认）
- 已完成：抽出第一批公司组合组件：`PageShell`、`PageHeader`、`SearchToolbar`、`ConfirmDangerDialog`
- 已完成：沉淀第一版布局规范：`docs/LAYOUTS.md`
- 已完成：补全 Button 场景示例（类型/尺寸/状态/图标/组合），组件总览矩阵改为从场景数据派生避免漏同步
- 已完成：拉取 ButtonGroup 组件并补充按钮组合场景

## 当前优先级

继续基于列表页 demo 抽内部 Blocks，补详情页 / 编辑页 / 设置页样板

## 已知边界

- 暂不扫老 Element 库（需求清单二期再说）
- token 真相源是 `theme/fx-theme.css`，改它影响全局
