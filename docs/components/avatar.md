---
category: Components
group: 通用
title: Avatar
subtitle: 头像
description: 展示用户、团队或实体身份，必须提供 fallback。
source: src/components/ui/avatar.tsx
theme: theme/fx-theme.css
tokens:
  - primary
  - primary-foreground
  - background
  - foreground
  - muted
  - muted-foreground
  - border
  - ring
status: complete
---

# Avatar 头像

展示用户、团队或实体身份，必须提供 fallback。

源码来自 shadcn/ui，进入项目后保持 open-code。当前 Avatar 以 `shadcn-extended` 受治理：Base UI 原生图片加载与 fallback 语义保持不变，shadcn 缺少的尺寸、形状、状态、分组与拼接能力继续在同一基础组件中补齐，不拆成黑盒或业务层组件。公司视觉通过 `theme/fx-theme.css` 的语义 token 注入。

AI 使用 Avatar 前必须先以 `src/components/ui/avatar.tsx` 为真实 API；本文档记录的是当前仓库源码能力，不是凭记忆推断的组件能力。

## 来源 {#source}

```txt
src/components/ui/avatar.tsx
```

## 使用方式 {#usage}

```tsx
import { Avatar, AvatarImage, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarComposite, AvatarBadge } from "@/components/ui/avatar"
```

```tsx
<Avatar>
  <AvatarImage src="/avatar.png" alt="张三" />
  <AvatarFallback>张</AvatarFallback>
</Avatar>
```

## 组件总览 {#overview}

- 类型：display
- 语义 DOM：data-slot="avatar"、data-slot="avatar-image"、data-slot="avatar-fallback"、data-slot="avatar-badge"、data-slot="avatar-group"、data-slot="avatar-group-count"、data-slot="avatar-composite"、data-slot="avatar-composite-cell"
- 原生/数据状态：`imageLoadingStatus`（idle/loading/loaded/error）
- 能力：`size`（xs/sm/default/lg/xl = 20/24/32/40/48）、`shape`（circle/square）、`AvatarFallback neutral`（默认 muted 兜底）、`AvatarFallback colorful`（按内容 hash 取色板色）、`AvatarBadge status`（online/away/busy/offline）、`AvatarGroup max`（超出自动折叠 +N）、`AvatarComposite max`（2/3/4 人拼接）
- 导出项：Avatar、AvatarImage、AvatarFallback、AvatarGroup、AvatarGroupCount、AvatarComposite、AvatarBadge、avatarInitials

## 场景示例 {#examples}

### 推荐场景

- 使用意图：展示用户、团队或实体身份，必须提供 fallback。
- 规则：优先使用源码已有子组件、props、状态和 token，不复制内部 JSX 到业务页面里重写。

```tsx
<Avatar>
  <AvatarImage src="/avatar.png" alt="张三" />
  <AvatarFallback>张</AvatarFallback>
</Avatar>
```

### 不适合场景

- 不用 Avatar 承载它职责之外的语义。
- 不通过 `className` 硬覆盖组件内部颜色、圆角、边框、阴影和状态样式。
- 不发明源码里没有的 prop、variant、size 或状态。

## API {#api}

以源码导出为准（`src/components/ui/avatar.tsx`），核心 props：

