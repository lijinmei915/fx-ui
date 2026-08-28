import tokensMarkdown from "../../../docs/TOKENS.md?raw"
import colorsMarkdown from "../../../docs/foundations/colors.md?raw"
import gridMarkdown from "../../../docs/foundations/grid.md?raw"
import iconsMarkdown from "../../../docs/foundations/icons.md?raw"
import layerMarkdown from "../../../docs/foundations/layer.md?raw"
import layoutMarkdown from "../../../docs/foundations/layout.md?raw"
import motionMarkdown from "../../../docs/foundations/motion.md?raw"
import radiusMarkdown from "../../../docs/foundations/radius.md?raw"
import shadowMarkdown from "../../../docs/foundations/shadow.md?raw"
import spacingMarkdown from "../../../docs/foundations/spacing.md?raw"
import typographyMarkdown from "../../../docs/foundations/typography.md?raw"

export const docsByPage = {
  tokens: { title: "Tokens", path: "docs/TOKENS.md", markdown: tokensMarkdown },
  "tokens-colors": { title: "Colors", path: "docs/foundations/colors.md", markdown: colorsMarkdown },
  "tokens-typography": { title: "Typography", path: "docs/foundations/typography.md", markdown: typographyMarkdown },
  "tokens-icons": { title: "Icons", path: "docs/foundations/icons.md", markdown: iconsMarkdown },
  "tokens-radius": { title: "Radius", path: "docs/foundations/radius.md", markdown: radiusMarkdown },
  "tokens-shadow": { title: "Shadow", path: "docs/foundations/shadow.md", markdown: shadowMarkdown },
  "tokens-spacing": { title: "Spacing", path: "docs/foundations/spacing.md", markdown: spacingMarkdown },
  "tokens-layer": { title: "Layer", path: "docs/foundations/layer.md", markdown: layerMarkdown },
  "tokens-motion": { title: "Motion", path: "docs/foundations/motion.md", markdown: motionMarkdown },
  grid: { title: "Grid", path: "docs/foundations/grid.md", markdown: gridMarkdown },
  layout: { title: "Layout", path: "docs/foundations/layout.md", markdown: layoutMarkdown },
} as const

// Kept as an empty compatibility export because the shared shell types the full-site adapter.
// The Foundation registry never renders or publishes the website-standards page.
export const websiteStandardsDoc = { title: "", path: "", markdown: "" } as const

export type DocPage = keyof typeof docsByPage

export function isDocPage(page: string): page is DocPage {
  return page in docsByPage
}
