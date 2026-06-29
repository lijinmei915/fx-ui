import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

// 页面骨架组件（参考 Semi/Ant 的 Layout）。整页骨架用 flex 拼装，复用 + 少出错；
// 内容区内部的分栏仍用 Tailwind 24 列栅格工具类（见「栅格」页），两者分工。
// 默认尺寸（见 docs/LAYOUTS.md）：顶栏 56 / 侧栏 240·收起 64 / 底栏 48 / 内容内边距 16→24。

type DivProps = { children?: ReactNode; className?: string }

// Layout：整页容器。含侧栏时设 hasSider 横向排布，否则纵向（头/内容/底）。
function Layout({ children, className, hasSider }: DivProps & { hasSider?: boolean }) {
  return (
    <div
      data-slot="layout"
      className={cn("flex min-h-screen w-full bg-background", hasSider ? "flex-row" : "flex-col", className)}
    >
      {children}
    </div>
  )
}

// LayoutHeader：顶栏，固定高 56px。
function LayoutHeader({ children, className }: DivProps) {
  return (
    <header
      data-slot="layout-header"
      className={cn("flex h-14 shrink-0 items-center gap-3 border-b border-border bg-card px-4 lg:px-6", className)}
    >
      {children}
    </header>
  )
}

// LayoutSider：侧栏，展开 240 / 收起 64（图标栏）。collapsed 由使用方控制（含响应式）。
function LayoutSider({ children, className, collapsed }: DivProps & { collapsed?: boolean }) {
  return (
    <aside
      data-slot="layout-sider"
      data-collapsed={collapsed ? "" : undefined}
      className={cn(
        "flex shrink-0 flex-col gap-1 border-r border-border bg-card p-2 transition-[width] duration-200",
        collapsed ? "w-16" : "w-60",
        className
      )}
    >
      {children}
    </aside>
  )
}

// LayoutContent：内容区，撑满剩余空间，内边距 16→24。内部分栏用栅格工具类。
function LayoutContent({ children, className }: DivProps) {
  return (
    <main data-slot="layout-content" className={cn("flex min-w-0 flex-1 flex-col gap-4 px-4 py-6 lg:px-6", className)}>
      {children}
    </main>
  )
}

// LayoutFooter：底栏，固定高 48px。
function LayoutFooter({ children, className }: DivProps) {
  return (
    <footer
      data-slot="layout-footer"
      className={cn("flex h-12 shrink-0 items-center justify-center border-t border-border bg-card px-4 text-sm text-muted-foreground lg:px-6", className)}
    >
      {children}
    </footer>
  )
}

export { Layout, LayoutHeader, LayoutSider, LayoutContent, LayoutFooter }