| 属性 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `Avatar.size` | `"xs" \| "sm" \| "default" \| "lg" \| "xl"` | `"default"` | 尺寸档 20/24/32/40/48，子元素随档联动 |
| `Avatar.shape` | `"circle" \| "square"` | `"circle"` | 人物用 circle；企业、项目、群组、应用等实体可用 square，圆角随尺寸档联动 |
| `Avatar.render` | `AvatarPrimitive.Root.Props["render"]` | — | 保留 Avatar 视觉并渲染为链接或按钮；组件内置 pointer 与 focus-visible 视觉 |
| `AvatarImage.onLoadingStatusChange` | `(status) => void` | — | 监听 Base UI 图片加载状态：idle/loading/loaded/error |
| `AvatarFallback.delay` | `number` | — | 图片加载时延迟显示 fallback，避免快速加载产生闪烁 |
| `AvatarFallback.render` | `AvatarPrimitive.Fallback.Props["render"]` | — | 使用 Base UI 原生 render 能力替换 fallback 标签 |
| `AvatarFallback.colorful` | `boolean` | `false` | 兜底文字按内容 hash 取色板色，实底（Map base-80，对应旧 08 阶）+ 语义反白文字；六色查表由组件内部治理，不是公开 Styling Hook |
| `AvatarBadge.status` | `"online" \| "away" \| "busy" \| "offline"` | — | 右下角 presence 状态点：在线绿 / 离开黄 / 忙红 / 离线灰（参考 Slack/Teams）|
| `AvatarGroup.max` | `number` | — | 最多展示几个，超出折叠为 `+N` |
| `AvatarGroupCount.render` | `useRender.ComponentProps<"div">["render"]` | — | 需要 hover/focus 触发 Tooltip 时渲染为 button，获得正确键盘语义 |
| `AvatarComposite.max` | `2 \| 3 \| 4` | `4` | 群聊拼接头像最多展示几个成员；2 中线左右、3 上中 + 下二、4 田字 |
| `AvatarComposite.size` | `"default" \| "lg" \| "xl"` | `"default"` | 拼接头像整体尺寸档 32/40/48；20/24 无法可靠辨认多个成员，不开放 |
| `avatarInitials(name)` | `(string) => string` | — | 工具函数，从姓名取缩写（见下方取值逻辑） |

### 可点击头像 {#clickable}

头像作为入口（跳个人主页 / 用户卡片）时，用 `render` 把它渲染成 `<a>`/`<button>`；组件会提供 pointer 与 focus-visible 视觉。不要给 Avatar 绑裸 `onClick` 当按钮。

```tsx
<Avatar render={<a href="/u/zhang" />}>
  <AvatarImage src="/avatars/01.png" alt="张三" />
  <AvatarFallback>张</AvatarFallback>
</Avatar>
```

### 头像组 +N 悬停看全部 {#group-hover}

协作者较多时，群组默认展示前 3 个头像，第 4 个起折叠为 `+N`；用 `Tooltip` 包住 `AvatarGroupCount`，hover/focus 时展示剩余成员名单，不要把名单平铺在页面上。

```tsx
<TooltipProvider>
  <AvatarGroup>
    {members.slice(0, 3).map((member) => (
      <Avatar key={member.name}>…</Avatar>
    ))}
    <Tooltip>
      <TooltipTrigger render={<AvatarGroupCount render={<button type="button" />} aria-label="剩余成员：王五、赵六、孙七">+3</AvatarGroupCount>} />
      <TooltipContent>王五、赵六、孙七</TooltipContent>
    </Tooltip>
  </AvatarGroup>
</TooltipProvider>
```

### 群组头像：堆叠 vs 拼接 {#group-modes}

多用户群组头像有两种模式，别混用：

- **堆叠**（overlap，`AvatarGroup`）→ 协作者列表、评论区，头像横向重叠 + `+N` 折叠。
- **拼接**（composite，`AvatarComposite`）→ 群聊 / 多人会话头像，把成员头像按人数拼进一个群聊头像容器。**成员有头像图就拼真实图（`AvatarImage`），无图才 `colorful` 文字兜底。** **按人数自适应**：2 人中线左右两块、3 人上中一块 + 下方两块、4 人田字 2×2。图片撑满每个格子，单个头像不加圆角，调用处不要手写宫格。

```tsx
<AvatarComposite max={4}>
  {members.slice(0, 4).map((m) => (
    <Avatar key={m.name}>
      <AvatarImage src={m.avatar} />
      <AvatarFallback colorful>{avatarInitials(m.name)}</AvatarFallback>
    </Avatar>
  ))}
</AvatarComposite>
```

### 兜底文字取值逻辑 {#initials}

`avatarInitials(name)` 的缩写规则（参考主流）：

- **中文**：≤2 字全取（「张三」→张三）；≥3 字取**末两字**（名），「欧阳娜娜」→娜娜、「王小明」→小明。
- **英文**：单名取首字母（Alice→A）；全名取**首末两词首字母**（John Doe→JD），统一大写。

