import * as React from "react"
import { zhCN } from "date-fns/locale"
import type { DateRange } from "react-day-picker"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input, InputAffix, InputGroup } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { CalendarIcon, ClockIcon, XIcon } from "@/lib/icons"
import { cn } from "@/lib/utils"

const timePickerSizeClassName = {
  xs: "h-(--fds-g-sizing-control-block-xs) rounded-md px-(--fds-g-spacing-control-inline-xs) text-xs",
  sm: "h-(--fds-g-sizing-control-block-sm) rounded-md px-2 text-sm",
  md: "h-(--fds-g-sizing-control-block-md) rounded-lg px-2 text-base",
} as const

const timePickerIconClassName = {
  xs: "size-4",
  sm: "size-5",
  md: "size-6",
} as const

const timePickerClearIconClassName = {
  xs: "size-3",
  sm: "size-3.5",
  md: "size-4",
} as const

const calendarStartMonth = new Date(new Date().getFullYear() - 100, 0)
const calendarEndMonth = new Date(new Date().getFullYear() + 100, 11)

type TimePickerSize = keyof typeof timePickerSizeClassName

type TimePickerRangeValue = {
  start?: string
  end?: string
}

type DateTimePickerRangeValue = DateRange

type TimePickerCommonProps = {
  placeholder?: string
  startPlaceholder?: string
  endPlaceholder?: string
  size?: TimePickerSize
  mode?: "native" | "popover"
  picker?: "list" | "wheel"
  format?: "HH:mm" | "HH:mm:ss"
  step?: 15 | 30 | 60
  minuteStep?: 1 | 5 | 10 | 15 | 30
  secondStep?: 1 | 5 | 10 | 15 | 30
  needConfirm?: boolean
  disabledTime?: (time: { hours: number; minutes: number; seconds: number }) => boolean
  variant?: "outlined" | "borderless"
  open?: boolean
  onOpenChange?: (open: boolean) => void
  showNow?: boolean
  disabled?: boolean
  clearable?: boolean
  "aria-invalid"?: boolean
  className?: string
  "data-state"?: "hover" | "focus" | "open"
}

type TimePickerProps = TimePickerCommonProps & (
  | {
      range?: false
      value?: string
      defaultValue?: string
      onValueChange?: (value: string) => void
    }
  | {
      range: true
      value?: TimePickerRangeValue
      defaultValue?: TimePickerRangeValue
      onValueChange?: (value: TimePickerRangeValue) => void
    }
)

function padTimeUnit(value: number) {
  return String(value).padStart(2, "0")
}

function buildTimeOptions(step: 15 | 30 | 60) {
  const options: string[] = []
  for (let hour = 0; hour < 24; hour += 1) {
    for (let minute = 0; minute < 60; minute += step) {
      options.push(`${padTimeUnit(hour)}:${padTimeUnit(minute)}`)
    }
  }
  return options
}

function buildUnitOptions(max: number, step: number) {
  return Array.from({ length: Math.floor(max / step) }, (_, index) => index * step)
}

function parseTimeValue(value: string, format: "HH:mm" | "HH:mm:ss") {
  const [hours = "00", minutes = "00", seconds = "00"] = value.split(":")
  return {
    hours: Number(hours) || 0,
    minutes: Number(minutes) || 0,
    seconds: format === "HH:mm:ss" ? Number(seconds) || 0 : 0,
  }
}

function formatTimeValue(value: { hours: number; minutes: number; seconds: number }, format: "HH:mm" | "HH:mm:ss") {
  const base = `${padTimeUnit(value.hours)}:${padTimeUnit(value.minutes)}`
  return format === "HH:mm:ss" ? `${base}:${padTimeUnit(value.seconds)}` : base
}

function timeValueFromDate(value: Date | undefined, format: "HH:mm" | "HH:mm:ss") {
  if (!value) return format === "HH:mm:ss" ? "00:00:00" : "00:00"
  return formatTimeValue({ hours: value.getHours(), minutes: value.getMinutes(), seconds: value.getSeconds() }, format)
}

function mergeDateAndTime(date: Date, time: string, format: "HH:mm" | "HH:mm:ss") {
  const parsed = parseTimeValue(time, format)
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), parsed.hours, parsed.minutes, parsed.seconds)
}

function formatDateTime(value: Date, format: "HH:mm" | "HH:mm:ss") {
  const date = `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, "0")}-${String(value.getDate()).padStart(2, "0")}`
  return `${date} ${timeValueFromDate(value, format)}`
}

