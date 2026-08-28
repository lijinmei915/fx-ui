---
layer: knowledge
type: spec
last_verified: 2026-08-28
teaches: "FDS elevation 阴影档位与组成规则"
use_when: "查询卡片、浮层、Sheet 或 Dialog 阴影时"
---

# FDS 阴影规范

> 本文是 FDS Foundation 专题说明；数值与映射的唯一真相源仍是 `tokens/source/*.tokens.json`。总览见 [设计 Token](../TOKENS.md)，统一目录见 [FDS 文档索引](../INDEX.md)。

## 阴影

阴影表达元素「离页面多高」（elevation），主题里的「阴影强度」提供 **无 / 低 / 中 / 高** 四档递进；不把复古硬阴影放进 shadow level，复古属于独立视觉风格，不属于主流 elevation 强度。阴影只在浮层/下拉/可交互表面谨慎使用，不作装饰。来源：Figma「图层样式」。**禁用 Tailwind 内置 `shadow-sm/md/lg`**——未映射公司 token，会漂。

| Token | 值 | 场景 |
|------|-----|------|
| `shadow-l1` | 两层：`0 2 6 -2` / `0 4 10 -4` | 浮层菜单、Dropdown — 最近层 |
| `shadow-l2` | 三层：`0 4 12 -4` / `0 8 20 -2` / `0 12 28 0` | Sheet、侧边滑出面板 — 中层 |
| `shadow-l3` | 三层：`0 6 16 -8` / `0 9 28 0` / `0 12 48 16` | Dialog、Modal — 最高层遮罩 |
| `shadow-l1-up` | 两层：`0 -2 6 -2` / `0 -4 10 -4` | 向上弹出的浮层（底部工具栏菜单） |

**计算方式**：一个 elevation token 由两到三层 `0 {y}px {blur}px {spread}px var(--fds-g-color-shadow-*)` 组成。近层保留落点，远层负责柔和扩散；调用方只选择一档，不叠加多个 elevation token。
- **颜色总开关** `--fds-g-color-shadow-default / soft / faint = 8% / 5% / 3%`：均从最深中性灰（带品牌色相微染）派生，**跟随色板**而非写死纯黑。
- **y 偏移 / blur / spread**：随层级升高，偏移和模糊增大；近层的负 spread 收住边缘，L3 最外层的正 spread 保证高层投影仍可见。
- `shadow-l1-up` 是 L1 的 y 取负方向变体；阴影只表达 elevation，不作装饰性边框。
- FDS 公开 elevation Hook 为 `--fds-g-shadow-elevation-1/2/3/1-up`；调用层继续使用映射后的 `shadow-l1/l2/l3/l1-up` utility。L1/L2/L3 已有真实消费者和视觉基线并为 stable；L1-up 在出现真实向上浮层消费者前保持 experimental。
