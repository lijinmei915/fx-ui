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
  - secondary
  - secondary-foreground
  - muted
  - muted-foreground
  - destructive
  - ring
  - radius
status: draft
---

# Button 按钮

Button 用于触发即时操作，适合提交、保存、创建、删除等用户动作。

源码来自 shadcn/ui，进入项目后保持 open-code。公司视觉通过 `theme/fx-theme.css` 的语义 token 注入，不通过重新封装或硬编码样式实现。

AI 生成页面时应优先使用 Button 的 `variant`、`size` 和 `disabled` 状态表达语义，避免手写颜色、圆角和 loading prop。

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

## 使用方式 {#usage}

把 import 和 JSX 调用复制到业务页面里使用。fx-ui 通过统一 preset / registry 整块接入，不建议业务项目逐个安装基础组件。

```tsx
import { Button } from "@/components/ui/button"
```

```tsx
<Button variant="outline">Button</Button>
```

## 组件总览 {#overview}

组件总览用于快速查看 Button 的视觉能力，不承载语义规则和复制代码。

- 类型：Default、Secondary、Outline、Ghost、Destructive、Link
- 尺寸：XS、SM、Default、Large，以及 Icon XS、Icon SM、Icon、Icon LG
- 交互状态：Normal、Loading、Disabled；Loading 由 `disabled` 与 Spinner 组合
- 图标：左图标、右图标、图标按钮
- 尺寸、交互状态与图标统一使用 Default variant，便于只比较对应能力差异；Hover、Press、Keyboard Focus 等交互反馈可直接在任意类型按钮上体验
- `aria-invalid` 属于校验状态，保留在 API 中，不混入常规交互状态总览

## 场景示例 {#examples}

场景示例用于解释什么时候使用哪一种 Button。网页以决策表展示，并支持按 `全部 / 类型 / 尺寸 / 状态 / 图标` 点选查看。每行都绑定场景、使用意图、推荐写法、约束和预览，让人、AI 和程序读同一份语义；类型、尺寸、原生状态和业务组合态保持明确区分。

### 主操作

- 使用意图：页面或区域的主要行动点，一个操作区域建议只出现一个。
- 规则：用于保存、提交、新建等明确推进流程的操作。
- 分组：`类型`
- 关键属性：`variant: "default"`，`size: "default"`。

```tsx
<Button>保存</Button>
```

### 次操作

- 使用意图：与主操作并列但优先级较低，不抢主行动点。
- 规则：用于取消、返回、稍后处理等辅助操作。
- 分组：`类型`
- 关键属性：`variant: "secondary"`，`size: "default"`。

```tsx
<Button variant="secondary">取消</Button>
```

### 危险操作

- 使用意图：删除、移除权限等不可逆操作，通常需要二次确认。
- 规则：必须使用 `destructive`，不要用主按钮表达危险操作。
- 分组：`类型`
- 关键属性：`variant: "destructive"`，`size: "default"`。

```tsx
<Button variant="destructive">删除项目</Button>
```

### 链接操作

- 使用意图：弱操作或跳转入口，不承载关键提交行为。
- 规则：用于查看详情、打开文档等轻量跳转。
- 分组：`类型`
- 关键属性：`variant: "link"`，`size: "default"`。

```tsx
<Button variant="link">打开文档</Button>
```

### 超小尺寸

- 使用意图：极紧凑的工具栏、表格内联操作。
- 规则：只用于密度很高的局部操作，不用于页面主按钮。
- 分组：`尺寸`
- 关键属性：`variant: "outline"`，`size: "xs"`。

```tsx
<Button size="xs" variant="outline">更多</Button>
```

### 小尺寸

- 使用意图：筛选栏、表格行、紧凑表单等高密度区域。
- 规则：小尺寸用于空间受限场景，不用于页面主行动点。
- 分组：`尺寸`
- 关键属性：`variant: "outline"`，`size: "sm"`。

```tsx
<Button size="sm" variant="outline">筛选</Button>
```

### 默认尺寸

- 使用意图：页面正文、表单页和常规操作区域。
- 规则：默认尺寸是业务页面的首选尺寸。
- 分组：`尺寸`
- 关键属性：`variant: "default"`，`size: "default"`。

```tsx
<Button>提交</Button>
```

### 大尺寸

