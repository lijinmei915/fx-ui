---
layer: governance
type: spec
last_verified: 2026-08-21
teaches: "fx-ui 页面装配 playbook：怎么拼出一个页面才不出错（拼装现成 block，不现拼）"
use_when: "要生成 / 改造任意页面（列表页、表单页、详情页、看板…）前，先按这套流程走"
---

# 页面装配 Playbook

> 用途：定死"怎么装配一个页面"的固定流程。**页面不靠"现拼"，靠"拼装现成 block + 组件"**——照流程走，生成任意页面都不出错（不手搓、不覆盖、复用现成）。
> 产物住哪/谁 check 见 `docs/MAP.md`；布局尺寸见 `docs/LAYOUTS.md`；行为红线见 `AGENTS.md`。

## 列表页：直接跑生成器（最稳，不靠手拼）

做**列表页**别从零拼——跑脚手架，结构按固定模板吐出，你只填 columns/数据 → 结构层零跑偏：

```bash
npm run gen:list-page -- --name 订单 --slug order
```

它生成 `src/pages/<slug>-list.tsx`（已拼好 `CrmAppShell + ListPageHeader + ListToolbar + DataTable + Pagination`），并打印要在 `src/lib/page-registry-config.tsx` 接的 registry 行，以及在 `src/lib/site-navigation.ts` 接的 `docsNav` 项。接好后**只改 `columns`/`rows`**，跑 `check:all` + `test:visual`。其它页型暂无生成器 → 走下面的通用 6 步。

> **强制**：`src/pages/` 里手写列表页（用了 `ListToolbar` + `DataTable` 却没 `@generated fx-ui:list-page` 标记）会被 `scripts/check-list-page-source.mjs` 拦下——列表页只能由生成器产出。

Agent 先查询受控 Build Kit，再执行已登记的生成器；列表页、编辑表单页和详情页均处于 `ready`，不得绕过生成器临时拼装页面。

```bash
npm run fx -- build list --json
```

### 列表页视觉校准：只比较已声明的 Block 变体

客户列表是列表页的真实视觉基线。需要评审背景层次或扫描密度时，进入 `#customer-list-calibration`，在**真实** `CustomerListFrame` 上比较已声明的候选项：

- `CrmAppShell.frame`：`inset` / `continuous`，只决定内容工作区是否保留内层卡片轮廓；外层网站卡片和 token 不变。搭建器需要直接操作页面 chrome 时，使用 `topBar`、`navigation` 与 `renderChrome` 控制既有 TopBar / CrmShellNav，不复制其结构。
- `DataTable.density`：`default` / `compact`，只透传现有 shadcn `Table` 的行高密度。

它不是自由 CSS 编辑器，不提供任意颜色、圆角、阴影或像素间距。评审选定一个候选组合后，必须回写到拥有它的 Block（跨页面）或页面配置（仅本页），更新视觉基线并运行 `check:all` + `test:visual`；如果候选需要改全局语义色/间距 token，按 token 真相源流程处理。

## 装配流程（无生成器的页型走这个）

每次按这 6 步走，不跳步：

1. **选外壳**：整页 app 外壳/后台页 → fx 组件 `Layout`（`src/components/fx/layout.tsx`）；内容区分栏 → 24 列栅格工具类（DEC-010）。不自己拼壳。
2. **选区块（block）**：从 `src/components/recipes/`（文件夹历史名）挑同场景的成形区块，**整段搬运**（导航用 `CrmShellNav`）。有同类区块就别从零拼。
3. **选组件**：区块里的元素只用现有 ui/fx 组件（`Table`/`Tag`/`Progress`/`Pagination`/`Avatar`…），用 **props/variant** 表达差异，**不在调用处用 className 覆盖组件外观**（红线 7）。
4. **填数据**：只换数据 props，结构照搬，一个范例里没有的 className 都别加（红线 6/7）。
5. **登记路由**：`pageRegistry`（`src/lib/page-registry-config.tsx`，DEC-023）加一行 + `docsNav` 导航项；整页外壳类加 `fullBleed`。详见 `docs/MAP.md`「页面/路由」。
6. **双检查收尾**：`bash scripts/check-all.sh` 全绿 **且** `npm run test:visual` 看截图无多余缝隙/圆角/漂移，才算完成。

