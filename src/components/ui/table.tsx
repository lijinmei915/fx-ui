import * as React from "react"

import { cn } from "@/lib/utils"
import { ChevronUpIcon, ChevronDownIcon, ChevronsUpDownIcon } from "@/lib/icons"

function Table({
  className,
  density = "default",
  bordered = false,
  ...props
}: React.ComponentProps<"table"> & { density?: "default" | "compact"; bordered?: boolean }) {
  return (
    <div
      data-slot="table-container"
      // 默认无边框（贴公司列表页）；bordered 时套圆角描边卡片
      className={cn(
        "relative w-full overflow-x-auto",
        bordered && "overflow-hidden rounded-xl border border-border-subtle bg-card"
      )}
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

function TableHead({
  className,
  align,
  pinned,
  sortable,
  sorted = false,
  onSort,
  children,
  ...props
}: React.ComponentProps<"th"> & {
  align?: "left" | "center" | "right"
  pinned?: "left" | "right"
  sortable?: boolean
  sorted?: "asc" | "desc" | false
  onSort?: () => void
}) {
  return (
    <th
      data-slot="table-head"
      data-sorted={sorted || undefined}
      className={cn(
        "h-10 px-2 align-middle font-semibold whitespace-nowrap text-foreground group-data-[density=compact]/table:h-9 [&:has([role=checkbox])]:pr-0",
        alignClass(align),
        pinnedClass(pinned),
        className
      )}
      {...props}
    >
      {sortable ? (
        <button
          type="button"
          onClick={onSort}
          className={cn(
            "inline-flex items-center gap-1 font-medium outline-none select-none hover:text-foreground data-[sorted]:text-foreground [&_svg]:size-3.5 [&_svg]:shrink-0",
            align === "right" && "flex-row-reverse"
          )}
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
    </th>
  )
}

function TableCell({
  className,
  align,
  pinned,
  ...props
}: React.ComponentProps<"td"> & { align?: "left" | "center" | "right"; pinned?: "left" | "right" }) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "p-2 align-middle whitespace-nowrap group-data-[density=compact]/table:h-9 group-data-[density=compact]/table:py-0 [&:has([role=checkbox])]:pr-0",
        alignClass(align),
        pinnedClass(pinned),
        className
      )}
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
