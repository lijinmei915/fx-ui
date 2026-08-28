---
layer: knowledge
type: spec
last_verified: 2026-08-28
teaches: "FDS 圆角 Seed、Map 推导与使用约束"
use_when: "查询圆角档位、推导公式或组件圆角选择时"
---

# FDS 圆角规范

> 本文是 FDS Foundation 专题说明；数值与映射的唯一真相源仍是 `tokens/source/*.tokens.json`。总览见 [设计 Token](../TOKENS.md)，统一目录见 [FDS 文档索引](../INDEX.md)。

## 圆角

按组件**类型/层级**选档（标签<控件<卡片<弹窗），不是在调用处自由输入数值。`--fds-g-radius-seed-base = 8px` 是内部 Seed；构建器按 `0 / 1/4 / 1/2 / 3/4 / 1 / 3/2 / 2` 生成 `0 / 2 / 4 / 6 / 8 / 12 / 16px` Map。生成结果为确定的 px，不依赖浏览器运行时计算。`full = 9999px` 无法由基准值有意义地派生，因此继续作为固定 Primitive；同一按钮按高度映射：24/28 用 6px，32/36 用 8px。

为方便 Agent 按用途判断，Token manifest 额外提供 `none / inner / element / container / page / full` 六个**语义别名**，它们映射到现有圆角阶，不改变任何已落地组件外观。嵌套圆角表面遵守同心规则：`innerRadius = max(0px, outerRadius - inset)`；该计算只应由组件内部实现，业务调用处不手写 `calc()` 或覆盖圆角。

**为什么采用 Seed + Map**：① 8px 是常规控件/表面的主圆角，也与当前 Web 适配器的 `--radius` 基准一致；② 比例形成清晰的四分之一、二分之一、四分之三、一倍、一点五倍和两倍；③ 原名称、原数值和组件映射全部不变；④ 这只是首个非颜色样板，不代表所有物理刻度都必须算法化。语义别名负责表达容器层级。

| 项 | 值 | 用法 |
|----|-----|------|
| `rounded-none` | `0` | 表格、紧贴边缘容器、直角分割块 |
| `rounded-xs` | `2px` | 极小图形、紧凑结构 |
| `rounded-sm` | `4px` | 小标签、嵌套内层 |
| `rounded-md` | `6px` | 24/28 控件、输入框 |
| `rounded-lg` | `8px`（Seed 基准） | 32/36 控件、常规表面 |
| `rounded-xl` | `12px` | 下拉、浮层、较大容器 |
| `rounded-2xl` | `16px` | Dialog、Sheet、页面级容器 |
| `rounded-3xl/4xl` | 24 / 32px | 特殊大区域，不作为常规组件默认值 |
| `rounded-full` | `9999px` | 胶囊按钮、Badge、头像、开关 |
