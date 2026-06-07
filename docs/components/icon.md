---
category: Components
group: 通用
title: Icon
subtitle: 图标
description: fx-ui 统一使用 lucide-react 作为图标库。
source: package.json
config: components.json
library: lucide-react
iconLibrary: lucide
status: draft
---

# Icon 图标

fx-ui 当前统一使用 `lucide-react` 作为图标库。项目配置中的 `components.json` 已声明：

```json
{
  "iconLibrary": "lucide"
}
```

依赖包来自 `package.json`：

```json
{
  "lucide-react": "^1.17.0"
}
```

图标不是公司封装组件，不进入 `src/components/ui/`。它作为基础视觉语言，被 shadcn 组件、页面 blocks 和业务组合组件直接消费。

## 图标库 {#icon-library}

| 项目 | 当前值 |
| --- | --- |
| shadcn iconLibrary | `lucide` |
| React 包 | `lucide-react` |
| 导入方式 | 按需命名导入 |
| 颜色策略 | 默认 `currentColor`，跟随父级文字色 |

## 安装状态 {#icon-install}

当前项目已经安装 `lucide-react`。如果在新项目中补装，使用：

```bash
npm install lucide-react
```

或按项目包管理器切换为：

```bash
pnpm add lucide-react
yarn add lucide-react
```

## 代码演示 {#icon-examples}

### 普通图标

```tsx
import { SearchIcon } from "lucide-react"

export function SearchHint() {
  return <SearchIcon className="size-4 text-muted-foreground" />
}
```

### 按钮内图标

```tsx
import { SearchIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

export function SearchButton() {
  return (
    <Button variant="outline">
      <SearchIcon data-icon="inline-start" />
      搜索
    </Button>
  )
}
```

### 纯图标按钮

```tsx
import { SettingsIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

export function SettingsButton() {
  return (
    <Button size="icon" variant="outline" aria-label="打开设置">
      <SettingsIcon data-icon="inline-start" />
    </Button>
  )
}
```

## 使用规则 {#icon-rules}

| 场景 | 规则 |
| --- | --- |
| 普通说明图标 | 可以使用 `size-*` 与 `text-*` 语义色控制展示 |
| Button 内图标 | 使用 `data-icon="inline-start"` 或 `data-icon="inline-end"`，不要手写尺寸 |
| 纯图标按钮 | 必须提供 `aria-label` |
| 状态图标 | 颜色跟随语义 token，不写硬编码十六进制颜色 |
| 业务图标 | 优先选择通用语义图标，不为单个页面临时换一套风格 |

## AI Rules {#icon-ai-rules}

- 统一从 `lucide-react` 按需导入图标。
- 不要混用其他图标库，除非用户明确批准并同步更新 `components.json`。
- 图标颜色使用 `currentColor`，通过父级 `text-*` 语义色控制。
- 图标放在 Button 内时必须使用 `data-icon`。
- 纯图标按钮必须提供 `aria-label`。
- 不要为了单个页面临时手写 SVG 图标。

