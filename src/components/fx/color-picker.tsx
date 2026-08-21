"use client"

import * as React from "react"
import { colord } from "colord"
import { HexAlphaColorPicker, HexColorPicker } from "react-colorful"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ColorPickerIcon } from "@/lib/icons"
import { cn } from "@/lib/utils"

type ColorFormat = "HEX" | "RGB" | "HSL" | "CSS"
type ColorPickerTriggerContent = "value" | "name" | "label"

type ColorPickerProps = {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  format?: ColorFormat
  defaultFormat?: ColorFormat
  onFormatChange?: (format: ColorFormat) => void
  formats?: ColorFormat[]
  showPreviewSwatch?: boolean
  showEyedropper?: boolean
  showAlpha?: boolean
  recentColors?: string[]
  presetColors?: string[]
  triggerContent?: ColorPickerTriggerContent
  colorName?: string
  label?: string
  disabled?: boolean
  onConfirm?: (value: string) => void
  onClear?: () => void
  className?: string
}

type EyeDropperConstructor = new () => {
  open: () => Promise<{ sRGBHex: string }>
}

const DEFAULT_COLOR = "#1677ff" // hygiene-ignore: 默认选中值属于颜色数据，不是组件 chrome
const DEFAULT_FORMATS: ColorFormat[] = ["HEX", "RGB", "HSL", "CSS"]

function normalizeColor(value: string, alpha: boolean) {
  const parsed = colord(value)
  if (!parsed.isValid()) return null
  const hex = parsed.toHex()
  return alpha ? hex : hex.slice(0, 7)
}

function formatColor(value: string, format: ColorFormat) {
  const parsed = colord(value)
  if (!parsed.isValid()) return value
  if (format === "RGB") return parsed.toRgbString()
  if (format === "HSL") return parsed.toHslString()
  if (format === "CSS") return parsed.alpha() < 1 ? parsed.toRgbString() : parsed.toHex()
  return parsed.toHex().toUpperCase()
}

function Swatch({ color, selected, label, onSelect }: {
  color: string
  selected?: boolean
  label: string
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      data-slot="color-picker-swatch"
      aria-label={label}
      aria-pressed={selected}
      className="size-4 shrink-0 rounded-sm border border-border outline-none ring-offset-1 ring-offset-popover focus-visible:ring-2 focus-visible:ring-ring aria-pressed:ring-2 aria-pressed:ring-primary"
      style={{ backgroundColor: color }}
      onClick={onSelect}
    />
  )
}

