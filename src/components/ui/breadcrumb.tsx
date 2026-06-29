import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"

import { cn } from "@/lib/utils"
import { ChevronRightIcon, MoreHorizontalIcon } from "@/lib/icons"

function Breadcrumb({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      aria-label="breadcrumb"
      data-slot="breadcrumb"
      className={cn(className)}
      {...props}
    />
  )
}

// 尺寸档（对齐企业 web 规范）：lg=15 / default=13 / sm=12，字号驱动整条面包屑。
const breadcrumbSizes = {
  lg: "text-lg",
  default: "text-base",
  sm: "text-sm",
} as const

function BreadcrumbList({
  className,
  size = "default",
  ...props
}: React.ComponentProps<"ol"> & { size?: keyof typeof breadcrumbSizes }) {
  return (
    <ol
      data-slot="breadcrumb-list"
      data-size={size}
      className={cn(
        "flex flex-wrap items-center gap-1.5 wrap-break-word text-muted-foreground",
        breadcrumbSizes[size],
        className
      )}
      {...props}
    />
  )
}

function BreadcrumbItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="breadcrumb-item"
      className={cn("inline-flex items-center gap-1", className)}
      {...props}
    />
  )
}

function BreadcrumbLink({
  className,
  render,
  ...props
}: useRender.ComponentProps<"a">) {
  return useRender({
    defaultTagName: "a",
    props: mergeProps<"a">(
      {
        // 默认不带图标；需要图标时把 icon 放进 children，自动 inline 排版并按字号缩放
        className: cn("inline-flex items-center gap-1 transition-colors hover:text-foreground [&>svg]:size-[1.15em] [&>svg]:shrink-0", className),
      },
      props
    ),
    render,
    state: {
      slot: "breadcrumb-link",
    },
  })
}

function BreadcrumbPage({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="breadcrumb-page"
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn("inline-flex items-center gap-1 font-normal text-foreground [&>svg]:size-[1.15em] [&>svg]:shrink-0", className)}
      {...props}
    />
  )
}

function BreadcrumbSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="breadcrumb-separator"
      role="presentation"
      aria-hidden="true"
      className={cn("[&>svg]:size-3.5", className)}
      {...props}
    >
      {children ?? (
        <ChevronRightIcon />
      )}
    </li>
  )
}

function BreadcrumbEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="breadcrumb-ellipsis"
      role="presentation"
      aria-hidden="true"
      className={cn(
        "flex size-5 items-center justify-center [&>svg]:size-4",
        className
      )}
      {...props}
    >
      <MoreHorizontalIcon
      />
      <span className="sr-only">More</span>
    </span>
  )
}

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
}
