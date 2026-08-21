import { Fragment, useState, type ReactNode } from "react"

import { Avatar, AvatarFallback, AvatarImage, avatarInitials } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Pagination } from "@/components/ui/pagination"
import { Progress } from "@/components/ui/progress"
import { Tag } from "@/components/ui/tag"
import { CrmAppShell, type CrmAppShellFrame } from "@/components/recipes/crm-app-shell"
import { DataTable, type Column, type DataTableDensity } from "@/components/recipes/data-table"
import { ListPageHeader } from "@/components/recipes/list-page-header"
import { ListToolbar } from "@/components/recipes/list-toolbar"
import { PageLead } from "@/components/fx/page-lead"
import { docsSpacing } from "@/lib/docs-spacing"
import {
  LayoutColumnsIcon,
  LayoutGridIcon,
  MapPinIcon,
  MoreHorizontalIcon,
  PlusIcon,
  RefreshIcon,
  ListIcon,
  SettingsIcon,
  Trash2Icon,
} from "@/lib/icons"
import { cn } from "@/lib/utils"

export type CustomerListTemplateLang = "zh" | "en"

type TplCustomer = {
  id: number
  name: string
  level: string
  levelColor: "amber" | "red" | "blue"
  progress: number
  progressTone: "success" | "warning" | "default"
  flag: string
  phone: string
  owner: string
  avatar: string
}

const tplCustomers: TplCustomer[] = [
  { id: 1, name: "三门峡嘉浩咨询有限公司", level: "VIP客户", levelColor: "amber", progress: 100, progressTone: "success", flag: "🇨🇳", phone: "+86 15201123044", owner: "孙婉茹", avatar: "/avatars/01.jpg" },
  { id: 2, name: "广西思锐建筑工作室", level: "VIP客户", levelColor: "amber", progress: 0, progressTone: "default", flag: "🇨🇳", phone: "+86 15001171032", owner: "吴彦琛", avatar: "/avatars/02.jpg" },
  { id: 3, name: "芜湖磊昇传播科技有限公司", level: "重要客户", levelColor: "red", progress: 0, progressTone: "default", flag: "🇨🇳", phone: "+86 13071032601", owner: "李婉婷", avatar: "/avatars/03.jpg" },
  { id: 4, name: "商丘运昭可哲食品有限公司", level: "一般客户", levelColor: "blue", progress: 100, progressTone: "success", flag: "🇨🇳", phone: "+86 13071032601", owner: "冯远海", avatar: "/avatars/04.jpg" },
  { id: 5, name: "台州众悦贸易有限公司", level: "一般客户", levelColor: "blue", progress: 60, progressTone: "warning", flag: "🇺🇸", phone: "+27 5001171032", owner: "周琳", avatar: "/avatars/05.jpg" },
  { id: 6, name: "佳木斯晶森科技有限公司", level: "重要客户", levelColor: "red", progress: 100, progressTone: "success", flag: "🇫🇷", phone: "+86 15001171032", owner: "冯远海", avatar: "/avatars/06.jpg" },
  { id: 7, name: "乌兰察布旭图互动科技有限公司", level: "一般客户", levelColor: "blue", progress: 40, progressTone: "warning", flag: "🇨🇳", phone: "+86 13071032601", owner: "周南", avatar: "/avatars/01.jpg" },
  { id: 8, name: "济宁金源网络科技有限公司", level: "一般客户", levelColor: "blue", progress: 0, progressTone: "default", flag: "🇩🇪", phone: "+86 15001171032", owner: "李婉婷", avatar: "/avatars/02.jpg" },
]

const tplViews = [
  { value: "list", label: "列表", icon: <ListIcon /> },
  { value: "grid", label: "看板", icon: <LayoutGridIcon /> },
  { value: "map", label: "地图", icon: <MapPinIcon /> },
  { value: "split", label: "分栏", icon: <LayoutColumnsIcon /> },
]

const tplScopes = [
  { key: "name", label: "客户名称" },
  { key: "owner", label: "负责人" },
  { key: "phone", label: "电话" },
]

