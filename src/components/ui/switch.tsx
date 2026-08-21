"use client"

import { Switch as SwitchPrimitive } from "@base-ui/react/switch"
import type { ReactNode } from "react"

import { cn } from "@/lib/utils"
import { Spinner } from "@/components/ui/spinner"

type SwitchProps = SwitchPrimitive.Root.Props & {
  size?: SwitchSize
  loading?: boolean
  checkedChildren?: ReactNode
  unCheckedChildren?: ReactNode
}

type SwitchSize = "micro" | "mini" | "small" | "medium"

function Switch({
  className,
  size = "small",
  loading = false,
  checkedChildren,
  unCheckedChildren,
  disabled,
  ...props
}: SwitchProps) {
  const hasContent = checkedChildren != null || unCheckedChildren != null

  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      data-content={hasContent ? "true" : undefined}
      data-loading={loading ? "true" : undefined}
      aria-busy={loading || undefined}
      disabled={disabled || loading}
      className={cn(
        "peer group/switch relative inline-flex shrink-0 items-center overflow-hidden rounded-full border border-transparent transition-colors outline-none after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 data-[size=micro]:h-3 data-[size=micro]:w-5 data-[size=mini]:h-4 data-[size=mini]:w-7 data-[size=small]:h-[22px] data-[size=small]:w-[42px] data-[size=medium]:h-8 data-[size=medium]:w-[70px] dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 data-checked:bg-primary data-unchecked:bg-input dark:data-unchecked:bg-input/80 not-data-disabled:data-checked:hover:bg-primary-hover data-disabled:cursor-not-allowed data-disabled:data-checked:bg-primary-disabled data-disabled:data-unchecked:bg-surface-disabled data-disabled:text-foreground-disabled data-[loading=true]:data-checked:bg-primary-disabled data-[loading=true]:data-unchecked:bg-input data-[loading=true]:text-foreground",
        className
      )}
      {...props}
    >
      {hasContent ? (
        <span data-slot="switch-content" className="pointer-events-none absolute inset-0 flex items-center justify-between text-xs leading-none text-primary-foreground group-data-[size=micro]/switch:text-[8px] group-data-[size=mini]/switch:text-[9px] group-data-disabled/switch:text-foreground-disabled [&_svg]:size-2">
          <span className="flex flex-1 items-center justify-center group-data-unchecked/switch:invisible">{checkedChildren}</span>
          <span className="flex flex-1 items-center justify-center text-foreground-secondary group-data-checked/switch:invisible">{unCheckedChildren}</span>
        </span>
      ) : null}
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="pointer-events-none absolute left-px block rounded-full bg-surface ring-0 transition-transform group-data-[size=micro]/switch:size-2.5 group-data-[size=mini]/switch:size-3 group-data-[size=small]/switch:size-[18px] group-data-[size=medium]/switch:size-[26px] group-data-[size=micro]/switch:data-checked:translate-x-2 group-data-[size=mini]/switch:data-checked:translate-x-3 group-data-[size=small]/switch:data-checked:translate-x-5 group-data-[size=medium]/switch:data-checked:translate-x-[38px] group-data-[size=mini]/switch:left-0.5 group-data-[size=small]/switch:left-0.5 group-data-[size=medium]/switch:left-[3px] dark:data-checked:bg-primary-foreground dark:data-unchecked:bg-foreground group-data-disabled/switch:bg-surface"
      >
        {loading ? <Spinner aria-hidden="true" className="size-full p-0.5 text-primary" /> : null}
      </SwitchPrimitive.Thumb>
    </SwitchPrimitive.Root>
  )
}

export { Switch, type SwitchProps, type SwitchSize }