## 受控页面/区块搭建器

`#page-builder` 是顶栏“页面”旁的一级独立工作台，路由使用 `workspace` 外壳，不进入文档侧栏，也不渲染 PageLead、目录或文档内容限宽。标题旁的受控下拉在“页面搭建 / 基础组件评审 / 业务组件搭建”之间切换：页面模式组合已验证模板和 Block；基础组件评审模式消费外部 Agent 通过 MCP/CLI 提交的候选契约，负责真实预览、状态验收、受控 API 校正、检查与确认；业务组件模式从空白画布开始，通过搜索加入白名单组件并组织结构。三者都不是自由样式编辑器，不接受 JSX、CSS class 或任意样式值。统一真相源为 `docs/data/page-builder.manifest.json`。

首个客户列表 MVP 支持预设、空白页起步、可选 Block 添加/删除、上移/下移排序、标题/工作区/表格密度的受控属性编辑和真实 `CustomerListFrame` 预览。空白页是独立登记的模板，首次进入先选择 Agent 或手动搭建；手动模式只能选择 manifest 登记的骨架与插入区，组件库按业务区块、基础组件、已保存区块分层，新增区块后自动成为当前配置对象。Agent 先给出受控操作摘要，确认后与手动编辑共用同一条 operation/撤销管线。以后可增加拖拽排序手势，但不能扩大已登记的可组合范围。

基础组件评审 MVP 默认加载待评审的外部 Agent 候选。左侧只展示候选、来源与预期产物；中间使用 manifest 登记的安全预览适配器渲染真实组件与默认、禁用、加载、图标等状态；右侧只开放真实组件已有的 variant、size 和候选 Props。修改要求只生成结构化返工任务，未配置连接器时不伪称已发送或已修改代码。组件 API、token、交互/无障碍与视觉检查通过后，用户才能确认进入 Playground 和入库审核；确认动作仍不直接覆盖 `src/components/ui/*`。

业务组件搭建默认是空白画布。左侧在“组件 / 图层”间切换：“组件”不默认展开长清单，而是搜索 `components.manifest.json` 中全部 ui/fx 组件后只展示匹配结果；已登记适配项使用受治理的默认实例直接加入画布，不要求先连接业务数据，其他匹配组件只汇总为一条待支持提示，不生成不可用节点。首批默认实例覆盖 Button、Input、Checkbox、Switch、Tag、Avatar、Separator、Select、Textarea、Badge、Slider、RadioGroup、Toggle、ToggleGroup、Link 和 Alert。图层树用于定位、排序和删除。画布支持单选、Shift 多选、成组与解组；右侧在未选中组件时配置 Auto Layout，选中组件后从 `component-playgrounds.manifest.json` 的真实 Playground contract 渲染经评审的实例属性；没有 Playground contract 的默认实例暂不显示虚构属性。属性可绑定为公开业务 Prop，并在发布前命名为唯一英文驼峰标识；实例值、公开名和默认值进入同一草稿与撤销历史。布局仍只开放 `none/xs/sm/md/lg` 间距档与横向/纵向方向，调用方不能输入像素或覆盖 token。组件命名后可直接保存到个人组件库；选择业务组件时只提交审核，审核通过后才进入公共 fx 组件体系。

## 决策树

- **已有同类型 block** → 直接拼，只换数据。
- **没有同类型** → 先按下方「沉淀一个 block」把它做出来，**再**拼。**不要现拼一次性页面**。
- **缺基础能力（库里没有的组件）** → 标「需沉淀为组件」交给用户，**不手搓填补**。

## 沉淀一个 block

新页面类型没有现成区块时，先沉淀，再用：

- 位置 `src/components/recipes/<name>.tsx`；内部**只组合现有组件、只用 token**。
- 把该场景的交互（选中/折叠/分页/筛选等）内置好，对外只暴露**数据 props**。
- 登记 `docs/ARCHITECTURE.md` 的「页面 Block 层」（以后补视觉基线）。

