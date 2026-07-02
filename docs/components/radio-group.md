---
category: Components
group: 数据录入
title: RadioGroup
subtitle: 单选组
description: 用于一组选项中只能选择一个的场景。
source: src/components/ui/radio-group.tsx
theme: theme/fx-theme.css
tokens:
  - primary
  - primary-foreground
  - destructive
  - border
  - input
  - ring
status: complete
---

# RadioGroup 单选组

用于一组选项中只能选择一个的场景，例如表单单选、设置项、表格单选列。

源码来自 shadcn/ui，进入项目后保持 open-code。公司视觉通过 `theme/fx-theme.css` 的语义 token 注入，不通过重新封装、硬编码颜色或手写状态样式实现。

AI 使用 RadioGroup 前必须先以 `src/components/ui/radio-group.tsx` 为真实 API；本文档记录的是当前仓库源码能力，不是凭记忆推断的组件能力。

## 来源 {#source}

```txt
src/components/ui/radio-group.tsx
```

## 使用方式 {#usage}

```tsx
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
```

```tsx
<RadioGroup value={value} onValueChange={setValue}>
  <div className="flex items-center gap-2">
    <RadioGroupItem id="crm" value="crm" />
    <Label htmlFor="crm">CRM</Label>
  </div>
  <div className="flex items-center gap-2">
    <RadioGroupItem id="bi" value="bi" />
    <Label htmlFor="bi">BI</Label>
  </div>
</RadioGroup>
```

## 组件总览 {#overview}

- 类型：form
- 语义 DOM：data-slot="radio-group"、data-slot="radio-group-item"、data-slot="radio-group-indicator"
- 原生/数据状态：focus-visible、disabled、aria-invalid、data-checked
- 变体：无独立 variant prop
- 导出项：RadioGroup、RadioGroupItem

## 场景示例 {#examples}

### 推荐场景

- 使用意图：用于一组选项里只能选一个的控件。
- 规则：表格单选列也使用 RadioGroupItem，不在业务处手写原生 radio 外观。

```tsx
<RadioGroup value={selectedId} onValueChange={setSelectedId}>
  <RadioGroupItem value={String(customer.id)} aria-label={`选择 ${customer.name}`} />
</RadioGroup>
```

### 不适合场景

- 不用 RadioGroup 表达多选，多个可独立勾选的选项应使用 Checkbox。
- 不通过 `className` 硬覆盖组件内部颜色、圆角、边框、阴影和状态样式。
- 不发明源码里没有的 prop、variant、size 或状态。

## API {#api}

该组件以源码导出的子组件和原生 props 为准。使用前读取 `src/components/ui/radio-group.tsx`，不要凭空发明 API。

## Semantic DOM {#semantic-dom}

| 部位 | 说明 |
| --- | --- |
| `data-slot="radio-group"` | 单选组根节点，承载分组布局和选择状态管理 |
| `data-slot="radio-group-item"` | 单个单选项根节点，承载交互态和选中态 |
| `data-slot="radio-group-indicator"` | 选中态指示圆点 |

## 状态标记 {#states}

| 状态 | 说明 |
| --- | --- |
| `focus-visible` | 键盘焦点态，必须保留可访问焦点环 |
| `disabled` | 禁用态，阻止交互并降低视觉权重 |
| `aria-invalid` | 校验失败语义，同时驱动错误态样式 |
| `data-checked` | 选中态 |

## 主题变量 Design Token {#design-token}

| Token | 用途 |
| --- | --- |
| `--primary` | 品牌强调色、选中态或主语义强调 |
| `--primary-foreground` | 主色背景上的文字和图标 |
| `--destructive` | 危险、错误或不可逆操作语义 |
| `--border` | 边框、分隔线和描边结构 |
| `--input` | 表单控件边框、背景和 disabled 语义 |
| `--ring` | focus-visible 焦点环 |

完整 token 规则见 `docs/TOKENS.md`。

## AI Rules {#ai-rules}

- 表单单选或表格单选列使用 `RadioGroup / RadioGroupItem`。
- 每个 `RadioGroupItem` 必须提供唯一 `value`，并用 `Label` 或 `aria-label` 说明含义。
- 禁用态使用源码支持的 `disabled`，不要靠 opacity 伪装。
- 使用 RadioGroup 前必须以 src/components/ui/radio-group.tsx 为真实 API。
- 不要手写颜色、圆角、边框和状态样式；优先使用源码已有 prop、状态和 token。
- className 只用于布局、宽度或外部间距，不用于覆盖组件自身基础视觉。

## 正误示例 {#do-dont}

| Do | Don't |
| --- | --- |
| 表格单选列使用 `RadioGroupItem`。 | 在业务代码里手写 `input[type=radio]` 并覆盖样式。 |
| 使用 `Label` 或 `aria-label` 说明选项含义。 | 只展示无语义的圆点。 |
