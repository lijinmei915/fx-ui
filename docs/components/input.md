---
category: Components
group: 通用
title: Input
subtitle: 输入框
description: 单行文本录入控件，用于表单字段、搜索、内联编辑等场景。
source: src/components/ui/input.tsx
theme: theme/fx-theme.css
tokens:
  - input
  - background
  - foreground
  - border
  - primary
  - ring
  - destructive
  - muted-foreground
  - radius
status: complete
---

# Input 输入框

Input 用于单行文本录入，适合表单字段、搜索、内联编辑等场景。

源码来自 shadcn/ui，进入项目后保持 open-code。公司视觉通过 `theme/fx-theme.css` 的语义 token 注入，不通过重新封装或硬编码样式实现。

AI 生成页面时应优先使用原生 input props、`disabled` 和 `aria-invalid` 表达状态，避免手写边框色、圆角或禁用样式。前后缀、单位、搜索按钮和范围选择等固定组合使用 `InputGroup`、`InputAddon`、`InputAffix`、`InputAction`，不要在调用处绝对定位图标或覆盖内边距。范围下拉 + 全局搜索使用已有 fx `TopBarSearch`，不把它伪装成 Input prop。进入真实表单时，Input 不单独承担字段结构，字段结构由 `FieldGroup`、`Field`、`FieldLabel`、`FieldDescription` 和 `FieldError` 承载。

## 来源 {#source}

Input 源码位于：

```txt
src/components/ui/input.tsx
```

上游来源：

```txt
shadcn/ui input
```

## 使用方式 {#usage}

标准表单字段使用 Field 体系组织，并通过 `id` / `htmlFor` 建立可访问性关联。

```tsx
import {
  Input,
  InputAction,
  InputAddon,
  InputAffix,
  InputGroup,
} from "@/components/ui/input"
import { SearchIcon } from "@/lib/icons"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
```

```tsx
<FieldGroup>
  <Field>
    <FieldLabel htmlFor="name">姓名</FieldLabel>
    <Input id="name" placeholder="请输入姓名" />
    <FieldDescription>请填写真实姓名。</FieldDescription>
  </Field>
</FieldGroup>
```

## 调试台规则 {#playground}

AI 选择 Input 时按这个顺序判断：

1. 先判断是不是“真实表单字段”。如果是，用 `FieldGroup + Field + FieldLabel + Input`。
2. 再判断是否需要前后缀、搜索图标、范围选择或单位。需要就用 `InputGroup` 组合，不手写定位。
3. 再判断是否需要辅助文案或错误文案。说明用 `FieldDescription`，错误用 `FieldError`。
4. 再判断状态。禁用是 `data-disabled + disabled`，校验失败是 `data-invalid + aria-invalid`。
5. 最后才考虑布局宽度。`className` 可以放宽度和外部间距，不覆盖 Input 自身颜色、圆角、边框、内边距。

Input 默认显示普通调用调试台，提供能直接落到真实调用的占位文字、输入类型、前置/后置内容、尺寸、`disabled` 和 `aria-invalid`。前后内容是 `InputGroup + InputAffix/InputAddon/InputAction` 的受控组合，不是 `prefix`、`suffix` 等伪 prop；搜索输入用原生 `type="search"` 表达语义，默认组合前置 `SearchIcon`，也可改为后置但两者互斥；有关键词时在悬停或聚焦控件后显示后置 `XIcon` 清除动作，不作为独立配置，按需可追加 `variant="primary"` 的主搜索按钮。为避免重复的清除入口，基础 Input 隐藏浏览器 `type="search"` 的 WebKit 原生清除按钮。输入类型会收窄可选结构：数字保留货币/单位等符号和标签；邮箱默认使用前置 `MailIcon`，调试台会在失焦后把原生格式结果映射为 `aria-invalid` 错误样式，并以内联 `FieldError` 显示“请输入有效的邮箱地址。”，不显示浏览器浮层；密码默认使用后置 `InputAction`，通过 `EyeIcon` / `EyeOffIcon` 切换显示状态并同步可访问名称。邮箱和密码均不展示搜索组合，切换类型时会清除不兼容的前后内容。范围选择、全局检索、远程建议和结果面板属于 `TopBarSearch`、`SearchToolbar` 或 `Command`，不作为基础 Input 的 prop。日期选择属于 `Calendar + Popover` 的独立组件组合，不作为 Input 的图标前缀。hover/focus、字段包装和 Token 仍只在“编辑组件”里。点击工具栏“编辑组件”后进入制作台，并按“先拼结构，再编辑节点，最后验证 Token 与行为”的顺序拆分。制作台使用临时草稿，结构、状态、文案和 Token 调整只在编辑期间生效；完成编辑后恢复进入编辑前的普通实时属性：

