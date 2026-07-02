---
category: Maintain
group: 网站规范
title: SectionLead
subtitle: 内容页章节标题
description: 网站规范项，用于维护本站内容页章节标题和说明的复用模式。
source: src/components/fx/section-lead.tsx
theme: theme/fx-theme.css
tokens:
  - foreground
  - muted-foreground
status: complete
---

# SectionLead 内容页章节标题

网站规范项，用于维护本站内容页章节标题和说明的复用模式。

AI 使用 SectionLead 前必须先以 `src/components/fx/section-lead.tsx` 为真实 API；本文档记录的是当前仓库源码能力，不是凭记忆推断的组件能力。

## 来源 {#source}

```txt
src/components/fx/section-lead.tsx
```

## 使用方式 {#usage}

```tsx
import { SectionLead } from "@/components/fx/section-lead"
```

```tsx
<SectionLead
  title="使用方式"
  description="复制 import 即可；具体 JSX 写法使用调试台生成。"
/>
```

## 组件总览 {#overview}

- 类型：fx
- 语义 DOM：root
- 原生/数据状态：root
- 变体：无独立 variant prop
- 导出项：SectionLead

## 取值逻辑 {#value-rules}

- `title`：章节标题，通常对应右侧目录中的页内锚点名称。
- `description`：一句说明，可省略；标题和说明之间固定 4px。
- 说明文字固定使用 14px，用于内容页的二级说明，不承载正文段落。

### 带不带说明

- `场景示例 / 使用方式 / 语义 DOM / 正误示例`：默认带说明。
- `API 属性`：默认不带说明；有额外阅读规则时再补。
- 标题太抽象、只看标题看不出用途时：带说明。
- 标题已经够直白、下方内容一眼能懂时：不带说明。

### 说明怎么写

- 只写一句话。
- 尽量控制在 12-24 个汉字内。
- 直接说“这一节看什么 / 做什么”。
- 不重复标题，不写背景，不写口号。
- 优先用 `展示 / 记录 / 说明 / 复制 / 对比` 这类动词。

### 说明示例

- `场景示例`：`常见用法与适用场景。`
- `使用方式`：`复制 import 和 JSX 调用到业务页面里使用。`
- `语义 DOM`：`记录源码中的语义部位，供 AI 和工程师理解。`
- `正误示例`：`对比高频错误写法与推荐写法。`
- `API 属性`：`按属性 / 子组件查看真实 API。`

## API {#api}

| 属性 | 说明 |
| --- | --- |
| `title: ReactNode` | 章节标题 |
| `description?: ReactNode` | 章节说明，可省略 |

## Semantic DOM {#semantic-dom}

| 部位 | 说明 |
| --- | --- |
| `root` | 章节标题组根节点 |

## 状态标记 {#states}

| 状态 | 说明 |
| --- | --- |
| `root` | 无额外交互状态 |

## 主题变量 Design Token {#design-token}

| Token | 用途 |
| --- | --- |
| `--foreground` | 标题文字 |
| `--muted-foreground` | 说明文字 |

完整 token 规则见 `docs/TOKENS.md`。

## AI Rules {#ai-rules}

- 内容页章节标题和说明优先复用 SectionLead 或 `docsSpacing.sectionHeader / sectionDesc` 同步节奏。
- 不要在页面里临时手写不同的标题说明间距。
- className 只用于外部布局，不用于覆盖组件自身基础视觉。

## 正误示例 {#do-dont}

不推荐：

```tsx
<div className="flex flex-col gap-3">
  <h2>使用方式</h2>
  <p className="text-base">复制 import 即可。</p>
</div>
```

推荐：

```tsx
<SectionLead title="使用方式" description="复制 import 即可。" />
```
