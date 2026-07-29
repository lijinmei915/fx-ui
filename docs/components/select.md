---
category: Components
group: 通用
title: Select
subtitle: 选择器
description: 用于从一组选项中选择一个值。
source: src/components/ui/select.tsx
theme: theme/fx-theme.css
tokens:
  - foreground
  - popover
  - popover-foreground
  - muted
  - muted-foreground
  - accent
  - accent-foreground
  - destructive
  - border
  - input
  - ring
  - radius
status: complete
---

# Select 选择器

用于从一组选项中选择一个或多个值。

源码来自 shadcn/ui，进入项目后保持 open-code。公司视觉通过 `theme/fx-theme.css` 的语义 token 注入，不通过重新封装、硬编码颜色或手写状态样式实现。

AI 使用 Select 前必须先以 `src/components/ui/select.tsx` 为真实 API；本文档记录的是当前仓库源码能力，不是凭记忆推断的组件能力。

## 来源 {#source}

```txt
src/components/ui/select.tsx
```

## 使用方式 {#usage}

```tsx
import { Select, SelectClear, SelectContent, SelectControl, SelectGroup, SelectItem, SelectItemIndicator, SelectLabel, SelectMultiValue, SelectScrollDownButton, SelectScrollUpButton, SelectSeparator, SelectTrigger, SelectValue } from "@/components/ui/select"
```

```tsx
<Select>
  <SelectTrigger>
    <SelectValue placeholder="请选择状态" />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      <SelectLabel>状态</SelectLabel>
      <SelectItem value="paid">已支付</SelectItem>
    </SelectGroup>
  </SelectContent>
</Select>
```

## 组件总览 {#overview}

- 类型：form
- 语义 DOM：data-slot="select-group"、data-slot="select-control"、data-slot="select-value"、data-slot="select-trigger"、data-slot="select-content"、data-slot="select-label"、data-slot="select-multi-value"、data-overflow、data-slot="select-multi-value-remove"、data-slot="select-overflow-count"、data-slot="select-item"、data-slot="select-item-indicator"、data-slot="select-clear"、data-slot="select-separator"、data-slot="select-scroll-up-button"、data-slot="select-scroll-down-button"
- 原生/数据状态：hover、focus-visible、disabled、aria-invalid、data-popup-open、data-open、data-closed、data-highlighted、data-selected
- 变体：`outline`（有边框，默认）、`borderless`（无边框）
- 尺寸：`xs`=24px、`sm`=28px（默认）、`md`=32px
- 选择数量：单选默认；多选使用 `multiple`，value / defaultValue 为数组
- 导出项：Select、SelectClear、SelectContent、SelectControl、SelectGroup、SelectItem、SelectItemIndicator、SelectLabel、SelectMultiValue、SelectScrollDownButton、SelectScrollUpButton、SelectSeparator、SelectTrigger、SelectValue

## 能力边界 {#boundary}

主流组件库通常把搜索、清除、多选、空结果和加载态放进 Select 能力范围；fx-ui 也覆盖这些常用边界，但不把远程搜索、人员选择、客户选择、自由标签输入塞进基础 Select。

