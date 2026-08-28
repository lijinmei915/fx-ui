import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const cardVariants = cva(
  "group/card flex flex-col gap-(--card-spacing) overflow-hidden rounded-xl py-(--card-spacing) text-base text-card-foreground transition-[background-color,border-color,box-shadow] [--card-spacing:var(--fds-g-spacing-panel-padding)] has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0 *:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl [a]:cursor-pointer [a]:outline-none [button]:cursor-pointer [button]:appearance-none [button]:text-left [button]:outline-none [a]:focus-visible:border-ring [a]:focus-visible:ring-3 [a]:focus-visible:ring-ring/50 [button]:focus-visible:border-ring [button]:focus-visible:ring-3 [button]:focus-visible:ring-ring/50 [button]:disabled:cursor-not-allowed [button]:disabled:bg-surface-disabled [button]:disabled:text-foreground-disabled",
  {
    variants: {
      variant: {
        outline:
          "border border-border-strong bg-card [a]:hover:bg-muted [a]:active:bg-muted-hover [button]:not-disabled:hover:bg-muted [button]:not-disabled:active:bg-muted-hover",
        subtle:
          "border border-border-subtle bg-muted [a]:hover:bg-muted-hover [a]:active:bg-muted-active [button]:not-disabled:hover:bg-muted-hover [button]:not-disabled:active:bg-muted-active",
        elevated:
          "border border-border-container bg-card shadow-l1 [a]:hover:bg-muted [a]:active:bg-muted-hover [button]:not-disabled:hover:bg-muted [button]:not-disabled:active:bg-muted-hover",
      },
      size: {
        sm: "[--card-spacing:calc(var(--fds-g-spacing-panel-padding)-2px)]",
        md: "[--card-spacing:var(--fds-g-spacing-panel-padding)]",
        lg: "[--card-spacing:calc(var(--fds-g-spacing-panel-padding)+4px)]",
      },
    },
    defaultVariants: {
      variant: "outline",
      size: "md",
    },
  }
)

type CardProps = useRender.ComponentProps<"div"> &
  VariantProps<typeof cardVariants>

function Card({
  className,
  variant = "outline",
  size = "md",
  render,
  ...props
}: CardProps) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        className: cn(cardVariants({ variant, size }), className),
      },
      props
    ),
    render,
    state: {
      slot: "card",
      variant,
      size,
    },
  })
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "group/card-header @container/card-header grid auto-rows-min items-start gap-(--fds-g-spacing-control-gap-tight) rounded-t-xl px-(--card-spacing) has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] [.border-b]:pb-(--card-spacing)",
        className
      )}
      {...props}
    />
  )
}

function CardMedia({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-media"
      className={cn(
        "overflow-hidden first:-mt-(--card-spacing) [&>img]:block [&>img]:w-full [&>video]:block [&>video]:w-full",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        "font-heading text-base leading-snug font-medium group-data-[size=sm]/card:text-sm group-data-[size=lg]/card:text-lg",
        className
      )}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn(
        "text-base text-muted-foreground group-data-[size=sm]/card:text-sm",
        className
      )}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-(--card-spacing)", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex items-center gap-(--fds-g-spacing-control-gap) rounded-b-xl border-t bg-muted p-(--card-spacing)",
        className
      )}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardMedia,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
  cardVariants,
  type CardProps,
}