const tplColMenu = [{ label: "冻结此列" }, { label: "筛选" }]

const customerColumns: Column<TplCustomer>[] = [
  { key: "name", header: "客户名称", sortable: true, sortValue: (customer) => customer.name, menuActions: tplColMenu, cell: (customer) => <a href="#template-customer-list" className="text-foreground hover:text-link hover:underline">{customer.name}</a> },
  { key: "level", header: "客户级别", sortable: true, sortValue: (customer) => customer.level, menuActions: tplColMenu, cell: (customer) => <Tag color={customer.levelColor}>{customer.level}</Tag> },
  { key: "progress", header: "跟进进度", dataType: "percentage", headClassName: "w-40", sortable: true, sortValue: (customer) => customer.progress, menuActions: tplColMenu, cell: (customer) => <span className="flex items-center justify-end gap-2"><Progress value={customer.progress} tone={customer.progressTone} className="w-[60px]" trackClassName="h-1" /><span className="w-9 shrink-0 text-sm tabular-nums text-muted-foreground">{customer.progress}%</span></span> },
  { key: "phone", header: "电话", dataType: "identifier", menuActions: tplColMenu, cell: (customer) => <span className="inline-flex items-center gap-1.5"><span>{customer.flag}</span>{customer.phone}</span> },
  { key: "owner", header: "负责人", menuActions: tplColMenu, cell: (customer) => <span className="inline-flex items-center gap-1.5"><Avatar className="size-5"><AvatarImage src={customer.avatar} alt={customer.owner} /><AvatarFallback colorful>{avatarInitials(customer.owner)}</AvatarFallback></Avatar>{customer.owner}</span> },
]

export type CustomerListFrameProps = {
  blocks?: CustomerListBlockId[]
  columnSet?: "standard" | "essential"
  frame?: CrmAppShellFrame
  density?: DataTableDensity
  height?: number
  permission?: "editable" | "readonly"
  rowActions?: "show" | "hide"
  title?: string
  builder?: { selected: CustomerListBlockId | "page"; onSelect: (block: CustomerListBlockId) => void; onRemove: (block: CustomerListBlockId) => void }
}

export const customerListBlockIds = ["topbar", "navigation", "header", "toolbar", "customer-list"] as const
export type CustomerListBlockId = (typeof customerListBlockIds)[number]
const customerListBlockLabels: Record<CustomerListBlockId, string> = { topbar: "顶栏", navigation: "侧边导航", header: "页面头部", toolbar: "筛选工具栏", "customer-list": "客户列表" }

