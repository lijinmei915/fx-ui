---
category: Components
group: Agent UI
title: AgentSurface
subtitle: Agent UI 安全渲染面
description: Agent UI 组件，用于把 Agent 返回的受控 JSON 渲染为 fx-ui React 卡片。
source: src/components/fx/agent-surface.tsx
theme: theme/fx-theme.css
tokens:
  - foreground
  - muted
  - muted-foreground
  - card
  - border
  - primary
  - primary-foreground
  - ring
status: complete
---

# AgentSurface Agent UI 安全渲染面

AgentSurface 是 fx-ui 第一阶段的 Agent UI 组件：Agent 不生成 React、HTML 或 JS，只生成受控 JSON；前端用本地 React 组件把 JSON 渲染成真实界面。

源码来自 fx-ui 公司组合组件，底层组合 shadcn/ui 的 Card、Button 和 Badge。公司视觉通过 `theme/fx-theme.css` 的语义 token 注入，不通过执行 LLM 生成代码实现。

AI 使用 AgentSurface 前必须先以 `src/components/fx/agent-surface.tsx` 为真实 API；本文档记录的是当前仓库源码能力，不是凭记忆推断的组件能力。

## 来源 {#source}

```txt
src/components/fx/agent-surface.tsx
```

## 使用方式 {#usage}

```tsx
import { AgentSurface } from "@/components/fx/agent-surface"
```

```tsx
<AgentSurface
  surface={{
    id: "customer-briefing",
    title: "客户跟进建议",
    description: "由 Agent 根据当前客户资料生成。",
    blocks: [
      {
        type: "object-card",
        title: "客户信息",
        fields: [
          { label: "客户", value: "星河科技" },
          { label: "状态", value: "待跟进" },
        ],
        actions: [
          { label: "生成跟进计划", event: "generate_followup" },
        ],
      },
      {
        type: "file-card",
        title: "相关文件",
        filename: "采购合同.pdf",
        summary: "Agent 可以基于该文件继续总结、提取风险或生成下一步。",
        actions: [
          { label: "总结文件", event: "summarize_file", variant: "outline" },
        ],
      },
      {
        type: "insight-card",
        title: "建议优先跟进",
        summary: "合同已延期 7 天，建议先生成跟进计划。",
        tone: "warning",
        evidence: ["合同状态：延期", "最近沟通：未确认新时间"],
      },
    ],
  }}
  onAction={(event) => {
    console.log(event)
  }}
/>
```

## 组件总览 {#overview}

- 类型：fx
- 语义 DOM：`data-slot="agent-surface"`、`data-slot="agent-surface-object-card"`、`data-slot="agent-surface-file-card"`、`data-slot="agent-surface-insight-card"`、`data-slot="agent-surface-actions"`
- 高频场景：对象信息、文件信息、建议/结论、操作区
- 原生/数据状态：root、unsupported type
- 变体：无独立 variant prop；块类型由 JSON 的 `type` 决定
- 导出项：AgentSurface

## 场景示例 {#examples}

### 推荐场景

- 公司 Agent 对话里动态展示对象卡片、文件卡片、摘要说明和操作按钮。
- 需要让 Agent 决定“展示哪些块、顺序是什么、按钮是什么”，但不允许 Agent 执行代码。
- 需要把用户点击转换成事件回传给 Agent 或后端。
- 需要在文档站 `#agent-surface-playground` 粘贴 mock JSON，查看真实组件会生成什么样。

```tsx
<AgentSurface
  surface={{
    id: "case-review",
    blocks: [
      { type: "text", text: "Agent 已识别 2 个可处理对象。" },
      {
        type: "action-row",
        actions: [
          { label: "继续分析", event: "continue_analysis" },
          { label: "取消", event: "cancel", variant: "outline" },
        ],
      },
    ],
  }}
/>
```

### 不适合场景

- 不用 AgentSurface 承载任意 HTML、任意 CSS 或任意 JS。
- 不把 `onClick`、`script`、`style` 等可执行内容放进 Agent JSON。
- 不让 Agent 直接生成 React 组件源码。
- 不把复杂业务权限、真实接口调用和删除逻辑交给 Agent JSON 决定。

## API {#api}

源码定义的 AgentSurfaceProps：

| 属性 | 说明 |
| --- | --- |
| `surface: AgentSurfaceSchema` | Agent UI 的受控 JSON。包含 `id`、可选标题说明和 blocks。 |
| `onAction?: (event: AgentSurfaceEvent) => void` | 用户点击按钮后触发的事件回调。只回传事件名和 payload，不执行 Agent 生成代码。 |
| `emptyText?: string` | blocks 为空时的提示文案。 |

