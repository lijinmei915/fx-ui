import { useEffect, useRef, useState, type ReactNode } from "react"

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { ChevronDownIcon, ChevronRightIcon, ChevronsLeftIcon, ChevronsRightIcon, LockOpenIcon, SearchIcon, PlusIcon } from "@/lib/icons"

// 导航菜单（单面板侧边栏，1:1 参照 Figma「AI交互探索」侧边栏，token 全用 fx-theme）。
// 结构（自上而下）：头部(标题 + 视图名 + 展开) → 搜索行(搜索框 + 新增) → 菜单树(滚动) → 底部(设置 + 收起)。
// 尺寸：展开 200px、收起 48px；圆角 8(rounded-lg)、内边距 12(p-3)、块间距 8(gap-2)；菜单项 p-2 rounded-lg、图标 16、文字 13(text-fx-13)。
// 状态：默认 / 悬停(bg-muted) / 选中(bg-accent 浅品牌底 + 中粗)。嵌套子项左缩进 26px。收起态居中、仅图标、用气泡补全文案。

type DivProps = { children?: ReactNode; className?: string }

// NavRail：一级导航栏（应用栏），定宽 64px，竖排应用入口，底部固定设置区。
// 选中项白底 + 左圆角（与右侧二级菜单面板拼接）+ 主色加粗。
function NavRail({ children, footer, className }: DivProps & { footer?: ReactNode }) {
  return (
    <nav
      data-slot="nav-rail"
      className={cn("flex h-full w-16 shrink-0 flex-col justify-between py-3", className)}
    >
      <div className="flex flex-col">{children}</div>
      {footer && <div className="flex flex-col">{footer}</div>}
    </nav>
  )
}

