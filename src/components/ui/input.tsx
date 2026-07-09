import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

const inputSizeClassName = {
  xs: "h-(--fx-control-xs-height) rounded-md px-(--fx-control-px-xs) text-xs",
  sm: "h-(--fx-control-sm-height) rounded-md px-(--fx-control-px-sm) text-sm",
  md: "h-(--fx-control-md-height) rounded-lg px-(--fx-control-px-sm) text-base",
} as const

type InputSize = keyof typeof inputSizeClassName

// Semantic states used by the docs playground: data-state="hover|focus".
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
        "w-full min-w-0 border border-input bg-surface py-1 transition-colors outline-none file:inline-flex file:h-(--fx-control-xs-height) file:border-0 file:bg-transparent file:text-base file:font-medium file:text-foreground placeholder:text-foreground-disabled focus-visible:border-ring disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-muted disabled:text-foreground-disabled disabled:opacity-100 aria-invalid:border-destructive dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50",
        "data-[state=hover]:border-ring data-[state=focus]:border-ring",
        "in-data-[slot=input-group]:h-full in-data-[slot=input-group]:border-0 in-data-[slot=input-group]:bg-transparent in-data-[slot=input-group]:px-(--fx-control-px-sm) in-data-[slot=input-group]:ring-0 in-data-[slot=input-group]:focus-visible:border-transparent in-data-[slot=input-group]:disabled:bg-transparent [[data-slot=input-affix]+&]:pl-1 [&+[data-slot=input-affix]]:pr-1 group-data-[size=xs]/input-group:text-xs group-data-[size=sm]/input-group:text-sm group-data-[size=md]/input-group:text-base",
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
        "group/input-group inline-flex w-full min-w-0 items-center overflow-hidden border border-input bg-surface transition-colors",
        "focus-within:border-ring has-aria-invalid:border-destructive has-disabled:pointer-events-none has-disabled:bg-muted has-disabled:text-foreground-disabled",
        "data-[state=hover]:border-ring data-[state=focus]:border-ring",
        "data-[size=xs]:h-(--fx-control-xs-height) data-[size=xs]:rounded-md data-[size=sm]:h-(--fx-control-sm-height) data-[size=sm]:rounded-md data-[size=md]:h-(--fx-control-md-height) data-[size=md]:rounded-lg",
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
        "flex h-full shrink-0 items-center gap-(--fx-control-gap-tight) bg-muted px-(--fx-control-px-sm) text-sm text-foreground [&_svg]:size-4",
        "data-[side=start]:border-r data-[side=end]:border-l",
        "border-border-subtle group-data-[size=xs]/input-group:px-(--fx-control-px-xs) group-data-[size=xs]/input-group:text-xs group-data-[size=xs]/input-group:[&_svg]:size-3.5 group-data-[size=sm]/input-group:text-sm",
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
        "flex h-full shrink-0 items-center px-(--fx-control-px-sm) text-sm text-foreground-disabled data-[side=start]:pr-0 data-[side=end]:pl-0 [&_svg]:size-4",
        "group-data-[size=xs]/input-group:px-(--fx-control-px-xs) group-data-[size=xs]/input-group:text-xs group-data-[size=xs]/input-group:[&_svg]:size-3.5 group-data-[size=sm]/input-group:text-sm",
        className
      )}
      {...props}
    />
  )
}

function InputAction({
  className,
  type = "button",
  ...props
}: React.ComponentProps<"button">) {
  return (
    <button
      type={type}
      data-slot="input-action"
      className={cn(
        "flex h-full shrink-0 items-center justify-center px-(--fx-control-px-sm) text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:text-foreground disabled:pointer-events-none disabled:text-foreground-disabled [&_svg]:size-4",
        "group-data-[size=xs]/input-group:px-(--fx-control-px-xs) group-data-[size=xs]/input-group:[&_svg]:size-3.5",
        className
      )}
      {...props}
    />
  )
}

export { Input, InputGroup, InputAddon, InputAffix, InputAction }