1. **结构插槽**：前置与后置独立选择无、搜索图标、符号、标签或动作；搜索只有前置搜索图标、默认的有值清除和可选主搜索，邮箱只有前置邮箱图标，密码只有后置显隐动作，结构树只展示真实存在的节点。
2. **节点属性**：选中 Input、InputAffix、InputAddon、InputAction 后，只编辑源码真实 props 与内容。
3. **字段包装**：真实表单选择 Field 包装；工具栏或独立输入不额外包装。
4. **交互状态与尺寸**：默认、悬停、聚焦、禁用、报错；超小24、默认28、中32。
5. **语义 Token**：只允许选择控件表面、输入边框和占位文字三个已声明槽位，不开放原始色值或任意 className。
6. **状态语义**：展示正常、悬停、聚焦、禁用、错误状态实际映射到的语义 Token 与色板名称；点击一行切换真实预览。

制作台在界面上使用“默认表面 / 弱化表面 / 默认输入边框 / 辅助文字”等用途语义；底层仍保存 `surface`、`muted`、`input`、`muted-foreground` 等真实 Token。真实 Token 通过选项悬停提示和代码草稿追溯，不维护第二套视觉值。

状态语义层不新增 Input prop。当前真实映射为：正常/禁用边框使用 `input → neutrals-07`，悬停/聚焦边框使用 `primary → brand-09`，禁用表面使用 `muted → neutrals-03`，错误边框使用 `destructive → red-09`。色板名称从 `docs/data/design-tokens.json` 的语义映射自动派生，不在状态配置里手填；界面不再展示 `oklch(...)` / `rgb(...)` 原始值。

### 实时属性拼接原则

制作台和 AI 的实时属性只暴露组件**结构零件**及其位置，例如 `InputAffix`、`InputAddon`、`InputAction` 和 `side`；不能额外暴露可由这些零件推导出的业务语义。搜索语义由原生 `type="search"` 表达，搜索图标与按钮由结构插槽自然拼出；通用图标不能固定等同于搜索，也不新增 `search` prop。

新增属性时先判断它是否已经能由现有结构推导：能推导就收进“输入组合”，不新增 `search` 等平行能力或伪 prop；不能推导且包含建议列表、远程请求、历史或筛选联动时，沉淀为 fx 组合组件。页面只保留调试台作为实时示例入口，不再额外维护“组件总览”或“场景示例”重复区块。

Token 编辑属于组件作者模式。预览区局部重映射 `--fds-c-input-color-background`、`--fds-c-input-color-border` 和占位文字语义来确认真实组件是否生效；生成结果是组件源码草稿，非默认 Token 组合必须经过 Component Hook 治理后才能进入主题，不能用于业务页面的单实例覆盖。

选择槽位默认值时不写局部覆盖，例如默认边框直接继承 `--fds-c-input-color-border`；只有选择非默认映射时才生成 Hook 草稿，避免 CSS 变量自引用。

### 当前规格

