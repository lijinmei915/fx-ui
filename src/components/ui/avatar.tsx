"use client"

import * as React from "react"
import { Avatar as AvatarPrimitive } from "@base-ui/react/avatar"

import { cn } from "@/lib/utils"

// 文字头像彩色背景（反白）：按内容 hash 取一个色系，实底(08 阶) + 白字(neutrals-01)。
// 参考 Gmail/Google 头像的中饱和实底白字；用 08 而非满饱和 09，柔半阶又保证白字对比。
const AVATAR_TONES = ["brand", "green", "amber", "red", "blue", "purple"] as const
const AvatarHasImageContext = React.createContext(false)

function hasAvatarImage(children: React.ReactNode): boolean {
  return React.Children.toArray(children).some((child) => {
    if (!React.isValidElement(child)) return false
    if (child.type === AvatarImage) return true
    const props = child.props as { children?: React.ReactNode }
    return hasAvatarImage(props.children)
  })
}

function avatarTone(seed: string) {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0
  return AVATAR_TONES[h % AVATAR_TONES.length]
}

// 兜底文字缩写取值逻辑（参考主流）：
//  - 中文：≤2 字全取；≥3 字取末两字（名），如「欧阳娜娜」→「娜娜」、「王小明」→「小明」。
//  - 英文：单名取首字母（Alice→A）；全名取首末两词首字母（John Doe→JD），统一大写。
function avatarInitials(name: string): string {
  const s = (name ?? "").trim()
  if (!s) return ""
  if (/[一-龥]/.test(s)) {
    const cjk = s.replace(/\s+/g, "")
    return cjk.length <= 2 ? cjk : cjk.slice(-2)
  }
  const parts = s.split(/\s+/).filter(Boolean)
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}

function Avatar({
  className,
  size = "default",
  shape = "circle",
  children,
  ...props
}: AvatarPrimitive.Root.Props & {
  size?: "xs" | "sm" | "default" | "lg" | "xl"
  shape?: "circle" | "square"
}) {
  const hasImage = hasAvatarImage(children)
  return (
    <AvatarHasImageContext.Provider value={hasImage}>
      <AvatarPrimitive.Root
        data-slot="avatar"
        data-size={size}
        data-shape={shape}
        className={cn(
          "group/avatar relative flex size-8 shrink-0 select-none rounded-full",
          "data-[size=xs]:size-5 data-[size=sm]:size-6 data-[size=lg]:size-10 data-[size=xl]:size-12",
          "data-[shape=square]:rounded-md data-[shape=square]:data-[size=xs]:rounded data-[shape=square]:data-[size=sm]:rounded-[5px] data-[shape=square]:data-[size=lg]:rounded-lg data-[shape=square]:data-[size=xl]:rounded-[10px]",
          className
        )}
        {...props}
      >
        {children}
      </AvatarPrimitive.Root>
    </AvatarHasImageContext.Provider>
  )
}

function AvatarImage({ className, ...props }: AvatarPrimitive.Image.Props) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn(
        "aspect-square size-full rounded-[inherit] object-cover",
        className
      )}
      {...props}
    />
  )
}

function AvatarFallback({
  className,
  colorful,
  children,
  style,
  ...props
}: AvatarPrimitive.Fallback.Props & { colorful?: boolean }) {
  const hasImage = React.useContext(AvatarHasImageContext)
  const seed = typeof children === "string" ? children : ""
  const tone = avatarTone(seed)
  const toneStyle = colorful
    ? { backgroundColor: `var(--fx-${tone}-08)`, color: "var(--fx-neutrals-01)", ...style }
    : style
  const fallbackClassName = cn(
    "flex size-full items-center justify-center rounded-[inherit] text-[11px] leading-none",
    colorful ? "" : "bg-muted text-muted-foreground",
    "group-data-[size=xs]/avatar:text-[8px] group-data-[size=sm]/avatar:text-[10px] group-data-[size=lg]/avatar:text-[13px] group-data-[size=xl]/avatar:text-[15px]",
    "[&>svg]:size-[18px] group-data-[size=xs]/avatar:[&>svg]:size-3 group-data-[size=sm]/avatar:[&>svg]:size-3.5 group-data-[size=lg]/avatar:[&>svg]:size-5 group-data-[size=xl]/avatar:[&>svg]:size-[22px]",
    className
  )

  if (!hasImage) {
    const { render: _render, ...spanProps } = props
    const spanStyle = typeof toneStyle === "function" ? undefined : toneStyle
    return (
      <span
        data-slot="avatar-fallback"
        style={spanStyle}
        className={fallbackClassName}
        {...spanProps}
      >
        {children}
      </span>
    )
  }

  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      style={toneStyle}
      className={fallbackClassName}
      {...props}
    >
      {children}
    </AvatarPrimitive.Fallback>
  )
}

// presence 状态色（参考 Slack/Teams）：在线绿 / 离开黄 / 忙红 / 离线灰。
const AVATAR_STATUS_TONE = {
  online: "bg-success",
  away: "bg-warning",
  busy: "bg-destructive",
  offline: "bg-muted-foreground",
} as const

