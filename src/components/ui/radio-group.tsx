import { Radio as RadioPrimitive } from "@base-ui/react/radio"
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group"

import { cn } from "@/lib/utils"

type RadioGroupItemSize = "sm" | "default" | "lg"

type RadioGroupItemProps = RadioPrimitive.Root.Props & {
  size?: RadioGroupItemSize
}

function RadioGroup({ className, ...props }: RadioGroupPrimitive.Props) {
  return (
    <RadioGroupPrimitive
      data-slot="radio-group"
      className={cn("grid w-full gap-2", className)}
      {...props}
    />
  )
}

function RadioGroupItem({ className, size = "default", ...props }: RadioGroupItemProps) {
  return (
    <RadioPrimitive.Root
      data-slot="radio-group-item"
      data-size={size}
      className={cn(
        "group/radio-group-item peer relative flex aspect-square size-3.5 shrink-0 rounded-full border border-input outline-none data-[size=sm]:size-3 data-[size=lg]:size-4 after:absolute after:-inset-x-3 after:-inset-y-2 hover:border-primary focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 data-disabled:cursor-not-allowed data-disabled:border-border-subtle data-disabled:bg-muted data-disabled:text-foreground-disabled data-disabled:data-checked:border-border-subtle data-disabled:data-checked:bg-muted data-disabled:data-checked:text-foreground-disabled aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 aria-invalid:aria-checked:border-primary dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground dark:data-checked:bg-primary",
        className
      )}
      {...props}
    >
      <RadioPrimitive.Indicator
        data-slot="radio-group-indicator"
        data-size={size}
        className="flex size-full items-center justify-center"
      >
        <span className="absolute top-1/2 left-1/2 size-1.75 -translate-x-1/2 -translate-y-1/2 rounded-full bg-current data-[size=sm]:size-1.5 data-[size=lg]:size-2" />
      </RadioPrimitive.Indicator>
    </RadioPrimitive.Root>
  )
}

export { RadioGroup, RadioGroupItem, type RadioGroupItemProps, type RadioGroupItemSize }
