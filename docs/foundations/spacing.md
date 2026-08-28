---
layer: knowledge
type: spec
last_verified: 2026-08-28
teaches: "FDS 间距、尺寸与表格行高规则"
use_when: "查询 spacing、control size、内外边距或表格行高时"
---

# FDS 间距与尺寸规范

> 本文是 FDS Foundation 专题说明；数值与映射的唯一真相源仍是 `tokens/source/*.tokens.json`。总览见 [设计 Token](../TOKENS.md)，统一目录见 [FDS 文档索引](../INDEX.md)。

## 间距

间距的数值真相由 `--fx-space-*` 基础刻度保存，Tailwind spacing utilities 仍是调用方式。页面使用 `gap-* / p-* / m-* / space-*`，不直接写 `var(--fx-space-*)`；框架适配器负责把对应工具类或布局属性映射到同一基础刻度。

**计算方式**：以 4px 为主网格，`gap-4 = 16px`、`gap-6 = 24px`。2/6/10px 是为图标与紧凑控件保留的受控物理补档；1px 归边框宽度体系，未被真实场景消费的 3/5/7/9/11px 不进入间距刻度。padding / margin / gap 共用同一套数值，一律用已映射的工具类、不手写任意 px。

| 基础 Token | Tailwind 调用 | 值 | 使用场景 |
|------|------|-----|----------|
| `--fx-space-0` | `gap-0` | `0px` | 无间距、紧贴、去掉默认间隙 |
| `--fx-space-2` | `gap-0.5` | `2px` | 极紧凑：图标与文字、徽标内部 |
| `--fx-space-4` | `gap-1` | `4px` | 紧凑图标、微小内部间隔 |
| `--fx-space-8` | `gap-2` | `8px` | 按钮图标、表单项内部间隔 |
| `--fx-space-12` | `gap-3` | `12px` | 章节标题与说明之间 |
| `--fx-space-16` | `gap-4` | `16px` | 卡片内容、表单字段之间 |
| `--fx-space-20` | `gap-5` | `20px` | 章节标题组与主体内容之间 |
| `--fx-space-24` | `gap-6` | `24px` | 页面区块、小型章节之间 |
| `--fx-space-40` | `gap-10` | `40px` | 文档章节、主内容分组之间 |

## 表格行高

表格行高单独治理，不直接复用通用控件高度。当前 `Table` 的三档真实值为：

| Token | 值 | 场景 |
|------|-----|------|
| `--fx-table-row-height-compact` | `28px` | 紧凑列表、信息密度高的表格 |
| `--fx-table-row-height-default` | `36px` | 默认表格行高 |
| `--fx-table-row-height-comfortable` | `42px` | 宽松列表、需要更强可读性的表格 |

这三个历史结构变量已由 Table 公开 Hook 接管：默认、compact、comfortable 分别使用 `--fds-c-table-sizing-cell-block`、`--fds-c-table-sizing-cell-block-compact`、`--fds-c-table-sizing-cell-block-comfortable`。新框架适配器读取 Component contract，不读取 React 内部 `--fx-table-*` 名称。
