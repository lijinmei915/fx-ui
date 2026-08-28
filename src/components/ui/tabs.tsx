"use client"

import { Tabs as TabsPrimitive } from "@base-ui/react/tabs"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

function Tabs({
  className,
  orientation = "horizontal",
  ...props
}: TabsPrimitive.Root.Props) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-orientation={orientation}
      orientation={orientation}
      className={cn(
        "group/tabs flex gap-2 data-horizontal:flex-col",
        className
      )}
      {...props}
    />
  )
}

const tabsListVariants = cva(
  "group/tabs-list inline-flex w-fit items-center justify-center rounded-lg p-[3px] text-muted-foreground group-data-vertical/tabs:h-fit group-data-vertical/tabs:flex-col data-[variant=line]:rounded-none",
  {
    variants: {
      variant: {
        default: "bg-muted",
        line: "gap-1 bg-transparent",
      },
      size: {
        sm: "[--tabs-trigger-height:var(--fds-g-sizing-control-block-sm)] group-data-horizontal/tabs:h-(--fds-g-sizing-control-block-sm)",
        md: "[--tabs-trigger-height:var(--fds-g-sizing-control-block-md)] group-data-horizontal/tabs:h-(--fds-g-sizing-control-block-md)",
        lg: "[--tabs-trigger-height:var(--fds-g-sizing-control-block-lg)] group-data-horizontal/tabs:h-(--fds-g-sizing-control-block-lg)",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

function TabsList({
  className,
  variant = "default",
  size = "md",
  ...props
}: TabsPrimitive.List.Props & VariantProps<typeof tabsListVariants>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      data-size={size}
      className={cn(tabsListVariants({ variant, size }), className)}
      {...props}
    />
  )
}

function TabsTrigger({ className, ...props }: TabsPrimitive.Tab.Props) {
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      className={cn(
        "relative inline-flex flex-1 items-center justify-center gap-(--fds-g-spacing-control-gap-tight) rounded-md border border-transparent py-0.5 font-medium whitespace-nowrap text-muted-foreground transition-all group-data-horizontal/tabs:h-[calc(100%-1px)] group-data-vertical/tabs:h-(--tabs-trigger-height) group-data-vertical/tabs:w-full group-data-vertical/tabs:justify-start group-data-[size=sm]/tabs-list:px-(--fds-g-spacing-control-inline-xs) group-data-[size=sm]/tabs-list:text-sm group-data-[size=md]/tabs-list:px-(--fds-g-spacing-control-inline-xs) group-data-[size=md]/tabs-list:text-base group-data-[size=lg]/tabs-list:px-(--fds-g-spacing-control-inline-sm) group-data-[size=lg]/tabs-list:text-lg hover:text-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none disabled:pointer-events-none disabled:text-foreground-disabled has-data-[icon=inline-end]:pr-[calc(var(--fds-g-spacing-control-inline-xs)-2px)] has-data-[icon=inline-start]:pl-[calc(var(--fds-g-spacing-control-inline-xs)-2px)] aria-disabled:pointer-events-none aria-disabled:text-foreground-disabled dark:text-muted-foreground dark:hover:text-foreground group-data-[variant=default]/tabs-list:not-data-active:hover:bg-muted-hover group-data-[variant=default]/tabs-list:data-active:border-border-subtle [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        "group-data-[variant=line]/tabs-list:bg-transparent group-data-[variant=line]/tabs-list:data-active:bg-transparent dark:group-data-[variant=line]/tabs-list:data-active:border-transparent dark:group-data-[variant=line]/tabs-list:data-active:bg-transparent",
        "data-active:bg-background data-active:text-foreground dark:data-active:border-input dark:data-active:bg-input/30 dark:data-active:text-foreground",
        "after:absolute after:bg-foreground after:opacity-0 after:transition-opacity group-data-horizontal/tabs:after:inset-x-0 group-data-horizontal/tabs:after:bottom-[-5px] group-data-horizontal/tabs:after:h-0.5 group-data-vertical/tabs:after:inset-y-0 group-data-vertical/tabs:after:-right-1 group-data-vertical/tabs:after:w-0.5 group-data-[variant=line]/tabs-list:data-active:after:opacity-100",
        className
      )}
      {...props}
    />
  )
}

function TabsContent({ className, ...props }: TabsPrimitive.Panel.Props) {
  return (
    <TabsPrimitive.Panel
      data-slot="tabs-content"
      className={cn("flex-1 text-base outline-none", className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants }
