import type { ReactNode } from "react"

import type { PageEntry } from "@/lib/page-registry"
import { GridPage, gridAnchors } from "@/pages/docs/foundations/grid-page"
import { LayoutPage, layoutAnchors } from "@/pages/docs/foundations/layout-page"
import { ColorPaletteWithTabs } from "@/pages/docs/tokens/color-palette-with-tabs"
import { SeedPreview } from "@/pages/docs/tokens/color-seed-preview"
import { TokensColorsPage, renderTokenExample, semanticTokenGroups, tokenColorsAnchors } from "@/pages/docs/tokens/tokens-colors-page"
import { TokensLayerPage, layerTokens, tokenLayerAnchors } from "@/pages/docs/tokens/tokens-layer-page"
import { TokensIconsPage, tokenIconAnchors } from "@/pages/docs/tokens/tokens-icons-page"
import { TokensMotionPage, motionTokens, tokenMotionAnchors } from "@/pages/docs/tokens/tokens-motion-page"
import { tokenAnchors } from "@/pages/docs/tokens/tokens-page"
import { TokensPageAdapter } from "@/pages/docs/tokens/tokens-page-adapter"
import { TokensRadiusPage, radiusTokens, tokenRadiusAnchors } from "@/pages/docs/tokens/tokens-radius-page"
import { TokensShadowPage, shadowTokens, tokenShadowAnchors } from "@/pages/docs/tokens/tokens-shadow-page"
import { TokensSpacingPage, spacingTokens, tokenSpacingAnchors } from "@/pages/docs/tokens/tokens-spacing-page"
import { TokensTypographyPage, tokenTypographyAnchors, typeFamilyTokens, typeSizeTokens, typeWeightTokens } from "@/pages/docs/tokens/tokens-typography-page"

type Lang = "zh" | "en"

type DesignTokenManifest = {
  foundation: {
    groups: { id: string; label: string; count: number; tokens: string[] }[]
  }
  typography: {
    roles: { id: string; utility: string; tailwind: [string, string]; usage: string; avoid: string }[]
    conventions: { id: string; rule: string; usage: string; tailwind?: string[]; prohibited?: string[]; examples?: string[] }[]
  }
}

export function createPageRegistry(
  designTokensManifest: DesignTokenManifest,
  _componentIndexSections: unknown,
  _renderGettingStartedPage: (actions: ReactNode, lang: Lang, page: never) => ReactNode,
): Record<string, PageEntry> {
  return {
    tokens: { anchors: tokenAnchors.filter((anchor) => anchor.href !== "#tokens-admission"), render: (actions, lang) => <TokensPageAdapter actions={actions} lang={lang} foundationGroups={designTokensManifest.foundation.groups} /> },
    "tokens-colors": { anchors: tokenColorsAnchors, render: (actions, lang) => <TokensColorsPage actions={actions} lang={lang} SeedPreview={SeedPreview} ColorPaletteWithTabs={ColorPaletteWithTabs} semanticTokenGroups={semanticTokenGroups} getTokenExample={renderTokenExample} /> },
    "tokens-typography": { anchors: tokenTypographyAnchors, render: (actions, lang) => <TokensTypographyPage actions={actions} lang={lang} roles={designTokensManifest.typography.roles} conventions={designTokensManifest.typography.conventions} sizeTokens={typeSizeTokens} weightTokens={typeWeightTokens} familyTokens={typeFamilyTokens} /> },
    "tokens-icons": { anchors: tokenIconAnchors, render: (actions, lang) => <TokensIconsPage actions={actions} lang={lang} /> },
    "tokens-radius": { anchors: tokenRadiusAnchors, render: (actions, lang) => <TokensRadiusPage actions={actions} lang={lang} radiusTokens={radiusTokens} /> },
    "tokens-shadow": { anchors: tokenShadowAnchors, render: (actions, lang) => <TokensShadowPage actions={actions} lang={lang} shadowTokens={shadowTokens} /> },
    "tokens-spacing": { anchors: tokenSpacingAnchors, render: (actions, lang) => <TokensSpacingPage actions={actions} lang={lang} spacingTokens={spacingTokens} /> },
    "tokens-layer": { anchors: tokenLayerAnchors, render: (actions, lang) => <TokensLayerPage actions={actions} lang={lang} layerTokens={layerTokens} /> },
    "tokens-motion": { anchors: tokenMotionAnchors, render: (actions, lang) => <TokensMotionPage actions={actions} lang={lang} motionTokens={motionTokens} /> },
    grid: { anchors: gridAnchors, render: (actions, lang) => <GridPage actions={actions} lang={lang} /> },
    layout: { anchors: layoutAnchors, render: (actions, lang) => <LayoutPage actions={actions} lang={lang} /> },
  }
}