## block 怎么处理变体

block 既不能僵（不能变），也不能堆成 ProTable 那种 config 怪物。**分三层处理 + 一条铁律**：

1. **已知的小变化 → 开 props/slots（有限的轴）**：把"合理会变的部分"做成可选 prop/插槽。例：`DataTable` 的 `selectable?`/`columns`/`rowActions?`、`ListToolbar` 的 `scopes?`/`views?`/`actions`。不要某部分就不传，不靠改 block。
2. **内部组件长相不同 → 透传那个组件自己的 variant，不在 block 里覆盖**：如要紧凑表格，把 `Table` 已有的 `density` 暴露成 block 的 prop 透传下去，**不写 className 覆盖**（红线 7）。即"把内部组件已有的 variant 按需暴露成 block prop"。
3. **变化太大 → 降一层自己拼，不给 block 加第 20 个 flag**：离群案例直接用更小的块（`DataTable` + 自拼工具栏）或原子（`Table` 直接拼）。block 只覆盖**常见形态**。这条是和 ProTable 划清界限的关键。

> **铁律：变体轴按需加，不预先堆。** 第二个真实场景真要某个变体了才加那个 prop；凭空"万一要密度/排序/拖拽"全开 = 滑向 ProTable（同 N=1 不预先抽页面一个道理）。

## 可用区块

> 随沉淀更新。候选（未落地）：`ListPageBlock` / `FormBlock` / `DetailBlock` / `DashboardBlock`。

| 区块              | 文件                                                                    | 用途                                                                                                          |
| ----------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `CrmAppShell`     | `src/components/recipes/crm-app-shell.tsx`                              | CRM 整页外壳：TopBar + 双层导航 + 内容卡插槽；`frame` 仅开放 `inset` / `continuous` 两种已验证工作区层级      |
| `CrmShellNav`     | `src/components/recipes/crm-shell-nav.tsx`                              | CRM 双层导航（NavRail 一级 + NavMenu 二级，含折叠/固定/选中）；已被 CrmAppShell 内置                          |
| `DataTable`       | `src/components/recipes/data-table.tsx`                                 | 薄表格：勾选(全选/半选) + 行操作，中间列由 `columns` 驱动；`density` 透传 shadcn Table；受控、不引 TanStack   |
| `ListToolbar`     | `src/components/recipes/list-toolbar.tsx`                               | 列表页工具栏：筛选 + 复合搜索 + 视图切换 + 右侧动作，全受控配置化                                             |
| `ListPageHeader`  | `src/components/recipes/list-page-header.tsx`                           | 列表页标题栏：标题 + 可选视图下拉(`views?`) + 操作插槽(`actions` 0..N)                                        |
| `EditFormBlock`   | `src/components/recipes/edit-form-block.tsx`                            | schema 驱动编辑表单：字段默认值、必填校验、错误聚焦、提交 loading、脏状态取消                                 |
| `DetailPageBlock` | `src/components/recipes/detail-page-block.tsx`                          | 对象详情页：身份头、字段网格、Tabs、活动时间线、关联记录和空态                                                |
| 客户列表页模板    | `src/pages/templates/customer-list-template.tsx` `CustomerListTemplate` | 列表页范例 = `CrmAppShell` + `ListPageHeader` + `ListToolbar` + `DataTable` + `Pagination`，只换 columns/数据 |

`DataTable.Column` 的 `dataType` 管数据排版：`number / currency / percentage` 默认右对齐并使用等宽数字；`date / identifier` 左对齐、不换行且使用等宽数字；`status` 居中。普通 `text` 不必声明。名称或说明需要截断时，在真实列内容中显式使用 `truncate`，不要让表格 block 猜测。

## 正反例

- ✅ 列表页 = `CrmAppShell` 外壳 + 现有 `Table`/`Tag`/`Progress`/`Pagination`，只换 children 与数据。
- ❌ 给 `NavMenu` 加 `rounded-none` 改外观、外层加范例没有的 `gap`、现拼一个裸 div 表格。
