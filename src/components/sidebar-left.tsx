import {
  BookOpenIcon,
  BoxIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  DatabaseIcon,
  LayoutGridIcon,
  MessageSquareWarningIcon,
  NavigationIcon,
  SearchIcon,
  SettingsIcon,
  SparklesIcon,
} from "@/lib/icons"

import { Badge } from "@/components/ui/badge"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar"

const componentItems = ["Button", "Input", "Select", "Checkbox", "Switch", "Table", "Dialog", "Tooltip"]

const navGroups = [
  {
    title: "开始使用",
    icon: SparklesIcon,
    items: ["安装", "快速上手", "更新日志"],
  },
  {
    title: "基础组件",
    icon: BoxIcon,
    open: true,
    items: componentItems,
  },
  {
    title: "反馈组件",
    icon: MessageSquareWarningIcon,
    items: ["Alert", "Toast", "Progress"],
  },
  {
    title: "数据展示",
    icon: DatabaseIcon,
    items: ["Badge", "Card", "Tabs"],
  },
  {
    title: "布局组件",
    icon: LayoutGridIcon,
    items: ["Shell", "Sidebar", "Grid"],
  },
  {
    title: "导航组件",
    icon: NavigationIcon,
    items: ["Menu", "Breadcrumb", "Pagination"],
  },
  {
    title: "其他组件",
    icon: SettingsIcon,
    items: ["Skeleton", "Popover", "Sheet"],
  },
]

export function SidebarLeft({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" className="border-r" {...props}>
      <SidebarHeader className="gap-3 border-b border-sidebar-border p-4">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-primary">fx-ui</div>
          <Badge variant="outline">v1.2.0</Badge>
        </div>
        <div className="relative">
          <SidebarInput placeholder="搜索组件..." className="pr-8" />
          <SearchIcon className="pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup className="py-3">
          <SidebarGroupContent>
            <SidebarMenu>
              {navGroups.map((group) => {
                const Icon = group.icon

                return (
                  <SidebarMenuItem key={group.title}>
                    <SidebarMenuButton isActive={group.open}>
                      <Icon />
                      <span>{group.title}</span>
                      {group.open ? <ChevronDownIcon className="ml-auto" /> : null}
                    </SidebarMenuButton>
                    {group.open ? (
                      <SidebarMenuSub>
                        {group.items.map((item) => (
                          <SidebarMenuSubItem key={item}>
                            <SidebarMenuSubButton isActive={item === "Button"} render={<a href="#" />}>
                              <span>{item}</span>
                              {item === "Button" ? <ChevronRightIcon className="ml-auto size-4" /> : null}
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    ) : null}
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupLabel>Resources</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton render={<a href="#" />}>
                  <BookOpenIcon />
                  <span>组件规范</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
