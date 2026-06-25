"use client"

import { useState, type ReactNode } from "react"

import {
  TopBar, TopBarBrand, TopBarDivider, TopBarApps, TopBarSearch, TopBarActions, TopBarIconButton, TooltipProvider,
} from "@/components/fx/top-bar"
import { CrmShellNav } from "@/components/recipes/crm-shell-nav"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { MessageCircleIcon, BellIcon, HelpIcon } from "@/lib/icons"

// Recipe（可搬运外壳）：CRM 应用外壳 = TopBar 顶栏 + CrmShellNav 双层导航 + 内容卡插槽。
// 固定 chrome（顶栏/导航/头像菜单）都在这里，页面只往 children 里塞内容（页头/工具栏/表格…）。
// 灰底 + 圆角白卡浮起布局；外壳本身不写死页面内容，换页面只换 children。
const shellApps = [
  { key: "crm", label: "CRM" },
  { key: "marketing", label: "营销通" },
  { key: "service", label: "服务通" },
  { key: "bi", label: "BI 智能分析" },
]
const shellScopes = [
  { key: "all", label: "全部" },
  { key: "cust", label: "客户" },
  { key: "contact", label: "联系人" },
]

function CrmAppShell({ children, height = 600 }: { children: ReactNode; height?: number }) {
  const [app, setApp] = useState("crm")
  const [q, setQ] = useState("")
  const [scope, setScope] = useState("all")
  return (
    <TooltipProvider>
      <div className="overflow-hidden rounded-xl border border-border bg-background shadow-l1">
        <TopBar>
          <TopBarBrand logo={<img src="/LOGO.svg" alt="" className="size-5 shrink-0 object-contain" />} name="北京易动纷享科技有限责任公司" />
          <TopBarDivider />
          <TopBarApps current={shellApps.find((a) => a.key === app)!.label} apps={shellApps} onSelect={setApp} />
          <TopBarSearch value={q} onValueChange={setQ} scope={scope} scopes={shellScopes} onScopeChange={setScope} placeholder="搜索" />
          <TopBarActions>
            <TopBarIconButton icon={<MessageCircleIcon />} label="企信" count={3} />
            <TopBarIconButton icon={<BellIcon />} label="CRM提醒" dot />
            <TopBarIconButton icon={<HelpIcon />} label="帮助" />
          </TopBarActions>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Avatar className="size-8 cursor-pointer outline-none transition-opacity hover:opacity-90 focus-visible:ring-3 focus-visible:ring-ring/50">
                  <AvatarImage src="/avatars/01.jpg" alt="李明" />
                  <AvatarFallback colorful>李</AvatarFallback>
                </Avatar>
              }
            />
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem>个人中心</DropdownMenuItem>
              <DropdownMenuItem>账号设置</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive">退出登录</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TopBar>

        {/* 灰底 + 圆角白卡浮起：rail / 二级菜单卡 / 内容卡之间留一致灰槽 */}
        <div className="flex min-h-0 gap-2 py-2 pr-2" style={{ height }}>
          <CrmShellNav />
          <div className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-lg bg-card">{children}</div>
        </div>
      </div>
    </TooltipProvider>
  )
}

export { CrmAppShell }
