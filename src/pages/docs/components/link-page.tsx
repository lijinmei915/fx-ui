import { ComponentPlayground, type ComponentPlaygroundConfig } from "@/components/fx/component-playground"
import { Link } from "@/components/ui/link"
import { CopyIcon, LinkIcon } from "@/lib/icons"
import { StandardDocPage, type StandardDocLang } from "@/pages/docs/components/standard-doc-page"
import { componentPlaygroundPropsFromManifest, type ComponentPlaygroundsManifest } from "@/pages/docs/components/component-playground-manifest"
import componentPlaygroundsManifestRaw from "../../../../docs/data/component-playgrounds.manifest.json?raw"

type PropRow = { prop: string; type: string; defaultValue: string; desc: string }
type SemanticDomRow = { part: string; desc: string }
type DoDontRow = { do: string; dont: string }

export const linkAnchors = [
  { label: "调试台", labelEn: "Playground", href: "#link-playground" },
  { label: "API", href: "#link-props" },
  { label: "语义 DOM", labelEn: "Semantic DOM", href: "#link-semantic-dom" },
  { label: "正误示例", labelEn: "Do / Don’t", href: "#link-do-dont" },
]

export const linkPropRows = [
  { prop: "tone", type: "\"standard\" | \"default\" | \"primary\" | \"success\" | \"warning\" | \"danger\"", defaultValue: "\"standard\"", desc: "语义色档，对应链接的语义场景。" },
  { prop: "underline", type: "\"hover\" | \"always\"", defaultValue: "\"hover\"", desc: "类型：基础链接（悬停出下划线）或下划线链接（常驻）。" },
  { prop: "size", type: "\"sm\" | \"default\" | \"lg\"", defaultValue: "\"default\"", desc: "尺寸档（12 / 14 / 16px），图标随字号缩放。" },
  { prop: "disabled", type: "boolean", defaultValue: "false", desc: "禁用态，移除 href、移出 Tab 序并阻止点击处理器执行。" },
  { prop: "...props", type: "React.ComponentProps<\"a\">", defaultValue: "—", desc: "原生 a 属性，如 href、target、rel。" },
]

export const linkSemanticDomRows = [{ part: "[data-slot=\"link\"][data-tone][data-underline][data-size]", desc: "链接本体，data-tone/underline/size 标记语义色、类型与档位并驱动样式。" }]

export const linkDoDontRows = [
  { do: "导航类文字跳转用 Link，并提供真实 href。", dont: "手写 <a> 再贴一堆颜色类伪装链接。" },
  { do: "用 tone 表达语义色（如 danger 表示风险操作说明）。", dont: "给链接手写 text-[#xxx] 硬编码颜色。" },
  { do: "强操作（提交、删除按钮）改用 Button。", dont: "把 Link 当按钮，用 onClick 触发表单提交。" },
  { do: "图标用 data-icon 标位，尺寸交给 Link。", dont: "给链接内图标手写 size-4 等尺寸。" },
]

type LinkTone = "standard" | "default" | "primary" | "success" | "warning" | "danger"
type LinkUnderline = "hover" | "always"
type LinkSize = "sm" | "default" | "lg"
type LinkIconMode = "none" | "start" | "end"

const componentPlaygroundsManifest = JSON.parse(componentPlaygroundsManifestRaw) as ComponentPlaygroundsManifest

function getLinkLabel(tone: LinkTone, lang: StandardDocLang) {
  const labels: Record<LinkTone, { zh: string; en: string }> = {
    standard: { zh: "标准链接", en: "Standard link" },
    default: { zh: "默认链接", en: "Default link" },
    primary: { zh: "主要链接", en: "Primary link" },
    success: { zh: "成功链接", en: "Success link" },
    warning: { zh: "警告链接", en: "Warning link" },
    danger: { zh: "危险链接", en: "Danger link" },
  }
  return lang === "en" ? labels[tone].en : labels[tone].zh
}

function renderLinkPlayground(underline: LinkUnderline, tone: LinkTone, size: LinkSize, icon: LinkIconMode, disabled: boolean, lang: StandardDocLang) {
  const label = getLinkLabel(tone, lang)
  return <Link
    href="#link"
    underline={underline}
    tone={tone}
    size={size}
    disabled={disabled}
    onClick={(event) => {
      event.preventDefault()
      event.currentTarget.dataset.activated = "true"
    }}
  >
    {icon === "start" ? <LinkIcon data-icon="inline-start" /> : null}
    {label}
    {icon === "end" ? <CopyIcon data-icon="inline-end" /> : null}
  </Link>
}

function genLinkPlaygroundCode(underline: LinkUnderline, tone: LinkTone, size: LinkSize, icon: LinkIconMode, disabled: boolean, lang: StandardDocLang) {
  const attrs = disabled ? ["disabled"] : [`href="/docs"`]
  if (underline !== "hover") attrs.push(`underline="${underline}"`)
  if (tone !== "standard") attrs.push(`tone="${tone}"`)
  if (size !== "default") attrs.push(`size="${size}"`)
  const label = getLinkLabel(tone, lang)
  const content = icon === "start" ? `<LinkIcon data-icon="inline-start" />${label}` : icon === "end" ? `${label}<CopyIcon data-icon="inline-end" />` : label
  return `import { Link } from "@/components/ui/link"\n${icon !== "none" ? `import { ${icon === "start" ? "LinkIcon" : "CopyIcon"} } from "@/lib/icons"\n` : ""}\n<Link ${attrs.join(" ")}>${content}</Link>`
}

export const linkPlaygroundConfig: ComponentPlaygroundConfig = {
  storySource: "docs/data/component-playgrounds.manifest.json#components.link",
  props: componentPlaygroundPropsFromManifest(componentPlaygroundsManifest.components.link),
  initial: componentPlaygroundsManifest.components.link.initial,
  renderOne: (values, lang) => renderLinkPlayground(values.underline as LinkUnderline, values.tone as LinkTone, values.size as LinkSize, values.icon as LinkIconMode, values.disabled === "true", lang),
  genCode: (values, lang) => genLinkPlaygroundCode(values.underline as LinkUnderline, values.tone as LinkTone, values.size as LinkSize, values.icon as LinkIconMode, values.disabled === "true", lang),
}

export function LinkPage({ actions, lang, playgroundConfig, propRows, semanticDomRows, doDontRows }: {
  actions: React.ReactNode
  lang: StandardDocLang
  playgroundConfig: ComponentPlaygroundConfig
  propRows: PropRow[]
  semanticDomRows: SemanticDomRow[]
  doDontRows: DoDontRow[]
}) {
  return <StandardDocPage
    slug="link"
    title="Link 链接"
    lead="用于页面内跳转或外部导航的文字链接；它是 shadcn 缺少通用文本链接时，经白名单治理的原生语义组件。"
    playground={<ComponentPlayground config={playgroundConfig} lang={lang} />}
    hideOverview
    hideScenarioExamples
    hideUsage
    overview={null}
    scenarioExamples={[]}
    renderScenarioPreview={() => null}
    importCode={`import { Link } from "@/components/ui/link"`}
    usageCode={`<Link href="/docs">打开文档</Link>`}
    propRows={propRows}
    semanticDomRows={semanticDomRows}
    doDontRows={doDontRows}
    actions={actions}
    lang={lang}
  />
}
