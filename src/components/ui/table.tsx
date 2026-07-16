import * as React from "react"

import { cn } from "@/lib/utils"
import { ChevronUpIcon, ChevronDownIcon, ChevronsUpDownIcon, MoreVerticalIcon, FilterIcon } from "@/lib/icons"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

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
  const [scrolledX, setScrolledX] = React.useState(false)
  const containerStyle: React.CSSProperties | undefined =
    maxHeight != null ? { maxHeight: typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight } : undefined
  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    setScrolledX(event.currentTarget.scrollLeft > 0)
  }

  return (
    <div
      data-slot="table-container"
      data-density={density}
      data-scrolled-x={scrolledX ? "true" : undefined}
      // 默认无边框（贴公司列表页）；bordered 时套圆角描边卡片
      className={cn(
        "group/table-container relative w-full overflow-x-auto",
        maxHeight != null && "scrollbar-thin overflow-y-auto overscroll-contain [-webkit-overflow-scrolling:auto]",
        bordered && "overflow-hidden rounded-xl border border-border-subtle bg-card"
      )}
      onScroll={handleScroll}
      style={containerStyle}
    >
      <table
        data-slot="table"
        data-density={density}
        className={cn("group/table w-full caption-bottom text-sm", className)}
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
        // 表头白底，靠「中等字重 + 下边线」和表体区分（更接近主流默认表格观感）
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
        "border-t border-border bg-muted font-medium [&>tr]:last:border-b-0",
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

const selectionCellClass =
  "data-[selection-cell=true]:w-8 data-[selection-cell=true]:min-w-8 data-[selection-cell=true]:px-2 data-[selection-cell=true]:text-center data-[selection-cell=true]:[&>*]:mx-auto [&:has([role=checkbox])]:w-8 [&:has([role=checkbox])]:min-w-8 [&:has([role=checkbox])]:px-2 [&:has([role=checkbox])]:text-center [&:has([role=checkbox])>*]:mx-auto [&:has([role=radio])]:w-8 [&:has([role=radio])]:min-w-8 [&:has([role=radio])]:px-2 [&:has([role=radio])]:text-center [&:has([role=radio])>*]:mx-auto"

const selectionHeadInnerClass =
  "data-[selection-cell=true]:[&>div]:flex data-[selection-cell=true]:[&>div]:h-full data-[selection-cell=true]:[&>div]:w-full data-[selection-cell=true]:[&>div]:items-center data-[selection-cell=true]:[&>div]:justify-center [&:has([role=checkbox])>div]:flex [&:has([role=checkbox])>div]:h-full [&:has([role=checkbox])>div]:w-full [&:has([role=checkbox])>div]:items-center [&:has([role=checkbox])>div]:justify-center [&:has([role=radio])>div]:flex [&:has([role=radio])>div]:h-full [&:has([role=radio])>div]:w-full [&:has([role=radio])>div]:items-center [&:has([role=radio])>div]:justify-center"

// 固定列：横向滚动时贴边不动。用柔和阴影表达层级，避免硬线和列边框叠出多根竖线。
const pinnedClass = (pinned?: "left" | "right") =>
  pinned === "right"
    ? "sticky right-0 z-[2] bg-card"
    : pinned === "left"
      ? "sticky left-0 z-[2] bg-card"
      : ""

// 冻结到此列（Excel 冻结窗格模型）：传 frozenLeft 数值 = 该列贴左的累加偏移；frozenEdge 标记冻结区最后一列（加右缘阴影分隔）。
function frozenStyle(frozenLeft?: number): React.CSSProperties | undefined {
  return frozenLeft != null ? { left: frozenLeft } : undefined
}
function frozenClass(frozenLeft?: number, frozenEdge?: boolean) {
  if (frozenLeft == null) return ""
  return cn(
    "sticky z-[2] bg-card",
    frozenEdge &&
      "after:pointer-events-none after:absolute after:top-0 after:right-0 after:bottom-0 after:w-7 after:translate-x-full group-data-[scrolled-x=true]/table-container:after:shadow-[inset_10px_0_8px_-8px_var(--fx-shadow-color)]"
  )
}

const pinnedEdgeClass = (pinned?: "left" | "right") =>
  pinned === "right"
    ? "before:pointer-events-none before:absolute before:top-0 before:bottom-0 before:left-0 before:w-7 before:-translate-x-full group-data-[scrolled-x=true]/table-container:before:shadow-[inset_-10px_0_8px_-8px_var(--fx-shadow-color)]"
    : pinned === "left"
      ? "after:pointer-events-none after:absolute after:top-0 after:right-0 after:bottom-0 after:w-7 after:translate-x-full group-data-[scrolled-x=true]/table-container:after:shadow-[inset_10px_0_8px_-8px_var(--fx-shadow-color)]"
      : ""

function TableHead({
  className,
  align,
  pinned,
  frozenLeft,
  frozenEdge,
  sortable,
  sorted = false,
  onSort,
  filterContent,
  filtered,
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
  // 列筛选弹层：适合搜索 + 多选 + 确认/重置这类需要停留操作的筛选面板。
  filterContent?: React.ReactNode
  filtered?: boolean
  // 列操作菜单（冻结/筛选等不常用操作收进 hover 出现的 ⋮ 菜单，避免平铺挤窄列）
  menuActions?: { label: string; icon?: React.ReactNode; onClick?: () => void }[]
}) {
  return (
    <th
      data-slot="table-head"
      data-sorted={sorted || undefined}
        className={cn(
        "group/th relative h-(--fx-table-row-height-default) min-w-[96px] px-(--fx-control-px-xs) align-middle whitespace-nowrap font-medium text-foreground/88 group-data-[density=compact]/table:h-(--fx-table-row-height-compact) group-data-[density=comfortable]/table:h-(--fx-table-row-height-comfortable)",
        selectionCellClass,
        selectionHeadInnerClass,
        alignClass(align),
        pinnedClass(pinned),
        frozenClass(frozenLeft, frozenEdge),
        pinnedEdgeClass(pinned),
        className
      )}
      style={{ ...frozenStyle(frozenLeft), ...style }}
      {...props}
    >
      <div className={cn("inline-flex items-center gap-(--fx-control-gap-tight)", align === "right" && "flex-row-reverse")}>
        {sortable ? (
          <button
            type="button"
            onClick={onSort}
            className="inline-flex items-center gap-(--fx-control-gap-tight) font-medium outline-none select-none hover:text-foreground data-[sorted]:text-foreground [&_svg]:size-3.5 [&_svg]:shrink-0"
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
        {filterContent && (
          <Popover>
            <PopoverTrigger
              aria-label="列筛选"
              className="ml-0.5 inline-flex size-(--fx-control-xs-height) items-center justify-center rounded text-muted-foreground opacity-0 outline-none transition-opacity hover:bg-muted hover:text-foreground focus-visible:opacity-100 group-hover/th:opacity-100 data-popup-open:opacity-100 data-popup-open:bg-muted data-[filtered=true]:text-primary data-[filtered=true]:opacity-100 [&_svg]:size-3.5"
              data-filtered={filtered ? "true" : undefined}
            >
              <FilterIcon />
            </PopoverTrigger>
            <PopoverContent align="start" className="w-72 p-0">
              {filterContent}
            </PopoverContent>
          </Popover>
        )}
        {menuActions && menuActions.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger
              className="ml-0.5 inline-flex size-(--fx-control-xs-height) items-center justify-center rounded text-muted-foreground opacity-0 outline-none transition-opacity hover:bg-muted hover:text-foreground focus-visible:opacity-100 group-hover/th:opacity-100 data-popup-open:opacity-100 data-popup-open:bg-muted [&_svg]:size-3.5"
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
        "relative h-(--fx-table-row-height-default) px-(--fx-control-px-xs) py-0 align-middle whitespace-nowrap group-data-[density=compact]/table:h-(--fx-table-row-height-compact) group-data-[density=comfortable]/table:h-(--fx-table-row-height-comfortable)",
        selectionCellClass,
        alignClass(align),
        pinnedClass(pinned),
        frozenClass(frozenLeft, frozenEdge),
        pinnedEdgeClass(pinned),
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
      className={cn("mt-3 text-sm text-muted-foreground", className)}
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
