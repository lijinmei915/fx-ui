import SignaturePad from "signature_pad"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type SignatureProps = Omit<React.ComponentPropsWithoutRef<"div">, "onChange"> & {
  value?: string | null
  defaultValue?: string | null
  onChange?: (value: string | null) => void
  onBegin?: () => void
  onEnd?: () => void
  disabled?: boolean
  clearLabel?: string
  height?: number
}

function Signature({
  className,
  value,
  defaultValue,
  onChange,
  onBegin,
  onEnd,
  disabled = false,
  clearLabel = "清空",
  height = 70,
  ...props
}: SignatureProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const padRef = React.useRef<SignaturePad | null>(null)
  const valueRef = React.useRef(value ?? defaultValue ?? null)
  const [filled, setFilled] = React.useState(Boolean(value ?? defaultValue))

  const resizeCanvas = React.useCallback(() => {
    const canvas = canvasRef.current
    const pad = padRef.current
    if (!canvas || !pad) return

    const ratio = Math.max(window.devicePixelRatio || 1, 1)
    const width = canvas.clientWidth
    const data = pad.isEmpty() ? null : pad.toData()
    canvas.width = Math.max(1, width * ratio)
    canvas.height = Math.max(1, height * ratio)
    canvas.getContext("2d")?.scale(ratio, ratio)
    pad.clear()
    if (data) pad.fromData(data)
  }, [height])

  React.useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const pad = new SignaturePad(canvas, {
      backgroundColor: "transparent",
      penColor: getComputedStyle(document.documentElement).getPropertyValue("--foreground").trim(),
    })
    const handleBegin = () => onBegin?.()
    const handleEnd = () => {
      const next = pad.isEmpty() ? null : pad.toDataURL("image/png")
      valueRef.current = next
      setFilled(Boolean(next))
      onChange?.(next)
      onEnd?.()
    }
    pad.addEventListener("beginStroke", handleBegin)
    pad.addEventListener("endStroke", handleEnd)
    padRef.current = pad
    resizeCanvas()
    if (valueRef.current) void pad.fromDataURL(valueRef.current)
    const observer = new ResizeObserver(resizeCanvas)
    observer.observe(canvas)

    return () => {
      observer.disconnect()
      pad.removeEventListener("beginStroke", handleBegin)
      pad.removeEventListener("endStroke", handleEnd)
      pad.off()
      padRef.current = null
    }
  }, [onBegin, onChange, onEnd, resizeCanvas])

  React.useEffect(() => {
    const pad = padRef.current
    const next = value ?? null
    if (!pad || next === valueRef.current) return
    valueRef.current = next
    setFilled(Boolean(next))
    pad.clear()
    if (next) void pad.fromDataURL(next)
  }, [value])

  React.useEffect(() => {
    const pad = padRef.current
    if (!pad) return
    pad.off()
    if (disabled) return
    pad.on()
  }, [disabled])

  const clear = () => {
    padRef.current?.clear()
    valueRef.current = null
    setFilled(false)
    onChange?.(null)
  }

  return (
    <div
      {...props}
      data-component="Signature"
      data-slot="signature"
      data-filled={filled ? "true" : "false"}
      data-disabled={disabled ? "true" : undefined}
      className={cn("flex w-full min-w-0 flex-col items-start gap-0.5", className)}
    >
      <div className="relative w-full rounded-md border border-input bg-surface">
        <canvas
          ref={canvasRef}
          aria-label="签名"
          aria-disabled={disabled || undefined}
          tabIndex={disabled ? -1 : 0}
          data-slot="signature-canvas"
          className="block h-full min-h-[var(--fx-control-lg-height)] w-full touch-none rounded-md outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed"
          style={{ height }}
        />
      </div>
      <Button
        type="button"
        variant="plain"
        size="xs"
        disabled={disabled || !filled}
        onClick={clear}
        data-slot="signature-clear"
      >
        {clearLabel}
      </Button>
    </div>
  )
}

export { Signature }
export type { SignatureProps }
