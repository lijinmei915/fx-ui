import * as React from "react"
import { Select as SelectPrimitive } from "@base-ui/react/select"

import { cn } from "@/lib/utils"
import { ChevronDownIcon, ChevronUpIcon, XIcon } from "@/lib/icons"
import { Tag } from "@/components/ui/tag"

const Select = SelectPrimitive.Root

const SelectControlContext = React.createContext(false)

function SelectControl({
  className,
  onPointerEnter,
  onPointerLeave,
  onFocusCapture,
  onBlurCapture,
  ...props
}: React.ComponentProps<"div">) {
  const [hovered, setHovered] = React.useState(false)
  const [focusWithin, setFocusWithin] = React.useState(false)

  return (
    <SelectControlContext.Provider value={hovered || focusWithin}>
      <div
        data-slot="select-control"
        data-active={hovered || focusWithin ? true : undefined}
        className={cn("relative", className)}
        onPointerEnter={(event) => {
          setHovered(true)
          onPointerEnter?.(event)
        }}
        onPointerLeave={(event) => {
          setHovered(false)
          onPointerLeave?.(event)
        }}
        onFocusCapture={(event) => {
          setFocusWithin(true)
          onFocusCapture?.(event)
        }}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setFocusWithin(false)
          onBlurCapture?.(event)
        }}
        {...props}
      />
    </SelectControlContext.Provider>
  )
}

function SelectGroup({ className, ...props }: SelectPrimitive.Group.Props) {
  return (
    <SelectPrimitive.Group
      data-slot="select-group"
      className={cn("scroll-my-1", className)}
      {...props}
    />
  )
}

function SelectValue({ className, ...props }: SelectPrimitive.Value.Props) {
  return (
    <SelectPrimitive.Value
      data-slot="select-value"
      className={cn("flex flex-1 text-left", className)}
      {...props}
    />
  )
}

type SelectMultiValueItem = {
  value: string
  label: React.ReactNode
}

function SelectMultiValue({
  items,
  maxVisible = 2,
  className,
}: {
  items: SelectMultiValueItem[]
  maxVisible?: number
  className?: string
}) {
  const visibleItems = items.slice(0, Math.max(0, maxVisible))
  const overflowCount = Math.max(0, items.length - visibleItems.length)

  return (
    <span
      data-slot="select-multi-value"
      className={cn("flex min-w-0 flex-1 items-center gap-1 overflow-hidden", className)}
    >
      {visibleItems.map((item) => (
        <Tag key={item.value} variant="outline">
          {item.label}
        </Tag>
      ))}
      {overflowCount > 0 ? (
        <Tag data-slot="select-overflow-count" variant="secondary">
          +{overflowCount}
        </Tag>
      ) : null}
    </span>
  )
}

const selectTriggerSizeClassName = {
  xs: "h-(--fx-control-xs-height) rounded-md text-xs",
  sm: "h-(--fx-control-sm-height) rounded-md text-sm",
  md: "h-(--fx-control-md-height) rounded-lg text-base",
} as const

const selectContentSizeClassName = {
  xs: "text-xs",
  sm: "text-sm",
  md: "text-base",
} as const

const selectTriggerVariantClassName = {
  outline: "border-input bg-surface",
  borderless: "border-transparent bg-transparent hover:bg-muted data-[state=hover]:bg-muted data-popup-open:bg-muted",
} as const

type SelectTriggerSize = keyof typeof selectTriggerSizeClassName
type SelectTriggerVariant = keyof typeof selectTriggerVariantClassName

function SelectTrigger({
  className,
  size = "sm",
  variant = "outline",
  clearable = false,
  children,
  ...props
}: SelectPrimitive.Trigger.Props & {
  size?: SelectTriggerSize
  variant?: SelectTriggerVariant
  clearable?: boolean
}) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      data-variant={variant}
      data-clearable={clearable ? true : undefined}
      className={cn(
        "flex w-fit items-center justify-between gap-(--fx-control-gap-tight) border pr-(--fx-control-px-xs) pl-(--fx-control-px-sm) text-foreground whitespace-nowrap transition-colors outline-none select-none focus-visible:border-primary disabled:cursor-not-allowed disabled:bg-muted disabled:text-foreground-disabled disabled:opacity-100 aria-invalid:border-destructive data-[state=hover]:border-primary data-[state=focus]:border-primary data-popup-open:border-primary data-popup-open:bg-surface data-placeholder:text-foreground-disabled data-[clearable=true]:[&_[data-slot=select-value]]:pr-5 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-(--fx-control-gap-tight) dark:bg-input/30 dark:hover:bg-input/50 dark:aria-invalid:border-destructive/50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        selectTriggerSizeClassName[size],
        selectTriggerVariantClassName[variant],
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon
        render={
          <ChevronDownIcon data-slot="select-icon" className="pointer-events-none size-4 text-muted-foreground transition-transform data-[popup-open]:rotate-180" />
        }
      />
    </SelectPrimitive.Trigger>
  )
}

