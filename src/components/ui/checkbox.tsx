import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox"

import { cn } from "@/lib/utils"
import { CheckIcon, MinusIcon } from "@/lib/icons"

type CheckboxSize = "sm" | "default" | "lg"

type CheckboxProps = CheckboxPrimitive.Root.Props & {
  size?: CheckboxSize
}

function Checkbox({ className, indeterminate, size = "default", ...props }: CheckboxProps) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      data-size={size}
      indeterminate={indeterminate}
      className={cn(
        "peer relative flex size-3.5 shrink-0 items-center justify-center rounded-[4px] border border-input transition-colors outline-none data-[size=sm]:size-3 data-[size=lg]:size-4 after:absolute after:-inset-x-3 after:-inset-y-2 hover:border-primary focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 data-disabled:cursor-not-allowed data-disabled:border-border-subtle data-disabled:bg-muted data-disabled:text-foreground-disabled data-disabled:data-checked:border-border-subtle data-disabled:data-checked:bg-muted data-disabled:data-checked:text-foreground-disabled data-disabled:data-indeterminate:border-border-subtle data-disabled:data-indeterminate:bg-muted data-disabled:data-indeterminate:text-foreground-disabled aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 aria-invalid:aria-checked:border-primary dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground data-indeterminate:border-primary data-indeterminate:bg-primary data-indeterminate:text-primary-foreground not-data-disabled:data-checked:hover:border-primary-hover not-data-disabled:data-checked:hover:bg-primary-hover not-data-disabled:data-checked:active:border-primary-active not-data-disabled:data-checked:active:bg-primary-active not-data-disabled:data-indeterminate:hover:border-primary-hover not-data-disabled:data-indeterminate:hover:bg-primary-hover not-data-disabled:data-indeterminate:active:border-primary-active not-data-disabled:data-indeterminate:active:bg-primary-active dark:data-checked:bg-primary dark:data-indeterminate:bg-primary",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        data-size={size}
        className="grid place-content-center text-current transition-none [&>svg]:size-2.5 [&>svg]:!stroke-[2.4] data-[size=sm]:[&>svg]:size-2 data-[size=sm]:[&>svg]:!stroke-[3] data-[size=lg]:[&>svg]:size-3 data-[size=lg]:[&>svg]:!stroke-[2]"
      >
        {indeterminate ? <MinusIcon /> : <CheckIcon />}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox, type CheckboxProps, type CheckboxSize }
