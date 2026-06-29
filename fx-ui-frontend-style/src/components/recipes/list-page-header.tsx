"use client"

import type { ReactNode } from "react"

import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { ChevronDownIcon } from "@/lib/icons"

// Block（区块，文件夹历史名 recipes/）：列表页紧凑标题栏 —— 标题 + 可选视图下拉 + 操作插槽。
// 三个变体轴（按需用）：① views 不传 → 只有标题(「客户」)，传了 → 「客户 ｜ 全部客户 ⌄」视图切换；
// ② actions 是插槽，0..N 个按钮可有可没有、单个或多个，由页面塞；③ 操作按钮样式由页面决定（描边/主色等）。
function ListPageHeader({
  title,
  views,
  view,
  onViewChange,
  actions,
}: {
  title: ReactNode
  views?: { key: string; label: string }[]
  view?: string
  onViewChange?: (k: string) => void
  actions?: ReactNode
}) {
  return (
    <div className="flex h-12 shrink-0 items-center justify-between gap-3 border-b border-border-subtle px-4">
      <div className="flex shrink-0 items-center gap-2 whitespace-nowrap text-lg">
        <span className="font-medium text-foreground">{title}</span>
        {views && views.length > 0 && (
          <>
            <span className="text-border">|</span>
            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex items-center gap-1 text-foreground outline-none hover:text-primary">
                {views.find((v) => v.key === view)?.label ?? views[0].label}
                <ChevronDownIcon className="size-4 text-muted-foreground" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {views.map((v) => (
                  <DropdownMenuItem key={v.key} selected={v.key === view} onClick={() => onViewChange?.(v.key)}>{v.label}</DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}
      </div>
      {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
    </div>
  )
}

export { ListPageHeader }
