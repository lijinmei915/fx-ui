---
category: Components
group: 通用
title: Button
subtitle: 按钮
description: 用于触发即时操作的基础组件，适合提交、保存、创建、删除等用户动作。
source: src/components/ui/button.tsx
theme: theme/fx-theme.css
tokens:
  - primary
  - primary-foreground
  - background
  - foreground
  - secondary
  - secondary-foreground
  - muted
  - muted-foreground
  - destructive
  - border
  - input
  - ring
  - radius
status: complete
---

# Button 按钮

Button 用于触发即时操作，适合提交、保存、创建、删除等用户动作。

源码来自 shadcn/ui，进入项目后保持 open-code。公司视觉通过 `theme/fx-theme.css` 的语义 token 注入，不通过重新封装或硬编码样式实现。

AI 生成页面时应优先使用 Button 的 `variant`、`size` 和 `disabled` 状态表达语义，避免手写颜色、圆角和自造加载属性。

Button 文档也是后续组件精修的模板：先写“什么时候用”，再写“源码真实 API”，最后写“AI 不要怎么误用”。

## 来源 {#source}

Button 源码位于：

```txt
src/components/ui/button.tsx
```

fx-ui 推荐通过统一 registry / preset 接入组件、主题和 AI 规则；组件页不推荐业务项目逐个手动安装基础组件。

完整接入方式见 `开始使用 / 安装接入`。

上游来源：

```txt
shadcn/ui button
```

## 设计真相源（公司 Figma） {#figma-spec}

