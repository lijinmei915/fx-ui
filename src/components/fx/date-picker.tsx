import * as React from "react"
import type { DateRange } from "react-day-picker"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { SelectMultiValue } from "@/components/ui/select"
import { CalendarIcon, XIcon } from "@/lib/icons"
import { cn } from "@/lib/utils"

const datePickerSizeClassName = {
  xs: "h-(--fds-g-sizing-control-block-xs) rounded-md px-(--fds-g-spacing-control-inline-xs) text-xs",
  sm: "h-(--fds-g-sizing-control-block-sm) rounded-md px-2 text-sm",
  md: "h-(--fds-g-sizing-control-block-md) rounded-lg px-2 text-base",
} as const

const datePickerIconClassName = {
  xs: "size-4",
  sm: "size-5",
  md: "size-6",
} as const

const calendarStartMonth = new Date(new Date().getFullYear() - 100, 0)
const calendarEndMonth = new Date(new Date().getFullYear() + 100, 11)

type DatePickerSize = keyof typeof datePickerSizeClassName
type DatePickerRangeValue = DateRange
type DatePickerPicker = "date" | "week" | "month" | "quarter" | "year"
type DatePickerMultipleValue = Date[]

type DatePickerCommonProps = {
  placeholder?: string
  startPlaceholder?: string
  endPlaceholder?: string
  format?: Intl.DateTimeFormatOptions
  minDate?: Date
  maxDate?: Date
  disabledDate?: (date: Date) => boolean
  presets?: Array<{ label: React.ReactNode; value: Date | DateRange | Date[] }>
  variant?: "outlined" | "borderless"
  open?: boolean
  onOpenChange?: (open: boolean) => void
  showToday?: boolean
  picker?: DatePickerPicker
  size?: DatePickerSize
  disabled?: boolean
  clearable?: boolean
  "aria-invalid"?: boolean
  className?: string
  "data-state"?: "hover" | "focus" | "open"
}

type DatePickerProps = DatePickerCommonProps & (
  | {
      multiple: true
      range?: false
      picker?: "date"
      value?: DatePickerMultipleValue
      defaultValue?: DatePickerMultipleValue
      onValueChange?: (value: DatePickerMultipleValue | undefined) => void
    }
  | {
      multiple?: false
      range?: false
      value?: Date
      defaultValue?: Date
      onValueChange?: (value: Date | undefined) => void
    }
  | {
      multiple?: false
      range: true
      value?: DateRange
      defaultValue?: DateRange
      onValueChange?: (value: DateRange | undefined) => void
    }
)

function formatDate(value: Date, options?: Intl.DateTimeFormatOptions) {
  if (!options) {
    const year = value.getFullYear()
    const month = String(value.getMonth() + 1).padStart(2, "0")
    const day = String(value.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    ...options,
  }).format(value)
}

function formatPickerValue(value: Date, picker: DatePickerPicker, options?: Intl.DateTimeFormatOptions) {
  if (picker === "week") {
    const firstDay = new Date(value.getFullYear(), 0, 1)
    const firstWeekOffset = (firstDay.getDay() + 6) % 7
    const week = Math.floor((Math.floor((value.getTime() - firstDay.getTime()) / 86_400_000) + firstWeekOffset) / 7) + 1
    return `${value.getFullYear()}-${week}周`
  }
  if (picker === "month") return options ? new Intl.DateTimeFormat("zh-CN", { year: "numeric", month: "2-digit", ...options }).format(value) : `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, "0")}`
  if (picker === "quarter") return `${value.getFullYear()}-Q${Math.floor(value.getMonth() / 3) + 1}`
  if (picker === "year") return String(value.getFullYear())
  return formatDate(value, options)
}