export function CustomerListFrame({ blocks = [...customerListBlockIds], builder, columnSet = "standard", frame = "inset", density = "default", height, permission = "editable", rowActions = "show", title = "客户" }: CustomerListFrameProps) {
  const [query, setQuery] = useState("")
  const [scope, setScope] = useState("name")
  const [view, setView] = useState("list")
  const [headerView, setHeaderView] = useState("all")
  const [selected, setSelected] = useState<Set<string | number>>(new Set())
  const renderBuilderBlock = (block: CustomerListBlockId, content: ReactNode, layout: "topbar" | "navigation" | "content") => {
    if (!builder) return content
    const blockSelected = builder.selected === block
    return <div key={block} data-builder-block={block} data-builder-label={customerListBlockLabels[block]} data-selected={blockSelected || undefined} tabIndex={0} className={cn("relative before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:z-20 before:h-0.5 after:pointer-events-none after:absolute after:inset-0 after:z-[1] hover:before:bg-primary hover:after:ring-2 hover:after:ring-inset hover:after:ring-primary focus-visible:outline-none focus-visible:before:bg-primary focus-visible:after:ring-2 focus-visible:after:ring-inset focus-visible:after:ring-primary", layout === "navigation" ? "h-full shrink-0" : layout === "content" && block === "customer-list" ? "min-h-0 flex-1" : "shrink-0", blockSelected && "before:bg-primary after:ring-2 after:ring-inset after:ring-primary")} onClick={() => builder.onSelect(block)} onKeyDown={(event) => { if (event.currentTarget === event.target && (event.key === "Delete" || event.key === "Backspace")) builder.onRemove(block) }}>
      {content}
      {blockSelected && <Button variant="destructive" size="icon-sm" aria-label={`删除${customerListBlockLabels[block]}`} className="absolute top-1 left-1 z-10" onClick={(event) => { event.stopPropagation(); builder.onRemove(block) }}><Trash2Icon /></Button>}
    </div>
  }

  return (
    <CrmAppShell frame={frame} height={height} topBar={blocks.includes("topbar")} navigation={blocks.includes("navigation")} renderChrome={builder ? (slot, content) => renderBuilderBlock(slot, content, slot) : undefined}>
      {blocks.map((block) => {
        let content: ReactNode
        if (block === "topbar" || block === "navigation") return null
        if (block === "header") content = <ListPageHeader
          title={title}
          views={[{ key: "all", label: "全部客户" }, { key: "mine", label: "我负责的" }, { key: "sub", label: "下属负责的" }]}
          view={headerView}
          onViewChange={setHeaderView}
          actions={permission === "editable" ? <><Button size="sm"><PlusIcon data-icon="inline-start" />新建</Button><Button variant="outline" size="sm">智能表单</Button><Button variant="outline" size="sm">导入</Button><Button variant="outline" size="icon-sm" aria-label="更多"><MoreHorizontalIcon /></Button></> : undefined}
        />
        else if (block === "toolbar") content = <ListToolbar
          search={query}
          onSearchChange={setQuery}
          scope={scope}
          scopes={tplScopes}
          onScopeChange={setScope}
          view={view}
          views={tplViews}
          onViewChange={setView}
          onFilter={() => {}}
          actions={<><Button variant="ghost" size="icon-sm" aria-label="显示设置" className="[&_svg]:size-3.5"><SettingsIcon /></Button><Button variant="ghost" size="icon-sm" aria-label="刷新" className="[&_svg]:size-3.5"><RefreshIcon /></Button></>}
        />
        else if (block === "customer-list") content = <div className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 overflow-auto px-3">
            <DataTable columns={columnSet === "essential" ? customerColumns.filter((column) => ["name", "level", "owner"].includes(String(column.key))) : customerColumns} data={tplCustomers} rowKey={(customer) => customer.id} selectable={permission === "editable"} selected={selected} onSelectedChange={setSelected} density={density} rowActions={rowActions === "show" ? () => <span className="flex items-center gap-3"><Button variant="plain" tone="info" size="sm">查看</Button>{permission === "editable" && <Button variant="plain" tone="info" size="sm">编辑</Button>}</span> : undefined} />
          </div>
          <div className="mx-3 flex shrink-0 items-center justify-between border-t border-border-subtle py-2.5">
            <span className="text-sm text-muted-foreground">已选 {selected.size} 项</span>
            <Pagination page={1} total={193} pageSize={20} onPageChange={() => {}} />
          </div>
        </div>
        else return null
        if (!builder) return <Fragment key={block}>{content}</Fragment>
        return renderBuilderBlock(block, content, "content")
      })}
    </CrmAppShell>
  )
}

export function CustomerListTemplate({ actions, lang }: { actions: ReactNode; lang: CustomerListTemplateLang }) {
  return (
    <div className={docsSpacing.pageStack}>
      <section id="template-customer-list" className="flex flex-col gap-2">
        <PageLead
          crumb={lang === "en" ? "Pages / List page" : "页面 / 列表页"}
          title={lang === "en" ? "List page" : "列表页"}
          lead={lang === "en" ? "A full CRM list page assembled entirely from existing components — top bar, nav, page header, toolbar, table and pagination." : "完全用现有组件拼出的 CRM 列表页：顶栏 + 导航 + 页头 + 工具栏 + 表格 + 分页，演示组件如何组装成真实页面。"}
          actions={actions}
        />
      </section>
      <CustomerListFrame />
    </div>
  )
}