> 体检 / 改 Button 视觉前，以公司 Figma「按钮设计指南」为准，主流（shadcn/Ant）作交叉参考。
> 节点：[设计指南](https://www.figma.com/design/k98zObf0bN7OKGVwpCyjBd/Web%E7%AB%AF%E5%9F%BA%E7%A1%80%E7%BB%84%E4%BB%B6%E5%BA%93?node-id=11993-16779)（另有 11999-26653 / 11999-46922 同源补充）。

Figma 关键规格（默认/中尺寸）：

> 默认尺寸已对齐：尺寸名是纯尺寸 `xs(24) / sm(28) / md(32) / lg(36)`（双层设计——尺寸名不含「default」语义），「哪个是默认」由 `defaultVariants.size = "sm"` 单独声明，不写 size 即渲染 28px（对齐公司「中尺寸」默认）。

| 项 | 公司 Figma | 当前 fx-ui | 是否对齐 |
| --- | --- | --- | --- |
| 默认高度 | **28px**（中：24≤h≤28） | 28px（默认走 sm 档） | ✅ |
| 横向内边距 | **10px**（外间距/Button） | sm 档 px-2.5（10px） | ✅ |
| 圆角 | **6px**（中）/ 8px（大 h≥32） | `--radius-md` | 待核 |
| 图标-文字间距 | **4px**（内间距/Button） | 4px（gap-1） | ✅ |
| 字号 | **13px** Regular | 13/14（按 size） | 大体一致 |

注：上表差异是**待体检对齐项**（尚未改动，先记录留痕）；调整时连同 size 阶梯（小24 / 中28 / 大32+）一并评估，不要只改默认。

## 使用方式 {#usage}

把 import 和 JSX 调用复制到业务页面里使用。fx-ui 通过统一 preset / registry 整块接入，不建议业务项目逐个安装基础组件。

```tsx
import { Button } from "@/components/ui/button"
```

```tsx
<Button variant="outline">Button</Button>
```

## 调试台规则 {#playground-rules}

Button 网页不再单独维护「组件总览」和「场景示例」决策表；交互调试台已经同时展示预览、使用意图、约束和推荐写法，避免同一套规则在页面里重复两遍。

AI 选择 Button 时按这个顺序判断：

1. 先判断动作语义：主操作、次操作、危险操作、弱操作、跳转操作。
2. 再判断空间密度：默认 `sm`（28px）优先，高密度区域才用 `xs`，更宽松的表单或行动点才考虑 `md` / `lg`。
3. 再判断是否需要图标：图标只辅助识别，不替代文字；纯图标按钮必须补 `aria-label`。
4. 最后判断状态：原生状态用 HTML/ARIA 表达，业务组合态用现有组件组合，不发明新 prop。

原生交互态来自 Button 源码：`hover`、`active`、`focus-visible`、`disabled`、`aria-invalid`、`aria-expanded`。业务组合态不新增 Button API，例如加载态用 `disabled + Spinner`。

```tsx
<Button>保存</Button>
<Button variant="secondary">取消</Button>
<Button variant="destructive">删除项目</Button>
<Button variant="plain" tone="danger" size="icon-sm" aria-label="删除">
  <Trash2Icon />
</Button>
```

Button 没有内置 `loading` prop；Loading = `disabled + Spinner`。

```tsx
<Button disabled>
  <Spinner data-icon="inline-start" />
  提交中
</Button>
```

## API {#api}

Button 支持 `@base-ui/react/button` 的原生 button props，并额外支持以下变体。

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `variant` | 按钮样式变体 | `'default' \| 'outline' \| 'secondary' \| 'ghost' \| 'destructive' \| 'plain'` | `'default'` |
| `size` | 按钮尺寸（默认值见 defaultVariants） | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'icon-xs' \| 'icon-sm' \| 'icon-md' \| 'icon-lg'` | `'sm'`（28px） |
| `disabled` | 是否禁用 | `boolean` | `false` |
| `aria-invalid` | 是否展示错误态 | `boolean` | `false` |
| `render` | 把按钮样式渲染到自定义元素上，例如 `<a>`；这是 Base UI 版本的 asChild 能力 | `ReactElement \| (props, state) => ReactElement` | - |
| `className` | 追加 class，主要用于布局，不用于硬覆盖颜色和字体 | `string` | - |

组合按钮使用 `ButtonGroup` 承载，不在业务页面靠负 margin 手拼边框。

## Semantic DOM {#semantic-dom}

| 部位 | 说明 |
| --- | --- |
| `data-component="Button"` | DevInspector 和 AI 识别 Button 的组件身份证。 |
| `data-slot="button"` | shadcn open-code 根节点标记，供样式选择器和测试定位使用。 |
| `data-variant` | 当前 Button 的样式变体，值来自源码里的 `variant`。 |
| `data-size` | 当前 Button 的尺寸变体，值来自源码里的 `size`。 |
| `root` | 按钮根节点，承载 variant、size、disabled、aria-invalid 和焦点态样式。 |
| `icon` | 图标区域。图标使用 `data-icon="inline-start"` 或 `data-icon="inline-end"` 标记位置，不手写尺寸覆盖。 |
| `content` | 按钮文本内容。保持短动作短语，不放长说明。 |

## 主题变量 Design Token {#design-token}

| Token | 用途 |
| --- | --- |
| `--primary` | 默认主按钮背景、激活态和品牌强调 |
| `--primary-foreground` | 主色背景上的文字和图标 |
| `--background` | outline 按钮背景 |
| `--foreground` | hover 与低强调按钮文字 |
| `--secondary` | 次按钮背景 |
| `--secondary-foreground` | 次按钮文字 |
| `--muted` | ghost、outline hover 背景 |
| `--border` | outline 按钮边框 |
| `--input` | dark 模式下 outline 边框/背景兼容 |
| `--destructive` | 危险按钮、错误态和不可逆操作 |
| `--ring` | 键盘焦点环和可访问性焦点态 |
| `--radius` | 按钮圆角派生尺度 |

完整 token 规则见 `docs/TOKENS.md`。

## AI Rules {#ai-rules}

- 需要主操作时使用 `<Button>保存</Button>`，不要手写 `bg-[#FF8000]`。
- 需要危险操作时使用 `variant="destructive"`。
- 需要跳转但仍要 Button 外观时，优先使用 `render={<a href="..." />}`，不要在 Button 里套 `<a>`。
- 图标按钮必须有 `aria-label`。
- 图标放在按钮内时，图标使用 `data-icon`，不要直接写 `size-4`。
- `className` 只用于布局、宽度或间距，不用于覆盖组件颜色。
- 当前 Button 没有内置加载属性；Loading = `disabled + Spinner`。

### 组合规则（4 个正交轴，自由组合，不造新组件）

Button 只有一个组件，靠 4 个**互相独立**的轴组合，任意搭配都合法，**不要为某个组合新建组件或新 variant**：

| 轴 | prop | 取值 | 管什么 |
| --- | --- | --- | --- |
| 类型 | `variant` | default / secondary / outline / ghost / destructive / plain | 语义层级与底色 |
| 尺寸 | `size` | xs(24) / sm(28,默认) / md(32) / lg(36) / icon-* | 高度、内边距、字号、图标-文字 gap |
| 分色 | `tone` | default / primary / info / danger | **仅 `plain` 生效**，给无底色按钮分色（info=蓝） |
| 状态 | 原生 | `disabled`（+ Spinner = loading） | 交互态 |

- 选择顺序：先按语义选 `variant` → 按密度/场景选 `size` → 若是 `plain` 再选 `tone` → 状态按需加。
- 任意 `variant` 都能配任意 `size` 与状态（正交），例如 `<Button variant="plain" size="sm" tone="danger">`、`<Button variant="outline" size="lg" disabled>`。
- `tone` 只对 `plain` 有意义；实心/描边/ghost 的颜色由 `variant` 决定，不要叠 `tone`。
- 纯图标（任意 variant + `size="icon-*"`）必须补 `aria-label` + Tooltip。

## 正误示例 {#do-dont}

这些例子记录工程师和 AI 生成代码最容易犯的错误。

### 不要手写品牌色

不推荐：

```tsx
<Button className="bg-[#FF8000]">保存</Button>
```

推荐：

```tsx
<Button>保存</Button>
```

### 危险操作使用 destructive

不推荐：

```tsx
<Button>删除项目</Button>
```

推荐：

```tsx
<Button variant="destructive">删除项目</Button>
```

### 加载态用组合，不新增加载属性

不推荐：给 Button 自造加载属性。

推荐：

```tsx
<Button disabled>
  <Spinner data-icon="inline-start" />
  提交中
</Button>
```

### 按钮内图标不手写尺寸

不推荐：

```tsx
<PackageIcon className="size-4" />
```

推荐：

```tsx
<PackageIcon data-icon="inline-start" />
```

### 链接外观用 render，不嵌套 a

不推荐：

```tsx
<Button>
  <a href="/docs">打开文档</a>
</Button>
```

推荐：

```tsx
<Button render={<a href="/docs" />}>打开文档</Button>
```
