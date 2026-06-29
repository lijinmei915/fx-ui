"use client"

import type { ReactNode } from "react"

import { Button } from "@/components/ui/button"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { FilterIcon, SearchIcon, ChevronDownIcon } from "@/lib/icons"

// Block（区块，文件夹历史名 recipes/）：列表页工具栏 —— 左(筛选? + 复合搜索?) + 右(视图切换? + 额外动作?)。
// 左右两簇全可有可没有、可配置：onFilter/onSearchChange/scopes/views/actions 各自传了才出对应控件；换页面只换配置。
function ListToolbar({
  search,
  onSearchChange,
  scope,
  scopes,
  onScopeChange,
  view,
  views,
  onViewChange,
  onFilter,
  leftExtra,
  actions,
  searchPlaceholder = "搜索",
}: {
  search?: string
  onSearchChange?: (v: string) => void
  scope?: string
  scopes?: { key: string; label: string }[]
  onScopeChange?: (k: string) => void
  view?: string
  views?: { value: string; label: string; icon: ReactNode }[]
  onViewChange?: (v: string) => void
  onFilter?: () => void
  leftExtra?: ReactNode
  actions?: ReactNode
  searchPlaceholder?: string
}) {
  return (
    <div className="flex shrink-0 items-center justify-between gap-3 px-4 py-2.5">
      <div className="flex items-center gap-2">
        {onFilter && (
          <Button variant="outline" size="sm" onClick={onFilter}><FilterIcon data-icon="inline-start" />筛选</Button>
        )}
        {/* 复合搜索（可选）：传了 onSearchChange 才出；范围下拉 + 输入 + 放大镜 */}
        {onSearchChange && (
        <div className="flex h-8 w-64 items-center rounded-lg border border-border bg-card transition-colors focus-within:border-ring">
          {scopes && scopes.length > 0 && (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger className="inline-flex shrink-0 items-center gap-1 rounded-l-lg px-2.5 text-base text-muted-foreground outline-none hover:text-foreground [&_svg]:size-3">
                  {scopes.find((s) => s.key === scope)?.label ?? scopes[0].label}
                  <ChevronDownIcon />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {scopes.map((s) => (
                    <DropdownMenuItem key={s.key} selected={s.key === scope} onClick={() => onScopeChange?.(s.key)}>{s.label}</DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <span className="h-4 w-px bg-border" />
            </>
          )}
          <input value={search ?? ""} onChange={(e) => onSearchChange(e.target.value)} placeholder={searchPlaceholder} className="min-w-0 flex-1 bg-transparent px-2.5 text-base outline-none placeholder:text-foreground-disabled" />
          <SearchIcon className="mr-2.5 size-4 shrink-0 text-muted-foreground" />
        </div>
        )}
        {leftExtra}
      </div>
      <div className="flex items-center gap-2">
        {views && views.length > 0 && (
          <ToggleGroup value={view ? [view] : []} onValueChange={(v) => v[0] && onViewChange?.(v[0])}>
            {views.map((vw) => (
              <Tooltip key={vw.value}>
                <TooltipTrigger render={<ToggleGroupItem value={vw.value} aria-label={vw.label}>{vw.icon}</ToggleGroupItem>} />
                <TooltipContent>{vw.label}</TooltipContent>
              </Tooltip>
            ))}
          </ToggleGroup>
        )}
        {actions}
      </div>
    </div>
  )
}

export { ListToolbar }
