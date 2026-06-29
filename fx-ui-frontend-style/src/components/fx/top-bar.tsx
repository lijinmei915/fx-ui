"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { SearchIcon, ChevronDownIcon, CaretDownFilledIcon } from "@/lib/icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"

// 全局应用顶栏（1:1 参照公司 Figma「新版WebUI」顶栏，token 全用 fx-theme）。
// 高 48px、自身不设底色也不画分割线（换肤时由宿主决定背景/分隔）；左品牌+应用切换、右搜索+工具图标+头像，两端对齐。
// 可组合：TopBar 容器 + TopBarBrand / TopBarApps / TopBarSearch / TopBarActions / TopBarIconButton 子件。

function TopBar({ className, children, ...props }: React.ComponentProps<"header">) {
  return (
    <header
      data-slot="top-bar"
      className={cn(
        "flex h-12 w-full items-center gap-3 px-3 text-base text-foreground",
        className
      )}
      {...props}
    >
      {children}
    </header>
  )
}

// 左侧品牌：logo + 公司/产品名
function TopBarBrand({
  logo,
  name,
  className,
}: {
  logo?: React.ReactNode
  name: React.ReactNode
  className?: string
}) {
  return (
    <div data-slot="top-bar-brand" className={cn("flex shrink-0 items-center gap-2", className)}>
      {logo}
      <span className="max-w-[280px] truncate text-foreground">{name}</span>
    </div>
  )
}

// 竖向分隔线
function TopBarDivider({ className }: { className?: string }) {
  return <span data-slot="top-bar-divider" className={cn("h-4 w-px shrink-0 bg-border", className)} />
}

// 应用切换的彩色九宫格图标：品牌多彩 logo 资产（固定色、非主题色，换肤不变），就是一张静态 SVG
const appGridColors = ["#ff4a66", "#ff522a", "#ff8000", "#55d48c", "#6fcb0b", "#ffb602", "#54d1c7", "#5498ff", "#976aeb"] // hygiene-ignore: 品牌多彩九宫格图标，固定色非语义 token
function AppGridIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 14 14" aria-hidden className={cn("size-3.5 shrink-0", className)}>
      {appGridColors.map((c, i) => (
        <rect key={i} x={(i % 3) * 5} y={Math.floor(i / 3) * 5} width="4" height="4" rx="1" fill={c} />
      ))}
    </svg>
  )
}

// 应用切换：当前应用名 + 下拉选择（受控）
function TopBarApps({
  current,
  apps,
  onSelect,
  className,
}: {
  current: string
  apps: { key: string; label: string }[]
  onSelect?: (key: string) => void
  className?: string
}) {
  return (
    <DropdownMenu>
      {/* 应用切换卡片：复用 Button(outline=白底)，无描边无阴影，grid 图标 + 应用名加粗 + 实心下三角 */}
      <DropdownMenuTrigger
        render={
          <Button
            variant="outline"
            size="md"
            className={cn("gap-1.5 rounded-lg border-transparent font-semibold", className)}
          />
        }
      >
        <AppGridIcon />
        {current}
        <CaretDownFilledIcon className="size-3 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {apps.map((a) => (
          <DropdownMenuItem key={a.key} selected={a.label === current} onClick={() => onSelect?.(a.key)}>
            {a.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// 中部搜索：范围下拉（全部▾）+ 输入框（受控）
function TopBarSearch({
  value,
  onValueChange,
  scope,
  scopes,
  onScopeChange,
  placeholder = "搜索",
  className,
}: {
  value: string
  onValueChange: (v: string) => void
  scope?: string
  scopes?: { key: string; label: string }[]
  onScopeChange?: (key: string) => void
  placeholder?: string
  className?: string
}) {
  return (
    <div
      data-slot="top-bar-search"
      className={cn(
        // 默认固定 240px 并靠右（与工具区成组，对齐主流全局顶栏；设计稿 290px，这里更紧凑）；宽度可由 className 覆盖
        // 半透明填充：待命 fill-subtle、hover 加深到 fill-hover、聚焦变实白；叠在任意宿主底色上都有反差（顶栏透明也不糊）
        // 300ms ease-out 缓冲，避免生硬（飞书式，不用硬阴影）
        "ml-auto flex h-8 w-60 max-w-full items-center rounded-lg bg-fill-subtle transition-colors duration-300 ease-out [&:hover:not(:focus-within)]:bg-fill-hover focus-within:bg-card",
        className
      )}
    >
      {scopes && scopes.length > 0 && (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex shrink-0 items-center gap-1 rounded-l-lg px-3 text-muted-foreground outline-none hover:text-foreground [&_svg]:size-3">
              {scopes.find((s) => s.key === scope)?.label ?? scopes[0].label}
              <ChevronDownIcon />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {scopes.map((s) => (
                <DropdownMenuItem key={s.key} selected={s.key === scope} onClick={() => onScopeChange?.(s.key)}>
                  {s.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <span className="h-4 w-px bg-border" />
        </>
      )}
      <Input
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        placeholder={placeholder}
        className="h-8 flex-1 rounded-none border-0 bg-transparent px-3 shadow-none focus-visible:ring-0"
      />
      <SearchIcon className="mr-3 size-4 shrink-0 text-muted-foreground" />
    </div>
  )
}

// 右侧工具区容器
function TopBarActions({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div data-slot="top-bar-actions" className={cn("flex shrink-0 items-center gap-2.5", className)}>
      {children}
    </div>
  )
}

// 工具图标按钮：plain 无底色图标 + Tooltip + 可选角标（dot/count）
function TopBarIconButton({
  icon,
  label,
  dot,
  count,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  dot?: boolean
  count?: number
  onClick?: () => void
}) {
  // 角标只裹图标本身，贴图标右上角（而非整个按钮方框，否则会飘在图标上方）
  // hover 出白色圆角底（宿主为浅灰，白底浮起），对齐公司 Figma
  const btn = (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label={label}
      onClick={onClick}
      className="rounded-lg transition-colors duration-200 ease-out [&_svg]:size-[18px] enabled:hover:bg-fill-hover enabled:hover:text-foreground enabled:active:bg-fill-subtle"
    >
      {dot || count != null ? (
        <Badge dot={dot} count={count} className={count != null ? "h-3.5 min-w-3.5 px-1 text-[9px]" : undefined}>
          {icon}
        </Badge>
      ) : (
        icon
      )}
    </Button>
  )
  return (
    <Tooltip>
      <TooltipTrigger render={btn} />
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}

export {
  TopBar,
  TopBarBrand,
  TopBarDivider,
  TopBarApps,
  TopBarSearch,
  TopBarActions,
  TopBarIconButton,
  TooltipProvider,
}
