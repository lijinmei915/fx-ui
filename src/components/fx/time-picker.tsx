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

type TimePickerProps = {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  size?: TimePickerSize
  mode?: "native" | "popover"
  step?: 15 | 30 | 60
  disabled?: boolean
  clearable?: boolean
  "aria-invalid"?: boolean
  className?: string
  "data-state"?: "hover" | "focus" | "open"
}

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

function TimePicker({
  value,
  defaultValue,
  onValueChange,
  placeholder = "请选择时间",
  size = "sm",
  mode = "popover",
  step = 30,
  disabled,
  clearable,
  className,
  "aria-invalid": invalid,
  "data-state": dataState,
}: TimePickerProps) {
  const [innerValue, setInnerValue] = React.useState(defaultValue ?? "")
  const [open, setOpen] = React.useState(dataState === "open")
  const selectedValue = value ?? innerValue
  const options = React.useMemo(() => buildTimeOptions(step), [step])

  const setValue = (next: string) => {
    if (value === undefined) {
      setInnerValue(next)
    }
    onValueChange?.(next)
  }

  if (mode === "native") {
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
          disabled={disabled}
          aria-invalid={invalid}
          onChange={(event) => setValue(event.currentTarget.value)}
        />
      </InputGroup>
    )
  }

  const resolvedOpen = dataState === "open" ? true : open

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
            selectedValue ? "text-foreground" : "text-foreground-disabled"
          )}
        >
          {selectedValue || placeholder}
        </span>
        {clearable && selectedValue && !disabled ? (
          <span
            role="button"
            tabIndex={-1}
            aria-label="清除时间"
            data-slot="time-picker-clear"
            className="flex shrink-0 items-center text-muted-foreground hover:text-foreground"
            onClick={(event) => {
              event.preventDefault()
              event.stopPropagation()
              setValue("")
            }}
          >
            <XIcon className={timePickerIconClassName[size]} />
          </span>
        ) : null}
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="max-h-64 w-(--anchor-width) min-w-36 overflow-y-auto p-1"
      >
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
      </PopoverContent>
    </Popover>
  )
}

export { TimePicker, type TimePickerProps }
