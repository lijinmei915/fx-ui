export function deriveThemeSeedVariables(brand: string): Record<string, string> {
  return {
    "--fds-g-color-seed-brand": brand
  }
}

type SolidForegroundGroup = {
  id: string
  foreground: string
  backgrounds: string[]
  policy?: "auto-contrast" | "fixed-preferred"
}

export type SolidForegroundContract = {
  strategy: "prefer-light-for-entire-state-group-with-dark-fallback"
  minimumContrast: number
  preferred: string
  fallback: string
  groups: SolidForegroundGroup[]
}

const linearize = (channel: number) => {
  const value = channel / 255
  return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
}

const relativeLuminance = ([red, green, blue]: number[]) =>
  0.2126 * linearize(red) + 0.7152 * linearize(green) + 0.0722 * linearize(blue)

const contrastRatio = (first: number[], second: number[]) => {
  const [lighter, darker] = [relativeLuminance(first), relativeLuminance(second)].sort((a, b) => b - a)
  return (lighter + 0.05) / (darker + 0.05)
}

export function deriveSolidForegroundVariables(
  root: HTMLElement,
  contract: SolidForegroundContract,
): Record<string, string> {
  const document = root.ownerDocument
  const view = document.defaultView
  if (!view || contract.strategy !== "prefer-light-for-entire-state-group-with-dark-fallback") return {}

  const probe = document.createElement("i")
  probe.setAttribute("aria-hidden", "true")
  probe.style.cssText = "position:absolute;visibility:hidden;pointer-events:none"
  root.appendChild(probe)

  const canvas = document.createElement("canvas")
  canvas.width = canvas.height = 1
  const context = canvas.getContext("2d", { willReadFrequently: true })
  if (!context) {
    probe.remove()
    return {}
  }

  const resolve = (variable: string) => {
    probe.style.backgroundColor = `var(${variable})`
    const color = view.getComputedStyle(probe).backgroundColor
    context.clearRect(0, 0, 1, 1)
    context.fillStyle = color
    context.fillRect(0, 0, 1, 1)
    return [...context.getImageData(0, 0, 1, 1).data]
  }

  try {
    const preferred = resolve(contract.preferred)
    return Object.fromEntries(contract.groups.map((group) => {
      const usePreferred = group.policy === "fixed-preferred" || group.backgrounds.every((background) => {
        const resolved = resolve(background)
        return resolved[3] === 255 && contrastRatio(preferred, resolved) >= contract.minimumContrast
      })
      return [group.foreground, `var(${usePreferred ? contract.preferred : contract.fallback})`]
    }))
  } finally {
    probe.remove()
  }
}