默认尺寸为 `sm`，高度 `28px`。默认输入文字使用 `14px / 20px / 400`；placeholder 同为 `400`，颜色走 `text-foreground-disabled`。输入框边框为 `1px`；悬停与聚焦边框使用主题色 `border-primary`，错误态使用 `border-destructive`，不额外添加聚焦环。输入内容与控件外侧统一保留 `8px`；`InputAffix` 内容槽位最小为 `16px`，贴近输入内容的一侧也统一保留 `8px`，左、右镜像一致。`InputAddon` 与输入区共享 `surface`，只用与外框同源的 `input` 竖分隔线划出固定内容，不单独着色或起圆角。`type="number"` 隐藏浏览器默认微调箭头，但保留键盘上下键、`min` / `max` / `step` 和原生数值校验。

## API {#api}

Input 支持原生 input props，并保留 shadcn open-code 的基础视觉。组合型能力由同文件导出的子组件承载。

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `size` | 输入框尺寸，`xs`=24px、`sm`=28px（默认）、`md`=32px | `"xs" \| "sm" \| "md"` | `sm` |
| `type` | 原生 input 类型，例如 text / number / password / email / search；number 隐藏默认微调箭头，保留键盘步进和校验 | `string` | `text` |
| `disabled` | 禁用输入，触发禁用态样式 | `boolean` | `false` |
| `aria-invalid` | 标记当前值未通过校验，触发错误态样式 | `boolean` | `false` |
| `placeholder` | 占位提示文字 | `string` | - |
| `className` | 追加 class，主要用于布局、宽度或外部间距 | `string` | - |
| `InputGroup` | 输入组合容器，统一持有边框、焦点、禁用和错误态 | 组件 | - |
| `InputAddon` | 前后置固定标签块，例如 `http://`、`PX`、`全部` | 组件 | `side="start"` |
| `InputAffix` | 轻量前后缀内容，例如图标、`¥`、清除提示 | 组件 | `side="end"` |
| `InputAction` | 输入框内动作按钮；`icon` 用于图标搜索/清除，`primary` 用于紧贴输入框的主搜索按钮 | `button & { variant?: "icon" \| "primary" }` | `type="button"`, `variant="icon"` |
| `...props` | 透传所有原生 input 属性，原生 `size` 由组件尺寸接管 | `Omit<React.ComponentProps<"input">, "size">` | - |

## Semantic DOM {#semantic-dom}

| 部位 | 说明 |
| --- | --- |
| `data-slot="input"` | 输入框根节点，供样式选择器、测试和 AI 定位使用 |
| `data-slot="input-group"` | 输入组合容器，统一持有边框、焦点、禁用和错误态 |
| `data-slot="input-addon"` | 前后置固定标签块，带分隔线 |
| `data-slot="input-affix"` | 轻量前后缀区域，常用于图标或单位 |
| `data-slot="input-action"` | 输入框内动作按钮；图标动作必须提供 `aria-label`，主动作使用可见按钮文本 |
| `data-input-state="hover|focus"` | 文档调试台用于展示悬停 / 聚焦视觉态，不作为业务状态来源 |
| `data-slot="field"` | 字段容器，承载 label、control、description 和 error 的语义分组 |
| `data-slot="field-label"` | 字段标签，通常通过 `htmlFor` 与 Input 的 `id` 关联 |
| `data-slot="field-description"` | 字段辅助说明 |
| `data-slot="field-error"` | 字段错误文案，使用 `role="alert"` 向辅助技术宣布错误 |
| `data-invalid` | 字段级错误状态，设置在 `Field` 上 |
| `data-disabled` | 字段级禁用状态，设置在 `Field` 上 |
| `disabled` | 原生禁用属性，驱动禁用态样式并阻止交互 |
| `aria-invalid` | 校验失败态的语义标记，同时驱动错误态样式 |

## 主题变量 Design Token {#design-token}

| Token | 用途 |
| --- | --- |
| `--input` | 输入框正常与禁用态边框 |
| `--surface` | 输入框默认表面 |
| `--muted` | 输入框禁用态表面 |
| `--background` | 页面背景语义，可作为受控表面槽位候选 |
| `--foreground` | 文件输入按钮文字等前景色 |
| `--border` | 基础边框语义，参与全局边框体系 |
| `--primary` | hover / focus-visible / focus-within 交互边框 |
| `--ring` | 组合输入内层输入框清除聚焦 ring |
| `--destructive` | aria-invalid 错误态边框 |
| `--muted-foreground` | placeholder 文本 |
| `--foreground-disabled` | 默认 placeholder 与禁用文字 |
| `--radius` | 输入框圆角派生尺度 |

