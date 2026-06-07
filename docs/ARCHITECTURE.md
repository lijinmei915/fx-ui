---
layer: knowledge
type: architecture
last_verified: 2026-06-06
teaches: "fx-ui 的三层生产体系：基础组件、公司组合组件、页面 Blocks/布局规范"
use_when: "AI 要判断 fx-ui 未来如何统一公司组件、生成页面、沉淀布局规范时"
---

# fx-ui 架构方向

> 用途：记录 fx-ui 不只是组件库，而是公司级 AI 可读前端生产体系。

## 总目标

fx-ui 的目标不是重新手写一套 UI 组件库，而是建立一套公司级前端生产体系：

- 基础控件统一
- 公司视觉统一
- 页面可以快速生成
- 生成后的页面可以继续改造
- 高频页面模式可以沉淀成公司的布局规范和内部 Blocks

## 三层体系

### 1. 基础组件层：shadcn/ui

目录建议：`src/components/ui/`

这一层只放 shadcn/ui 拉下来的 open-code 组件。

- 通过 `npx shadcn@latest add <component>` 获取
- 不手写 Button / Input / Dialog / Table 等基础控件
- 不做黑盒封装
- 公司视觉通过 `theme/fx-theme.css` 注入 token

这一层解决：基础控件统一、源码可读、AI 可消费。

### 2. 公司组合组件层：fx components

目录建议：`src/components/fx/`

这一层沉淀公司高频业务模式，但底层仍然由 shadcn 组件组合而成。

候选组件：

- `PageHeader`：页面标题、描述、面包屑、主操作
- `SearchToolbar`：筛选项、搜索框、查询、重置
- `EntityTable`：表格、分页、批量操作、行操作
- `FormSection`：表单分组、标题、说明、操作区
- `EmptyState`：空状态
- `ConfirmDangerDialog`：危险操作确认弹窗
- `PageShell`：后台页面外壳

这一层解决：公司业务组件统一、常见交互模式统一。

### 3. 页面 Blocks / 布局规范层

目录建议：`src/blocks/`、`src/layouts/`、`docs/LAYOUTS.md`

这一层用于快速生成完整页面，并从真实页面里抽出公司的布局规范。

候选 Blocks：

- `ListPageBlock`：列表页，含筛选、表格、分页、批量操作
- `EditFormBlock`：新建/编辑表单页
- `DetailPageBlock`：详情页
- `DashboardBlock`：数据看板页
- `AuthBlock`：登录/注册页
- `SettingsBlock`：设置页
- `MasterDetailBlock`：主从结构页

这一层解决：页面快速起步、页面模式复用、公司布局规范沉淀。

## 推荐目录边界

```txt
src/
  components/
    ui/              # shadcn 原子组件，CLI 拉取
    fx/              # 公司组合组件，由 shadcn 组合而成
  blocks/            # 公司页面模板
  layouts/           # 页面壳、侧边栏布局、主内容布局
theme/
  fx-theme.css       # 公司 token 真相源
registry/
  fx-theme.json      # shadcn 官方 registry:theme 分发格式
docs/
  components/        # 组件文档资产，给人和 AI 共同消费
  TOKENS.md          # token 查询表
  ARCHITECTURE.md    # 三层体系与路线
  LAYOUTS.md         # 未来沉淀公司布局规范
  BLOCKS.md          # 未来记录内部 Blocks 使用方式
```

## 落地路线

第一阶段先做一个小闭环：

1. 继续拉 shadcn 基础组件：`card input dialog table form tabs badge separator`
2. 做一个标准后台列表页 demo：标题区 + 筛选区 + 表格区 + 新建弹窗
3. 从 demo 里抽出 `PageHeader`、`SearchToolbar`、`ConfirmDangerDialog`、`PageShell`
4. 把页面间距、标题区、筛选区、表格区、操作区规则写入 `docs/LAYOUTS.md`
5. 再扩展详情页、编辑页、设置页、Dashboard 等内部 Blocks

## 关键原则

- 基础组件不手写，优先从 shadcn 拉
- 页面不从零写，优先从 shadcn Blocks / v0 / 内部 Blocks 起步
- 公司组合组件可以写，但必须是 shadcn 组件的可读组合
- token 真相源仍然是 `theme/fx-theme.css`
- 对外分发主题时使用 shadcn 官方 `registry:theme` 格式：`registry/fx-theme.json`
- 布局规范来自真实页面沉淀，不凭空制定
