import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

const inputSizeClassName = {
  xs: "h-(--fds-g-sizing-control-block-xs) rounded-md px-(--fds-g-spacing-control-inline-xs) text-xs",
  sm: "h-(--fds-g-sizing-control-block-sm) rounded-md px-(--fds-g-spacing-control-inline-xs) text-sm",
  md: "h-(--fds-g-sizing-control-block-md) rounded-lg px-(--fds-g-spacing-control-inline-xs) text-base",
} as const

type InputSize = keyof typeof inputSizeClassName

// Semantic states used by the docs playground: data-input-state="hover|focus".
function Input({
  className,
  type,
  size = "sm",
  ...props
}: Omit<React.ComponentProps<"input">, "size"> & { size?: InputSize }) {
  return (
    <InputPrimitive
      type={type}
      data-size={size}
      data-slot="input"
      className={cn(
        "w-full min-w-0 border border-(--fds-c-input-color-border) bg-(--fds-c-input-color-background) py-1 transition-colors outline-none file:inline-flex file:h-(--fds-g-sizing-control-block-xs) file:border-0 file:bg-transparent file:text-base file:font-medium file:text-foreground placeholder:text-foreground-disabled hover:border-(--fds-c-input-color-border-hover) focus-visible:border-(--fds-c-input-color-border-focus) disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-muted disabled:text-foreground-disabled disabled:opacity-100 aria-invalid:!border-(--fds-c-input-color-border-invalid) dark:bg-input/30 dark:disabled:bg-input/80",
        "data-[input-state=hover]:border-(--fds-c-input-color-border-hover) data-[input-state=focus]:border-(--fds-c-input-color-border-focus)",
        "in-data-[slot=input-group]:h-full in-data-[slot=input-group]:border-0 in-data-[slot=input-group]:bg-transparent in-data-[slot=input-group]:px-(--fds-g-spacing-control-inline-xs) in-data-[slot=input-group]:ring-0 in-data-[slot=input-group]:focus-visible:border-transparent in-data-[slot=input-group]:disabled:bg-transparent group-data-[size=xs]/input-group:text-xs group-data-[size=sm]/input-group:text-sm group-data-[size=md]/input-group:text-base",
        type === "number" && "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
        type === "search" && "[&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none",
        inputSizeClassName[size],
        className
      )}
      {...props}
    />
  )
}

function InputGroup({
  className,
  size = "sm",
  ...props
}: React.ComponentProps<"div"> & { size?: InputSize }) {
  return (
    <div
      data-slot="input-group"
      data-size={size}
      className={cn(
        "group/input-group inline-flex w-full min-w-0 items-center overflow-hidden border border-(--fds-c-input-color-border) bg-(--fds-c-input-color-background) transition-colors",
        "hover:border-(--fds-c-input-color-border-hover) focus-within:border-(--fds-c-input-color-border-focus) has-aria-invalid:!border-(--fds-c-input-color-border-invalid) has-disabled:pointer-events-none has-disabled:bg-muted has-disabled:text-foreground-disabled",
        "data-[input-state=hover]:border-(--fds-c-input-color-border-hover) data-[input-state=focus]:border-(--fds-c-input-color-border-focus)",
        "data-[size=xs]:h-(--fds-g-sizing-control-block-xs) data-[size=xs]:rounded-md data-[size=sm]:h-(--fds-g-sizing-control-block-sm) data-[size=sm]:rounded-md data-[size=md]:h-(--fds-g-sizing-control-block-md) data-[size=md]:rounded-lg",
        className
      )}
      {...props}
    />
  )
}

function InputAddon({
  className,
  side = "start",
  ...props
}: React.ComponentProps<"span"> & { side?: "start" | "end" }) {
  return (
    <span
      data-slot="input-addon"
      data-side={side}
      className={cn(
        "flex h-full shrink-0 items-center gap-2 bg-surface px-2 text-sm text-foreground [&_svg]:size-4",
        "data-[side=start]:border-r data-[side=end]:border-l",
        "border-input group-data-[size=xs]/input-group:px-(--fds-g-spacing-control-inline-xs) group-data-[size=xs]/input-group:text-xs group-data-[size=xs]/input-group:[&_svg]:size-3.5 group-data-[size=sm]/input-group:text-sm",
        className
      )}
      {...props}
    />
  )
}

function InputAffix({
  className,
  side = "end",
  ...props
}: React.ComponentProps<"span"> & { side?: "start" | "end" }) {
  return (
    <span
      data-slot="input-affix"
      data-side={side}
      className={cn(
        "flex h-full min-w-4 shrink-0 items-center justify-center px-2 text-sm text-foreground-disabled data-[side=start]:pr-0 data-[side=end]:pl-0 [&_svg]:size-4",
        "group-data-[size=xs]/input-group:px-(--fds-g-spacing-control-inline-xs) group-data-[size=xs]/input-group:text-xs group-data-[size=xs]/input-group:[&_svg]:size-3.5 group-data-[size=sm]/input-group:text-sm",
        className
      )}
      {...props}
    />
  )
}

function InputAction({
  className,
  type = "button",
  variant = "icon",
  ...props
}: React.ComponentProps<"button"> & { variant?: "icon" | "primary" }) {
  return (
    <button
      type={type}
      data-slot="input-action"
      data-variant={variant}
      className={cn(
        "flex h-full shrink-0 items-center justify-center px-2 text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:text-foreground disabled:pointer-events-none disabled:text-foreground-disabled data-[clear=true]:pointer-events-none data-[clear=true]:invisible group-hover/input-group:data-[clear=true]:pointer-events-auto group-hover/input-group:data-[clear=true]:visible group-focus-within/input-group:data-[clear=true]:pointer-events-auto group-focus-within/input-group:data-[clear=true]:visible group-data-[input-state=hover]/input-group:data-[clear=true]:pointer-events-auto group-data-[input-state=hover]/input-group:data-[clear=true]:visible group-data-[input-state=focus]/input-group:data-[clear=true]:pointer-events-auto group-data-[input-state=focus]/input-group:data-[clear=true]:visible [&_svg]:size-4",
        "data-[variant=primary]:bg-primary data-[variant=primary]:text-primary-foreground data-[variant=primary]:hover:bg-primary-hover data-[variant=primary]:focus-visible:bg-primary-hover data-[variant=primary]:disabled:bg-primary-disabled data-[variant=primary]:disabled:text-primary-foreground",
        "group-data-[size=xs]/input-group:px-(--fds-g-spacing-control-inline-xs) group-data-[size=xs]/input-group:[&_svg]:size-3.5",
        className
      )}
      {...props}
    />
  )
}

export { Input, InputGroup, InputAddon, InputAffix, InputAction }