- **基础 Select**：单选 / 多选、普通 / 分组 / 禁用项 / 描述项、placeholder / selected、hover / focus / open / invalid / disabled、空结果和加载反馈。
- **受控组合**：清除选择用受控 `value` + `SelectClear` 表达，不新增 `allowClear` prop，也不在 `SelectTrigger` 内嵌套 button。
- **多选展示**：`Select multiple` 使用数组值，默认沿用有边框外观；已选值和折叠计数都在 `SelectValue` 内使用 `Tag variant="soft"` 的外观，但作为控件值统一使用 `font-normal`，不继承真实 Tag 的语义字重。标签高度、字号、内边距和删除热区会从 `SelectTrigger data-size` 自动跟随 `xs / sm / md`，无需重复传 size。`overflow="collapse"`（默认）优先展示容器能容纳的全部标签，空间不足时才从末项折叠为 `+n`；需要业务数量上限时再显式传 `maxVisible`。`overflow="scroll"` 保持单行并横向滚动全部标签。多选值区的首项内边距与标签间距统一使用 `--fx-control-gap-tight`（4px）。多选项用 `SelectItemIndicator` 展示 Checkbox 反馈，但选择状态仍由 Select 统一管理。
- **清除热区**：`SelectClear` 与触发器同级放在 `SelectControl` 中；有值时按钮在悬停或键盘聚焦控件后显示，位于下拉箭头左侧。`SelectTrigger clearable` 始终预留稳定的 suffix 空间。标签内 X 只删除单项，总清除 X 清空全部选择。
- **其他输入**：基础 Select 不支持自由输入；如果业务需要“其他”，使用受控 `value` + `SelectItem value="other"` + `SelectContent` 内的 `Input` 组合。必填校验落在输入框 `aria-invalid` 和字段错误文案上，不新增 `allowOther` / `otherRequired` prop。
- **下拉面板**：对齐 Figma Select 浮层，使用 `bg-popover`、`rounded-md`、下拉层级 `shadow-l1` 和四周 4px 内边距；不添加边框或装饰性三角。默认 `alignItemWithTrigger=false`，从触发器下方展开。选项最小高度 32px、水平内边距 8px、常规字重；hover/focus 使用 `bg-background`，选中项只使用 `text-primary` 强调。
- **字号联动**：`SelectContent size` 与 `SelectTrigger size` 使用同一档，确保选择框文字和下拉选项文字等大；两者默认均为 `sm`。
- **展开反馈**：Select Trigger 原生 `data-popup-open` 驱动触发器使用 `border-primary`，尾部箭头旋转向上；关闭后恢复默认输入边框，不新增业务状态 prop。
- **本地搜索**：数据已在前端时，搜索输入作为 `SelectContent` 内组合；搜索后的空结果用明确文案。
- **fx 组合组件**：远程搜索、人员选择、客户选择、建议下拉、历史记录、自由 tags 输入，应沉淀为 Combobox / SearchSelect / UserPicker / TagInput 等组合组件。

## 场景示例 {#examples}

### 基础选择

- 使用意图：用于从一组选项中选择一个值。
- 规则：优先使用源码已有子组件、props、状态和 token，不复制内部 JSX 到业务页面里重写。

```tsx
<Select>
  <SelectTrigger>
    <SelectValue placeholder="请选择状态" />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      <SelectLabel>状态</SelectLabel>
      <SelectItem value="paid">已支付</SelectItem>
    </SelectGroup>
  </SelectContent>
</Select>
```

### 筛选选择

```tsx
<Select>
  <SelectTrigger size="xs">
    <SelectValue placeholder="筛选状态" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="active">进行中</SelectItem>
    <SelectItem value="done">已完成</SelectItem>
  </SelectContent>
</Select>
```

### 不适合场景

- 不用 Select 承载它职责之外的语义。
- 不通过 `className` 硬覆盖组件内部颜色、圆角、边框、阴影和状态样式。
- 不发明源码里没有的 prop、variant、size 或状态。

## API {#api}

该组件以源码导出的子组件和原生 props 为准。使用前读取 `src/components/ui/select.tsx`，不要凭空发明 API。

| 属性 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `items` | `Select item data[]` | - | 可选的数据集合，用于让 SelectValue 根据 value 解析显示内容 |
| `value / defaultValue` | `string \| string[] \| null` | - | 受控 / 非受控的当前选中值；多选时为数组 |
| `onValueChange` | `(value: string \| string[] \| null) => void` | - | 选中值变化时的回调；返回类型随单选 / 多选模式变化 |
| `multiple` | `boolean` | `false` | 开启多选，value / defaultValue 使用数组 |
| `disabled` | `boolean` | `false` | 禁用整个选择器 |
| `variant`（SelectTrigger） | `"outline" \| "borderless"` | `"outline"` | 触发器样式：有边框 / 无边框 |
| `size`（SelectTrigger） | `"xs" \| "sm" \| "md"` | `"sm"` | 触发器尺寸：24 / 28 / 32 |
| `size`（SelectContent） | `"xs" \| "sm" \| "md"` | `"sm"` | 下拉选项字号尺寸，应与 SelectTrigger 传相同值 |
| `clearable`（SelectTrigger） | `boolean` | `false` | 为悬停或聚焦时显示的总清除动作预留箭头左侧 suffix 空间；需配合 `SelectClear` 同级使用 |
| `value`（SelectItem） | `string` | - | 选项取值，需要在选项集合内唯一 |
| `disabled`（SelectItem） | `boolean` | `false` | 禁用单个选项 |
| 其他输入组合 | 受控 `value` + `Input` | - | 选择 `value="other"` 后渲染输入框；必填/选填由业务校验控制 |
| `side / align / alignItemWithTrigger`（SelectContent） | `SelectContent props` | `bottom / center / false` | 控制浮层位置、对齐和是否将已选项对齐触发器；默认从触发器下方展开 |
| `SelectClear` | `button` | `type="button"` | 清除当前选择的 suffix 动作，作为 `SelectTrigger` 的同级绝对定位按钮 |
| `SelectControl` | `div` | - | 触发器与清除动作的定位容器 |
| `SelectSeparator` | 子组件 | - | 分隔不同 SelectGroup，不用普通边框元素代替 |
| `SelectScrollUpButton / SelectScrollDownButton` | 子组件 | 内置 | 长列表滚动时由 SelectContent 内部提供边缘滚动反馈 |
| `SelectMultiValue` | `{ items, maxVisible?, overflow?, onRemove?, getRemoveLabel? }` | `maxVisible=items.length, overflow="collapse"` | 多选已选值展示；标签自动跟随所在 SelectTrigger 的 `data-size`，`collapse` 默认按容器宽度折叠为 `+n`，显式 maxVisible 可增加数量上限，`scroll` 保持单行横向滚动全部标签 |
| `SelectItemIndicator` | `SelectPrimitive.ItemIndicator.Props` | — | 多选项的 Checkbox 选中反馈；不建立独立选择状态 |