当前支持的 block：

| Block | 用途 |
| --- | --- |
| `text` | 普通说明文字。 |
| `object-card` | 对象信息卡片，例如客户、任务、审批对象。 |
| `file-card` | 文件卡片，例如合同、附件、报告。 |
| `insight-card` | Agent 结论、建议、风险提示或推荐动作。 |
| `action-row` | 一组操作按钮。 |

`insight-card` 字段：

| 字段 | 说明 |
| --- | --- |
| `title` | 结论或建议标题。 |
| `summary` | 一句话解释 Agent 为什么给出这个判断。 |
| `tone` | 可选语气：`info`、`success`、`warning`、`danger`。 |
| `evidence` | 可选依据列表，放短事实，不放长正文。 |
| `actions` | 可选操作按钮。 |

当前 action：

| 字段 | 说明 |
| --- | --- |
| `label` | 按钮文案。 |
| `event` | 稳定事件名，例如 `summarize_file`。 |
| `payload` | 可选上下文数据。 |
| `variant` | Button 现有 variant：`default`、`outline`、`secondary`、`ghost`、`destructive`。 |

## Semantic DOM {#semantic-dom}

| 部位 | 说明 |
| --- | --- |
| `data-slot="agent-surface"` | Agent UI 渲染根节点。 |
| `data-slot="agent-surface-header"` | surface 标题和说明。 |
| `data-slot="agent-surface-blocks"` | blocks 容器。 |
| `data-slot="agent-surface-text"` | text block。 |
| `data-slot="agent-surface-object-card"` | object-card block。 |
| `data-slot="agent-surface-file-card"` | file-card block。 |
| `data-slot="agent-surface-insight-card"` | insight-card block。 |
| `data-slot="agent-surface-action-row"` | action-row block。 |
| `data-slot="agent-surface-actions"` | action 按钮组。 |
| `data-slot="agent-surface-unsupported"` | 未知 type 的安全兜底。 |

## 状态标记 {#states}

| 状态 | 说明 |
| --- | --- |
| `root` | 正常渲染 surface。 |
| `unsupported type` | Agent 返回不在白名单里的 type，前端只显示安全提示，不执行、不渲染未知代码。 |

## 主题变量 Design Token {#design-token}

| Token | 用途 |
| --- | --- |
| `--foreground` | 主要文字和图标。 |
| `--muted` | 弱化背景和信息块。 |
| `--muted-foreground` | 辅助说明文字。 |
| `--card` | 卡片容器背景。 |
| `--border` | 卡片边框和分隔线。 |
| `--primary` | 主操作按钮和强调点。 |
| `--primary-foreground` | 主操作按钮文字。 |
| `--ring` | focus-visible 焦点环。 |

完整 token 规则见 `docs/TOKENS.md`。

## AI Rules {#ai-rules}

- AgentSurface 是受控生成式 UI，不是静态 HTML 生成器。
- Agent 只能生成 JSON 意图，不能生成 React、HTML、CSS 或 JS 给前端执行。
- `action` 只是事件，不是代码；前端只把 `{ surfaceId, event, payload }` 交给 `onAction`。
- 未知 `type` 必须走安全兜底，不能尝试动态 import、eval 或 innerHTML。
- 新增 block 前，先判断是否能用现有 `object-card`、`file-card`、`text`、`action-row` 表达；同类结构稳定复用后再扩展。
- 高频场景先用通用 block 表达，不按客户、合同、员工等业务名无限拆组件。
- 使用 AgentSurface 前必须以 src/components/fx/agent-surface.tsx 为真实 API。
- 不要手写颜色、圆角、边框和状态样式；优先使用源码已有 prop、状态和 token。
- className 只用于布局、宽度或外部间距，不用于覆盖组件自身基础视觉。

## 正误示例 {#do-dont}

### 生成 UI 意图，不生成代码

不推荐：

```json
{
  "type": "button",
  "label": "删除",
  "onClick": "fetch('/api/delete-all')"
}
```

推荐：

```json
{
  "type": "action-row",
  "actions": [
    {
      "label": "删除",
      "event": "request_delete",
      "payload": {
        "id": "file-001"
      }
    }
  ]
}
```

### 使用白名单 block，不发明任意组件

不推荐：

```json
{
  "type": "custom-dashboard-widget",
  "html": "<script>run()</script>"
}
```

推荐：

```json
{
  "type": "object-card",
  "title": "客户信息",
  "fields": [
    { "label": "客户", "value": "星河科技" }
  ]
}
```
