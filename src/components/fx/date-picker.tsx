import * as React from "react"
import type { DateRange } from "react-day-picker"

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
type DatePickerRangeValue = DateRange

type DatePickerCommonProps = {
  placeholder?: string
  startPlaceholder?: string
  endPlaceholder?: string
  size?: DatePickerSize
  disabled?: boolean
  clearable?: boolean
  "aria-invalid"?: boolean
  className?: string
  "data-state"?: "hover" | "focus" | "open"
}

type DatePickerProps = DatePickerCommonProps & (
  | {
      range?: false
      value?: Date
      defaultValue?: Date
      onValueChange?: (value: Date | undefined) => void
    }
  | {
      range: true
      value?: DateRange
      defaultValue?: DateRange
      onValueChange?: (value: DateRange | undefined) => void
    }
)

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(value)
}

function DatePicker({
  range = false,
  value,
  defaultValue,
  onValueChange,
  placeholder = "请选择日期",
  startPlaceholder = "开始日期",
  endPlaceholder = "结束日期",
  size = "sm",
  disabled,
  clearable,
  className,
  "aria-invalid": invalid,
  "data-state": dataState,
}: DatePickerProps) {
  const defaultSingleValue = defaultValue instanceof Date ? defaultValue : undefined
  const defaultRangeValue = defaultValue && !(defaultValue instanceof Date) ? defaultValue : undefined
  const [innerValue, setInnerValue] = React.useState<Date | undefined>(defaultSingleValue)
  const [innerRangeValue, setInnerRangeValue] = React.useState<DateRange | undefined>(defaultRangeValue)
  const [open, setOpen] = React.useState(dataState === "open")
  const selectedValue = value instanceof Date ? value : innerValue
  const selectedRangeValue = value && !(value instanceof Date) ? value : innerRangeValue
  const resolvedOpen = dataState === "open" ? true : open

  const setValue = (next: Date | undefined) => {
    if (value === undefined) {
      setInnerValue(next)
    }
    if (!range) (onValueChange as ((value: Date | undefined) => void) | undefined)?.(next)
  }

  const setRangeValue = (next: DateRange | undefined) => {
    if (value === undefined) setInnerRangeValue(next)
    if (range) (onValueChange as ((value: DateRange | undefined) => void) | undefined)?.(next)
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
              range
                ? selectedRangeValue?.from || selectedRangeValue?.to ? "text-foreground" : "text-foreground-disabled"
                : selectedValue ? "text-foreground" : "text-foreground-disabled"
            )}
          >
            {range ? (
              <span className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-(--fx-control-gap)">
                <span className="truncate">{selectedRangeValue?.from ? formatDate(selectedRangeValue.from) : startPlaceholder}</span>
                <span className="text-muted-foreground">-</span>
                <span className="truncate">{selectedRangeValue?.to ? formatDate(selectedRangeValue.to) : endPlaceholder}</span>
              </span>
            ) : selectedValue ? formatDate(selectedValue) : placeholder}
          </span>
        </PopoverTrigger>
        {clearable && (range ? selectedRangeValue?.from || selectedRangeValue?.to : selectedValue) && !disabled ? (
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            aria-label="清除日期"
            data-slot="date-picker-clear"
            onClick={() => range ? setRangeValue(undefined) : setValue(undefined)}
          >
            <XIcon />
          </Button>
        ) : null}
      </div>
      <PopoverContent align="start" sideOffset={8} className="w-auto p-0">
        {range ? (
          <Calendar
            mode="range"
            selected={selectedRangeValue}
            defaultMonth={selectedRangeValue?.from}
            onSelect={(next) => {
              setRangeValue(next)
              if (next?.from && next.to) setOpen(false)
            }}
          />
        ) : (
          <Calendar
            mode="single"
            selected={selectedValue}
            onSelect={(next) => {
              setValue(next)
              if (next) setOpen(false)
            }}
          />
        )}
      </PopoverContent>
    </Popover>
  )
}

export { DatePicker, type DatePickerProps, type DatePickerRangeValue }