## Semantic DOM {#semantic-dom}

| 部位 | 说明 |
| --- | --- |
| `data-slot="select-group"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="select-control"` | 触发器与清除动作的组合热区 |
| `data-slot="select-value"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="select-trigger"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="select-content"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="select-label"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="select-multi-value"` | 多选已选值容器；`data-overflow="collapse"` 承载折叠计数，`data-overflow="scroll"` 支持横向滚动 |
| `data-slot="select-multi-value-remove"` | 删除单个已选标签的动作按钮 |
| `data-slot="select-overflow-count"` | 多选超出 `maxVisible` 后显示的 `+n` 标签 |
| `data-slot="select-item"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="select-item-indicator"` | 多选项内由 Select 选中状态驱动的 Checkbox 反馈 |
| `data-slot="select-clear"` | 清除选择的 suffix 动作按钮 |
| `data-slot="select-separator"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="select-scroll-up-button"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="select-scroll-down-button"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-selected` | 选项选中态 |
| `data-highlighted` | 键盘或鼠标导航高亮态 |

## 状态标记 {#states}

| 状态 | 说明 |
| --- | --- |
| `hover` | 鼠标悬停反馈，来自源码状态样式 |
| `focus-visible` | 键盘焦点态，以 1px 边框变化反馈，不加外扩 focus ring |
| `disabled` | 禁用态，阻止交互并使用禁用语义色 |
| `aria-invalid` | 校验失败语义，以 1px 错误边框反馈 |
| `data-popup-open` | Trigger / Icon 感知 Select 浮层已打开，用于主题色边框和箭头反馈 |
| `data-open` | Popup 打开态，用于浮层进入动效 |
| `data-closed` | Popup 关闭态，用于浮层退出动效 |
| `data-selected` | 选项已被选中 |
| `data-highlighted` | 选项被导航高亮 |

## 主题变量 Design Token {#design-token}

| Token | 用途 |
| --- | --- |
| `--foreground` | 主要文字和图标 |
| `--background` | 无填充选项的 hover / 键盘高亮背景 |
| `--popover` | 浮层背景 |
| `--popover-foreground` | 浮层文字和图标 |
| `--muted` | 弱化背景或低强调区域 |
| `--muted-foreground` | 辅助说明、placeholder 或弱化文字 |
| `--destructive` | 危险、错误或不可逆操作语义 |
| `--border` | 边框、分隔线和描边结构 |
| `--input` | 表单控件边框、背景和 disabled 语义 |
| `--ring` | focus-visible 焦点环 |
| `--radius` | 圆角派生尺度 |

完整 token 规则见 `docs/TOKENS.md`。

## AI Rules {#ai-rules}