完整 token 规则见 `docs/TOKENS.md`。

## Component Styling Hooks {#component-styling-hooks}

以下 5 个 Hook 已通过 stable 准入，覆盖 Input 与同源 InputGroup 的公开换肤边界：

| Hook | 默认引用 |
| --- | --- |
| `--fds-c-input-color-background` | `--fds-g-color-surface-control` |
| `--fds-c-input-color-border` | `--fds-g-color-border-interactive` |
| `--fds-c-input-color-border-hover` | `--fds-g-color-action-primary` |
| `--fds-c-input-color-border-focus` | `--fds-g-color-action-primary` |
| `--fds-c-input-color-border-invalid` | `--fds-g-color-action-destructive` |

Hook 覆盖范围同时作用于 Input 与同源 InputGroup 外框。它不新增 prop，也不允许页面局部覆写；字段错误语义仍必须由 `data-invalid + aria-invalid` 驱动。

## 排版 Typography {#typography}

| 元素 | 规则 |
| --- | --- |
| 输入值 | `size="md"` 使用 body 的 `text-base`；`sm/xs` 仅为高密度控件降为 `text-sm/text-xs`，不新增文本角色。 |
| placeholder | 继承当前 Input 的字号，颜色使用 `placeholder:text-foreground-disabled`；它是输入提示，不替代 `FieldLabel`。 |

机器映射在 `docs/data/design-tokens.json#componentUsage`，可用 `npm run tokens -- component Input --json` 查询。

`Field` 是独立的表单组合层：它决定是否显示标题、说明和 `FieldError`。`disabled` 与 `aria-invalid` 始终只表达 Input 本身的状态；裸 Input 的 invalid 只显示错误边框，不应凭空出现标题或错误文案。

## AI Rules {#ai-rules}

- 真实表单字段必须使用 `FieldGroup + Field + FieldLabel + Input`，并用 `id` / `htmlFor` 关联。
- 前后缀、单位、搜索按钮、范围选择必须使用 `InputGroup` 组合，不要绝对定位图标或覆盖 Input 内边距。
- 校验失败时 Field 设置 `data-invalid`，Input 设置 `aria-invalid`，错误文案放在 `FieldError`，不要手写红色边框 className。
- `Field` 是否存在与 `disabled` / `aria-invalid` 相互独立：独立输入可有 disabled 或错误边框；只有真实字段才附带标题、说明和错误文案。
- 不可编辑时 Field 设置 `data-disabled`，Input 设置 `disabled`，不要用 opacity 或 pointer-events 假装禁用。
- `className` 只用于布局、宽度或外部间距，不用于覆盖输入框自身颜色、圆角、边框和内边距。
- Input 没有 `variant` prop，不要发明视觉类型；尺寸只使用 `size="md|sm|xs"`。

## 正误示例 {#do-dont}

### 表单字段使用 Field

不推荐：

```tsx
<div className="custom-field">
  <Label htmlFor="name">姓名</Label>
  <Input />
</div>
```

推荐：

```tsx
<Field>
  <FieldLabel htmlFor="name">姓名</FieldLabel>
  <Input id="name" />
</Field>
```

### 错误态使用 aria-invalid

不推荐：

```tsx
<Input className="border-red-500" />
```

推荐：

```tsx
<Field data-invalid>
  <FieldLabel htmlFor="email">邮箱</FieldLabel>
  <Input id="email" aria-invalid />
  <FieldError>请输入有效邮箱。</FieldError>
</Field>
```

### 禁用态使用 disabled

不推荐：

```tsx
<Input className="opacity-50" />
```

推荐：

```tsx
<Field data-disabled>
  <Input disabled />
</Field>
```
