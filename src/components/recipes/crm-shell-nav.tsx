"use client"

import { useState } from "react"

import {
  NavRail, NavRailItem,
  NavMenu, NavMenuHeader, NavMenuSearch, NavMenuList, NavMenuGroupLabel, NavMenuItem, NavMenuFooter,
} from "@/components/fx/nav-menu"
import {
  MessageCircleIcon, MessageCircleFilledIcon,
  ChartPieIcon, ChartPieFilledIcon,
  BriefcaseIcon, BriefcaseFilledIcon,
  CheckCircleIcon, CheckCircleFilledIcon,
  CalendarIcon, CalendarFilledIcon,
  SchoolIcon, SchoolFilledIcon,
  LayoutGridIcon, LayoutGridFilledIcon,
  SettingsIcon, HomeIcon, StarIcon, BellIcon,
  BuildingIcon, MapPinIcon, ReportMoneyIcon, UserIcon, TargetIcon, DatabaseIcon,
} from "@/lib/icons"

// Recipe（可搬运范例）：CRM 应用外壳导航 = 一级应用栏(NavRail) + 二级菜单(NavMenu) 的规范组合。
// 复用导航文档页 comboDemo 的成形用法，全套折叠/固定/hover 展开/选中交互；只换数据。
// app-shell 里齐平显示（rounded-none + 右分割线）。要别的应用换 railApps/菜单数据即可，不要重写结构。
function CrmShellNav() {
  const [selected, setSelected] = useState("客户")
  const [open, setOpen] = useState<Record<string, boolean>>({ cust: true })
  const [pinned, setPinned] = useState(true)
  const [hovered, setHovered] = useState(false)
  const [railApp, setRailApp] = useState("crm")
  const c = !pinned && !hovered
  const railApps = [
    { id: "qx", icon: <MessageCircleIcon />, activeIcon: <MessageCircleFilledIcon />, label: "企信" },
    { id: "crm", icon: <ChartPieIcon />, activeIcon: <ChartPieFilledIcon />, label: "CRM" },
    { id: "work", icon: <BriefcaseIcon />, activeIcon: <BriefcaseFilledIcon />, label: "工作" },
    { id: "todo", icon: <CheckCircleIcon />, activeIcon: <CheckCircleFilledIcon />, label: "待办" },
    { id: "cal", icon: <CalendarIcon />, activeIcon: <CalendarFilledIcon />, label: "日程" },
    { id: "train", icon: <SchoolIcon />, activeIcon: <SchoolFilledIcon />, label: "培训助手" },
    { id: "more", icon: <LayoutGridIcon />, activeIcon: <LayoutGridFilledIcon />, label: "更多" },
  ]
  const custChildren = [
    { label: "客户", icon: <BuildingIcon /> },
    { label: "客户地址", icon: <MapPinIcon /> },
    { label: "客户财务信息", icon: <ReportMoneyIcon /> },
    { label: "联系人", icon: <UserIcon /> },
    { label: "商机", icon: <TargetIcon /> },
  ]
  return (
    <div className="flex h-full">
      <NavRail footer={<NavRailItem boxed icon={<SettingsIcon />} aria-label="设置" />}>
        {railApps.map((a) => (
          <NavRailItem key={a.id} icon={a.icon} activeIcon={a.activeIcon} label={a.label} active={railApp === a.id} onClick={() => setRailApp(a.id)} />
        ))}
      </NavRail>
      <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
        <NavMenu collapsed={c} className="rounded-none border-r border-border-subtle">
          <NavMenuHeader title="CRM" viewName="客户管理" collapsed={c} />
          <NavMenuSearch placeholder="搜索" onAdd={() => {}} collapsed={c} />
          <NavMenuList>
            <NavMenuItem icon={<HomeIcon />} label="首页" active={selected === "首页"} collapsed={c} onClick={() => setSelected("首页")} />
            <NavMenuItem icon={<StarIcon />} label="最近使用" active={selected === "最近使用"} collapsed={c} onClick={() => setSelected("最近使用")} />
            <NavMenuItem icon={<BellIcon />} label="CRM提醒" active={selected === "CRM提醒"} collapsed={c} onClick={() => setSelected("CRM提醒")} />
            <NavMenuItem icon={<CheckCircleIcon />} label="CRM待办" active={selected === "CRM待办"} collapsed={c} onClick={() => setSelected("CRM待办")} />
            {c ? (
              <>
                <NavMenuGroupLabel collapsed>客户及商机管理</NavMenuGroupLabel>
                {custChildren.map((cc) => (
                  <NavMenuItem key={cc.label} icon={cc.icon} label={cc.label} active={selected === cc.label} collapsed onClick={() => setSelected(cc.label)} />
                ))}
              </>
            ) : (
              <>
                <NavMenuItem expandable expanded={open.cust} label="客户及商机管理" onClick={() => setOpen((o) => ({ ...o, cust: !o.cust }))} />
                {open.cust && custChildren.map((cc) => (
                  <NavMenuItem key={cc.label} indent icon={cc.icon} label={cc.label} active={selected === cc.label} onClick={() => setSelected(cc.label)} />
                ))}
              </>
            )}
            <NavMenuItem icon={<ReportMoneyIcon />} label="订单及回款管理" active={selected === "订单及回款管理"} collapsed={c} onClick={() => setSelected("订单及回款管理")} />
            <NavMenuItem icon={<DatabaseIcon />} label="数据驾驶舱" active={selected === "数据驾驶舱"} collapsed={c} onClick={() => setSelected("数据驾驶舱")} />
          </NavMenuList>
          <NavMenuFooter collapsed={c} pinned={pinned} onToggle={() => setPinned(false)} onPin={() => setPinned(true)} />
        </NavMenu>
      </div>
    </div>
  )
}

export { CrmShellNav }
