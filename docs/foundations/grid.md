---
layer: knowledge
type: spec
last_verified: 2026-08-28
teaches: "FDS Web 24 列栅格、gutter 与响应式规则"
use_when: "设计或实现内容区分栏、偏移、嵌套或响应式栅格时"
---

# FDS 栅格规范

> 本文是 FDS Foundation 专题说明；数值与映射的唯一真相源仍是 `tokens/source/*.tokens.json`。总览见 [设计 Token](../TOKENS.md)，统一目录见 [FDS 文档索引](../INDEX.md)。

## 栅格系统

来源：企业 Web 布局规范。

- **24 列基准**（不是 Tailwind 默认的 12 列）；内容按 1/24 分栏自由组合。
- **gutter（列间距）= 16px**：相邻分栏之间的固定空隙，决定内容块横向呼吸感。
- **对齐方式**：整体左对齐 / 居中对齐 / 右对齐 / 左右齐飞（两端对齐），按业务场景选。
- **等分 / 混合**：等分用 `repeat(n,1fr)`；非等分按 /24 给不同 span（如 6/18、8/16、6/12/6）。
- Tailwind 落地：24 列不在默认刻度，用 `grid grid-cols-[repeat(24,minmax(0,1fr))] gap-4`（gap-4 = 16px = 列间距）；分栏用 `col-span-[n]`（按 24 计，如半栏 `col-span-[12]`）。
- **进阶（对齐 Semi/Ant）**：列间距推荐取 **16+8n**；需要水平/垂直不同间距用 `gap-x-* gap-y-*`（对应 Semi 的 `gutter:[h,v]`）、响应式间距用 `gap-4 lg:gap-6`（对应响应式 gutter 对象）；改顺序用 `order-*`，精细位移用 `col-start-*`（offset/push/pull）。
- 栅格是独立一页（网页「栅格」），与「布局」（页面容器）分开：栅格管内容分栏，布局管整页骨架。

**以下为框架默认/主流（企业 Figma 未单独规定，按 Tailwind 落地）：**

- **响应式断点**（Tailwind 默认）：`sm` 640 / `md` 768 / `lg` 1024（后台默认）/ `xl` 1280 / `2xl` 1536；用前缀 `lg:col-span-[12]` 做响应式分栏。
- **偏移 offset**：内容前留空用 `col-start-[n]`。
- **容器/版心**：内容最大宽度 + 页面外边距，`max-w-7xl` + `px-4 lg:px-8`。
- **嵌套**：栅格内可再嵌栅格，子栅格按 1/24 重新划分。
