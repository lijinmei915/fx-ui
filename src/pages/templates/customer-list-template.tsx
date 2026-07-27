import { useState, type ReactNode } from "react"

import { Avatar, AvatarFallback, AvatarImage, avatarInitials } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Pagination } from "@/components/ui/pagination"
import { Progress } from "@/components/ui/progress"
import { Tag } from "@/components/ui/tag"
import { CrmAppShell } from "@/components/recipes/crm-app-shell"
import { DataTable, type Column } from "@/components/recipes/data-table"
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
} from "@/lib/icons"

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

export function CustomerListTemplate({ actions, lang }: { actions: ReactNode; lang: CustomerListTemplateLang }) {
  const [query, setQuery] = useState("")
  const [scope, setScope] = useState("name")
  const [view, setView] = useState("list")
  const [headerView, setHeaderView] = useState("all")
  const [selected, setSelected] = useState<Set<string | number>>(new Set())

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

      <CrmAppShell>
        <ListPageHeader
          title="客户"
          views={[{ key: "all", label: "全部客户" }, { key: "mine", label: "我负责的" }, { key: "sub", label: "下属负责的" }]}
          view={headerView}
          onViewChange={setHeaderView}
          actions={<><Button size="sm"><PlusIcon data-icon="inline-start" />新建</Button><Button variant="outline" size="sm">智能表单</Button><Button variant="outline" size="sm">导入</Button><Button variant="outline" size="icon-sm" aria-label="更多"><MoreHorizontalIcon /></Button></>}
        />
        <ListToolbar
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
        <div className="min-h-0 flex-1 overflow-auto px-3">
          <DataTable columns={customerColumns} data={tplCustomers} rowKey={(customer) => customer.id} selectable selected={selected} onSelectedChange={setSelected} rowActions={() => <span className="flex items-center gap-3"><Button variant="plain" tone="info" size="sm">查看</Button><Button variant="plain" tone="info" size="sm">编辑</Button></span>} />
        </div>
        <div className="mx-3 flex shrink-0 items-center justify-between border-t border-border-subtle py-2.5">
          <span className="text-sm text-muted-foreground">已选 {selected.size} 项</span>
          <Pagination page={1} total={193} pageSize={20} onPageChange={() => {}} />
        </div>
      </CrmAppShell>
    </div>
  )
}
