import type { ReactNode } from "react"

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ChevronDownIcon, ChevronRightIcon, SearchIcon, PlusIcon, SettingsIcon, PanelLeftIcon } from "@/lib/icons"

// 导航菜单（单面板侧边栏，1:1 参照 Figma「AI交互探索」侧边栏，token 全用 fx-theme）。
// 结构（自上而下）：头部(标题 + 视图名 + 展开) → 搜索行(搜索框 + 新增) → 菜单树(滚动) → 底部(设置 + 收起)。
// 尺寸：面板 200px、圆角 8(rounded-lg)、内边距 12(p-3)、块间距 8(gap-2)；菜单项 p-2 rounded-lg、图标 16、文字 13(text-fx-13)。
// 状态：默认 / 悬停(bg-muted) / 选中(bg-accent 浅品牌底 + 中粗)。嵌套子项左缩进 26px。

type DivProps = { children?: ReactNode; className?: string }

// NavMenu：单面板根容器，定宽 200px，纵向 头部/搜索/列表/底部。
function NavMenu({ children, className }: DivProps) {
  return (
    <div
      data-slot="nav-menu"
      className={cn("flex h-full w-[200px] flex-col gap-2 rounded-lg border border-border bg-card p-3", className)}
    >
      {children}
    </div>
  )
}

// NavMenuHeader：头部，左标题(15px 中粗) + 右侧视图名 + 展开箭头。
function NavMenuHeader({ title, viewName, className }: { title: string; viewName?: string; className?: string }) {
  return (
    <div data-slot="nav-menu-header" className={cn("flex shrink-0 items-center gap-1", className)}>
      <span className="flex-1 truncate text-fx-15 font-medium text-foreground">{title}</span>
      {viewName && (
        <button
          type="button"
          className="flex items-center gap-0.5 text-fx-13 text-foreground outline-none cursor-pointer focus-visible:underline"
        >
          <span className="max-w-[76px] truncate">{viewName}</span>
          <ChevronDownIcon className="size-3" />
        </button>
      )}
    </div>
  )
}

// NavMenuSearch：搜索行，搜索框(h-7，右侧放大镜) + 方形新增按钮(28×28)。
function NavMenuSearch({
  placeholder = "搜索",
  onAdd,
  className,
}: { placeholder?: string; onAdd?: () => void; className?: string }) {
  return (
    <div data-slot="nav-menu-search" className={cn("flex shrink-0 items-center gap-2", className)}>
      <div className="relative flex-1">
        <Input placeholder={placeholder} className="h-7 pr-7 text-fx-13" />
        <SearchIcon className="pointer-events-none absolute top-1/2 right-2 size-3.5 -translate-y-1/2 text-muted-foreground" />
      </div>
      {onAdd && (
        <Button type="button" size="icon-sm" variant="outline" aria-label="新增" onClick={onAdd}>
          <PlusIcon />
        </Button>
      )}
    </div>
  )
}

// NavMenuList：菜单树滚动区。
function NavMenuList({ children, className }: DivProps) {
  return (
    <div data-slot="nav-menu-list" className={cn("flex flex-1 flex-col overflow-y-auto", className)}>
      {children}
    </div>
  )
}

// NavMenuItem：菜单项。三态：默认 / 悬停(bg-muted) / 选中(bg-accent + 中粗)。
// expandable=可折叠分组（前置箭头随 expanded 旋转）；indent=嵌套子项左缩进 26px。
function NavMenuItem({
  icon,
  label,
  active,
  indent,
  expandable,
  expanded,
  className,
  ...props
}: {
  icon?: ReactNode
  label: string
  active?: boolean
  indent?: boolean
  expandable?: boolean
  expanded?: boolean
} & React.ComponentProps<"button">) {
  return (
    <button
      type="button"
      data-slot="nav-menu-item"
      data-active={active ? "" : undefined}
      className={cn(
        "flex w-full items-center gap-1 rounded-lg p-2 text-left text-fx-13 outline-none transition-colors cursor-pointer",
        "text-foreground hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/50",
        "data-active:bg-accent data-active:font-medium",
        indent && "pl-[26px]",
        "[&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0",
        className
      )}
      {...props}
    >
      {expandable ? (
        <ChevronRightIcon className={cn("transition-transform", expanded && "rotate-90")} />
      ) : (
        icon
      )}
      <span className="flex-1 truncate">{label}</span>
    </button>
  )
}

// NavMenuFooter：底部操作区，靠右 设置 + 收起。
function NavMenuFooter({ className }: { className?: string }) {
  return (
    <div data-slot="nav-menu-footer" className={cn("flex shrink-0 items-center justify-end gap-3 px-2", className)}>
      <button type="button" aria-label="设置" className="text-muted-foreground outline-none cursor-pointer hover:text-foreground focus-visible:text-foreground [&_svg]:size-4">
        <SettingsIcon />
      </button>
      <button type="button" aria-label="收起" className="text-muted-foreground outline-none cursor-pointer hover:text-foreground focus-visible:text-foreground [&_svg]:size-4">
        <PanelLeftIcon />
      </button>
    </div>
  )
}

export { NavMenu, NavMenuHeader, NavMenuSearch, NavMenuList, NavMenuItem, NavMenuFooter }
