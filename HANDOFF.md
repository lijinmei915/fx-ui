> **接手时间**：2026-06-22
> **项目根目录**：fx-ui
> **当前状态**：组件文档结构统一收口——图标页重写为标准 7 段式、正误示例全站统一两列形式、筛选去「全部」、模块说明字号固定、按钮禁用态光标修正；新增组件文档 API / 导入约定门禁。已提交推送 main（公开仓库，同事可拉）
> **下一步**：1）其余组件页逐个对照新规范（PageLead lead 写法、模块说明 text-base、正误两列、尺寸分组逐档）巡检；2）toggle/table/tabs/sidebar 等 `/透明度`、旧 `bg-muted` hover 收敛（DEC-005 尾巴）；3）回到 Agent UI 真实视觉方向（见下方旧交接）
> **风险**：`theme/fx-theme.css` 是 token 真相源，动它即全局换肤；交互阶梯仅浅色模式；改 token 按顺序 改 CSS→TOKENS/规则→`npm run build:tokens`→再改组件（见 AGENTS.md）

---

## 本轮（2026-06-22）组件文档结构 & 用色统一

**主线：把"图标页对不齐 + 正误示例两种形式 + 筛选/说明不统一"理顺，并补门禁。**

已完成：
- **图标页重写**：标准 7 段式（总览/场景/使用/API/语义DOM/正误），新增带类型的 `iconPropRows` API 表；`icon.md` 从过期的 lucide 修正为 Tabler / `@/lib/icons` 并补「图标颜色规范」节
- **组件总览改纯展示**：单色线性/彩色线性/面型/反白/尺寸 五块，统一同一批图标（Home/CheckCircle/Bell/Star/Database）、统一主题色（`bg-primary`/`text-primary-foreground`），去掉子标签注释
- **图标用色定死**：单色默认 `text-foreground`、次要 muted、禁用 disabled；彩色走语义色；反白 `bg-primary`+`text-primary-foreground`；禁用 `opacity-50`+`cursor-not-allowed`（与 Button 同口径，不另造禁用 token）
- **场景筛选统一**：去掉「全部」tab、默认选第一组；按钮=类型/尺寸/状态/图标，按钮组=类型/尺寸，图标=类型/尺寸；尺寸分组逐档一行（写规格+用途+约束）
- **正误示例全站统一**：按钮/图标从「逐条代码卡片」改为两列「推荐 Do / 避免 Don't」+ 补一句说明，与其余 ~27 个组件（StandardDocPage + 13 内联页）口径一致
- **模块说明字号固定**：`docsSpacing.sectionDesc`（`text-base`），全站把零散 `text-fx-13` 模块说明 bump 上来；规范 PageLead `lead` 写法（一句话用途、不堆术语/代码/DEC 引用）
- **按钮禁用态**：`button.tsx` 去 `disabled:pointer-events-none`→`disabled:cursor-not-allowed`，各 variant hover/active 加 `enabled:` 前缀（禁用悬停不变色、显示禁止光标），base 加 `cursor-pointer`
- **新增门禁**：`scripts/check-component-docs.mjs`（每张 `*PropRows` 非空且 prop 都带 type）、`scripts/check-imports.mjs`（图标走 `@/lib/icons`、无旧图标库残留），均接入 `check-all.sh`
- 规范沉淀进 `docs/DOC_SITE_DESIGN.md`（页面头部组/模块说明/组件文档页结构/筛选 tab/尺寸逐档）

未收口（下一任注意）：
- 其余组件页（Input/Select/… 内联页）的 PageLead lead 写法、说明字号、尺寸分组是否全按新规范，尚未逐个巡检
- DEC-005 尾巴（toggle/table/tabs/sidebar 的 `/透明度`、旧 hover）仍未收敛

---

## 本轮（2026-06-16）颜色系统治理

**主线：把颜色从"散落写死/三套手法"整顿成"色板单一真相 + 统一规则 + 可执行检查"。**

已完成：
- **Token 生成器 + CI**：`scripts/build-design-tokens.mjs`（改完 CSS 跑 `npm run build:tokens` 重建 manifest）、`.github/workflows/check.yml`（服务器端全套检查，绕不过 `--no-verify`）、`scripts/check-frontmatter.sh`
- **两套灰合一**：删除独立 Gray 色系，全站唯一中性灰 = `--fx-neutrals-01~20`（20 阶，偏色 0.008）；secondary/muted 走中性轴
- **统一交互阶梯（DEC-005，仅浅色模式）**：以 09 为默认的色（主色/状态实心/链接/品牌文字）= 默认09 / hover08 / active10 / 禁用05；浅色组 01/02/03；中性填充 02/03/04，ghost/outline hover02/active03
- **状态色**：拆成 危险/成功/警告/信息 四张表，实心+浅色完整态；warning 改琥珀（不撞品牌橙）；info 蓝（中性/默认标签改用 `secondary`）
- **链接色**：新增 `--link`（蓝 09/08/10），Button/Badge link 变体由橙改蓝
- **文字/图标四级**：均匀梯度 20/15/11/07 + 反白 01；拆「中性层级」「彩色（品牌/链接）」两表；placeholder 与禁用同档(07)
- **三件套闭环**：`interactionLadder` 写进 `design-tokens.json`，`check-tokens-sync.sh` 校验每个色 hover/active/disabled 实际阶——已验证能拦漂移
- **文档站颜色页**：彩色色板（13 色系）+ 中性色板（20 阶）双表、推导数值上墙、示例列前置、说明独占整行（layoutContract 锁定）

