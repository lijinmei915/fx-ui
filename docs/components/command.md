---
category: Components
group: 导航
title: Command
subtitle: 命令面板
description: ⌘K 命令面板，模糊搜索 + 键盘导航，用于全站快速跳转/执行命令。
source: src/components/ui/command.tsx
theme: theme/fx-theme.css
tokens:
  - muted
  - foreground
  - border-subtle
status: complete
---

# Command 命令面板

⌘K 命令面板：模糊搜索 + 键盘导航，用于全站快速跳转或执行命令。

自建轻量实现（基于项目 `Dialog` + Base UI），**不引 cmdk / Radix**，与项目无头底层一致。

AI 使用 CommandPalette 前必须先以 `src/components/ui/command.tsx` 为真实 API。

## 来源 {#source}

```txt
src/components/ui/command.tsx
```

## 使用方式 {#usage}

```tsx
import { CommandPalette, type CommandItem } from "@/components/ui/command"
```

```tsx
const [open, setOpen] = useState(false)

// ⌘K 打开
useEffect(() => {
  const onKey = (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault(); setOpen((v) => !v)
    }
  }
  window.addEventListener("keydown", onKey)
  return () => window.removeEventListener("keydown", onKey)
}, [])

const items: CommandItem[] = pages.map((p) => ({
  id: p.href, label: p.label, group: p.group,
  onSelect: () => { window.location.hash = p.href },
}))

<CommandPalette open={open} onOpenChange={setOpen} items={items} placeholder="搜索…" />
```

## 组件总览 {#overview}

- 类型：navigation
- 语义 DOM：复用 Dialog（data-slot="dialog-content"）
- 能力：模糊搜索（label / group / keywords）、↑↓ 选择、Enter 触发、Esc 关闭、鼠标悬停高亮、空状态
- 导出项：CommandPalette、CommandItem(type)

## 场景示例 {#examples}

### 推荐场景

- 使用意图：文档站/后台的全局搜索与快速跳转（⌘K），项很多时优先用它而非长列表。
- 规则：受控；items 提供 `id / label / onSelect`，可选 `group / keywords` 提升可搜索性。

```tsx
<CommandPalette open={open} onOpenChange={setOpen} items={items} />
```

### 不适合场景

- 选项很少（一屏可见）时不必用命令面板，普通菜单即可。
- 不通过 `className` 硬覆盖内部布局/配色。

## API {#api}

该组件以源码导出的 props 为准。使用前读取 `src/components/ui/command.tsx`。

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `open` | `boolean` | — | 是否打开（受控） |
| `onOpenChange` | `(open: boolean) => void` | — | 开关回调 |
| `items` | `CommandItem[]` | — | 可搜索项：`{ id, label, group?, keywords?, onSelect }` |
| `placeholder` | `string` | `"搜索…"` | 搜索框占位 |
| `emptyText` | `string` | `"无匹配结果"` | 无结果文案 |

## Semantic DOM {#semantic-dom}

| 部位 | 说明 |
| --- | --- |
| `data-slot="dialog-content"` | 复用 Dialog 弹层容器（命令面板挂载其中） |

## 状态标记 {#states}

| 状态 | 说明 |
| --- | --- |
| `root` | 受控开关；高亮项用 `data-active`，键盘 ↑↓ 移动 |

## 主题变量 Design Token {#design-token}

| Token | 用途 |
| --- | --- |
| `--muted` | 高亮项底色 |
| `--foreground` | 项文字 |
| `--border-subtle` | 搜索框分隔线 |

完整 token 规则见 `docs/TOKENS.md`。

## AI Rules {#ai-rules}

- 受控：自己持有 `open`，在 `onOpenChange` 更新；⌘K 监听由调用方加。
- `items` 的 `onSelect` 负责实际动作（跳转/执行）；`keywords` 提升模糊命中。
- 使用前必须以 src/components/ui/command.tsx 为真实 API；不引 cmdk/Radix。
- className 只用于布局或外部间距。

## 正误示例 {#do-dont}

### 用受控 items，不手搓搜索

不推荐：

```tsx
// 不要在业务层手写一套输入框 + 过滤 + 键盘导航
<input onChange={...} />{list.filter(...)}
```

推荐：

```tsx
<CommandPalette open={open} onOpenChange={setOpen} items={items} />
```
