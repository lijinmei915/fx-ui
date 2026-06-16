> **接手时间**：2026-06-14
> **项目根目录**：fx-ui
> **当前状态**：Agent UI 第一阶段已落地基础协议、视觉规范、场景矩阵和 Mock Playground；下一轮可以继续做真实样式方向或补 `action/context` 机制
> **下一步**：优先二选一：1）把 `AgentSurface` 做成更 C 端化的数据卡视觉；2）继续扩展 Agent block（如 `metric-card` / `task-card`）或进入 `action/context` 队列
> **风险**：`theme/fx-theme.css` 仍是 token 真相源；Agent UI 当前只有轻协议，不具备页面上下文和宿主动作注册；基础组件仍必须来自 shadcn open-code，不能手写黑盒基础组件

---
layer: knowledge
type: status
last_verified: 2026-06-14
teaches: "fx-ui 当前 Agent UI 做到了哪里、哪些是已落地、哪些只是后续队列"
use_when: "新的 AI 会话接手 fx-ui，尤其是接手 Agent UI / 生成式 UI 相关工作时"
depends_on: [PROJECT.md]
---

# 当前交接 — fx-ui Agent UI

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
