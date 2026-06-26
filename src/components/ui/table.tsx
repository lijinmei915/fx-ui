import * as React from "react"

import { cn } from "@/lib/utils"
import { ChevronUpIcon, ChevronDownIcon, ChevronsUpDownIcon, MoreVerticalIcon } from "@/lib/icons"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

function Table({
  className,
  density = "default",
  bordered = false,
  maxHeight,
  ...props
}: React.ComponentProps<"table"> & {
  density?: "compact" | "default" | "comfortable"
  bordered?: boolean
  // 配合 TableHeader sticky 用：给定最大高度，组件自带稳定纵向滚动容器
  // （overscroll-contain 阻断 macOS 橡皮筋回弹，scrolling:auto 关惯性，滚动跟手不抖）
  maxHeight?: number | string
}) {
  return (
    <div
      data-slot="table-container"
      // 默认无边框（贴公司列表页）；bordered 时套圆角描边卡片
      className={cn(
        "relative w-full overflow-x-auto",
        maxHeight != null && "scrollbar-thin overflow-y-auto overscroll-contain [-webkit-overflow-scrolling:auto]",
        bordered && "overflow-hidden rounded-xl border border-border-subtle bg-card"
      )}
      style={maxHeight != null ? { maxHeight: typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight } : undefined}
    >
      <table
        data-slot="table"
        data-density={density}
        className={cn("group/table w-full caption-bottom text-fx-13", className)}
        {...props}
      />
    </div>
  )
}

function TableHeader({
  className,
  sticky,
  ...props
}: React.ComponentProps<"thead"> & { sticky?: boolean }) {
  return (
    <thead
      data-slot="table-header"
      className={cn(
        // 表头白底，靠「加粗文字 + 更深的下边线(neutrals05)」和表体区分（对齐公司列表页）
        "[&_tr]:border-b [&_tr]:border-border",
        // 吸顶：滚动时表头固定。需配合外层容器固定高度 + overflow-y-auto
        sticky && "sticky top-0 z-10 bg-card [&_th]:bg-card",
        className
      )}
      {...props}
    />
  )
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  )
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "border-t border-border-subtle bg-muted font-medium [&>tr]:last:border-b-0",
        className
      )}
      {...props}
    />
  )
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "border-b border-border-subtle transition-colors hover:bg-muted has-aria-expanded:bg-muted data-[state=selected]:bg-muted",
        className
      )}
      {...props}
    />
  )
}

const alignClass = (align?: "left" | "center" | "right") =>
  align === "right" ? "text-right" : align === "center" ? "text-center" : "text-left"

// 固定列：横向滚动时贴边不动。需不透明底遮挡滚动内容，并用内阴影做分隔线。
const pinnedClass = (pinned?: "left" | "right") =>
  pinned === "right"
    ? "sticky right-0 z-[1] bg-card shadow-[inset_1px_0_0_var(--border-subtle)]"
    : pinned === "left"
      ? "sticky left-0 z-[1] bg-card shadow-[inset_-1px_0_0_var(--border-subtle)]"
      : ""

// 冻结到此列（Excel 冻结窗格模型）：传 frozenLeft 数值 = 该列贴左的累加偏移；frozenEdge 标记冻结区最后一列（加右缘阴影分隔）。
function frozenStyle(frozenLeft?: number): React.CSSProperties | undefined {
  return frozenLeft != null ? { left: frozenLeft } : undefined
}
function frozenClass(frozenLeft?: number, frozenEdge?: boolean) {
  if (frozenLeft == null) return ""
  return cn("sticky z-[1] bg-card", frozenEdge && "shadow-[2px_0_6px_0_rgba(0,0,0,0.08)]")
}

function TableHead({
  className,
  align,
  pinned,
  frozenLeft,
  frozenEdge,
  sortable,
  sorted = false,
  onSort,
  menuActions,
  children,
  style,
  ...props
}: React.ComponentProps<"th"> & {
  align?: "left" | "center" | "right"
  pinned?: "left" | "right"
  frozenLeft?: number
  frozenEdge?: boolean
  sortable?: boolean
  sorted?: "asc" | "desc" | false
  onSort?: () => void
  // 列操作菜单（冻结/筛选等不常用操作收进 hover 出现的 ⋮ 菜单，避免平铺挤窄列）
  menuActions?: { label: string; icon?: React.ReactNode; onClick?: () => void }[]
}) {
  return (
    <th
      data-slot="table-head"
      data-sorted={sorted || undefined}
      className={cn(
        "group/th h-9 min-w-[112px] px-2 align-middle font-semibold whitespace-nowrap text-foreground [&:has([role=checkbox])]:pr-0",
        alignClass(align),
        pinnedClass(pinned),
        frozenClass(frozenLeft, frozenEdge),
        className
      )}
      style={{ ...frozenStyle(frozenLeft), ...style }}
      {...props}
    >
      <div className={cn("inline-flex items-center gap-1", align === "right" && "flex-row-reverse")}>
        {sortable ? (
          <button
            type="button"
            onClick={onSort}
            className="inline-flex items-center gap-1 font-medium outline-none select-none hover:text-foreground data-[sorted]:text-foreground [&_svg]:size-3.5 [&_svg]:shrink-0"
          >
            {children}
            {sorted === "asc" ? (
              <ChevronUpIcon />
            ) : sorted === "desc" ? (
              <ChevronDownIcon />
            ) : (
              <ChevronsUpDownIcon className="text-muted-foreground" />
            )}
          </button>
        ) : (
          children
        )}
        {menuActions && menuActions.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger
              className="ml-0.5 inline-flex size-5 items-center justify-center rounded text-muted-foreground opacity-0 outline-none transition-opacity hover:bg-muted hover:text-foreground focus-visible:opacity-100 group-hover/th:opacity-100 data-popup-open:opacity-100 data-popup-open:bg-muted [&_svg]:size-3.5"
              aria-label="列操作"
            >
              <MoreVerticalIcon />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {menuActions.map((a) => (
                <DropdownMenuItem key={a.label} onClick={a.onClick}>
                  {a.icon}
                  {a.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </th>
  )
}

function TableCell({
  className,
  align,
  pinned,
  frozenLeft,
  frozenEdge,
  style,
  ...props
}: React.ComponentProps<"td"> & { align?: "left" | "center" | "right"; pinned?: "left" | "right"; frozenLeft?: number; frozenEdge?: boolean }) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        // 表体三档行高（对齐公司）：紧凑28 / 舒适36(默认) / 宽松42；统一 align-middle 垂直居中
        "px-2 py-0 align-middle whitespace-nowrap h-9 group-data-[density=compact]/table:h-7 group-data-[density=comfortable]/table:h-[42px] [&:has([role=checkbox])]:pr-0",
        alignClass(align),
        pinnedClass(pinned),
        frozenClass(frozenLeft, frozenEdge),
        className
      )}
      style={{ ...frozenStyle(frozenLeft), ...style }}
      {...props}
    />
  )
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("mt-4 text-fx-13 text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