function TimeWheel({
  value,
  format,
  hours,
  minutes,
  seconds,
  labelPrefix,
  fill,
  onChange,
  disabledTime,
}: {
  value: { hours: number; minutes: number; seconds: number }
  format: "HH:mm" | "HH:mm:ss"
  hours: number[]
  minutes: number[]
  seconds: number[]
  labelPrefix?: string
  fill?: boolean
  onChange: (unit: "hours" | "minutes" | "seconds", value: number) => void
  disabledTime?: (time: { hours: number; minutes: number; seconds: number }) => boolean
}) {
  return (
    <div className={cn("grid gap-1", format === "HH:mm:ss" ? "grid-cols-3" : "grid-cols-2", fill && "min-h-0 flex-1 overflow-hidden")}>
      {[
        { key: "hours" as const, label: "时", values: hours },
        { key: "minutes" as const, label: "分", values: minutes },
        ...(format === "HH:mm:ss" ? [{ key: "seconds" as const, label: "秒", values: seconds }] : []),
      ].map((column) => (
        <div key={column.key} className={cn("min-w-0", fill && "flex min-h-0 flex-col")}>
          <div className="px-2 py-1 text-center text-xs text-muted-foreground">{column.label}</div>
          <div role="listbox" aria-label={`${labelPrefix ?? ""}${column.label}`} className={cn("flex max-h-48 flex-col gap-0.5 overflow-y-auto rounded-md border border-border-subtle p-1", fill && "max-h-none min-h-0 flex-1")}>
            {column.values.map((option) => {
              const active = value[column.key] === option
              return (
                <button
                  key={option}
                  type="button"
                  role="option"
                  aria-selected={active}
                  disabled={disabledTime?.({ hours: column.key === "hours" ? option : value.hours, minutes: column.key === "minutes" ? option : value.minutes, seconds: column.key === "seconds" ? option : value.seconds })}
                  className={cn("min-h-8 rounded-sm px-2 text-center text-sm text-foreground-secondary hover:bg-muted", active && "bg-muted text-primary")}
                  onClick={() => onChange(column.key, option)}
                >
                  {padTimeUnit(option)}
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

function TimePicker({
  range = false,
  value,
  defaultValue,
  onValueChange,
  placeholder = "请选择时间",
  startPlaceholder = "开始时间",
  endPlaceholder = "结束时间",
  size = "sm",
  mode = "popover",
  picker = "list",
  format = "HH:mm",
  step = 30,
  minuteStep = 1,
  secondStep = 1,
  needConfirm = true,
  disabledTime,
  variant = "outlined",
  open: controlledOpen,
  onOpenChange,
  showNow = false,
  disabled,
  clearable,
  className,
  "aria-invalid": invalid,
  "data-state": dataState,
}: TimePickerProps) {
  const defaultSingleValue = typeof defaultValue === "string" ? defaultValue : ""
  const defaultRangeValue = typeof defaultValue === "object" ? defaultValue : {}
  const [innerValue, setInnerValue] = React.useState(defaultSingleValue)
  const [innerRangeValue, setInnerRangeValue] = React.useState<TimePickerRangeValue>(defaultRangeValue)
  const [innerOpen, setInnerOpen] = React.useState(dataState === "open")
  const resolvedControlledOpen = controlledOpen ?? innerOpen
  const selectedValue = typeof value === "string" ? value : innerValue
  const selectedRangeValue = typeof value === "object" ? value : innerRangeValue
  const [draftValue, setDraftValue] = React.useState(selectedValue)
  const [draftRangeValue, setDraftRangeValue] = React.useState<TimePickerRangeValue>(selectedRangeValue)
  const options = React.useMemo(() => buildTimeOptions(step), [step])
  const wheelValue = React.useMemo(() => parseTimeValue(draftValue || selectedValue || "00:00", format), [draftValue, format, selectedValue])
  const startWheelValue = React.useMemo(() => parseTimeValue(draftRangeValue.start || selectedRangeValue.start || "00:00", format), [draftRangeValue.start, format, selectedRangeValue.start])
  const endWheelValue = React.useMemo(() => parseTimeValue(draftRangeValue.end || selectedRangeValue.end || "00:00", format), [draftRangeValue.end, format, selectedRangeValue.end])
  const wheelHours = React.useMemo(() => buildUnitOptions(24, 1), [])
  const wheelMinutes = React.useMemo(() => buildUnitOptions(60, minuteStep), [minuteStep])
  const wheelSeconds = React.useMemo(() => buildUnitOptions(60, secondStep), [secondStep])

  React.useEffect(() => {
    if (!resolvedControlledOpen) return
    setDraftValue(selectedValue)
    setDraftRangeValue(selectedRangeValue)
  }, [resolvedControlledOpen, selectedRangeValue, selectedValue])

  const setValue = (next: string) => {
    if (value === undefined) {
      setInnerValue(next)
    }
    if (!range) (onValueChange as ((value: string) => void) | undefined)?.(next)
  }

  const setRangeValue = (next: TimePickerRangeValue) => {
    if (value === undefined) setInnerRangeValue(next)
    if (range) (onValueChange as ((value: TimePickerRangeValue) => void) | undefined)?.(next)
  }

  if (mode === "native" && !range) {
    return (
      <InputGroup
        data-slot="time-picker"
        data-state={dataState}
        size={size}
        className={className}
      >
        <InputAffix side="start">
          <ClockIcon className={timePickerIconClassName[size]} />
        </InputAffix>
        <Input
          type="time"
          size={size}
          value={selectedValue}
          step={format === "HH:mm:ss" ? secondStep : step * 60}
          disabled={disabled}
          aria-invalid={invalid}
          onChange={(event) => setValue(event.currentTarget.value)}
        />
      </InputGroup>
    )
  }

  const resolvedOpen = dataState === "open" ? true : resolvedControlledOpen
  const closePicker = () => {
    if (controlledOpen === undefined) setInnerOpen(false)
    onOpenChange?.(false)
  }
  const previewClearVisible = dataState === "hover"
  const updateWheelUnit = (unit: "hours" | "minutes" | "seconds", next: number) => {
    setDraftValue(formatTimeValue({ ...wheelValue, [unit]: next }, format))
  }
  const updateRangeWheelUnit = (side: "start" | "end", unit: "hours" | "minutes" | "seconds", next: number) => {
    const current = side === "start" ? startWheelValue : endWheelValue
    setDraftRangeValue((previous) => ({ ...previous, [side]: formatTimeValue({ ...current, [unit]: next }, format) }))
  }
  const closeWheel = () => {
    setDraftValue(selectedValue)
    setDraftRangeValue(selectedRangeValue)
    if (controlledOpen === undefined) setInnerOpen(false)
    onOpenChange?.(false)
  }

  return (
    <Popover open={resolvedOpen} onOpenChange={disabled ? undefined : (next) => {
      if (controlledOpen === undefined) setInnerOpen(next)
      onOpenChange?.(next)
    }}>
      <PopoverTrigger
        render={
          <button
            type="button"
            data-slot="time-picker"
            data-size={size}
            data-state={dataState}
            disabled={disabled}
            aria-invalid={invalid}
            className={cn(
              cn("group/time-picker inline-flex w-full min-w-0 items-center gap-2 bg-surface text-left transition-colors outline-none focus-visible:border-ring disabled:cursor-not-allowed disabled:bg-muted disabled:text-foreground-disabled aria-invalid:border-destructive data-[state=hover]:border-ring data-[state=focus]:border-ring data-[state=open]:border-ring", variant === "borderless" ? "border border-transparent" : "border border-input"),
              timePickerSizeClassName[size],
              className
            )}
          />
        }
      >
        <ClockIcon className={cn("shrink-0 text-foreground-disabled", timePickerIconClassName[size])} />
        <span
          data-slot="time-picker-value"
          className={cn(
            "min-w-0 flex-1 truncate",
            range
              ? selectedRangeValue.start || selectedRangeValue.end ? "text-foreground" : "text-foreground-disabled"
              : selectedValue ? "text-foreground" : "text-foreground-disabled"
          )}
        >
          {range ? (
            <span className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-(--fds-g-spacing-control-gap)">
              <span className="truncate">{selectedRangeValue.start || startPlaceholder}</span>
              <span className="text-muted-foreground">-</span>
              <span className="truncate">{selectedRangeValue.end || endPlaceholder}</span>
            </span>
          ) : selectedValue || placeholder}
        </span>
        {clearable && (range ? selectedRangeValue.start || selectedRangeValue.end : selectedValue) && !disabled ? (
          <span
            role="button"
            tabIndex={-1}
            aria-label="清除时间"
            data-slot="time-picker-clear"
            className={cn(
              "flex shrink-0 items-center text-muted-foreground hover:text-foreground",
              previewClearVisible
                ? "pointer-events-auto visible"
                : "pointer-events-none invisible group-hover/time-picker:pointer-events-auto group-hover/time-picker:visible group-focus-within/time-picker:pointer-events-auto group-focus-within/time-picker:visible"
            )}
            onClick={(event) => {
              event.preventDefault()
              event.stopPropagation()
              if (range) setRangeValue({})
              else setValue("")
            }}
          >
            <XIcon className={timePickerClearIconClassName[size]} />
          </span>
        ) : null}
      </PopoverTrigger>
      <PopoverContent
        align="start"
        sideOffset={8}
        className={cn(
          "min-w-36 p-1",
          range ? "w-max min-w-(--anchor-width)" : "w-(--anchor-width)",
          range || picker === "wheel" ? "overflow-visible" : "max-h-64 overflow-y-auto"
        )}
      >
        {showNow && !range ? (
          <div className="border-b border-border-subtle pb-1">
            <Button type="button" variant="ghost" size="sm" className="w-full justify-center" onClick={() => {
              const now = new Date()
              const next = formatTimeValue({ hours: now.getHours(), minutes: now.getMinutes(), seconds: now.getSeconds() }, format)
              setValue(next)
              closePicker()
            }}>此刻</Button>
          </div>
        ) : null}
        {picker === "wheel" ? (
          <div data-slot="time-picker-wheel" className="flex flex-col gap-2">
            {range ? (
              <div className="grid grid-cols-[repeat(2,minmax(14rem,1fr))] gap-2">
                <div className="min-w-0">
                  <div className="flex min-h-8 items-center justify-center text-sm text-foreground-secondary">开始时间</div>
                  <TimeWheel value={startWheelValue} format={format} hours={wheelHours} minutes={wheelMinutes} seconds={wheelSeconds} labelPrefix="开始时间" disabledTime={disabledTime} onChange={(unit, next) => updateRangeWheelUnit("start", unit, next)} />
                </div>
                <div className="min-w-0">
                  <div className="flex min-h-8 items-center justify-center text-sm text-foreground-secondary">结束时间</div>
                  <TimeWheel value={endWheelValue} format={format} hours={wheelHours} minutes={wheelMinutes} seconds={wheelSeconds} labelPrefix="结束时间" disabledTime={disabledTime} onChange={(unit, next) => updateRangeWheelUnit("end", unit, next)} />
                </div>
              </div>
            ) : (
              <TimeWheel value={wheelValue} format={format} hours={wheelHours} minutes={wheelMinutes} seconds={wheelSeconds} disabledTime={disabledTime} onChange={updateWheelUnit} />
            )}
            {needConfirm ? (
              <div className="flex justify-end gap-2 border-t border-border-subtle pt-2">
                <Button type="button" variant="outline" size="sm" onClick={closeWheel}>取消</Button>
                <Button type="button" size="sm" onClick={() => {
                  if (range) setRangeValue({
                    start: draftRangeValue.start || formatTimeValue(startWheelValue, format),
                    end: draftRangeValue.end || formatTimeValue(endWheelValue, format),
                  })
                  else setValue(draftValue || formatTimeValue(wheelValue, format))
                  closePicker()
                }}>确定</Button>
              </div>
            ) : null}
          </div>
        ) : (
          range ? (
            <div data-slot="time-picker-list" className="flex flex-col gap-2">
              <div className="grid grid-cols-[repeat(2,minmax(14rem,1fr))] gap-2">
                {(["start", "end"] as const).map((side) => (
                  <div key={side} className="min-w-0">
                    <div className="flex min-h-8 items-center justify-center text-sm text-foreground-secondary">{side === "start" ? "开始时间" : "结束时间"}</div>
                    <div role="listbox" aria-label={side === "start" ? "开始时间" : "结束时间"} className="flex max-h-48 flex-col gap-0.5 overflow-y-auto rounded-md border border-border-subtle p-1">
                      {options.filter((option) => !disabledTime?.(parseTimeValue(option, format))).map((option) => (
                        <Button
                          key={option}
                          type="button"
                          variant={draftRangeValue[side] === option ? "secondary" : "ghost"}
                          size="sm"
                          className="justify-start"
                          onClick={() => setDraftRangeValue((previous) => ({ ...previous, [side]: option }))}
                        >
                          {option}
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-end gap-2 border-t border-border-subtle pt-2">
                <Button type="button" variant="outline" size="sm" onClick={closeWheel}>取消</Button>
                <Button type="button" size="sm" onClick={() => { setRangeValue(draftRangeValue); closePicker() }}>确定</Button>
              </div>
            </div>
          ) : (
            <div data-slot="time-picker-list" className="grid gap-0.5">
              {options.filter((option) => !disabledTime?.(parseTimeValue(option, format))).map((option) => (
                <Button
                  key={option}
                  type="button"
                  variant={(needConfirm ? draftValue : selectedValue) === option ? "secondary" : "ghost"}
                  size="sm"
                  className="justify-start"
                  onClick={() => {
                    if (needConfirm) {
                      setDraftValue(option)
                    } else {
                      setValue(option)
                      closePicker()
                    }
                  }}
                >
                  {option}
                </Button>
              ))}
              {needConfirm ? (
                <div className="flex justify-end gap-2 border-t border-border-subtle pt-2">
                  <Button type="button" variant="outline" size="sm" onClick={closeWheel}>取消</Button>
                  <Button type="button" size="sm" onClick={() => { setValue(draftValue); closePicker() }}>确定</Button>
                </div>
              ) : null}
            </div>
          )
        )}
      </PopoverContent>
    </Popover>
  )
}

type DateTimePickerCommonProps = {
  placeholder?: string
  startPlaceholder?: string
  endPlaceholder?: string
  size?: TimePickerSize
  format?: "HH:mm" | "HH:mm:ss"
  minDate?: Date
  maxDate?: Date
  disabledDate?: (date: Date) => boolean
  minuteStep?: 1 | 5 | 10 | 15 | 30
  secondStep?: 1 | 5 | 10 | 15 | 30
  variant?: "outlined" | "borderless"
  open?: boolean
  onOpenChange?: (open: boolean) => void
  showNow?: boolean
  disabled?: boolean
  clearable?: boolean
  "aria-invalid"?: boolean
  className?: string
  "data-state"?: "hover" | "focus" | "open"
}

type DateTimePickerProps = DateTimePickerCommonProps & (
  | {
      range?: false
      value?: Date
      defaultValue?: Date
      onValueChange?: (value: Date | undefined) => void
    }
  | {
      range: true
      value?: DateTimePickerRangeValue
      defaultValue?: DateTimePickerRangeValue
      onValueChange?: (value: DateTimePickerRangeValue | undefined) => void
    }
)

function DateTimePicker({
  range = false,
  value,
  defaultValue,
  onValueChange,
  placeholder = "请选择日期时间",
  startPlaceholder = "开始日期时间",
  endPlaceholder = "结束日期时间",
  size = "sm",
  format = "HH:mm:ss",
  minDate,
  maxDate,
  disabledDate,
  minuteStep = 1,
  secondStep = 1,
  variant = "outlined",
  open: controlledOpen,
  onOpenChange,
  showNow = false,
  disabled,
  clearable,
  className,
  "aria-invalid": invalid,
  "data-state": dataState,
}: DateTimePickerProps) {
  const defaultSingleValue = defaultValue instanceof Date ? defaultValue : undefined
  const defaultRangeValue = defaultValue && !(defaultValue instanceof Date) ? defaultValue : undefined
  const [innerValue, setInnerValue] = React.useState<Date | undefined>(defaultSingleValue)
  const [innerRangeValue, setInnerRangeValue] = React.useState<DateTimePickerRangeValue | undefined>(defaultRangeValue)
  const selectedValue = value instanceof Date ? value : innerValue
  const selectedRangeValue = value && !(value instanceof Date) ? value : innerRangeValue
  const [innerOpen, setInnerOpen] = React.useState(dataState === "open")
  const resolvedControlledOpen = controlledOpen ?? innerOpen
  const [draftDate, setDraftDate] = React.useState<Date | undefined>(selectedValue)
  const [draftRange, setDraftRange] = React.useState<DateTimePickerRangeValue | undefined>(selectedRangeValue)
  const [activeRangeSide, setActiveRangeSide] = React.useState<"start" | "end">("start")
  const [draftTime, setDraftTime] = React.useState(timeValueFromDate(selectedValue, format))
  const [draftRangeTime, setDraftRangeTime] = React.useState({
    start: timeValueFromDate(selectedRangeValue?.from, format),
    end: timeValueFromDate(selectedRangeValue?.to, format),
  })
  const [calendarHeight, setCalendarHeight] = React.useState<number>()
  const calendarObserverRef = React.useRef<ResizeObserver | null>(null)
  const calendarSyncFrameRef = React.useRef<number | undefined>(undefined)
  const calendarSyncTimerRef = React.useRef<number | undefined>(undefined)
  const openedValueRef = React.useRef<Date | undefined>(selectedValue)
  const openedRangeValueRef = React.useRef<DateTimePickerRangeValue | undefined>(selectedRangeValue)
  const wheelHours = React.useMemo(() => buildUnitOptions(24, 1), [])
  const wheelMinutes = React.useMemo(() => buildUnitOptions(60, minuteStep), [minuteStep])
  const wheelSeconds = React.useMemo(() => buildUnitOptions(60, secondStep), [secondStep])
  const wheelValue = React.useMemo(() => parseTimeValue(draftTime, format), [draftTime, format])
  const startWheelValue = React.useMemo(() => parseTimeValue(draftRangeTime.start, format), [draftRangeTime.start, format])
  const endWheelValue = React.useMemo(() => parseTimeValue(draftRangeTime.end, format), [draftRangeTime.end, format])
  const activeRangeDate = activeRangeSide === "start" ? draftRange?.from : draftRange?.to
  const activeRangeTime = activeRangeSide === "start" ? startWheelValue : endWheelValue
  const resolvedOpen = dataState === "open" ? true : resolvedControlledOpen
  const closeDateTimePicker = () => {
    if (controlledOpen === undefined) setInnerOpen(false)
    onOpenChange?.(false)
  }
  const hasValue = range ? Boolean(selectedRangeValue?.from || selectedRangeValue?.to) : Boolean(selectedValue)
  const previewClearVisible = dataState === "hover" || dataState === "focus" || dataState === "open"
  const displayRangeValue = React.useMemo(() => {
    if (!resolvedOpen) return selectedRangeValue
    return {
      from: draftRange?.from ? mergeDateAndTime(draftRange.from, draftRangeTime.start, format) : undefined,
      to: draftRange?.to ? mergeDateAndTime(draftRange.to, draftRangeTime.end, format) : undefined,
    }
  }, [draftRange, draftRangeTime.end, draftRangeTime.start, format, resolvedOpen, selectedRangeValue])

  React.useEffect(() => {
    if (!resolvedOpen) return
    openedValueRef.current = selectedValue
    openedRangeValueRef.current = selectedRangeValue
    setDraftDate(selectedValue)
    setDraftRange(selectedRangeValue)
    setDraftTime(timeValueFromDate(selectedValue, format))
    setDraftRangeTime({
      start: timeValueFromDate(selectedRangeValue?.from, format),
      end: timeValueFromDate(selectedRangeValue?.to, format),
    })
  }, [format, resolvedOpen])

  const observeCalendar = React.useCallback((calendar: HTMLDivElement | null) => {
    calendarObserverRef.current?.disconnect()
    if (calendarSyncFrameRef.current) cancelAnimationFrame(calendarSyncFrameRef.current)
    if (calendarSyncTimerRef.current) clearTimeout(calendarSyncTimerRef.current)
    if (!calendar) return

    const calendarRoot = calendar
    const syncHeight = () => {
      const height = calendarRoot.getBoundingClientRect().height
      if (height > 0) setCalendarHeight(height)
    }
    syncHeight()

    const observer = new ResizeObserver(syncHeight)
    observer.observe(calendarRoot)
    calendarObserverRef.current = observer
    calendarSyncFrameRef.current = requestAnimationFrame(syncHeight)
    calendarSyncTimerRef.current = window.setTimeout(syncHeight, 100)
  }, [])

  React.useEffect(() => () => {
    calendarObserverRef.current?.disconnect()
    if (calendarSyncFrameRef.current) cancelAnimationFrame(calendarSyncFrameRef.current)
    if (calendarSyncTimerRef.current) clearTimeout(calendarSyncTimerRef.current)
  }, [])

  const commitSingleValue = (next: Date | undefined) => {
    if (value === undefined) setInnerValue(next)
    if (!range) (onValueChange as ((value: Date | undefined) => void) | undefined)?.(next)
  }

  const commitRangeValue = (next: DateTimePickerRangeValue | undefined) => {
    if (value === undefined) setInnerRangeValue(next)
    if (range) (onValueChange as ((value: DateTimePickerRangeValue | undefined) => void) | undefined)?.(next)
  }

  const restoreOpenedValue = () => {
    if (range) {
      commitRangeValue(openedRangeValueRef.current)
    } else {
      commitSingleValue(openedValueRef.current)
    }
  }

  const closePanel = () => {
    restoreOpenedValue()
    closeDateTimePicker()
  }

  const updateSingleDate = (next: Date | undefined) => {
    setDraftDate(next)
    commitSingleValue(next ? mergeDateAndTime(next, draftTime, format) : undefined)
  }

  const updateActiveRangeDate = (next: Date | undefined) => {
    setDraftRange((previous) => {
      if (activeRangeSide === "start") return { from: next, to: previous?.to }
      return previous?.from ? { from: previous.from, to: next } : { from: next, to: undefined }
    })
  }

  const updateSingleTime = (unit: "hours" | "minutes" | "seconds", next: number) => {
    const nextTime = formatTimeValue({ ...wheelValue, [unit]: next }, format)
    setDraftTime(nextTime)
    if (draftDate) commitSingleValue(mergeDateAndTime(draftDate, nextTime, format))
  }

  const updateRangeTime = (side: "start" | "end", unit: "hours" | "minutes" | "seconds", next: number) => {
    const current = side === "start" ? startWheelValue : endWheelValue
    const nextTime = formatTimeValue({ ...current, [unit]: next }, format)
    const nextRangeTime = { ...draftRangeTime, [side]: nextTime }
    setDraftRangeTime(nextRangeTime)
  }

  const confirmDateTime = () => {
    if (!range) {
      closeDateTimePicker()
      return
    }

    if (!activeRangeDate) return
    const nextDateTime = mergeDateAndTime(activeRangeDate, formatTimeValue(activeRangeTime, format), format)
    if (activeRangeSide === "start") {
      const nextRange = { from: nextDateTime, to: undefined }
      setDraftRange(nextRange)
      commitRangeValue(nextRange)
      setActiveRangeSide("end")
      return
    }

    if (activeRangeSide === "end" && draftRange?.from && nextDateTime < draftRange.from) return
    const nextRange = { from: draftRange?.from, to: nextDateTime }
    setDraftRange(nextRange)
    commitRangeValue(nextRange)
      closeDateTimePicker()
  }

  return (
      <Popover
        open={resolvedOpen}
        onOpenChange={disabled ? undefined : (nextOpen) => {
          if (!nextOpen && resolvedOpen) restoreOpenedValue()
          if (controlledOpen === undefined) setInnerOpen(nextOpen)
          onOpenChange?.(nextOpen)
        }}
    >
      <div
        data-slot="date-time-picker"
        data-size={size}
        data-state={dataState}
        aria-invalid={invalid}
        className={cn(
          cn("group/date-time-picker inline-flex w-full min-w-0 items-center gap-2 bg-surface text-left transition-colors has-[button:disabled]:cursor-not-allowed has-[button:disabled]:bg-muted has-[button:disabled]:text-foreground-disabled aria-invalid:border-destructive data-[state=hover]:border-ring data-[state=focus]:border-ring data-[state=open]:border-ring", variant === "borderless" ? "border border-transparent" : "border border-input"),
          timePickerSizeClassName[size],
          className
        )}
      >
        {range ? (
          <PopoverTrigger
            render={
              <div
                data-slot="date-time-picker-trigger"
                aria-disabled={disabled || undefined}
                className="flex min-w-0 flex-1 items-center gap-2 text-left outline-none"
              />
            }
          >
            <CalendarIcon className={cn("shrink-0 text-foreground-disabled", timePickerIconClassName[size])} />
            <span data-slot="date-time-picker-value" className="flex min-w-0 flex-1 items-center gap-2">
              <button
                type="button"
                data-slot="date-time-picker-range-start"
                data-active={activeRangeSide === "start" && resolvedOpen ? "true" : undefined}
                disabled={disabled}
                className={cn("min-w-0 basis-0 flex-1 truncate border-b border-transparent text-left outline-none", activeRangeSide === "start" && resolvedOpen ? cn("border-primary", displayRangeValue?.from ? "text-foreground" : "text-foreground-disabled") : displayRangeValue?.from ? "text-foreground" : "text-foreground-disabled")}
                onPointerDown={(event) => {
                  if (resolvedOpen) event.stopPropagation()
                  setActiveRangeSide("start")
                }}
                onClick={(event) => {
                  if (resolvedOpen) event.stopPropagation()
                }}
              >
                {displayRangeValue?.from ? formatDateTime(displayRangeValue.from, format) : startPlaceholder}
              </button>
              <span className="shrink-0 text-muted-foreground" aria-hidden="true">-</span>
              <button
                type="button"
                data-slot="date-time-picker-range-end"
                data-active={activeRangeSide === "end" && resolvedOpen ? "true" : undefined}
                disabled={disabled}
                className={cn("min-w-0 basis-0 flex-1 truncate border-b border-transparent text-left outline-none", activeRangeSide === "end" && resolvedOpen ? cn("border-primary", displayRangeValue?.to ? "text-foreground" : "text-foreground-disabled") : displayRangeValue?.to ? "text-foreground" : "text-foreground-disabled")}
                onPointerDown={(event) => {
                  if (resolvedOpen) event.stopPropagation()
                  if (activeRangeSide === "start") {
                    event.preventDefault()
                    return
                  }
                  setActiveRangeSide("end")
                }}
                onClick={(event) => {
                  if (resolvedOpen) event.stopPropagation()
                }}
              >
                {displayRangeValue?.to ? formatDateTime(displayRangeValue.to, format) : endPlaceholder}
              </button>
            </span>
          </PopoverTrigger>
        ) : (
          <PopoverTrigger
            render={
              <button
                type="button"
                data-slot="date-time-picker-trigger"
                disabled={disabled}
                className="flex min-w-0 flex-1 items-center gap-2 text-left outline-none"
              />
            }
          >
            <CalendarIcon className={cn("shrink-0 text-foreground-disabled", timePickerIconClassName[size])} />
            <span data-slot="date-time-picker-value" className={cn("min-w-0 flex-1 truncate", hasValue ? "text-foreground" : "text-foreground-disabled")}>
              {selectedValue ? formatDateTime(selectedValue, format) : placeholder}
            </span>
          </PopoverTrigger>
        )}
        {clearable && hasValue && !disabled ? (
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            aria-label="清除日期时间"
            data-slot="date-time-picker-clear"
            className={cn(
              previewClearVisible
                ? "pointer-events-auto visible"
                : "pointer-events-none invisible group-hover/date-time-picker:pointer-events-auto group-hover/date-time-picker:visible"
            )}
            onClick={() => range ? commitRangeValue(undefined) : commitSingleValue(undefined)}
          >
            <XIcon />
          </Button>
        ) : null}
      </div>
      <PopoverContent align="start" sideOffset={8} className="w-auto p-0">
        <div data-slot="date-time-picker-content">
          <div data-slot="date-time-picker-panel" className="flex flex-col md:flex-row md:items-start">
            <div ref={observeCalendar}>
              {range ? (
                <Calendar
                  mode="single"
                  startMonth={calendarStartMonth}
                  endMonth={calendarEndMonth}
                  disabled={(date) => (minDate && date < minDate) || (maxDate && date > maxDate) || Boolean(disabledDate?.(date))}
                  locale={zhCN}
                  selected={activeRangeDate}
                  defaultMonth={activeRangeDate ?? draftRange?.from}
                  onSelect={updateActiveRangeDate}
                />
              ) : (
                <Calendar
                  mode="single"
                  startMonth={calendarStartMonth}
                  endMonth={calendarEndMonth}
                  disabled={(date) => (minDate && date < minDate) || (maxDate && date > maxDate) || Boolean(disabledDate?.(date))}
                  locale={zhCN}
                  selected={draftDate}
                  defaultMonth={draftDate}
                  onSelect={updateSingleDate}
                />
              )}
            </div>
            <Separator className="md:hidden" />
            <Separator orientation="vertical" className="hidden h-auto md:block" />
            <div
              data-slot="date-time-picker-time-panel"
              className="flex min-w-48 min-h-0 flex-col gap-2 overflow-hidden p-2 md:h-[calc(var(--date-time-picker-calendar-height)+3px)]"
              style={calendarHeight ? { "--date-time-picker-calendar-height": `${calendarHeight}px` } as React.CSSProperties : undefined}
            >
              {range ? (
                <div className="flex min-h-0 flex-1 flex-col gap-2">
                  <TimeWheel value={activeRangeTime} format={format} hours={wheelHours} minutes={wheelMinutes} seconds={wheelSeconds} labelPrefix={activeRangeSide === "start" ? "开始时间" : "结束时间"} fill={Boolean(calendarHeight)} onChange={(unit, next) => updateRangeTime(activeRangeSide, unit, next)} />
                </div>
              ) : (
                <TimeWheel value={wheelValue} format={format} hours={wheelHours} minutes={wheelMinutes} seconds={wheelSeconds} fill={Boolean(calendarHeight)} onChange={updateSingleTime} />
              )}
            </div>
          </div>
          {showNow && !range ? (
            <div className="border-t border-border-subtle px-2 pt-2">
              <Button type="button" variant="ghost" size="sm" className="w-full" onClick={() => {
                const now = new Date()
                updateSingleDate(now)
                setDraftTime(timeValueFromDate(now, format))
              }}>此刻</Button>
            </div>
          ) : null}
          <Separator />
          <div className="flex justify-end gap-2 p-2">
            <Button type="button" variant="outline" size="sm" onClick={closePanel}>取消</Button>
            <Button
              type="button"
              size="sm"
              disabled={range ? !activeRangeDate || (activeRangeSide === "end" && Boolean(draftRange?.from) && Boolean(activeRangeDate && mergeDateAndTime(activeRangeDate, formatTimeValue(activeRangeTime, format), format) < draftRange!.from!)) : !draftDate}
              onClick={confirmDateTime}
            >
              确定
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export {
  DateTimePicker,
  TimePicker,
  type DateTimePickerProps,
  type DateTimePickerRangeValue,
  type TimePickerProps,
  type TimePickerRangeValue,
}