- 真实表单字段优先放进 `FieldGroup + Field`，不要用普通 div 临时拼字段。
- 校验失败用字段级 `data-invalid` 和控件级 `aria-invalid`，不要手写红色边框。
- 禁用态使用源码支持的 `disabled` / `data-disabled`，不要靠 opacity 伪装。
- `SelectItem` 放在 `SelectContent` 内，选项多时用 `SelectGroup + SelectLabel`。
- 禁用单项用 `SelectItem disabled`，不要用普通文本或自定义 opacity 假装。
- 多选用 `Select multiple` 和数组值；已选值用 `SelectValue` children 渲染 `SelectMultiValue`；自由标签输入另做 TagInput。
- 清除动作放在 `SelectControl` 内，与 `SelectTrigger` 同级；不要把按钮嵌套进 trigger。
- 本地搜索可以作为 `SelectContent` 内组合；远程搜索、人员选择、客户选择必须沉淀为 fx 组合组件。
- 清除选择用受控 `value` + `SelectTrigger clearable` + `SelectClear`，不要发明 `allowClear`、`showSearch`、`remoteSearch` 等源码没有的 prop。
- 其他输入用受控 `value` + `SelectItem value="other"` + `Input` 组合；不要发明 `allowOther`、`otherRequired` 这类源码没有的 prop。
- 无边框场景用 `SelectTrigger variant="borderless"`，hover/open 仅显示浅底色，键盘焦点使用焦点环；报错态仍显示错误边框。不要在调用处用 className 覆盖 border / bg。
- 空结果和加载态必须有明确反馈，不要展示空白下拉层。
- 未选择态用 `SelectValue` 的 placeholder，不写空字符串选项。
- 尺寸只用 `SelectTrigger size`：`xs` 24px、`sm` 28px（默认）、`md` 32px。
- 校验失败时在 `SelectTrigger` 上设置 `aria-invalid`，错误文案放字段组件。
- 使用 Select 前必须以 src/components/ui/select.tsx 为真实 API。
- 不要手写颜色、圆角、边框和状态样式；优先使用源码已有 prop、状态和 token。
- className 只用于布局、宽度或外部间距，不用于覆盖组件自身基础视觉。

## 正误示例 {#do-dont}

### 使用现有组件能力

不推荐：

```tsx
// 不要手写一个看起来像 Select 的 div，也不要硬编码 token 颜色。
<div className="custom-select">...</div>
```

推荐：

```tsx
<Select>
  <SelectTrigger>
    <SelectValue placeholder="请选择状态" />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      <SelectLabel>状态</SelectLabel>
      <SelectItem value="paid">已支付</SelectItem>
    </SelectGroup>
  </SelectContent>
</Select>
```

### 多选筛选使用 multiple

不推荐：

```tsx
// 不要把自由标签输入当作 Select 多选。
<TagInput placeholder="选择状态" />
```

推荐：

```tsx
const [value, setValue] = useState<string[]>(["active", "done"])

<Select multiple value={value} onValueChange={setValue}>
  <SelectTrigger size="xs" render={<div />} nativeButton={false}>
    <SelectValue placeholder="筛选状态">
      {(value: string[]) =>
        value?.length ? (
          <SelectMultiValue
            items={value.map((item) => ({ value: item, label: item === "active" ? "进行中" : "已完成" }))}
            onRemove={(item) => setValue(value.filter((current) => current !== item))}
          />
        ) : "筛选状态"
      }
    </SelectValue>
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="active"><SelectItemIndicator />进行中</SelectItem>
    <SelectItem value="done"><SelectItemIndicator />已完成</SelectItem>
  </SelectContent>
</Select>
```

### 搜索和清除不发明 prop

不推荐：

```tsx
<Select showSearch allowClear remoteSearch />
```

推荐：

```tsx
const [value, setValue] = useState<string | null>("admin")

<Select value={value} onValueChange={setValue}>
  <div className="relative w-[200px]">
    <SelectTrigger clearable className="w-full">
      <SelectValue placeholder="请选择角色" />
    </SelectTrigger>
    <SelectClear aria-label="清除选择" onClick={() => setValue(null)} />
  </div>
  <SelectContent>
    <Input size="xs" placeholder="搜索选项" />
    <SelectItem value="admin">管理员</SelectItem>
    <SelectItem value="member">成员</SelectItem>
  </SelectContent>
</Select>
```

### 其他输入用受控组合

不推荐：

```tsx
<Select allowOther otherRequired />
```

推荐：

```tsx
const [value, setValue] = useState<string | null>("other")
const [otherValue, setOtherValue] = useState("")
const otherInvalid = value === "other" && !otherValue.trim()

<Select value={value} onValueChange={setValue}>
  <SelectTrigger aria-invalid={otherInvalid || undefined}>
    <SelectValue placeholder="请选择城市">
      {(current) =>
        current === "other" && otherValue ? otherValue :
        current === "other" ? "其他" :
        current === "beijing" ? "北京市" :
        current === "tianjin" ? "天津市" :
        undefined}
    </SelectValue>
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="beijing">北京市</SelectItem>
    <SelectItem value="tianjin">天津市</SelectItem>
    <SelectItem value="other">其他</SelectItem>
    {value === "other" ? (
      <Input
        value={otherValue}
        onChange={(event) => setOtherValue(event.target.value)}
        placeholder="请输入（必填）"
        aria-invalid={otherInvalid || undefined}
      />
    ) : null}
  </SelectContent>
</Select>
```