function ColorPicker({
  value,
  defaultValue = DEFAULT_COLOR,
  onValueChange,
  open,
  defaultOpen,
  onOpenChange,
  format,
  defaultFormat = "HEX",
  onFormatChange,
  formats = DEFAULT_FORMATS,
  showPreviewSwatch = true,
  showEyedropper = true,
  showAlpha = true,
  recentColors = [],
  presetColors = [],
  triggerContent = "value",
  colorName,
  label = "选择颜色",
  disabled = false,
  onConfirm,
  onClear,
  className,
}: ColorPickerProps) {
  const initialColor = normalizeColor(value ?? defaultValue, showAlpha) ?? DEFAULT_COLOR
  const [uncontrolledValue, setUncontrolledValue] = React.useState(initialColor)
  const [draft, setDraft] = React.useState(initialColor)
  const [uncontrolledFormat, setUncontrolledFormat] = React.useState<ColorFormat>(defaultFormat)
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen ?? false)
  const [inputValue, setInputValue] = React.useState(() => formatColor(initialColor, format ?? defaultFormat))
  const selectedValue = normalizeColor(value ?? uncontrolledValue, showAlpha) ?? DEFAULT_COLOR
  const selectedFormat = format ?? uncontrolledFormat
  const selectedOpen = open ?? uncontrolledOpen
  const eyeDropper = typeof window === "undefined"
    ? undefined
    : (window as Window & { EyeDropper?: EyeDropperConstructor }).EyeDropper

  React.useEffect(() => {
    setDraft(selectedValue)
    setInputValue(formatColor(selectedValue, selectedFormat))
  }, [selectedValue, selectedFormat])

  const updateDraft = (next: string) => {
    const normalized = normalizeColor(next, showAlpha)
    if (!normalized) return
    setDraft(normalized)
    setInputValue(formatColor(normalized, selectedFormat))
  }

  const setFormat = (next: ColorFormat | null) => {
    if (!next) return
    if (format === undefined) setUncontrolledFormat(next)
    onFormatChange?.(next)
    setInputValue(formatColor(draft, next))
  }

  const setOpen = (next: boolean) => {
    if (open === undefined) setUncontrolledOpen(next)
    onOpenChange?.(next)
  }

  const commit = () => {
    if (value === undefined) setUncontrolledValue(draft)
    onValueChange?.(draft)
    onConfirm?.(draft)
    setOpen(false)
  }

  const clear = () => {
    updateDraft(DEFAULT_COLOR)
    onClear?.()
  }

  const triggerText = triggerContent === "name"
    ? (colorName ?? formatColor(selectedValue, selectedFormat))
    : triggerContent === "label"
      ? label
      : formatColor(selectedValue, selectedFormat)

  return (
    <Popover open={selectedOpen} onOpenChange={setOpen}>
      <PopoverTrigger
        disabled={disabled}
        className={cn(
          "inline-flex h-(--fx-control-sm-height) items-center gap-2 rounded-md border border-input bg-surface px-(--fx-control-px-sm) text-sm text-foreground outline-none hover:border-primary focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:bg-surface-disabled disabled:text-foreground-disabled",
          className
        )}
      >
        <span className="size-4 rounded-sm border border-border" style={{ backgroundColor: selectedValue }} />
        <span>{triggerText}</span>
      </PopoverTrigger>
      <PopoverContent size="picker" align="start" aria-label={label}>
        <div data-slot="color-picker" className="flex max-h-[436px] flex-col gap-3 overflow-hidden p-3">
          <div
            className={cn(
              "relative h-[184px] w-[234px] shrink-0",
              "[&_.react-colorful]:h-full! [&_.react-colorful]:w-full! [&_[class$=saturation]]:h-36! [&_[class$=saturation]]:grow-0! [&_[class$=saturation]]:rounded-md! [&_[class$=saturation]]:border-b-0!",
              "[&_[class$=hue]]:mt-3! [&_[class$=hue]]:h-2! [&_[class$=hue]]:rounded-full!",
              "[&_[class$=alpha]]:mt-3! [&_[class$=alpha]]:h-2! [&_[class$=alpha]]:rounded-full!",
              showPreviewSwatch && "[&_[class$=hue]]:w-[194px]! [&_[class$=alpha]]:w-[194px]!",
              "[&_[class$=pointer]]:size-4! [&_[class$=pointer]]:border-2! [&_[class$=pointer]]:border-surface! [&_[class$=pointer]]:shadow-l1!"
            )}
          >
            {showAlpha ? (
              <HexAlphaColorPicker color={draft} onChange={updateDraft} />
            ) : (
              <HexColorPicker color={draft} onChange={updateDraft} />
            )}
            {showPreviewSwatch ? (
              <span
                data-slot="color-picker-preview"
                className="absolute right-0 bottom-0 size-8 rounded-sm border border-border"
                style={{ backgroundColor: draft }}
              />
            ) : null}
          </div>

          <div className="flex items-center gap-2">
            {showEyedropper ? (
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                disabled={!eyeDropper}
                aria-label="吸取屏幕颜色"
                title={!eyeDropper ? "当前浏览器不支持吸色器" : undefined}
                onClick={async () => {
                  if (!eyeDropper) return
                  const result = await new eyeDropper().open()
                  updateDraft(result.sRGBHex)
                }}
              >
                <ColorPickerIcon aria-hidden="true" />
              </Button>
            ) : null}
            <Select value={selectedFormat} onValueChange={setFormat}>
              <SelectTrigger size="sm" className="w-[72px]" aria-label="颜色格式">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {formats.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
              </SelectContent>
            </Select>
            <Input
              size="sm"
              aria-label="颜色值"
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              onBlur={() => updateDraft(inputValue)}
              onKeyDown={(event) => {
                if (event.key === "Enter") updateDraft(inputValue)
              }}
            />
          </div>

          {recentColors.length ? (
            <section data-slot="color-picker-recent" aria-label="最近使用颜色" className="flex flex-col gap-2">
              <span className="text-sm text-muted-foreground">最近使用</span>
              <div className="flex gap-2">
                {recentColors.slice(0, 10).map((color, index) => (
                  <Swatch key={`${color}-${index}`} color={color} selected={colord(color).isEqual(draft)} label={`选择最近使用颜色 ${color}`} onSelect={() => updateDraft(color)} />
                ))}
              </div>
            </section>
          ) : null}

          {presetColors.length ? (
            <section data-slot="color-picker-presets" aria-label="预设颜色" className="flex min-h-0 flex-col gap-2">
              <span className="text-sm text-muted-foreground">预设颜色</span>
              <div className="grid max-h-[88px] grid-cols-10 gap-2 overflow-y-auto py-0.5">
                {presetColors.map((color, index) => (
                  <Swatch key={`${color}-${index}`} color={color} selected={colord(color).isEqual(draft)} label={`选择预设颜色 ${color}`} onSelect={() => updateDraft(color)} />
                ))}
              </div>
            </section>
          ) : null}
        </div>
        <div data-slot="color-picker-footer" className="flex h-10 shrink-0 items-center justify-end gap-2 border-t border-border px-3">
          <Button type="button" variant="outline" onClick={clear}>清除</Button>
          <Button type="button" onClick={commit}>确定</Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export { ColorPicker }
export type { ColorFormat, ColorPickerProps, ColorPickerTriggerContent }
