import type { ReactNode } from "react"

import foundationManifestRaw from "../../../../docs/data/fds-foundation.manifest.json?raw"
import semanticManifestRaw from "../../../../docs/data/fds-semantic.manifest.json?raw"
import namingManifestRaw from "../../../../docs/data/token-naming.manifest.json?raw"
import { componentManifestRaw } from "@/lib/component-tokens-manifest-source"
import { TokensPage, type FoundationGroup, type FoundationTokenView, type TokenLayerView, type TokensPageLang, type TokensPageModel } from "@/pages/docs/tokens/tokens-page"

type NamingManifest = {
  brand: { globalPrefix: string; componentPrefix: string }
  layers: { id: TokenLayerView["id"]; order: number; owner: string; authoring: string }[]
  grammar: { global: Record<string, string>; component: Record<string, string> }
  dictionaries: { forbiddenAbbreviations: string[] }
  examples: { valid: { layer: TokenLayerView["id"]; name: string }[] }
  migration: { phase: string; phases: string[]; legacyPrefix: string }
}

type FoundationManifest = {
  counts: { primitive: number; map: number }
  tokens: Array<Omit<FoundationTokenView, "categoryId" | "semanticReferences" | "viewLayer"> & { layer: "primitive" | "map" }>
}
type SemanticManifest = {
  counts: { tokens: number }
  tokens: { name: string; value: string; modes: Record<string, string> }[]
}
type ComponentManifest = {
  admissions: { component: string; owner: string; independentThemingNeed: string }[]
  tokens: { component: string }[]
}

const namingManifest = JSON.parse(namingManifestRaw) as NamingManifest
const foundationManifest = JSON.parse(foundationManifestRaw) as FoundationManifest
const semanticManifest = JSON.parse(semanticManifestRaw) as SemanticManifest
const isFoundationPublication = import.meta.env.VITE_FX_DOCS_SCOPE === "foundation"
const componentManifest = JSON.parse(componentManifestRaw) as ComponentManifest

const cssReferencePattern = /var\((--fds-g-[a-z0-9-]+)\)/g

function extractReferences(values: string[]) {
  return new Set(values.flatMap((value) => [...value.matchAll(cssReferencePattern)].map((match) => match[1])))
}

function buildFoundationTokens(foundationGroups: FoundationGroup[]): FoundationTokenView[] {
  const categoryByName = new Map(foundationGroups.flatMap((group) => group.tokens.map((name) => [name, group.id] as const)))
  const semanticByName = new Map(semanticManifest.tokens.map((token) => [token.name, token]))
  const dependenciesBySemantic = new Map(semanticManifest.tokens.map((token) => [token.name, extractReferences([token.value, ...Object.values(token.modes)] as string[])]))

  const semanticUsesFoundation = (semanticName: string, foundationName: string, visited = new Set<string>()): boolean => {
    if (visited.has(semanticName)) return false
    visited.add(semanticName)
    const dependencies = dependenciesBySemantic.get(semanticName) ?? new Set<string>()
    if (dependencies.has(foundationName)) return true
    return [...dependencies].some((dependency) => semanticByName.has(dependency) && semanticUsesFoundation(dependency, foundationName, new Set(visited)))
  }

  return foundationManifest.tokens.map((token) => ({
    ...token,
    categoryId: categoryByName.get(token.name) ?? token.path.split(".")[0],
    viewLayer: token.path.includes(".seed.") ? "seed" : token.layer,
    semanticReferences: semanticManifest.tokens.filter((semantic) => semanticUsesFoundation(semantic.name, token.name)).map((semantic) => semantic.name),
  }))
}

const layerCopy: Record<TokenLayerView["id"], Pick<TokenLayerView, "title" | "titleEn" | "description" | "descriptionEn" | "permission" | "permissionEn">> = {
  primitive: { title: "Primitive / Seed", titleEn: "Primitive / Seed", description: "原始颜色、字号、间距、圆角等物理事实和主题输入。", descriptionEn: "Raw color, type, spacing, radius facts, and theme inputs.", permission: "仅 Foundation 维护者可修改", permissionEn: "Foundation maintainers only" },
  map: { title: "Map", titleEn: "Map", description: "由 Seed 和固定算法生成颜色与维度刻度。", descriptionEn: "Generated color and dimension scales from governed seeds.", permission: "只允许生成器产出", permissionEn: "Generator output only" },
  semantic: { title: "Semantic", titleEn: "Semantic", description: "表达跨页面、跨组件、跨框架稳定的使用意图。", descriptionEn: "Stable intent shared across pages, components, and frameworks.", permission: "协作者可以提案，必须经过 FDS 评审", permissionEn: "Collaborator proposals require FDS review" },
  component: { title: "Component", titleEn: "Component", description: "经过准入并受 SemVer 保护的组件专属公开 Hook。", descriptionEn: "Admitted component-specific public hooks protected by SemVer.", permission: "组件 owner 提案，FDS 审核准入", permissionEn: "Component owner proposal with FDS admission" },
}

const layerCounts: Record<TokenLayerView["id"], number> = {
  primitive: foundationManifest.counts.primitive,
  map: foundationManifest.counts.map,
  semantic: semanticManifest.counts.tokens,
  component: componentManifest.tokens.length,
}

const model: TokensPageModel = {
  layers: namingManifest.layers
    .filter((layer) => !isFoundationPublication || layer.id !== "component")
    .map((layer) => ({ ...layerCopy[layer.id], id: layer.id, order: layer.order, owner: layer.owner, example: namingManifest.examples.valid.find((example) => example.layer === layer.id)?.name ?? "", count: layerCounts[layer.id] })),
  naming: {
    globalPrefix: namingManifest.brand.globalPrefix,
    componentPrefix: namingManifest.brand.componentPrefix,
    globalGrammar: Object.values(namingManifest.grammar.global),
    componentGrammar: Object.values(namingManifest.grammar.component),
    globalExample: namingManifest.examples.valid.find((example) => example.layer === "semantic")?.name ?? "",
    componentExample: namingManifest.examples.valid.find((example) => example.layer === "component")?.name ?? "",
    forbiddenAbbreviations: namingManifest.dictionaries.forbiddenAbbreviations,
  },
  admissions: componentManifest.admissions.map((admission) => ({ component: admission.component, owner: admission.owner, hookCount: componentManifest.tokens.filter((token) => token.component === admission.component).length, reason: admission.independentThemingNeed })),
  migration: namingManifest.migration,
}

export function TokensPageAdapter({ actions, lang, foundationGroups }: { actions: ReactNode; lang: TokensPageLang; foundationGroups: FoundationGroup[] }) {
  return <TokensPage actions={actions} lang={lang} model={model} foundationGroups={foundationGroups} foundationTokens={buildFoundationTokens(foundationGroups)} />
}
