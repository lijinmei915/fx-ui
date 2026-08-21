---
category: Components
group: 数据录入
title: Upload
subtitle: 上传
description: 选择或拖拽本地文件，并以受控文件列表呈现上传状态。
source: src/components/ui/upload.tsx
theme: theme/fx-theme.css
tokens:
  - primary
  - info
  - destructive
  - success
  - foreground
  - foreground-disabled
  - muted
  - muted-foreground
  - surface
  - surface-disabled
  - input
  - border-subtle
  - ring
  - overlay
status: complete
---

# Upload 上传

用于图片和附件的本地选择、拖拽接收及文件状态展示。组件只负责选择与列表交互，不发送网络请求；业务上传器通过 `onFilesSelect` 接收原生 `File`，再更新受控 `value` 中的 `status` 与 `percent`。

Figma 的实时属性为上传形式（照片墙、按钮上传、拖拽上传、表单上传）与回填状态；代码分别映射为 `variant` 和是否传入文件列表。默认、悬浮、点击、拖拽中、禁用是原生交互状态，不暴露成视觉状态 prop。

shadcn registry 没有 Upload，因此本组件是 `native-semantic` 白名单例外，以原生 `input[type=file]` 保留浏览器文件选择语义，并复用 Button 与 Progress。

## 来源 {#source}

```txt
src/components/ui/upload.tsx
```

## 使用方式 {#usage}

```tsx
import { Upload, type UploadFileItem } from "@/components/ui/upload"
```

```tsx
const [files, setFiles] = useState<UploadFileItem[]>([])

<Upload
  value={files}
  onValueChange={setFiles}
  onFilesSelect={(selected) => uploadFiles(selected)}
  accept="image/png,image/svg+xml"
  maxSize={100 * 1024}
/>
```

## 组件总览 {#overview}

- 类型：form
- 上传形式：`button`、`dropzone`、`picture-card`、`link`
- 列表：`text`、`picture`
- 图片尺寸：`small`（68）、`mini`（36）、`micro`（28）
- 文件状态：`idle`、`uploading`、`success`、`error`
- 原生交互态：hover、focus-visible、dragging、disabled
- 网络边界：不内置 action、headers、请求重试或分片上传

## API {#api}

| 属性 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `value` | `UploadFileItem[]` | — | 受控文件列表 |
| `defaultValue` | `UploadFileItem[]` | `[]` | 非受控初始文件列表 |
| `onValueChange` | `(files) => void` | — | 选择或删除后返回完整列表 |
| `onFilesSelect` | `(files, items) => void` | — | 返回通过本地限制的原生 File 与列表项 |
| `onReject` | `(rejected) => void` | — | 返回 accept、maxSize、maxCount 拒绝原因 |
| `onRemove` | `(file) => boolean \| void` | — | 删除前回调；返回 false 阻止删除 |
| `accept` | `string` | — | 原生文件类型过滤表达式 |
| `multiple` | `boolean` | `false` | 是否允许多选 |
| `disabled` | `boolean` | `false` | 禁止选择、拖拽与删除 |
| `maxCount` | `number` | — | 最大文件数量 |
| `maxSize` | `number` | — | 单文件最大字节数 |
| `variant` | `button \| dropzone \| picture-card \| link` | `button` | Figma 上传形式映射 |
| `listType` | `text \| picture` | `text` | 文件列表呈现方式 |
| `imageSize` | `small \| mini \| micro` | `small` | 照片墙尺寸 |
| `showFileList` | `boolean` | `true` | 是否展示文件列表 |
| `label` | `string` | 随 variant | 触发区主文案 |
| `helperText` | `string` | — | 文件类型、大小等辅助提示 |
| `browseLabel` | `string` | `"点击上传"` | 拖拽区动作文本 |
| `className` | `string` | — | 仅用于根节点布局与宽度 |

## Semantic DOM {#semantic-dom}

| 部位 | 说明 |
| --- | --- |
| `data-slot="upload"` | 根节点，带 variant、list-type、disabled、dragging 标记 |
| `data-slot="upload-input"` | 原生 file input |
| `data-slot="upload-trigger"` | 按钮或链接触发器 |
| `data-slot="upload-dropzone"` | 可点击、可键盘触发、可接收拖拽文件的区域 |
| `data-slot="upload-picture-trigger"` | 照片墙新增入口 |
| `data-slot="upload-list"` | 文本或图文文件列表 |
| `data-slot="upload-item"` | 单个文件及 status |
| `data-slot="upload-picture-item"` | 照片墙单项及 status |
| `data-slot="upload-helper"` | 辅助说明 |

## 状态标记 {#states}

| 状态 | 说明 |
| --- | --- |
| `hover` | 指针悬浮时使用 token 色板阶梯 |
| `focus-visible` | 键盘焦点显示 ring token |
| `data-dragging="true"` | 文件进入拖拽区时切换主色边框和 muted 背景 |
| `disabled` | 原生 input、触发器、删除操作同时禁用 |
| `data-status` | 文件项的 idle、uploading、success、error 数据状态 |

## 主题变量 Design Token {#design-token}

组件使用 `--primary`、`--info`、`--destructive`、`--success`、`--foreground`、`--foreground-disabled`、`--muted`、`--muted-foreground`、`--surface`、`--surface-disabled`、`--input`、`--border-subtle`、`--ring`、`--overlay`。Figma 中的橙、蓝、红、灰只作为意图参考，不复制硬编码色值。

## AI Rules {#ai-rules}

- 上传请求由业务层处理，组件不接受 action URL，也不私自开始请求。
- `status` 与 `percent` 由业务更新受控文件列表；不要用 className 模拟状态。
- 图片与附件使用同一个 Upload，分别选 `picture-card` / `picture` 或 `text` 列表。
- `className` 只用于布局和宽度，不覆盖颜色、圆角、边框或内部间距。

## 正误示例 {#do-dont}

推荐：

```tsx
<Upload variant="dropzone" value={files} onValueChange={setFiles} onFilesSelect={startUpload} />
```

不推荐：

```tsx
<input type="file" onChange={startUpload} />
```
