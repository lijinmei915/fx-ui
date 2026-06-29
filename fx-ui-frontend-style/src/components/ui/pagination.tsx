import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon } from "@/lib/icons"

// 主流页码算法：首尾页常驻，当前页两侧各留 siblingCount 个，超出用省略号。
function getPageList(
  current: number,
  total: number,
  siblingCount = 1
): (number | "ellipsis")[] {
  const range = (start: number, end: number) =>
    Array.from({ length: end - start + 1 }, (_, i) => start + i)
  const totalNumbers = siblingCount * 2 + 5
  if (total <= totalNumbers) return range(1, total)

  const left = Math.max(current - siblingCount, 1)
  const right = Math.min(current + siblingCount, total)
  const showLeftEllipsis = left > 2
  const showRightEllipsis = right < total - 1

  if (!showLeftEllipsis && showRightEllipsis) {
    return [...range(1, siblingCount * 2 + 3), "ellipsis", total]
  }
  if (showLeftEllipsis && !showRightEllipsis) {
    return [1, "ellipsis", ...range(total - (siblingCount * 2 + 2), total)]
  }
  return [1, "ellipsis", ...range(left, right), "ellipsis", total]
}

function Pagination({
  page,
  total,
  pageSize = 10,
  siblingCount = 1,
  showTotal = true,
  onPageChange,
  className,
  ...props
}: Omit<React.ComponentProps<"nav">, "onChange"> & {
  page: number
  total: number
  pageSize?: number
  siblingCount?: number
  showTotal?: boolean
  onPageChange?: (page: number) => void
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const items = getPageList(page, totalPages, siblingCount)
  const go = (p: number) => {
    if (p >= 1 && p <= totalPages && p !== page) onPageChange?.(p)
  }
  return (
    <nav
      role="navigation"
      aria-label="分页"
      data-slot="pagination"
      className={cn("flex items-center justify-end gap-1", className)}
      {...props}
    >
      {showTotal && (
        <span className="mr-2 text-sm text-muted-foreground">共 {total} 条</span>
      )}
      <Button variant="outline" size="icon-sm" disabled={page <= 1} onClick={() => go(page - 1)} aria-label="上一页">
        <ChevronLeftIcon />
      </Button>
      {items.map((it, i) =>
        it === "ellipsis" ? (
          <span key={`ellipsis-${i}`} data-slot="pagination-ellipsis" className="flex size-7 items-center justify-center text-muted-foreground" aria-hidden>
            <MoreHorizontalIcon className="size-4" />
          </span>
        ) : (
          <Button
            key={it}
            variant={it === page ? "default" : "ghost"}
            size="icon-sm"
            aria-current={it === page ? "page" : undefined}
            onClick={() => go(it)}
          >
            {it}
          </Button>
        )
      )}
      <Button variant="outline" size="icon-sm" disabled={page >= totalPages} onClick={() => go(page + 1)} aria-label="下一页">
        <ChevronRightIcon />
      </Button>
    </nav>
  )
}

export { Pagination, getPageList }
