---
category: Components
group: 数据录入
title: Slider
subtitle: 滑块
description: 在连续或离散区间中选择单值或范围值。
source: src/components/ui/slider.tsx
theme: theme/fx-theme.css
figma: https://www.figma.com/design/k98zObf0bN7OKGVwpCyjBd/Web%E7%AB%AF%E5%9F%BA%E7%A1%80%E7%BB%84%E4%BB%B6%E5%BA%93?node-id=10271-206879
tokens:
  - primary
  - fx-primary-disabled
  - muted
  - background
  - border-subtle
  - ring
status: complete
---

# Slider 滑块

用于在连续或离散区间中选择单个数值或范围值。

源码通过 `npx shadcn@latest add slider` 从 shadcn/ui 拉取并保持 open-code。公司 Figma 作为结构与几何参考，轨道、游标和状态颜色全部消费 `theme/fx-theme.css` 的语义 token。

## 来源 {#source}

```txt
src/components/ui/slider.tsx
```

公司 Figma：[滑块规范节点](https://www.figma.com/design/k98zObf0bN7OKGVwpCyjBd/Web%E7%AB%AF%E5%9F%BA%E7%A1%80%E7%BB%84%E4%BB%B6%E5%BA%93?node-id=10271-206879)。当前基础几何对齐 6px 轨道与 16px 游标；Figma 的橙色、灰色和白色分别映射到项目的 `--primary`、`--muted`、`--background`，不复制参考稿硬编码色值。

## 使用方式 {#usage}

```tsx
import { Field, FieldLabel } from "@/components/ui/field"
import { Slider } from "@/components/ui/slider"
```

```tsx
<Field>
  <FieldLabel id="completion-label">完成度</FieldLabel>
  <Slider aria-labelledby="completion-label" defaultValue={20} />
</Field>
```

范围值由真实 `number[]` API 表达：

```tsx
<Field>
  <FieldLabel id="price-range-label">价格范围</FieldLabel>
  <Slider aria-labelledby="price-range-label" defaultValue={[20, 80]} />
</Field>
```

## 组件总览 {#overview}

- 类型：form control
- 单值 / 范围：`number | number[]`
- 方向：horizontal、vertical
- 原生状态：data-orientation、data-disabled、data-dragging
- 导出项：Slider

## 场景示例 {#examples}

Figma 参考稿包含基础、带刻度、带输入框三种结构。基础 Slider 已落地；刻度和输入框不是 Slider 根属性：刻度按 Slider + 文本刻度组合，输入框按 Slider + Input 组合。仓库形成受治理 recipe 前，不新增 `marks`、`showInput` 等伪 prop，也不在页面临时重写 Slider 内部结构。

## API {#api}

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `value / defaultValue` | `number \| number[]` | - | 单值传 number，范围值传数组。 |
| `onValueChange` | `(value, eventDetails) => void` | - | 值变化时触发。 |
| `onValueCommitted` | `(value, eventDetails) => void` | - | 一次交互提交完成时触发。 |
| `min / max` | `number` | `0 / 100` | 最小值与最大值。 |
| `step / largeStep` | `number` | `1 / 10` | 普通与大步进。 |
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` | 滑动方向。 |
| `disabled` | `boolean` | `false` | 禁用交互。 |
| `name / form` | `string` | - | 原生表单字段。 |
| `minStepsBetweenValues` | `number` | `0` | 范围游标之间的最小步数。 |
| `thumbCollisionBehavior` | `"push" \| "swap" \| "none"` | `"push"` | 范围游标相遇时的行为。 |

## Semantic DOM {#semantic-dom}

| 部位 | 说明 |
| --- | --- |
| `data-slot="slider"` / `role="group"` | 根节点与滑块组语义 |
| `data-slot="slider-track"` | 完整取值轨道 |
| `data-slot="slider-range"` | 已选单值进度或范围 |
| `data-slot="slider-thumb"` | 游标容器，内部由 Base UI 渲染 `input[type="range"]` |

## 状态标记 {#states}

| 状态 | 说明 |
| --- | --- |
| `data-orientation` | horizontal / vertical 方向 |
| `data-disabled` | 禁用态 |
| `data-dragging` | 指针拖动态 |
| `focus-visible` | 键盘焦点环 |

## 主题变量 Design Token {#design-token}

| Token | 用途 |
| --- | --- |
| `--primary` | 已选轨道与游标描边 |
| `--fx-primary-disabled` | 禁用的已选轨道 |
| `--muted` | 未选轨道与禁用游标表面 |
| `--background` | 游标表面 |
| `--border-subtle` | 禁用游标描边 |
| `--ring` | hover / focus-visible / active 反馈 |

## AI Rules {#ai-rules}

- 使用 Slider 前必须以 src/components/ui/slider.tsx 为真实 API。
- 单值和范围只通过 `number | number[]` 表达，不新增重复类型 prop。
- marks 和 input 属于组合结构，不是 Slider 根属性。
- className 只用于宽度、高度等外部布局，不覆盖轨道与游标视觉。

## 正误示例 {#do-dont}

不推荐：

```tsx
<Slider showInput marks range />
```

推荐：

```tsx
<Field>
  <FieldLabel id="budget-range-label">预算范围</FieldLabel>
  <Slider aria-labelledby="budget-range-label" defaultValue={[20, 80]} />
</Field>
```
