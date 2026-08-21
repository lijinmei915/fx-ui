---
category: Components
group: 业务组合组件
title: IconPicker
subtitle: 图标选择器
description: 检索、键盘选择、随机分配或上传图标。
source: src/components/fx/icon-picker.tsx
theme: theme/fx-theme.css
tokens:
  - foreground
  - popover
  - border
  - muted
  - primary
  - ring
status: complete
---

# IconPicker 图标选择器

IconPicker 是 fx 组合组件，由 Tabs、Input、Button、Tooltip、ScrollArea、Empty、Alert、Spinner 和 Field 组成。图标对象统一从 `@/lib/icons` 传入，组件不维护第二套图标资源。

Figma `23448:21327` 的实时属性只有 `模式`，选项为 `选择 / 选择时检索 / 选择时检索无结果 / 内容加载失败 / 内容加载中 / 上传`。代码不暴露纯视觉 `mode`：它们分别由默认数据、`query`、过滤结果、`error`、`loading` 和上传 Tab 生成。

## 来源 {#source}

```txt
src/components/fx/icon-picker.tsx
```

## 使用方式 {#usage}

```tsx
import { IconPicker } from "@/components/fx/icon-picker"
import { HomeIcon, UserIcon } from "@/lib/icons"

const icons = [
  { id: "home", label: "首页", icon: HomeIcon, keywords: ["导航"] },
  { id: "user", label: "用户", icon: UserIcon, keywords: ["账号"] },
]

<IconPicker icons={icons} value={iconId} onValueChange={setIconId} />
```

## 组件总览 {#overview}

- 类型：fx 业务组合组件
- Figma 尺寸参考：500×400px；代码宽度响应容器，最大 500px，高度 400px
- 图标网格：32px 热区、4px 间距；项目 `Button size="icon-md"` 负责稳定尺寸
- 图标：项目 Tabler 出口，组件内部不手写 SVG
- 选择：鼠标、方向键、Enter 和随机分配
- 状态：select、search、search-empty、loading、error、upload、disabled

## API {#api}

| 属性 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `icons` | `IconPickerOption[]` | — | 图标 ID、名称、组件和关键词 |
| `value / defaultValue` | `string` | — | 受控或非受控图标 ID |
| `onValueChange` | `(id, option) => void` | — | 返回图标 ID 与完整对象 |
| `query / defaultQuery` | `string` | `""` | 受控或非受控搜索词 |
| `onQueryChange` | `(query) => void` | — | 搜索词变化回调 |
| `allowUpload` | `boolean` | `false` | 显示图标库/上传 Tabs |
| `defaultTab` | `library \| upload` | `library` | 非受控初始页签 |
| `accept` | `string` | 图片类型 | 上传文件类型 |
| `onUpload` | `(file) => void` | — | 交给业务侧保存上传文件 |
| `loading` | `boolean` | `false` | 内容加载中 |
| `error / onRetry` | `string / () => void` | — | 加载失败与刷新 |
| `disabled` | `boolean` | `false` | 禁止修改 |
| `className` | `string` | — | 仅用于宽度和外部布局 |

## Semantic DOM {#semantic-dom}

| 部位 | 说明 |
| --- | --- |
| `data-slot="icon-picker"` | 根节点；`data-mode` 为 select、search、search-empty、loading、error 或 upload |
| `data-slot="icon-picker-grid"` | `role="grid"` 图标网格 |
| `data-slot="icon-picker-loading"` | Spinner 加载态 |
| `data-slot="icon-picker-error"` | Alert 加载失败态 |
| `data-slot="icon-picker-empty"` | Empty 搜索无结果态 |

## 状态标记 {#states}

- `select`：默认图标列表。
- `search`：`query` 非空且有结果。
- `search-empty`：过滤结果为空。
- `loading`：`loading=true`。
- `error`：传入 `error`。
- `upload`：上传 Tab 激活。
- `disabled`：搜索、选择、随机和上传全部禁用。

## 主题变量 Design Token {#design-token}

使用 `--foreground`、`--popover`、`--popover-foreground`、`--border`、`--muted`、`--muted-foreground`、`--primary`、`--destructive` 与 `--ring`。不复制 Figma 十六进制值。

## AI Rules {#ai-rules}

- 只从 `@/lib/icons` 传图标对象，不手写 SVG，不引第二个图标库。
- 状态由数据和行为生成，不新增 Figma 截图专用 `mode`。
- `className` 只用于根节点宽度和外部布局。
- 上传成功后的持久化、重命名和图标 ID 生成属于业务层。

## 正误示例 {#do-dont}

推荐：

```tsx
<IconPicker icons={icons} value={iconId} onValueChange={setIconId} />
```

不推荐：

```tsx
<IconPicker mode="搜索无结果" icons={icons} />
```
