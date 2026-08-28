---
layer: knowledge
type: status
last_verified: 2026-08-28
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
- 已完成：无语义 Foundation 收敛为 15 类、583 个只读基础 Token；协作者和 AI 只读，产品运行时禁止直引
- 已完成：主题生成系统 v1.10.0——Preset/Seed SSOT、算法 v3、Foundation 引用化的六维配置、统一 CSS/JSON/shadcn light+dark 产物、Dark Map 与语义对比度/交互态 Chromium 审计和哈希 release manifest
- 已完成：工程文件治理——清孤岛脚本、文档新鲜度自动维护
- 已完成：框架无关核心与框架适配器拆分；React 保持 ready 参考实现，Vue 2 仅保留 planned 准入入口
- 已完成：Input、Button、Select、Checkbox、Dialog、Table 六条 `adapter-ready` canonical contract + React 映射样板
- 已完成：FDS 四层 Token 升级已进入 `fds-primary`：143 个 DTCG Primitive + 440 个生成式 Map 输出 583 个 Foundation Token；其中 16 个固定色相各有 Base/Dark 12 阶。143 个 Global Semantic 输出 157 个旧变量/shadcn 兼容别名；Button/Input/Table 已准入 13 个 Component Hooks
- 已完成：runtime source 与公开装配入口旧前缀均归零；派生数据、React 和 portable core 使用 FDS 主名称，旧 `--fx-*` 只保留在生成兼容层与迁移对照字段，最早在 v2.0.0 经审计删除
- 已完成：FDS public Styling Hooks 形成单一发布投影——97 个 Global + 13 个 Component Hook 同步进入 Theme contract 与跨框架 core，release 会阻止两边漂移；当前合同为 `1.0.0-draft.11 / experimental`
- 已完成：8 类 Global/Component 命名子语法已结构化登记字段顺序、必填/可选、词典来源和末位字段；全部四层真实 Token 必须且只能命中一种语法
- 已完成：React 参考适配器显式绑定 Button/Input/Table 的 13 个 Component Hook；构建会检查组件归属、公开清单、重复项与真实源码消费，Vue 2 planned 保持零绑定
- 已完成：Button/Input/Table 的 13 个 Component Hook 通过文档、合同、视觉、ready 适配器和真实消费五项稳定门，随 `v1.4.0` 晋级 stable；97 个 Global Hook 继续逐项评审
- 已完成：主题质量门完全切换到 FDS Global Hook 主名称；34 个表面/文字、核心操作与状态阶梯 Hook 经 14 类输入、light/dark 审计后随 `v1.5.0` 晋级 stable
- 已完成：Theme audit 输出真实 `stableEligibleHooks`，命名稳定门不再以“出现在配置中”代替通过证据；border-strong、border-interactive、ring-focus 已进入 3:1 候选审计并因 `0/28`、`0/28`、`5/28` 通过率保持 experimental
- 已完成：text-secondary、icon-muted、icon-inverse 通过全部 28 个样本的 4.5:1/3:1 强制门，Global stable 增至 37 并随 `v1.6.0` 发布；icon-primary 与链接状态组因暗色/浅色失败继续 experimental
- 已完成：disabled 联合证据门同时验证视觉差异、相邻背景可见度、组件行为和 runtime 消费；text-disabled、destructive-disabled、info-disabled 覆盖全部 28 个样本后晋级，Global stable 增至 40 并随 `v1.7.0` 发布
- 已完成：阴影系统审计覆盖 28 个主题样本 × 4 个强度档；三种 shadow color 与 elevation 1/2/3 通过 alpha、几何、消费和视觉证据，Global stable 增至 46 并随 `v1.8.0` 发布，L1-up 因无真实消费者保持 experimental
- 已完成：Foundation 可视化与追溯第一阶段——保留颜色/排版/圆角等设计分类作为主浏览路径，在 Token 概览增加 Seed / Primitive / Map 层级筛选、全量搜索、只读详情和由真实合同派生的 Semantic 反向引用
- 已完成：圆角作为首个非颜色 Seed/Map 样板——8px 内部 Seed 在构建期生成 0/2/4/6/8/12/16px Map，full 保持固定 Primitive；原变量名、组件映射和视觉不变
- 已完成：间距刻度完成首轮消费审计——移除无真实通用消费者的 1/3/5/7/9/11px Primitive，密度 Preset 收敛到相邻偶数档；保留 4px 主网格和 2/6/10px 紧凑补档，不把 spacing 强行改造成 Seed/Map
- 已完成：文档站双发布配置——默认完整站继续输出 `dist/`，Foundation 分享站以白名单独立输出 `dist-foundation/`，包含 11 个基础页面和 11 份同源 Markdown；图标基础规范与组件 Playground 已拆分，组件、Playground、搭建器、页面模板、报告和治理数据由构建产物检查阻止发布

## 当前优先级

1. 分组评审剩余 51 个 FDS public-global Hook，从 `experimental` 晋级 `stable`；新增 Hook 继续执行准入和 SemVer
2. React 保持 ready 参考适配器，Vue 2 继续按 planned 准入；兼容层在 v2.0.0 前不得提前删除

## 已知边界

- 暂不扫老 Element 库（二期再说）
- Token 真相源按职责分为 `tokens/source/primitive.tokens.json`（DTCG Primitive）、`tokens/source/map.tokens.json`（Map 算法）、`tokens/source/semantic.tokens.json`（Semantic）与 `tokens/source/component.tokens.json`（准入式 Component Hooks）；`theme/{foundation,fds-semantic,fds-components}.css` 是生成产物，`theme/fx-theme.css` 是唯一公开装配入口
- 主题 light/dark 已审计并发布；自定义 seed 仍是运行时输入，不等于允许协作者修改 Foundation
- 当前只有 React 适配器可用；Vue 2 仅为 planned，不得宣称已支持
- Foundation 分享站已经可以静态部署，但公司实际托管平台和访问域名仍待确定；当前能力是可验证构建出口，不等同于已经上线公网或内网地址
- FDS Foundation、Global Semantic 与 Button/Input/Table 首批 Component Hooks 已进入运行时；`--fx-*` 仍在兼容窗口，其余组件准入与旧前缀退役尚未完成

## 想法储备（未排期）

- **受控主题实验室**：在 Foundation 只读边界之外提供临时 Seed/主题输入试算，实时预览生成结果但不直接写回 Token SSOT；确认发布仍走评审、构建和审计链。
