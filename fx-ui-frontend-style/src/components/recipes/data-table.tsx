"use client"

import type { ReactNode } from "react"

import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"

// Block（区块，文件夹历史名 recipes/）：薄 DataTable —— 表格 + 勾选(全选/半选) + 行操作；中间列由 columns 驱动。
// 受控：勾选状态由页面持有；不引 TanStack（排序/筛选以后真需要再加）。换表只换 columns/data。
export type Column<T> = {
  key: string
  header: ReactNode
  cell: (row: T) => ReactNode
  headClassName?: string // 列宽/对齐，如 "w-40" "w-8"
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
            <TableHead className="w-10 pl-4">
              <Checkbox checked={allChecked} indeterminate={someChecked && !allChecked} onCheckedChange={toggleAll} aria-label="全选" />
            </TableHead>
          )}
          {columns.map((c) => (
            <TableHead key={c.key} className={c.headClassName}>{c.header}</TableHead>
          ))}
          {rowActions && <TableHead className="pr-4">{rowActionsHeader}</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row) => {
          const k = rowKey(row)
          return (
            <TableRow key={k} data-selected={sel.has(k) ? "" : undefined}>
              {selectable && (
                <TableCell className="pl-4">
                  <Checkbox checked={sel.has(k)} onCheckedChange={() => toggleOne(k)} aria-label="选择行" />
                </TableCell>
              )}
              {columns.map((c) => (
                <TableCell key={c.key}>{c.cell(row)}</TableCell>
              ))}
              {rowActions && <TableCell className="pr-4">{rowActions(row)}</TableCell>}
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}

export { DataTable }
