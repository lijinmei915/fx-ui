---
layer: governance
type: spec
last_verified: 2026-06-26
teaches: "fx-ui 页面装配 playbook：怎么拼出一个页面才不出错（拼装现成 block，不现拼）"
use_when: "要生成 / 改造任意页面（列表页、表单页、详情页、看板…）前，先按这套流程走"
---

# 页面装配 Playbook

> 用途：定死"怎么装配一个页面"的固定流程。**页面不靠"现拼"，靠"拼装现成 block + 组件"**——照流程走，生成任意页面都不出错（不手搓、不覆盖、复用现成）。
> 产物住哪/谁 check 见 `docs/MAP.md`；布局尺寸见 `docs/LAYOUTS.md`；行为红线见 `AGENTS.md`。

## 装配流程

每次按这 6 步走，不跳步：

1. **选外壳**：整页 app 外壳/后台页 → fx 组件 `Layout`（`src/components/fx/layout.tsx`）；内容区分栏 → 24 列栅格工具类（DEC-010）。不自己拼壳。
2. **选区块（block/recipe）**：从 `src/components/recipes/` 挑同场景的成形区块，**整段搬运**（导航用 `CrmShellNav`）。有同类区块就别从零拼。
3. **选组件**：区块里的元素只用现有 ui/fx 组件（`Table`/`Tag`/`Progress`/`Pagination`/`Avatar`…），用 **props/variant** 表达差异，**不在调用处用 className 覆盖组件外观**（红线 7）。
4. **填数据**：只换数据 props，结构照搬，一个范例里没有的 className 都别加（红线 6/7）。
5. **登记路由**：`pageRegistry`（`src/App.tsx`，DEC-023）加一行 + `docsNav` 导航项；整页外壳类加 `fullBleed`。详见 `docs/MAP.md`「页面/路由」。
6. **双检查收尾**：`bash scripts/check-all.sh` 全绿 **且** `npm run test:visual` 看截图无多余缝隙/圆角/漂移，才算完成。

## 决策树

- **已有同类型 block/recipe** → 直接拼，只换数据。
- **没有同类型** → 先按下方「沉淀一个 block」把它做成 recipe，**再**拼。**不要现拼一次性页面**。
- **缺基础能力（库里没有的组件）** → 标「需沉淀为组件」交给用户，**不手搓填补**。

## 沉淀一个 block

新页面类型没有现成区块时，先沉淀，再用：

- 位置 `src/components/recipes/<name>.tsx`；内部**只组合现有组件、只用 token**。
- 把该场景的交互（选中/折叠/分页/筛选等）内置好，对外只暴露**数据 props**。
- 登记 `docs/ARCHITECTURE.md` 的 Blocks/Recipes 层（以后补视觉基线）。

## 可用区块

> 随沉淀更新。候选（未落地）：`ListPageBlock` / `FormBlock` / `DetailBlock` / `DashboardBlock`。

| 区块 | 文件 | 用途 |
|------|------|------|
| `CrmAppShell` | `src/components/recipes/crm-app-shell.tsx` | CRM 整页外壳：TopBar + 双层导航 + 内容卡插槽；页面只塞 children |
| `CrmShellNav` | `src/components/recipes/crm-shell-nav.tsx` | CRM 双层导航（NavRail 一级 + NavMenu 二级，含折叠/固定/选中）；已被 CrmAppShell 内置 |
| 客户列表页模板 | `src/App.tsx` `CustomerListTemplate`（内容部分待抽成 `ListPageBlock`） | 列表页范例：`CrmAppShell` 外壳 + 工具栏 + 表格 + 分页 |

## 正反例

- ✅ 列表页 = `CrmAppShell` 外壳 + 现有 `Table`/`Tag`/`Progress`/`Pagination`，只换 children 与数据。
- ❌ 给 `NavMenu` 加 `rounded-none` 改外观、外层加范例没有的 `gap`、现拼一个裸 div 表格。