function AvatarBadge({
  className,
  status,
  ...props
}: React.ComponentProps<"span"> & { status?: keyof typeof AVATAR_STATUS_TONE }) {
  return (
    <span
      data-slot="avatar-badge"
      data-status={status}
      className={cn(
        "absolute right-0 bottom-0 z-10 inline-flex items-center justify-center rounded-full text-primary-foreground bg-blend-color ring-2 ring-background select-none",
        status ? AVATAR_STATUS_TONE[status] : "bg-primary",
        "group-data-[size=xs]/avatar:size-1.5 group-data-[size=xs]/avatar:[&>svg]:hidden",
        "group-data-[size=sm]/avatar:size-2 group-data-[size=sm]/avatar:[&>svg]:hidden",
        "group-data-[size=default]/avatar:size-2.5 group-data-[size=default]/avatar:[&>svg]:size-2",
        "group-data-[size=lg]/avatar:size-3 group-data-[size=lg]/avatar:[&>svg]:size-2",
        "group-data-[size=xl]/avatar:size-3.5 group-data-[size=xl]/avatar:[&>svg]:size-2.5",
        className
      )}
      {...props}
    />
  )
}

function AvatarGroup({
  className,
  max,
  children,
  ...props
}: React.ComponentProps<"div"> & { max?: number }) {
  const items = React.Children.toArray(children)
  const shown = typeof max === "number" ? items.slice(0, max) : items
  const rest = typeof max === "number" ? items.length - shown.length : 0
  return (
    <div
      data-slot="avatar-group"
      className={cn(
        "group/avatar-group flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background",
        className
      )}
      {...props}
    >
      {shown}
      {rest > 0 ? <AvatarGroupCount>+{rest}</AvatarGroupCount> : null}
    </div>
  )
}

const AvatarGroupCount = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-slot="avatar-group-count"
      className={cn(
        "relative flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs text-muted-foreground ring-2 ring-background group-has-data-[size=xs]/avatar-group:size-5 group-has-data-[size=xs]/avatar-group:text-[10px] group-has-data-[size=sm]/avatar-group:size-6 group-has-data-[size=sm]/avatar-group:text-xs group-has-data-[size=lg]/avatar-group:size-10 group-has-data-[size=lg]/avatar-group:text-sm group-has-data-[size=xl]/avatar-group:size-12 group-has-data-[size=xl]/avatar-group:text-base [&>svg]:size-4 group-has-data-[size=lg]/avatar-group:[&>svg]:size-5 group-has-data-[size=sm]/avatar-group:[&>svg]:size-3",
        className
      )}
      {...props}
    />
  )
})
AvatarGroupCount.displayName = "AvatarGroupCount"

function AvatarComposite({
  className,
  max = 4,
  children,
  size = "default",
  ...props
}: React.ComponentProps<"div"> & {
  max?: 2 | 3 | 4
  size?: "xs" | "sm" | "default" | "lg" | "xl"
}) {
  const items = React.Children.toArray(children).slice(0, max)
  const count = items.length
  const cellStyle = (index: number): React.CSSProperties => {
    const half = "calc(50% - 0.5px)"
    const center = "calc(25% + 0.25px)"

    if (count === 2) {
      return {
        width: half,
        height: half,
        top: center,
        left: index === 0 ? 0 : "calc(50% + 0.5px)",
      }
    }

    if (count === 3) {
      if (index === 0) {
        return {
          width: half,
          height: half,
          top: 0,
          left: center,
        }
      }

      return {
        width: half,
        height: half,
        top: "calc(50% + 0.5px)",
        left: index === 1 ? 0 : "calc(50% + 0.5px)",
      }
    }

    return {
      width: half,
      height: half,
      top: index < 2 ? 0 : "calc(50% + 0.5px)",
      left: index % 2 === 0 ? 0 : "calc(50% + 0.5px)",
    }
  }

  return (
    <div
      data-slot="avatar-composite"
      data-size={size}
      data-count={count}
      className={cn(
        "relative shrink-0 overflow-hidden rounded-md bg-muted",
        "size-8 data-[size=xs]:size-5 data-[size=sm]:size-6 data-[size=lg]:size-10 data-[size=xl]:size-12",
        className
      )}
      {...props}
    >
      {items.map((child, index) => (
        <div
          key={index}
          data-slot="avatar-composite-cell"
          style={cellStyle(index)}
          className="absolute min-h-0 min-w-0 overflow-hidden bg-background"
        >
          {React.isValidElement<{ className?: string; shape?: "square" }>(child)
            ? React.cloneElement(child, {
                shape: "square",
                className: cn(
                  "size-full",
                  child.props.className,
                  "!rounded-none [&>[data-slot=avatar-fallback]]:!rounded-none [&>img]:!rounded-none"
                ),
              })
            : child}
        </div>
      ))}
    </div>
  )
}

export {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarComposite,
  AvatarBadge,
  avatarInitials,
}