function SelectClear({
  className,
  type = "button",
  ...props
}: React.ComponentProps<"button">) {
  const visible = React.useContext(SelectControlContext)

  return (
    <button
      type={type}
      data-slot="select-clear"
      className={cn(
        "absolute top-1/2 right-7 z-10 flex size-4 -translate-y-1/2 items-center justify-center rounded-sm text-muted-foreground outline-none transition-[color,opacity] hover:text-foreground focus-visible:text-foreground disabled:pointer-events-none disabled:text-foreground-disabled [&_svg]:size-3.5",
        visible ? "opacity-100" : "opacity-0",
        className
      )}
      {...props}
    >
      <XIcon />
    </button>
  )
}

function SelectContent({
  className,
  children,
  size = "sm",
  side = "bottom",
  sideOffset = 4,
  align = "center",
  alignOffset = 0,
  alignItemWithTrigger = false,
  collisionAvoidance,
  ...props
}: SelectPrimitive.Popup.Props &
  Pick<
    SelectPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset" | "alignItemWithTrigger" | "collisionAvoidance"
  > & {
    size?: SelectTriggerSize
  }) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        alignItemWithTrigger={alignItemWithTrigger}
        collisionAvoidance={collisionAvoidance}
        className="isolate z-50"
      >
        <SelectPrimitive.Popup
          data-slot="select-content"
          data-size={size}
          data-align-trigger={alignItemWithTrigger}
          className={cn("relative isolate z-50 max-h-(--available-height) w-(--anchor-width) min-w-36 origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-md bg-popover py-2 text-popover-foreground shadow-l1 duration-100 data-[align-trigger=true]:animate-none data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95", selectContentSizeClassName[size], className )}
          {...props}
        >
          <SelectScrollUpButton />
          <SelectPrimitive.List>{children}</SelectPrimitive.List>
          <SelectScrollDownButton />
        </SelectPrimitive.Popup>
      </SelectPrimitive.Positioner>
    </SelectPrimitive.Portal>
  )
}

function SelectLabel({
  className,
  ...props
}: SelectPrimitive.GroupLabel.Props) {
  return (
    <SelectPrimitive.GroupLabel
      data-slot="select-label"
      className={cn("px-2 py-1 text-sm font-normal text-muted-foreground", className)}
      {...props}
    />
  )
}

function SelectItem({
  className,
  children,
  ...props
}: SelectPrimitive.Item.Props) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "relative flex min-h-8 w-full cursor-default items-center gap-1.5 rounded-md px-2 py-1 font-normal outline-hidden select-none data-[highlighted]:bg-muted data-[highlighted]:text-foreground data-[selected]:text-primary data-disabled:pointer-events-none data-disabled:text-foreground-disabled [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
        className
      )}
      {...props}
    >
      <SelectPrimitive.ItemText className="flex flex-1 shrink-0 gap-2 whitespace-nowrap">
        {children}
      </SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
}

function SelectSeparator({
  className,
  ...props
}: SelectPrimitive.Separator.Props) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn("pointer-events-none -mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  )
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpArrow>) {
  return (
    <SelectPrimitive.ScrollUpArrow
      data-slot="select-scroll-up-button"
      className={cn(
        "top-0 z-10 flex w-full cursor-default items-center justify-center bg-popover py-1 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <ChevronUpIcon
      />
    </SelectPrimitive.ScrollUpArrow>
  )
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownArrow>) {
  return (
    <SelectPrimitive.ScrollDownArrow
      data-slot="select-scroll-down-button"
      className={cn(
        "bottom-0 z-10 flex w-full cursor-default items-center justify-center bg-popover py-1 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <ChevronDownIcon
      />
    </SelectPrimitive.ScrollDownArrow>
  )
}

export {
  Select,
  SelectControl,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectMultiValue,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectClear,
  SelectTrigger,
  SelectValue,
}
