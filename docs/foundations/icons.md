---
layer: knowledge
type: spec
last_verified: 2026-08-28
teaches: "FDS 图标颜色、尺寸、线宽、形态与接入规则"
use_when: "选择图标尺寸、颜色、线性/面型或新增图标时"
---

# FDS 图标规范

> 本文是 FDS Foundation 专题说明；数值与映射的唯一真相源仍是 `tokens/source/*.tokens.json`。总览见 [设计 Token](../TOKENS.md)，统一目录见 [FDS 文档索引](../INDEX.md)。

## 图标（颜色 + 尺寸）

图标用 Tabler（线性/面型均默认 `currentColor` 跟随），分三类用色，颜色全部来自色板/文字层级，不另造图标专用色：

**1. 单色图标 — 跟随文字四级层级**

| 用途 | 类 |
|------|----|
| 主图标 | `text-foreground`（neutrals-20） |
| 次图标 | `text-muted-foreground`（neutrals-11） |
| 禁用图标 | `text-foreground-disabled`（neutrals-06） |
| 主色/危险色底图标 | `text-primary-foreground` / `text-destructive-foreground`（neutrals-20） |

**2. 彩色线性图标 — 语义/品牌色**：`text-primary` / `text-success` / `text-warning` / `text-destructive` / `text-info`，分类场景可用 chart 色系（09 阶）。

**3. 面状/反白图标**：彩色圆底（`bg-{色}-09`）+ 白色图标（`text-primary-foreground`）。

**图标尺寸阶**：`size-3`(12) 内联/徽标 · `size-3.5`(14) 小按钮 · `size-4`(16) 默认 · `size-5`(20) 强调/列表 · `size-6`(24) 页面级/空状态。

**粗细 / 形态**：图标库 = **Tabler**（线性是真描边，线宽可调；见 DEC-009）。
- **线宽全局统一**：`theme/fx-theme.css` 的 `.tabler-icon { stroke-width: 1.75 }` 一处控制；要整体更粗/更细改这一个值，不逐个图标调。
- **线性 vs 面型是语义切换**（对齐 iOS/Material 惯例）：默认/未选态用线性，**选中/激活/强调态用 `*Filled` 实心变体**（如 `IconStarFilled`）。
- 个别图标要单独调线宽，可传 `stroke={n}`（默认 2 被全局 CSS 覆盖为 1.75）。
- **线端/拐角圆角**：由 `stroke-linecap` / `stroke-linejoin` 决定，Tabler 默认即 `round`（圆头圆角，柔和、主流），无需设置。要改硬朗方头，在 `.tabler-icon` 加 `stroke-linecap: butt`（或 `square`）、`stroke-linejoin: miter` 一处统管。Tabler 只有这一套圆头线性风格，没有 Material 那种 Rounded/Sharp 字族切换。

**来源与接入（见 DEC-013）**：图标支持三种来源——内置 Tabler / 第三方库 / 上传自定义，全部从唯一出口 `@/lib/icons` 引用，并登记进 `docs/data/icons.manifest.json`（`name + keywords` 让 AI 按语义检索取用）。
- **内置**：在 `src/lib/icons.ts` 用 `IconX as XIcon` 映射稳定别名。
- **第三方库**：同样在 `icons.ts` 映射出口，调用方不感知来源；注册表 `source` 记 `thirdparty:<库名>`。
- **上传自定义**：SVG 组件放 `src/lib/icons-custom.tsx`（`currentColor` + `viewBox 0 0 24 24`），从 `icons.ts` re-export；上传第三方 SVG 必须先消毒（删 `<script>`/`on*`/外链/写死色值，强制 currentColor）。
- 调用方禁止裸 `<svg>` / `<img src=*.svg>`；新增映射后运行 `npm run build:icons`，`npm run check:icons` 会同时拦截未登记导出与失效登记。

> 兼容别名：`--fx-icon-dark`=neutrals-20、`--fx-icon-gray`=neutrals-11、`--fx-icon-light`=neutrals-01，供现有组件语义类 `text-icon` / `text-icon-muted` 使用。
