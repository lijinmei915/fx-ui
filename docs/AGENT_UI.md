---
layer: governance
type: spec
last_verified: 2026-06-23
teaches: "fx-ui Agent UI 的生成式界面协议：Agent 发 JSON，前端渲染本地 React 组件，action 只作为事件"
use_when: "要让公司 Agent 在对话里生成卡片、文件、对象信息或操作按钮时"
---

# Agent UI 生成式界面协议

> 用途：定义 fx-ui 第一阶段 Agent UI 怎么生成、怎么渲染、怎么保证安全。
> 不要写什么：具体业务接口、权限规则、某个 Agent 的提示词。

---

## 一句话

Agent UI 不是让 LLM 写 React，也不是生成静态 HTML。

fx-ui 的第一阶段做法是：

```txt
Agent 生成 JSON 意图
  -> 前端校验 type 和字段
  -> AgentSurface 用本地 React/shadcn/fx 组件渲染
  -> 用户点击按钮
  -> 前端只回传事件给宿主应用或 Agent
```

## 和静态 HTML 的区别

| 对比 | 静态 HTML / JS 报告 | Agent UI |
|------|---------------------|----------|
| 输出 | 一份 HTML 文件 | 产品里的 React 交互界面 |
| 生成内容 | AI 直接拼 HTML/CSS/JS | Agent 只发 JSON 意图 |
| 渲染方式 | 浏览器打开 HTML | 本地 React 组件渲染 |
| 交互 | 重新生成或写 JS | action 事件回传宿主应用 |
| 安全边界 | 需要严控 AI 生成代码 | 前端不执行 LLM 生成代码 |

## 参考成熟规范与取舍

fx-ui 第一阶段参考这些方向，但不直接全量照搬：

| 参考 | 我们借鉴什么 | 暂时不照搬什么 |
|------|--------------|----------------|
| A2UI | catalog、surface、action、受控组件白名单 | 不先做完整跨端协议和远程组件生态 |
| AG-UI | Agent 和前端之间的事件、状态、流式通信思路 | 不把第一阶段做成完整运行时事件总线 |
| Vercel AI SDK Generative UI | 工具结果映射到本地 React 组件 | 不让 LLM 任意决定 React 代码结构 |
| OpenAI Apps / MCP UI | 工具结果可以带结构化 UI，由宿主渲染 | 不把 fx-ui 绑定到某个宿主平台 |

fx-ui 的取舍是：

```txt
先做轻协议，后看是否接重协议。
```

“轻协议”指的是：Agent 只输出受控 JSON，前端只渲染本地白名单组件，action 只作为事件。

“重协议”指的是：一开始就引入完整跨端标准、复杂事件流、远程组件注册、多宿主适配和长期兼容层。

第一阶段不要被重协议拖住。只有当公司 Agent 场景稳定、多个客户端都需要复用、或者必须和外部生态互通时，再评估是否兼容 A2UI / AG-UI 这类更大的协议。

## 当前组件

当前唯一运行组件是：

```txt
src/components/fx/agent-surface.tsx
```

机器事实表是：

```txt
docs/data/agent-ui.manifest.json
```

组件文档是：

```txt
docs/components/fx-agent-surface.md
```

网站里的真实预览入口是：

```txt
#agent-surface-playground
```

它用于粘贴或编辑 mock Agent JSON，并实时渲染真实 `AgentSurface` 组件。这个预览只接受受控 JSON；JSON 格式错误时显示错误，不渲染假 UI；未知 block 仍然走安全兜底。

## Surface 协议

```json
{
  "id": "customer-followup",
  "title": "客户跟进建议",
  "description": "由 Agent 根据当前客户资料生成。",
  "blocks": []
}
```

规则：

- `id` 必填，用来标识当前 UI surface。
- `blocks` 必填，是受控 block 列表。
- `title`、`description` 可选。
- 不允许在 surface 或 block 里放 HTML、JS、CSS、React 源码。

## Block 白名单

第一阶段只允许这些 block：

| type | 用途 |
|------|------|
| `text` | 普通说明文字 |
| `object-card` | 对象信息卡，例如客户、任务、审批对象 |
| `file-card` | 文件卡，例如合同、附件、报告 |
| `insight-card` | Agent 结论、建议、风险提示或推荐动作 |
| `action-row` | 操作按钮组 |

未知 `type` 的处理方式：

```txt
显示“不支持的 Agent UI 块”，不执行、不渲染未知代码。
```

## text

```json
{
  "type": "text",
  "text": "Agent 已识别 2 个可处理对象。",
  "tone": "muted"
}
```

字段：

- 必填：`type`、`text`
- 可选：`id`、`tone`
- `tone` 只能是 `default` 或 `muted`

## object-card

```json
{
  "type": "object-card",
  "title": "客户信息",
  "description": "由 Agent 上下文生成。",
  "fields": [
    { "label": "客户", "value": "星河科技" },
    { "label": "状态", "value": "待跟进" }
  ],
  "actions": [
    { "label": "生成跟进计划", "event": "generate_followup" }
  ]
}
```

字段：