function DatePicker({
  range = false,
  multiple = false,
  value,
  defaultValue,
  onValueChange,
  placeholder = "请选择日期",
  startPlaceholder = "开始日期",
  endPlaceholder = "结束日期",
  format,
  minDate,
  maxDate,
  disabledDate,
  presets,
  variant = "outlined",
  open: controlledOpen,
  onOpenChange,
  showToday = false,
  picker = "date",
  size = "sm",
  disabled,
  clearable,
  className,
  "aria-invalid": invalid,
  "data-state": dataState,
}: DatePickerProps) {
  const defaultSingleValue = defaultValue instanceof Date ? defaultValue : undefined
  const defaultMultipleValue = Array.isArray(defaultValue) ? defaultValue : undefined
  const defaultRangeValue = defaultValue && !(defaultValue instanceof Date) && !Array.isArray(defaultValue) ? defaultValue : undefined
  const [innerValue, setInnerValue] = React.useState<Date | undefined>(defaultSingleValue)
  const [innerMultipleValue, setInnerMultipleValue] = React.useState<DatePickerMultipleValue | undefined>(defaultMultipleValue)
  const [innerRangeValue, setInnerRangeValue] = React.useState<DateRange | undefined>(defaultRangeValue)
  const [innerOpen, setInnerOpen] = React.useState(dataState === "open")
  const resolvedControlledOpen = controlledOpen ?? innerOpen
  const selectedValue = value instanceof Date ? value : innerValue
  const selectedMultipleValue = Array.isArray(value) ? value : innerMultipleValue
  const selectedRangeValue = value && !(value instanceof Date) && !Array.isArray(value) ? value : innerRangeValue
  const [panelDate, setPanelDate] = React.useState(selectedValue ?? new Date())
  const [weekPreview, setWeekPreview] = React.useState<DateRange | undefined>()
  const resolvedOpen = dataState === "open" ? true : resolvedControlledOpen
  const hasValue = multiple ? Boolean(selectedMultipleValue?.length) : range ? Boolean(selectedRangeValue?.from || selectedRangeValue?.to) : Boolean(selectedValue)

  const setValue = (next: Date | undefined) => {
    if (value === undefined) {
      setInnerValue(next)
    }
    if (!range) (onValueChange as ((value: Date | undefined) => void) | undefined)?.(next)
  }

  const setMultipleValue = (next: DatePickerMultipleValue | undefined) => {
    if (value === undefined) setInnerMultipleValue(next)
    if (multiple) (onValueChange as ((value: DatePickerMultipleValue | undefined) => void) | undefined)?.(next)
  }

  const setRangeValue = (next: DateRange | undefined) => {
    if (value === undefined) setInnerRangeValue(next)
    if (range) (onValueChange as ((value: DateRange | undefined) => void) | undefined)?.(next)
  }

  const selectGranularity = (date: Date) => {
    setPanelDate(date)
    setValue(date)
    if (controlledOpen === undefined) setInnerOpen(false)
    onOpenChange?.(false)
  }

  const selectWeek = (date: Date) => {
    const day = date.getDay()
    const offset = day === 0 ? -6 : 1 - day
    const start = new Date(date)
    start.setDate(date.getDate() + offset)
    start.setHours(0, 0, 0, 0)
    const end = new Date(start)
    end.setDate(start.getDate() + 6)
    end.setHours(23, 59, 59, 999)
    setWeekPreview({ from: start, to: end })
    setValue(start)
    if (controlledOpen === undefined) setInnerOpen(false)
    onOpenChange?.(false)
  }

  const granularityOptions = React.useMemo(() => {
    if (picker === "month") return Array.from({ length: 12 }, (_, month) => new Date(panelDate.getFullYear(), month, 1))
    if (picker === "quarter") return [0, 1, 2, 3].map((quarter) => new Date(panelDate.getFullYear(), quarter * 3, 1))
    if (picker === "year") return Array.from({ length: 12 }, (_, index) => new Date(panelDate.getFullYear() - 5 + index, 0, 1))
    return []
  }, [panelDate, picker])

  return (
    <Popover open={resolvedOpen} onOpenChange={disabled ? undefined : (next) => {
      if (controlledOpen === undefined) setInnerOpen(next)
      onOpenChange?.(next)
    }}>
      <div
        data-slot="date-picker"
        data-size={size}
        data-state={dataState}
        aria-invalid={invalid}
        className={cn(
          cn("group/date-picker inline-flex w-full min-w-0 items-center gap-2 bg-surface text-left transition-colors has-[button:disabled]:cursor-not-allowed has-[button:disabled]:bg-muted has-[button:disabled]:text-foreground-disabled aria-invalid:border-destructive data-[state=hover]:border-ring data-[state=focus]:border-ring data-[state=open]:border-ring", variant === "borderless" ? "border border-transparent" : "border border-input"),
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
              className="flex min-w-0 flex-1 items-center gap-2 text-left outline-none"
            />
          }
        >
          <CalendarIcon className={cn("shrink-0 text-foreground-disabled", datePickerIconClassName[size])} />
          <span
            data-slot="date-picker-value"
            className={cn(
              "min-w-0 flex-1 truncate",
              multiple
                ? selectedMultipleValue?.length ? "text-foreground" : "text-foreground-disabled"
                : range
                ? selectedRangeValue?.from || selectedRangeValue?.to ? "text-foreground" : "text-foreground-disabled"
                : selectedValue ? "text-foreground" : "text-foreground-disabled"
            )}
          >
            {multiple ? (
              selectedMultipleValue?.length ? (
                <SelectMultiValue
                  items={selectedMultipleValue.map((date) => ({ value: date.toISOString(), label: formatPickerValue(date, picker, format) }))}
                  onRemove={(dateKey) => setMultipleValue(selectedMultipleValue.filter((date) => date.toISOString() !== dateKey))}
                  getRemoveLabel={(item) => `移除 ${item.label}`}
                />
              ) : placeholder
            ) : range ? (
              <span className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-(--fds-g-spacing-control-gap)">
                <span className="truncate">{selectedRangeValue?.from ? formatDate(selectedRangeValue.from, format) : startPlaceholder}</span>
                <span className="text-muted-foreground">-</span>
                <span className="truncate">{selectedRangeValue?.to ? formatDate(selectedRangeValue.to, format) : endPlaceholder}</span>
              </span>
            ) : selectedValue ? formatPickerValue(selectedValue, picker, format) : placeholder}
          </span>
        </PopoverTrigger>
        {clearable && hasValue && !disabled ? (
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            aria-label="清除日期"
            data-slot="date-picker-clear"
            className="pointer-events-none invisible group-hover/date-picker:pointer-events-auto group-hover/date-picker:visible"
            onClick={() => multiple ? setMultipleValue(undefined) : range ? setRangeValue(undefined) : setValue(undefined)}
          >
            <XIcon />
          </Button>
        ) : null}
      </div>
      <PopoverContent align="start" sideOffset={8} className="w-auto p-0">
        {presets?.length ? (
          <div className="flex flex-wrap gap-1 border-b border-border-subtle p-2">
            {presets.map((preset) => (
              <Button
                key={String(preset.label)}
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (range && !(preset.value instanceof Date) && !Array.isArray(preset.value)) setRangeValue(preset.value)
                  if (multiple && Array.isArray(preset.value)) setMultipleValue(preset.value)
                  if (!range && !multiple && preset.value instanceof Date) {
                    setValue(preset.value)
                    if (controlledOpen === undefined) setInnerOpen(false)
                    onOpenChange?.(false)
                  }
                }}
              >
                {preset.label}
              </Button>
            ))}
          </div>
        ) : null}
        {multiple ? (
          <Calendar
            mode="multiple"
            startMonth={calendarStartMonth}
            endMonth={calendarEndMonth}
            selected={selectedMultipleValue}
            defaultMonth={selectedMultipleValue?.[0]}
            disabled={(date) => (minDate && date < minDate) || (maxDate && date > maxDate) || Boolean(disabledDate?.(date))}
            onSelect={(next) => setMultipleValue(next)}
          />
        ) : picker !== "date" && picker !== "week" && !range ? (
          <div className="grid w-64 grid-cols-3 gap-1 p-2">
            {granularityOptions.map((date) => (
              <Button key={date.toISOString()} type="button" variant="ghost" size="sm" onClick={() => selectGranularity(date)}>
                {picker === "month" ? `${date.getMonth() + 1}月` : picker === "quarter" ? `第${date.getMonth() / 3 + 1}季度` : `${date.getFullYear()}年`}
              </Button>
            ))}
          </div>
        ) : range ? (
          <Calendar
            mode="range"
            resetOnSelect
            startMonth={calendarStartMonth}
            endMonth={calendarEndMonth}
            disabled={(date) => (minDate && date < minDate) || (maxDate && date > maxDate) || Boolean(disabledDate?.(date))}
            selected={selectedRangeValue}
            defaultMonth={selectedRangeValue?.from}
            onSelect={(next) => {
              setRangeValue(next)
            }}
          />
        ) : (
          // The calendar switches between single-date and week-range selection at runtime.
          // The underlying DayPicker union cannot express this discriminant in JSX.
          // @ts-expect-error mode-specific props are selected by picker at runtime.
          <Calendar
            mode={picker === "week" ? "range" : "single"}
            resetOnSelect={picker === "week"}
            startMonth={calendarStartMonth}
            endMonth={calendarEndMonth}
            disabled={(date) => (minDate && date < minDate) || (maxDate && date > maxDate) || Boolean(disabledDate?.(date))}
            selected={picker === "week" ? weekPreview as never : selectedValue}
            onSelect={(next: Date | DateRange | undefined) => {
              const nextDate = next instanceof Date ? next : next?.from
              if (nextDate && picker === "week") selectWeek(nextDate)
              else {
                setValue(nextDate)
                if (nextDate && !controlledOpen) setInnerOpen(false)
                if (nextDate) onOpenChange?.(false)
              }
            }}
          />
        )}
        {showToday && !range ? (
          <div className="border-t border-border-subtle p-2">
            <Button type="button" variant="ghost" size="sm" className="w-full" onClick={() => {
              const today = new Date()
              setValue(today)
              if (!controlledOpen) setInnerOpen(false)
              onOpenChange?.(false)
            }}>今天</Button>
          </div>
        ) : null}
      </PopoverContent>
    </Popover>
  )
}

export { DatePicker, type DatePickerProps, type DatePickerRangeValue, type DatePickerPicker }
