---
category: Components
group: 数据录入
title: Signature
subtitle: 签名
description: 用于采集用户手写签名，并输出 PNG data URL。
source: src/components/ui/signature.tsx
theme: theme/fx-theme.css
tokens:
  - foreground
  - surface
  - input
  - ring
  - radius
status: complete
---

# Signature 签名

用于在合同、授权或确认流程中采集手写签名。Figma 当前实例属性只有“填充=off/on”，代码中由组件根据画布是否有笔迹生成 `data-filled`，不暴露成视觉 variant。

shadcn registry 没有签名输入组件，因此本组件是 `native-semantic` 白名单例外。canvas 笔迹平滑使用 `signature_pad`，组件仍保持 open-code，公司视觉只通过现有语义 token 注入。

## 来源 {#source}

```txt
src/components/ui/signature.tsx
```

## 使用方式 {#usage}

```tsx
import { useState } from "react"
import { Signature } from "@/components/ui/signature"
```

```tsx
const [signature, setSignature] = useState<string | null>(null)

<Signature value={signature} onChange={setSignature} />
```

## 组件总览 {#overview}

- 类型：form
- 语义 DOM：`data-slot="signature"`、`signature-canvas`、`signature-clear`
- 原生/数据状态：focus-visible、disabled、data-filled
- 变体：无；Figma 填充属性是运行时状态
- 尺寸：宽度跟随容器，默认画布高 70px，可通过 `height` 调整业务输入面积
- 导出项：Signature、SignatureProps

## 场景示例 {#examples}

### 合同签署

使用受控 `value + onChange` 保存签名 data URL。提交表单时校验 `value`，不要读取 canvas DOM。

### 只读回显

已有签名通过 `value` 回填，并设置 `disabled` 阻止重绘和清空。

## API {#api}

| 属性 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `value` | `string \| null` | — | 受控 PNG data URL；传 `null` 清空 |
| `defaultValue` | `string \| null` | — | 非受控初始签名 |
| `onChange` | `(value: string \| null) => void` | — | 一笔结束或清空时返回完整值 |
| `onBegin` | `() => void` | — | 开始一笔时触发 |
| `onEnd` | `() => void` | — | 完成一笔且 onChange 更新后触发 |
| `disabled` | `boolean` | `false` | 禁止绘制和清空 |
| `clearLabel` | `string` | `"清空"` | 清空按钮的可见文本 |
| `height` | `number` | `70` | 画布 CSS 高度，宽度始终跟随容器 |
| `className` | `string` | — | 仅用于根节点布局与宽度 |

## Semantic DOM {#semantic-dom}

| 部位 | 说明 |
| --- | --- |
| `data-slot="signature"` | 根节点，带 `data-filled` 与 `data-disabled` |
| `data-slot="signature-canvas"` | 实际签名画布，尺寸随容器与 DPR 更新 |
| `data-slot="signature-clear"` | 复用 Button 的清空命令 |

## 状态标记 {#states}

| 状态 | 说明 |
| --- | --- |
| `data-filled="false"` | Figma 的填充 off；画布没有签名 |
| `data-filled="true"` | Figma 的填充 on；画布已有签名 |
| `focus-visible` | 画布获得键盘焦点时显示 token 焦点环 |
| `disabled` | 停止绘制监听并禁用清空按钮 |

## 主题变量 Design Token {#design-token}

| Token | 用途 |
| --- | --- |
| `--foreground` | 签名笔迹 |
| `--surface` | 画布背景 |
| `--input` | 画布边框 |
| `--ring` | focus-visible 焦点环 |
| `--radius` | 画布圆角派生 |

完整 token 规则见 `docs/TOKENS.md`。

## AI Rules {#ai-rules}

- 签名值统一从 `onChange` 获取，不用 ref 读取或修改 canvas。
- `data-filled` 是组件计算状态，不发明 `filled` prop。
- 清空使用内置清空按钮，或在受控模式传 `value={null}`。
- `className` 只用于布局与宽度，不覆盖颜色、圆角、边框和内部间距。

## 正误示例 {#do-dont}

推荐：

```tsx
<Signature value={signature} onChange={setSignature} />
```

不推荐：

```tsx
<canvas onPointerMove={drawSignature} />
```