- 必填：`type`、`title`、`fields`
- 可选：`id`、`description`、`actions`
- `fields` 每项必须有 `label` 和 `value`

## file-card

```json
{
  "type": "file-card",
  "title": "相关文件",
  "filename": "采购合同.pdf",
  "meta": "PDF",
  "summary": "Agent 可以基于该文件继续总结、提取风险或生成下一步。",
  "actions": [
    { "label": "总结文件", "event": "summarize_file" }
  ]
}
```

字段：

- 必填：`type`、`title`、`filename`
- 可选：`id`、`summary`、`meta`、`actions`

## insight-card

```json
{
  "type": "insight-card",
  "title": "建议优先跟进",
  "summary": "客户合同已延期 7 天，且最近两次沟通都没有明确下一步。",
  "tone": "warning",
  "evidence": [
    "合同状态：延期",
    "最近沟通：未确认新时间"
  ],
  "actions": [
    { "label": "生成跟进计划", "event": "generate_followup" }
  ]
}
```

字段：

- 必填：`type`、`title`、`summary`
- 可选：`id`、`tone`、`evidence`、`actions`
- `tone` 只能是 `info`、`success`、`warning` 或 `danger`
- `evidence` 用来放 Agent 判断依据，不放长篇正文

## action-row

```json
{
  "type": "action-row",
  "actions": [
    { "label": "继续分析", "event": "continue_analysis" },
    { "label": "取消", "event": "cancel", "variant": "ghost" }
  ]
}
```

字段：

- 必填：`type`、`actions`
- 可选：`id`

## Action 规则

Action 只是事件，不是代码。

推荐：

```json
{
  "label": "总结文件",
  "event": "summarize_file",
  "payload": {
    "fileId": "file_001"
  },
  "variant": "outline"
}
```

不允许：

```json
{
  "label": "删除",
  "onClick": "fetch('/api/delete-all')"
}
```

字段：

- 必填：`label`、`event`
- 可选：`payload`、`variant`
- `variant` 只能是 `default`、`outline`、`secondary`、`ghost`、`destructive`
- 前端回调只发：`onAction({ surfaceId, event, payload })`

## 安全红线

Agent UI JSON 不允许出现这些字段：

- `html`
- `script`
- `style`
- `css`
- `jsx`
- `onClick`
- `dangerouslySetInnerHTML`

前端渲染器不允许做这些事：

- `eval`
- `new Function`
- `innerHTML`
- `dangerouslySetInnerHTML`
- 根据 Agent payload 动态 import 组件

## 新增 block 的规则

新增 block 前先问：

1. 现有 `text`、`object-card`、`file-card`、`action-row` 能不能表达？
2. 这个结构是否会稳定复用三次以上？
3. 它是不是产品内真实 Agent 场景，而不是一次性展示需求？

新增 block 时必须同步：

1. `src/components/fx/agent-surface.tsx`
2. `docs/data/agent-ui.manifest.json`
3. `docs/AGENT_UI.md`
4. `docs/components/fx-agent-surface.md`
5. `npm run check:agent-ui`

## 高频场景矩阵

先按公司 Agent 回复里的高频场景沉淀组件，不按业务名无限拆组件。

| 场景 | 用户看到什么 | 对应 block | 阶段 |
|------|--------------|------------|------|
| 对象信息 | 客户、员工、订单、合同、项目、审批单 | `object-card` | phase-1 |
| 文件信息 | 合同、报告、附件、知识库文档、表格 | `file-card` | phase-1 |
| 建议/结论 | Agent 的判断、摘要、风险提示、推荐动作 | `insight-card` | phase-1 |
| 操作区 | 继续分析、生成报告、发起审批、查看详情 | `action-row` | phase-1 |
| 任务/待办 | 待跟进、待审批、待补充资料、待确认 | `task-card` | phase-2 |
| 多对象列表 | 找到多个客户、文件、记录或候选项 | `result-list` | phase-2 |
| 风险/警告 | 权限不足、数据缺失、高风险操作、不可逆动作 | `risk-card` | phase-2 |
| 进度状态 | 正在分析、已完成、部分失败、等待用户选择 | `agent-status` | phase-2 |

第一阶段先覆盖“对象、文件、结论、操作”。不要按“客户卡片、合同卡片、员工卡片”一个个做死；先用通用 `object-card` 和 `file-card` 表达业务对象，等结构稳定复用后再升级成更专门的 block。

## 后续队列

这块先记下来，等第一阶段 block 和视觉稳定后再做：

| 主题 | 现在先不做什么 | 以后要补什么 |
|------|----------------|--------------|
| `action/context` 机制 | 现在只做 `onAction({ surfaceId, event, payload })` 事件回传，不让 Agent 直接读页面上下文或控制应用 | 后续补页面上下文、动作注册表、宿主可执行 action 和 human-in-the-loop 流程 |

当前轻协议只解决“安全渲染 Agent UI”。后续的 `action/context` 机制解决的是“Agent 如何理解当前页面、知道当前对象是谁、并触发受控产品动作”。

## 检查

```bash
npm run check:agent-ui
```

总检查：

```bash
npm run check
```