未收口（下一任注意）：
- toggle / table / tabs / sidebar 等仍有 `/50` 透明度、旧 `bg-muted` hover，未收敛
- 组件"场景示例"表（约 22 张）是否按"示例在前"调整，老李暂停未定

---

# 上一轮交接 — fx-ui Agent UI（背景参考）

> 新 AI 接手这轮工作，先读这里。

## 当前状态

- 当前做到：`AgentSurface` 已经作为单独的 `Agent UI` 组接入文档站；支持 `text`、`object-card`、`file-card`、`insight-card`、`action-row` 五类 block
- 当前阻塞：无
- 是否可继续：可以；当前适合继续做真实视觉风格、更多高频 block，或者开始设计 `action/context` 机制

## 本次已完成

- **Agent UI 协议落地**：新增 `docs/AGENT_UI.md`、`docs/data/agent-ui.manifest.json`、`scripts/check-agent-ui-contract.mjs`。已把 Agent UI 从“口头规则”变成“文字规范 + 机器事实 + 可执行检查”
- **AgentSurface 组件落地**：新增 `src/components/fx/agent-surface.tsx`，当前 block 白名单：
  - `text`
  - `object-card`
  - `file-card`
  - `insight-card`
  - `action-row`
- **Agent UI 视觉规范**：新增 `docs/AGENT_UI_VISUAL.md` 和 `docs/data/agent-ui-visual.manifest.json`
  - 关键原则：`视觉气质参考 C 端，底层能力仍用 fx-ui`
  - 不是另起一套设计系统，仍吃 `fx-ui token + shadcn + src/components/fx`
- **高频场景矩阵**：Agent UI 已梳理 phase-1 / phase-2 场景
  - phase-1：对象信息、文件信息、建议/结论、操作区
  - phase-2：任务/待办、多对象列表、风险/警告、进度状态
- **AgentSurface 页面接入**：`src/App.tsx` 已有独立页面和右侧目录，内容包括：
  - 组件总览
  - 高频场景
  - 视觉规范
  - Mock 预览
  - 实时示例
  - JSON 协议
  - 协议取舍
  - 安全边界
- **Mock Playground**：当前页面 `#agent-surface` 已经支持左侧粘贴 / 编辑 mock JSON，右侧实时渲染真实 `AgentSurface`
  - JSON 错误时显示错误
  - 未知 block 走安全兜底
  - 按钮事件进入事件日志
- **action/context 已记账**：当前没有实现页面上下文和动作注册，只是明确记入后续队列

## 关键文件

- `src/components/fx/agent-surface.tsx`
  AgentSurface 真实源码和 block 白名单
- `src/App.tsx`
  AgentSurface 页面、Mock Playground、实时示例
- `docs/AGENT_UI.md`
  Agent UI 协议、block 说明、高频场景、后续队列
- `docs/AGENT_UI_VISUAL.md`
  Agent UI 视觉规范，强调“参考 C 端、底层仍用 fx-ui”
- `docs/components/fx-agent-surface.md`
  AgentSurface 组件文档
- `docs/data/agent-ui.manifest.json`
  Agent UI 机器事实表
- `docs/data/agent-ui-visual.manifest.json`
  Agent UI 视觉机器事实表
- `docs/data/governance-status.json`
  已记录 `agent-action-context` 为 `queued`
- `scripts/check-agent-ui-contract.mjs`
  Agent UI 检查脚本

## 风险与边界

- `theme/fx-theme.css` 是 token 真相源，动它就是全局换肤
- Agent UI 当前是**轻协议**，不是完整产品运行时
  - 当前只做到：`onAction({ surfaceId, event, payload })`
  - 还没做到：页面上下文、动作注册表、宿主 action、human-in-the-loop
- 组件样式目前仍偏“规则面板”，还没有进入用户想要的更强 C 端化真实风格
- 场景矩阵当前已经从“8 张同质卡”改成 phase-1 / phase-2 分组，但真实组件视觉风格还没正式重做

## 下一步建议

1. **优先做真实视觉方向**
   把 `AgentSurface` 改成更 C 端的数据卡 / 助理看板风格，而不是当前偏治理说明页的样子
2. **新增候选 block**
   如果继续扩展，最值得优先讨论的是：
   - `metric-card`
   - `task-card`
   - `result-list`
3. **再进入 action/context**
   这块已经登记，但建议等视觉和高频 block 稳住后再做

## 检查

- 当前最小检查：`npm run check:agent-ui`
- 当前总检查：`npm run check`
- 本轮最后一次已跑：`npm run check:agent-ui` 通过

## 给下一任模型的开场提示词

可以直接把下面这段交给下一任模型：

```txt
你正在接手 fx-ui 的 Agent UI 工作，请先读 HANDOFF.md、AGENTS.md、docs/AGENT_UI.md、docs/AGENT_UI_VISUAL.md。

当前状态：
1. AgentSurface 已落地，源码在 src/components/fx/agent-surface.tsx
2. 当前支持 5 个 block：text、object-card、file-card、insight-card、action-row
3. 文档站页面在 src/App.tsx，#agent-surface 页面已有 Mock Playground
4. Agent UI 当前是轻协议：只做安全渲染和 onAction 事件回传
5. action/context 机制还没做，只在 docs/data/governance-status.json 里记为 queued

本轮优先方向：
- 优先做更 C 端化的真实 Agent 卡片样式
- 或扩展新的高频 block（metric-card / task-card / result-list）
- 不要直接进入重协议或复杂运行时

规则：
- 不手写基础组件，继续用 shadcn open-code
- 不改 dist
- 改完运行 npm run check
```
