---
layer: knowledge
type: spec
last_verified: 2026-06-06
teaches: "fx-ui 标准后台页面布局规范：页面壳、标题区、筛选区、表格区、弹窗"
use_when: "AI 要生成公司后台页面、抽取页面 Blocks、或判断页面布局是否符合 fx-ui 规范时"
---

# fx-ui 布局规范

> 用途：从标准列表页 demo 沉淀公司后台页面的第一版布局规则。

## 标准列表页结构

后台列表页优先采用以下结构：

1. `PageShell`：页面外壳，控制全局背景、页面边距、最大宽度。
2. `PageHeader`：标题区，包含页面标题、说明、主操作。
3. `SearchToolbar`：筛选区，包含关键词、状态、类型、时间等筛选项，以及查询/重置。
4. 表格卡片：包含表格标题、辅助说明、批量/导出等操作、表格、分页。
5. 弹窗：新建/编辑用 `Dialog`，危险操作确认用 `ConfirmDangerDialog`。

## 间距规则

- 页面外边距：移动端 `px-4 py-6`，桌面端逐步增加到 `lg:px-8`。
- 页面最大宽度：后台工作台默认 `max-w-7xl`。
- 页面区块间距：默认 `gap-4`。
- 卡片内部使用 shadcn `Card` 自带 spacing，不额外写死大段 padding。

## 标题区规则

- 标题区底部用 `border-border` 分隔。
- 标题使用 `text-xl font-semibold`，避免营销页式大标题。
- 主操作按钮放右侧；移动端自然换行到标题下方。

## 筛选区规则

- 筛选区使用 `Card` 承载。
- 筛选项在桌面端横向网格排列，移动端自动单列/双列。
- 筛选项必须有可见 `Label`，不能只靠 placeholder。
- 查询为主按钮，重置为 outline。

## 表格区规则

- 表格放在 `Card` 内。
- 状态使用 `Badge`，不要只靠颜色表达含义。
- 行操作优先用 `DropdownMenu` 收纳。
- 危险操作必须二次确认。

## 弹窗规则

- 新建/编辑表单用 `Dialog`。
- 删除等危险操作用 `AlertDialog` 组合出的 `ConfirmDangerDialog`。
- 表单字段使用可见 `Label`，操作区放底部。