// NavRailItem：一级导航项，图标 18 + 11px 文案竖排；选中=白底左圆角 + 主色加粗。
// boxed：页面入口形态（如底部设置）——全圆角方块、仅 hover 底色，无白底左圆角选中态。
function NavRailItem({
  icon,
  activeIcon,
  label,
  active,
  boxed,
  className,
  ...props
}: { icon: ReactNode; activeIcon?: ReactNode; label?: string; active?: boolean; boxed?: boolean } & React.ComponentProps<"button">) {
  // 仅当文字真的被截断（scrollWidth > clientWidth）时才启用气泡，没超出不弹。
  const labelRef = useRef<HTMLSpanElement>(null)
  const [truncated, setTruncated] = useState(false)
  useEffect(() => {
    const el = labelRef.current
    if (!el) return
    const check = () => setTruncated(el.scrollWidth > el.clientWidth)
    check()
    const ro = new ResizeObserver(check)
    ro.observe(el)
    return () => ro.disconnect()
  }, [label])
  const button = (
    <button
      type="button"
      data-slot="nav-rail-item"
      data-active={!boxed && active ? "" : undefined}
      className={cn(
        "flex flex-col items-center justify-center gap-1 text-[11px] leading-[14px] text-foreground outline-none transition-colors cursor-pointer",
        "focus-visible:ring-2 focus-visible:ring-ring/50",
        "[&_svg:not([class*='size-'])]:size-[18px] [&_svg]:shrink-0",
        boxed
          // 页面入口：居中全圆角方块；hover/按下变白底 + 图标主色，和菜单选中态统一
          ? "mx-auto size-9 rounded-lg hover:bg-card hover:text-primary active:bg-card active:text-primary-active"
          // 应用入口：左圆角；未选中才 hover 灰底；选中=白底左圆角 + 主色加粗（选中不再变 hover 底色）
          : "ml-1 rounded-l-lg py-2 not-data-active:hover:bg-muted data-active:bg-card data-active:font-bold data-active:text-primary data-active:[&_svg]:text-primary",
        className
      )}
      {...props}
    >
      {active && activeIcon ? activeIcon : icon}
      {!boxed && label && <span ref={labelRef} className="max-w-full truncate px-1">{label}</span>}
    </button>
  )
  // 文字超出 64px 被截断时，才用气泡补全完整名（与收起提示一致）。
  if (!boxed && label && truncated) {
    return (
      <TooltipProvider delay={100}>
        <Tooltip>
          <TooltipTrigger render={button} />
          <TooltipContent side="right">{label}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }
  return button
}

// NavMenu：单面板根容器，展开 200。
// collapseMode：收起形态——
//   "rail"（默认）：收起成 48px 图标栏（适合每项都有图标的菜单，如后台）。
//   "strip"：收起成 12px 细条（Notion 式，适合含无图标分类标题的菜单，如前台对象菜单）；
//            细条不画内容，靠 hover 整面板临时滑出（peek）来选子项。
function NavMenu({ children, className, collapsed, collapseMode = "rail" }: DivProps & { collapsed?: boolean; collapseMode?: "rail" | "strip" }) {
  if (collapsed && collapseMode === "strip") {
    return (
      <div
        data-slot="nav-menu"
        data-collapsed=""
        aria-hidden
        className={cn("h-full w-3 shrink-0 rounded-lg bg-card transition-[width]", className)}
      />
    )
  }
  return (
    <div
      data-slot="nav-menu"
      data-collapsed={collapsed ? "" : undefined}
      className={cn(
        "flex h-full flex-col gap-2 rounded-lg bg-card transition-[width]",
        collapsed ? "w-12 items-center px-0 py-3" : "w-[200px] p-3",
        className
      )}
    >
      {children}
    </div>
  )
}

// NavMenuHeader：头部，左标题(15px 中粗) + 右侧视图名 + 展开箭头；收起时仅居中标题。
function NavMenuHeader({ title, viewName, collapsed, className }: { title: string; viewName?: string; collapsed?: boolean; className?: string }) {
  return (
    <div data-slot="nav-menu-header" className={cn("flex shrink-0 items-center gap-1", collapsed ? "justify-center" : "", className)}>
      <span className={cn("truncate text-fx-15 font-medium text-foreground", !collapsed && "flex-1")}>{title}</span>
      {!collapsed && viewName && (
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

// NavMenuSearch：搜索行，搜索框(h-7，右侧放大镜) + 方形新增按钮(28×28)；收起时仅留方形搜索按钮。
function NavMenuSearch({
  placeholder = "搜索",
  onAdd,
  collapsed,
  className,
}: { placeholder?: string; onAdd?: () => void; collapsed?: boolean; className?: string }) {
  if (collapsed) {
    return (
      <Button type="button" size="icon-sm" variant="outline" aria-label={placeholder} className={className}>
        <SearchIcon />
      </Button>
    )
  }
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
    <div data-slot="nav-menu-list" className={cn("scrollbar-thin flex w-full flex-1 flex-col gap-1 overflow-y-auto", className)}>
      {children}
    </div>
  )
}

// NavMenuGroupLabel：分组/区块标题，不可选（仅作分节，如后台菜单的「系统管理」）。
// 收起时退化为一条 16px 短横线分隔（替代文字标题）。
function NavMenuGroupLabel({ children, className, collapsed }: DivProps & { collapsed?: boolean }) {
  if (collapsed) {
    return (
      <div data-slot="nav-menu-group-label" className="flex h-[30px] items-center justify-center">
        <span className="h-px w-4 bg-muted-foreground" />
      </div>
    )
  }
  return (
    <div data-slot="nav-menu-group-label" className={cn("px-2 pt-3 pb-1 text-fx-13 text-muted-foreground select-none", className)}>
      {children}
    </div>
  )
}

// 收起态(无图标)取首部短标识：开头是英文/数字串则整段显示(最多 3，如 CRM)，否则取前 2 个中文字。
function collapsedLabel(label: string) {
  const ascii = label.match(/^[A-Za-z0-9]+/)
  return ascii ? ascii[0].slice(0, 3) : label.slice(0, 2)
}

// NavMenuItem：菜单项。三态：默认 / 悬停(bg-muted) / 选中(bg-accent + 中粗)。
// expandable=可折叠分组（前置箭头随 expanded 旋转）；indent=嵌套子项左缩进 26px；collapsed=仅图标居中 + 气泡补全。
function NavMenuItem({
  icon,
  label,
  active,
  indent,
  expandable,
  expanded,
  collapsed,
  arrow,
  className,
  ...props
}: {
  icon?: ReactNode
  label: string
  active?: boolean
  indent?: boolean | 1 | 2
  expandable?: boolean
  expanded?: boolean
  collapsed?: boolean
  arrow?: boolean
} & React.ComponentProps<"button">) {
  const button = (
    <button
      type="button"
      data-slot="nav-menu-item"
      data-active={active ? "" : undefined}
      className={cn(
        "flex shrink-0 items-center gap-1 rounded-lg text-fx-13 outline-none transition-colors cursor-pointer",
        "text-foreground not-data-active:hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/50",
        "data-active:bg-accent data-active:font-medium data-active:[&_svg]:text-primary",
        // 收起：居中 36px 正方块（选中底色呈方形）；展开：占满整行、左对齐，嵌套缩进。
        collapsed ? "mx-auto size-9 justify-center" : cn("w-full p-2 text-left", indent === 2 ? "pl-[40px]" : indent && "pl-[26px]"),
        "[&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0",
        className
      )}
      {...props}
    >
      {/* 前置：无图标的可折叠项用前置折叠箭头（前台分组）；其它显示图标。收起态只显示图标。 */}
      {expandable && !icon && !collapsed ? (
        <ChevronRightIcon className={cn("transition-transform", expanded && "rotate-90")} />
      ) : (
        icon
      )}
      {/* 展开：左对齐文案；收起且无图标：居中 2 字标识；收起且有图标：仅图标。 */}
      {!collapsed ? (
        <span className="flex-1 truncate">{label}</span>
      ) : !icon ? (
        <span className="w-full text-center whitespace-nowrap">{collapsedLabel(label)}</span>
      ) : null}
      {/* 后置箭头：有图标的可折叠项 = 右侧旋转箭头(>关 ∨开)；arrow 跳转项 = 右侧静态箭头(>) */}
      {!collapsed && ((expandable && icon) || arrow) && (
        <ChevronRightIcon
          className={cn(
            "size-3 shrink-0 text-muted-foreground",
            expandable && icon && cn("transition-transform", expanded && "rotate-90")
          )}
        />
      )}
    </button>
  )
  // 收起态信息不全（仅图标 / 截断文案），用气泡补全完整文案。
  if (collapsed) {
    return (
      <TooltipProvider delay={100}>
        <Tooltip>
          <TooltipTrigger render={button} />
          <TooltipContent side="right">{label}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }
  return button
}

// NavMenuFooter：底部操作区，hover 气泡提示。
// 两种模式：① 默认——收起/展开双箭头（onToggle）；② 传 onPin 时启用「固定导航」——
//   未固定且面板展开（hover 临时展开）时显示锁(固定导航)，点击固定；已固定时显示收起箭头。
function NavMenuFooter({
  collapsed,
  pinned,
  onToggle,
  onPin,
  className,
}: { collapsed?: boolean; pinned?: boolean; onToggle?: () => void; onPin?: () => void; className?: string }) {
  const pinMode = !!onPin && !collapsed && !pinned
  const tip = pinMode ? "固定导航" : collapsed ? "展开" : "收起"
  const icon = pinMode ? <LockOpenIcon /> : collapsed ? <ChevronsRightIcon /> : <ChevronsLeftIcon />
  return (
    <div
      data-slot="nav-menu-footer"
      className={cn("flex shrink-0 items-center", collapsed ? "justify-center" : "justify-end px-2", className)}
    >
      <TooltipProvider delay={100}>
        <Tooltip>
          <TooltipTrigger
            render={
              <button
                type="button"
                aria-label={tip}
                onClick={pinMode ? onPin : onToggle}
                className="text-muted-foreground outline-none cursor-pointer hover:text-foreground focus-visible:text-foreground [&_svg]:size-4"
              >
                {icon}
              </button>
            }
          />
          <TooltipContent side="right">{tip}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}

export { NavRail, NavRailItem, NavMenu, NavMenuHeader, NavMenuSearch, NavMenuList, NavMenuGroupLabel, NavMenuItem, NavMenuFooter }
