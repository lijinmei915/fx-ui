import * as React from "react"

import { Button } from "@/components/ui/button"
import { Input, InputAffix, InputGroup } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ClockIcon, XIcon } from "@/lib/icons"
import { cn } from "@/lib/utils"

const timePickerSizeClassName = {
  xs: "h-(--fx-control-xs-height) rounded-md px-(--fx-control-px-xs) text-xs",
  sm: "h-(--fx-control-sm-height) rounded-md px-(--fx-control-px-sm) text-sm",
  md: "h-(--fx-control-md-height) rounded-lg px-(--fx-control-px-sm) text-base",
} as const

const timePickerIconClassName = {
  xs: "size-4",
  sm: "size-5",
  md: "size-6",
} as const

type TimePickerSize = keyof typeof timePickerSizeClassName

type TimePickerRangeValue = {
  start?: string
  end?: string
}

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

function TimeWheel({
  value,
  format,
  hours,
  minutes,
  seconds,
  labelPrefix,
  onChange,
}: {
  value: { hours: number; minutes: number; seconds: number }
  format: "HH:mm" | "HH:mm:ss"
  hours: number[]
  minutes: number[]
  seconds: number[]
  labelPrefix?: string
  onChange: (unit: "hours" | "minutes" | "seconds", value: number) => void
}) {
  return (
    <div className={cn("grid gap-1", format === "HH:mm:ss" ? "grid-cols-3" : "grid-cols-2")}>
      {[
        { key: "hours" as const, label: "时", values: hours },
        { key: "minutes" as const, label: "分", values: minutes },
        ...(format === "HH:mm:ss" ? [{ key: "seconds" as const, label: "秒", values: seconds }] : []),
      ].map((column) => (
        <div key={column.key} className="min-w-0">
          <div className="px-2 py-1 text-center text-xs text-muted-foreground">{column.label}</div>
          <div role="listbox" aria-label={`${labelPrefix ?? ""}${column.label}`} className="flex max-h-48 flex-col gap-0.5 overflow-y-auto rounded-md border border-border-subtle p-1">
            {column.values.map((option) => {
              const active = value[column.key] === option
              return (
                <button
                  key={option}
                  type="button"
                  role="option"
                  aria-selected={active}
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
  const [open, setOpen] = React.useState(dataState === "open")
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
    if (!open) return
    setDraftValue(selectedValue)
    setDraftRangeValue(selectedRangeValue)
  }, [open, selectedRangeValue, selectedValue])

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

  const resolvedOpen = dataState === "open" ? true : open
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
    setOpen(false)
  }

  return (
    <Popover open={resolvedOpen} onOpenChange={disabled ? undefined : setOpen}>
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
              "inline-flex w-full min-w-0 items-center gap-(--fx-control-gap-tight) border border-input bg-surface text-left transition-colors outline-none focus-visible:border-ring disabled:cursor-not-allowed disabled:bg-muted disabled:text-foreground-disabled aria-invalid:border-destructive data-[state=hover]:border-ring data-[state=focus]:border-ring data-[state=open]:border-ring",
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
            <span className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-(--fx-control-gap)">
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
            className="flex shrink-0 items-center text-muted-foreground hover:text-foreground"
            onClick={(event) => {
              event.preventDefault()
              event.stopPropagation()
              if (range) setRangeValue({})
              else setValue("")
            }}
          >
            <XIcon className={timePickerIconClassName[size]} />
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
        {picker === "wheel" ? (
          <div data-slot="time-picker-wheel" className="flex flex-col gap-2">
            {range ? (
              <div className="grid grid-cols-[repeat(2,minmax(14rem,1fr))] gap-2">
                <div className="min-w-0">
                  <div className="flex min-h-8 items-center justify-center text-sm text-foreground-secondary">开始时间</div>
                  <TimeWheel value={startWheelValue} format={format} hours={wheelHours} minutes={wheelMinutes} seconds={wheelSeconds} labelPrefix="开始时间" onChange={(unit, next) => updateRangeWheelUnit("start", unit, next)} />
                </div>
                <div className="min-w-0">
                  <div className="flex min-h-8 items-center justify-center text-sm text-foreground-secondary">结束时间</div>
                  <TimeWheel value={endWheelValue} format={format} hours={wheelHours} minutes={wheelMinutes} seconds={wheelSeconds} labelPrefix="结束时间" onChange={(unit, next) => updateRangeWheelUnit("end", unit, next)} />
                </div>
              </div>
            ) : (
              <TimeWheel value={wheelValue} format={format} hours={wheelHours} minutes={wheelMinutes} seconds={wheelSeconds} onChange={updateWheelUnit} />
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
                  setOpen(false)
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
                      {options.map((option) => (
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
                <Button type="button" size="sm" onClick={() => { setRangeValue(draftRangeValue); setOpen(false) }}>确定</Button>
              </div>
            </div>
          ) : (
            <div data-slot="time-picker-list" className="grid gap-0.5">
              {options.map((option) => (
                <Button
                  key={option}
                  type="button"
                  variant={selectedValue === option ? "secondary" : "ghost"}
                  size="sm"
                  className="justify-start"
                  onClick={() => {
                    setValue(option)
                    setOpen(false)
                  }}
                >
                  {option}
                </Button>
              ))}
            </div>
          )
        )}
      </PopoverContent>
    </Popover>
  )
}

export { TimePicker, type TimePickerProps, type TimePickerRangeValue }
