import * as React from "react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, XIcon } from "@/lib/icons"
import { cn } from "@/lib/utils"

const datePickerSizeClassName = {
  xs: "h-(--fx-control-xs-height) rounded-md px-(--fx-control-px-xs) text-xs",
  sm: "h-(--fx-control-sm-height) rounded-md px-(--fx-control-px-sm) text-sm",
  md: "h-(--fx-control-md-height) rounded-lg px-(--fx-control-px-sm) text-base",
} as const

const datePickerIconClassName = {
  xs: "size-4",
  sm: "size-5",
  md: "size-6",
} as const

type DatePickerSize = keyof typeof datePickerSizeClassName

type DatePickerProps = {
  value?: Date
  defaultValue?: Date
  onValueChange?: (value: Date | undefined) => void
  placeholder?: string
  size?: DatePickerSize
  disabled?: boolean
  clearable?: boolean
  "aria-invalid"?: boolean
  className?: string
  "data-state"?: "hover" | "focus" | "open"
}

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(value)
}

function DatePicker({
  value,
  defaultValue,
  onValueChange,
  placeholder = "请选择日期",
  size = "sm",
  disabled,
  clearable,
  className,
  "aria-invalid": invalid,
  "data-state": dataState,
}: DatePickerProps) {
  const [innerValue, setInnerValue] = React.useState<Date | undefined>(defaultValue)
  const [open, setOpen] = React.useState(dataState === "open")
  const selectedValue = value ?? innerValue
  const resolvedOpen = dataState === "open" ? true : open

  const setValue = (next: Date | undefined) => {
    if (value === undefined) {
      setInnerValue(next)
    }
    onValueChange?.(next)
  }

  return (
    <Popover open={resolvedOpen} onOpenChange={disabled ? undefined : setOpen}>
      <div
        data-slot="date-picker"
        data-size={size}
        data-state={dataState}
        aria-invalid={invalid}
        className={cn(
          "inline-flex w-full min-w-0 items-center gap-(--fx-control-gap-tight) border border-input bg-surface text-left transition-colors has-[button:disabled]:cursor-not-allowed has-[button:disabled]:bg-muted has-[button:disabled]:text-foreground-disabled aria-invalid:border-destructive data-[state=hover]:border-ring data-[state=focus]:border-ring data-[state=open]:border-ring",
          datePickerSizeClassName[size],
          className
        )}
      >
        <PopoverTrigger
          render={
            <button
              type="button"
              data-slot="date-picker-trigger"
              disabled={disabled}
              className="flex min-w-0 flex-1 items-center gap-(--fx-control-gap-tight) text-left outline-none"
            />
          }
        >
          <CalendarIcon className={cn("shrink-0 text-foreground-disabled", datePickerIconClassName[size])} />
          <span
            data-slot="date-picker-value"
            className={cn(
              "min-w-0 flex-1 truncate",
              selectedValue ? "text-foreground" : "text-foreground-disabled"
            )}
          >
            {selectedValue ? formatDate(selectedValue) : placeholder}
          </span>
        </PopoverTrigger>
        {clearable && selectedValue && !disabled ? (
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            aria-label="清除日期"
            data-slot="date-picker-clear"
            onClick={() => setValue(undefined)}
          >
            <XIcon />
          </Button>
        ) : null}
      </div>
      <PopoverContent align="start" className="w-auto p-0">
        <Calendar
          mode="single"
          selected={selectedValue}
          onSelect={(next) => {
            setValue(next)
            if (next) {
              setOpen(false)
            }
          }}
        />
      </PopoverContent>
    </Popover>
  )
}

export { DatePicker, type DatePickerProps }