彩色兜底：`colorful` 按内容 hash 在 6 色系（brand/green/amber/red/blue/purple）里取一色，背景固定查表到 FDS Map 的 `base-80`，前景使用 `text.inverse` Semantic。调用方不写死颜色，也不覆盖单个实例。


## Semantic DOM {#semantic-dom}

| 部位 | 说明 |
| --- | --- |
| `data-slot="avatar"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="avatar-image"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="avatar-fallback"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="avatar-badge"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="avatar-group"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="avatar-group-count"` | 源码中的语义定位，供样式选择器、测试和 AI 定位使用 |
| `data-slot="avatar-composite"` | 群聊拼接头像容器，标记 default/lg/xl 尺寸与 2/3/4 成员数量 |
| `data-slot="avatar-composite-cell"` | 拼接头像中的单个成员单元 |

## 状态标记 {#states}

| 状态 | 说明 |
| --- | --- |
| `imageLoadingStatus` | Base UI 图片加载状态：idle / loading / loaded / error；由 AvatarImage 和 AvatarFallback 共同消费 |

## 主题变量 Design Token {#design-token}

| Token | 用途 |
| --- | --- |
| `--fds-g-color-brand-base-80` / `--fds-g-color-green-base-80` / `--fds-g-color-amber-base-80` | 彩色 fallback 内部查表的品牌、绿色与琥珀色实底；不是组件公开 Hook |
| `--fds-g-color-red-base-80` / `--fds-g-color-blue-base-80` / `--fds-g-color-purple-base-80` | 彩色 fallback 内部查表的红、蓝与紫色实底；不是组件公开 Hook |
| `--fds-g-color-text-inverse` | 彩色 fallback 上的反白文字与图标 |
| `--primary` / `--primary-foreground` | 默认 Badge 强调色及其前景色 |
| `--background` | 头像组描边和拼接单元间隔背景 |
| `--muted` / `--muted-foreground` | 默认 fallback 与折叠计数的弱化表面和文字 |
| `--success` / `--warning` / `--destructive` | online / away / busy presence 状态色 |
| `--ring` | 链接、按钮和折叠计数的 focus-visible 焦点环 |

完整 token 规则见 `docs/TOKENS.md`。

## AI Rules {#ai-rules}

- 展示组件只负责呈现数据或身份，不承载提交类动作。
- 状态语义优先用现有 variant 或组合组件，不手写颜色。
- `AvatarFallback` 必须存在，图片失败或用户无头像时仍有可读身份；兜底内容三选一：文字缩写（`avatarInitials`）、彩色文字（`colorful`）、或通用图标（匿名/无名用户，`colorful` + 面型 `UserFilledIcon`，实底白图标反白）。
- 尺寸用 `size` prop（xs/sm/default/lg/xl），不手写 `size-*` 覆盖；人物用 `circle`、企业/项目/群组用 `shape="square"`。
- `AvatarComposite` 是 shadcn Avatar 的基础能力补全，继续位于 `src/components/ui/avatar.tsx`；只使用 default/lg/xl，禁止在 20/24 尺寸里重拼多人宫格。
- `AvatarGroupCount` 触发 Tooltip 时必须通过 `render={<button type="button" />}` 获得按钮语义，不使用可聚焦的 div。
- 无头像图时用 `AvatarFallback colorful` 自动上色，不逐个写死背景色。
- 使用 Avatar 前必须以 src/components/ui/avatar.tsx 为真实 API。
- 不要手写颜色、圆角、边框和状态样式；优先使用源码已有 prop、状态和 token。
- className 只用于布局、宽度或外部间距，不用于覆盖组件自身基础视觉。

## 正误示例 {#do-dont}

### 使用现有组件能力

不推荐：

```tsx
// 不要手写一个看起来像 Avatar 的 div，也不要硬编码 token 颜色。
<div className="custom-avatar">...</div>
```

推荐：

```tsx
<Avatar>
  <AvatarImage src="/avatar.png" alt="张三" />
  <AvatarFallback>张</AvatarFallback>
</Avatar>
```
