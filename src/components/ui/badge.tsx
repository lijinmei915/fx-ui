import * as React from "react"

import { cn } from "@/lib/utils"

// Badge 角标：贴在载体（头像/图标/按钮）右上角的通知红点 / 未读数字（Ant Badge 模型）。
//  - 传 children 时包裹元素并定位到右上角；不传则独立内联渲染。
//  - count>max 显示「max+」；count<=0 默认不渲染（showZero 强制显示 0）。
// 行内状态/分类标签请用 Tag（src/components/ui/tag.tsx）。
function Badge({
  dot = false,
  count,
  max = 99,
  showZero = false,
  tone = "destructive",
  className,
  children,
}: {
  dot?: boolean
  count?: number
  max?: number
  showZero?: boolean
  tone?: "destructive" | "primary"
  className?: string
  children?: React.ReactNode
}) {
  const show = dot || (typeof count === "number" && (count > 0 || showZero))
  const content = dot
    ? null
    : typeof count === "number"
      ? count > max
        ? `${max}+`
        : count
      : null
  const toneClass =
    tone === "primary"
      ? "bg-primary text-primary-foreground"
      : "bg-destructive text-primary-foreground"
  const node = show ? (
    <span
      data-slot="badge"
      className={cn(
        // 角标数字按主流惯例比正文更小（10px），是字号 token 体系外的刻意单点破例：
        // 通知数字塞进 16px 小角标，最小的 text-fx-12 也偏挤，故此处例外。
        "pointer-events-none z-10 inline-flex items-center justify-center rounded-full text-[10px] leading-none font-medium tabular-nums ring-2 ring-background select-none",
        dot ? "size-2" : "h-4 min-w-4 px-1",
        toneClass,
        // 中心锚定载体右上角顶点（参考 MUI/Ant）：任意宽度角标位置一致、向外对称展开，不越宽越内盖
        children ? "absolute top-0 right-0 translate-x-1/2 -translate-y-1/2" : "",
        className
      )}
    >
      {content}
    </span>
  ) : null
  if (!children) return node
  return (
    <span data-slot="badge-root" className="relative inline-flex w-fit">
      {children}
      {node}
    </span>
  )
}

export { Badge }
