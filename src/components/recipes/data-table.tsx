"use client"

import { useState, type ReactNode } from "react"

import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"

// Block（区块，文件夹历史名 recipes/）：薄 DataTable —— 表格 + 勾选(全选/半选) + 行操作 + 表头排序/冻结/筛选(⋮)。
// 表头能力透传自 ui Table 的 TableHead（sortable/pinned/menuActions）；不引 TanStack。换表只换 columns/data。
export type Column<T> = {
  key: string
  header: ReactNode
  cell: (row: T) => ReactNode
  headClassName?: string // 列宽/对齐，如 "w-40" "w-8"
  align?: "left" | "center" | "right"
  pinned?: "left" | "right"            // 冻结列
  sortable?: boolean                    // 表头排序（点击切 asc/desc）
  sortValue?: (row: T) => string | number // 排序取值；不传则只显示箭头不真排
  menuActions?: { label: string; icon?: ReactNode; onClick?: () => void }[] // ⋮ 列菜单：锁定/筛选等
}

function DataTable<T>({
  columns,
  data,
  rowKey,
  selectable,
  selected,
  onSelectedChange,
  rowActions,
  rowActionsHeader = "操作",
}: {
  columns: Column<T>[]
  data: T[]
  rowKey: (row: T) => string | number
  selectable?: boolean
  selected?: Set<string | number>
  onSelectedChange?: (next: Set<string | number>) => void
  rowActions?: (row: T) => ReactNode
  rowActionsHeader?: ReactNode
}) {
  const [sort, setSort] = useState<{ key: string; dir: "asc" | "desc" } | null>(null)
  const toggleSort = (key: string) =>
    setSort((s) => (s?.key !== key ? { key, dir: "asc" } : s.dir === "asc" ? { key, dir: "desc" } : null))
  const sortCol = sort ? columns.find((c) => c.key === sort.key) : undefined
  const rows = sortCol?.sortValue
    ? [...data].sort((a, b) => {
        const av = sortCol.sortValue!(a)
        const bv = sortCol.sortValue!(b)
        const r = av < bv ? -1 : av > bv ? 1 : 0
        return sort!.dir === "asc" ? r : -r
      })
    : data
  const keys = data.map(rowKey)
  const sel = selected ?? new Set<string | number>()
  const allChecked = keys.length > 0 && keys.every((k) => sel.has(k))
  const someChecked = keys.some((k) => sel.has(k))
  const toggleAll = () => onSelectedChange?.(allChecked ? new Set() : new Set(keys))
  const toggleOne = (k: string | number) => {
    const next = new Set(sel)
    next.has(k) ? next.delete(k) : next.add(k)
    onSelectedChange?.(next)
  }
  return (
    <Table>
      <TableHeader className="sticky top-0 z-10 bg-card">
        <TableRow className="hover:bg-transparent">
          {selectable && (
            <TableHead className="w-10 pl-1">
              <Checkbox checked={allChecked} indeterminate={someChecked && !allChecked} onCheckedChange={toggleAll} aria-label="全选" />
            </TableHead>
          )}
          {columns.map((c) => (
            <TableHead
              key={c.key}
              className={c.headClassName}
              align={c.align}
              pinned={c.pinned}
              sortable={c.sortable}
              sorted={sort?.key === c.key ? sort.dir : false}
              onSort={c.sortable ? () => toggleSort(c.key) : undefined}
              menuActions={c.menuActions}
            >
              {c.header}
            </TableHead>
          ))}
          {rowActions && <TableHead className="pr-1">{rowActionsHeader}</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => {
          const k = rowKey(row)
          return (
            <TableRow key={k} data-selected={sel.has(k) ? "" : undefined}>
              {selectable && (
                <TableCell className="pl-1">
                  <Checkbox checked={sel.has(k)} onCheckedChange={() => toggleOne(k)} aria-label="选择行" />
                </TableCell>
              )}
              {columns.map((c) => (
                <TableCell key={c.key}>{c.cell(row)}</TableCell>
              ))}
              {rowActions && <TableCell className="pr-1">{rowActions(row)}</TableCell>}
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}

export { DataTable }
