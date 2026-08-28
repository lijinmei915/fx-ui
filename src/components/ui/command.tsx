"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { SearchIcon } from "@/lib/icons"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"

// 轻量命令面板（⌘K 模型）：基于项目 Dialog + Base UI 自建，不引 cmdk/Radix。
// 受控用法：open / onOpenChange + items；内部负责模糊过滤、↑↓ 选择、Enter 触发、Esc 关闭。
export type CommandItem = {
  id: string
  label: string
  meta?: string
  group?: string
  keywords?: string
  onSelect: () => void
}

function CommandPalette({
  open,
  onOpenChange,
  items,
  placeholder = "搜索…",
  emptyText = "无匹配结果",
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  items: CommandItem[]
  placeholder?: string
  emptyText?: string
}) {
  const [query, setQuery] = React.useState("")
  const [active, setActive] = React.useState(0)
  const listRef = React.useRef<HTMLDivElement>(null)

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return items
    return items.filter(
      (it) =>
        it.label.toLowerCase().includes(q) ||
        it.group?.toLowerCase().includes(q) ||
        it.keywords?.toLowerCase().includes(q)
    )
  }, [items, query])

  // 打开时重置；过滤后把高亮夹回范围
  React.useEffect(() => {
    if (open) { setQuery(""); setActive(0) }
  }, [open])
  React.useEffect(() => { setActive(0) }, [query])

  const select = (it?: CommandItem) => {
    if (!it) return
    onOpenChange(false)
    it.onSelect()
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, filtered.length - 1)) }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)) }
    else if (e.key === "Enter") { e.preventDefault(); select(filtered[active]) }
  }

  React.useEffect(() => {
    listRef.current?.querySelector<HTMLElement>('[data-active="true"]')?.scrollIntoView({ block: "nearest" })
  }, [active])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="top-[20%] max-w-xl translate-y-0 gap-0 overflow-hidden p-0">
        <DialogTitle className="sr-only">命令面板</DialogTitle>
        <div className="flex items-center gap-(--fds-g-spacing-control-gap) border-b border-border-subtle px-(--fds-g-spacing-control-inline-md)">
          <SearchIcon className="size-4 shrink-0 text-muted-foreground" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            className="h-[calc(var(--fds-g-sizing-control-block-lg)+8px)] w-full bg-transparent text-sm outline-none placeholder:text-foreground-disabled"
          />
        </div>
        <div ref={listRef} className="scrollbar-thin max-h-80 overflow-y-auto overscroll-contain p-1">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-base text-muted-foreground">{emptyText}</div>
          ) : (
            filtered.map((it, i) => (
              <button
                key={it.id}
                type="button"
                data-active={i === active}
                onMouseMove={() => setActive(i)}
                onClick={() => select(it)}
                className={cn(
                  "flex min-h-(--fds-g-sizing-control-block-md) w-full items-center justify-between gap-(--fds-g-spacing-control-gap) rounded-md px-(--fds-g-spacing-control-inline-sm) text-left text-base outline-none",
                  i === active ? "bg-muted text-foreground" : "text-foreground"
                )}
              >
                <span className="flex min-w-0 items-baseline gap-(--fds-g-spacing-control-gap)">
                  <span className="truncate">{it.label}</span>
                  {it.meta && <span className="shrink-0 text-sm text-muted-foreground">{it.meta}</span>}
                </span>
                {it.group && <span className="shrink-0 text-sm text-muted-foreground">{it.group}</span>}
              </button>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export { CommandPalette }