- 使用意图：需要更强触达的表单提交、营销页或空状态行动点。
- 规则：大尺寸谨慎使用，不在密集列表里使用。
- 分组：`尺寸`
- 关键属性：`variant: "default"`，`size: "lg"`。

```tsx
<Button size="lg">开始使用</Button>
```

### 左图标

- 使用意图：用图标辅助识别动作含义。
- 规则：左图标使用 `data-icon="inline-start"`，不手写尺寸。
- 分组：`图标`
- 关键属性：`variant: "default"`，`data-icon: "inline-start"`。

```tsx
<Button>
  <SearchIcon data-icon="inline-start" />
  搜索
</Button>
```

### 右图标

- 使用意图：用于带方向、展开或继续含义的按钮。
- 规则：右图标使用 `data-icon="inline-end"`。
- 分组：`图标`
- 关键属性：`variant: "outline"`，`data-icon: "inline-end"`。

```tsx
<Button variant="outline">
  继续
  <ChevronDownIcon data-icon="inline-end" />
</Button>
```

### 图标按钮

- 使用意图：工具栏、表格行操作等空间紧凑的位置。
- 规则：图标按钮必须有 `aria-label`，图标使用 `data-icon`，不手写尺寸。
- 分组：`图标`
- 关键属性：`variant: "default"`，`size: "icon"`，`aria-label`，`data-icon`。

```tsx
<Button size="icon" aria-label="打开组件包">
  <PackageIcon data-icon="inline-start" />
</Button>
```

### 禁用状态

- 使用意图：权限不足、表单未完成或提交中，暂时不可触发。
- 规则：使用 `disabled` 表达不可操作，不要只降低透明度伪装禁用。
- 分组：`状态`
- 关键属性：`variant: "default"`，`disabled: true`。

```tsx
<Button disabled>提交中</Button>
```

### 加载状态

- 使用意图：提交中、保存中等需要阻止重复点击的场景。
- 规则：Button 没有 `loading` prop，使用 `disabled` 和 Spinner 组合。
- 分组：`状态`
- 关键属性：`disabled`，`Spinner`，`data-icon: "inline-start"`。

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
| `variant` | 按钮样式变体 | `'default' \| 'outline' \| 'secondary' \| 'ghost' \| 'destructive' \| 'link'` | `'default'` |
| `size` | 按钮尺寸 | `'default' \| 'xs' \| 'sm' \| 'lg' \| 'icon' \| 'icon-xs' \| 'icon-sm' \| 'icon-lg'` | `'default'` |
| `disabled` | 是否禁用 | `boolean` | `false` |
| `aria-invalid` | 是否展示错误态 | `boolean` | `false` |
| `className` | 追加 class，主要用于布局，不用于硬覆盖颜色和字体 | `string` | - |

## Semantic DOM {#semantic-dom}

| 部位 | 说明 |
| --- | --- |
| `root` | 按钮根节点，承载 variant、size、disabled、aria-invalid 和焦点态样式。 |
| `icon` | 图标区域。图标使用 `data-icon="inline-start"` 或 `data-icon="inline-end"` 标记位置，不手写尺寸覆盖。 |
| `content` | 按钮文本内容。保持短动作短语，不放长说明。 |

## 主题变量 Design Token {#design-token}

| Token | 用途 |
| --- | --- |
| `primary` | 默认主按钮背景、激活态和品牌强调 |
| `primary-foreground` | 主色背景上的文字和图标 |
| `secondary` / `secondary-foreground` | 次按钮背景和文字 |
| `muted` / `muted-foreground` | ghost、outline hover 和弱信息 |
| `destructive` | 危险按钮、错误态和不可逆操作 |
| `ring` | 键盘焦点环和可访问性焦点态 |
| `radius` | 按钮圆角派生尺度 |

完整 token 规则见 `docs/TOKENS.md`。

## AI Rules {#ai-rules}

- 需要主操作时使用 `<Button>保存</Button>`，不要手写 `bg-[#FF8000]`。
- 需要危险操作时使用 `variant="destructive"`。
- 图标按钮必须有 `aria-label`。
- 图标放在按钮内时，图标使用 `data-icon`，不要直接写 `size-4`。
- `className` 只用于布局、宽度或间距，不用于覆盖组件颜色。
- 当前 Button 没有内置 `loading` prop；加载态用 `disabled` 与 Spinner 组合实现。

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

### 加载态用组合，不发明 loading prop

不推荐：

```tsx
<Button loading>提交</Button>
```

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
