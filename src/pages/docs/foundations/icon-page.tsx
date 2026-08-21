import { useState, type ComponentType, type ReactNode, type SVGProps } from "react"

import { Button } from "@/components/ui/button"
import { ComponentPlayground, PlaygroundSegmentedControl } from "@/components/fx/component-playground"
import { DocDoDont } from "@/components/fx/doc-do-dont"
import { DocSurfaceCard, DocSurfaceTableCard } from "@/components/fx/doc-surface"
import { PageLead } from "@/components/fx/page-lead"
import { SectionLead } from "@/components/fx/section-lead"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { componentPlaygroundPropsFromManifest, type ComponentPlaygroundsManifest } from "@/pages/docs/components/component-playground-manifest"
import { docsSpacing } from "@/lib/docs-spacing"
import * as Icons from "@/lib/icons"
import componentPlaygroundsManifestRaw from "../../../../docs/data/component-playgrounds.manifest.json?raw"
import iconsManifestRaw from "../../../../docs/data/icons.manifest.json?raw"

export type IconPageLang = "zh" | "en"

export const iconAnchors = [
  { label: "调试台", labelEn: "Playground", href: "#icon-playground" },
  { label: "组合方式", labelEn: "Composition", href: "#icon-composition" },
  { label: "API", href: "#icon-props" },
  { label: "语义 DOM", labelEn: "Semantic DOM", href: "#icon-semantic-dom" },
  { label: "正误示例", labelEn: "Do / Don’t", href: "#icon-do-dont" },
]

const componentPlaygroundsManifest = JSON.parse(componentPlaygroundsManifestRaw) as ComponentPlaygroundsManifest
type IconCatalogItem = { name: string; source: string; style: "line" | "fill"; category: string; keywords: string[] }
const iconCatalog = (JSON.parse(iconsManifestRaw) as { icons: IconCatalogItem[] }).icons
const iconCatalogByName = new Map(iconCatalog.map((icon) => [icon.name, icon]))
type IconComponent = ComponentType<SVGProps<SVGSVGElement>>

const iconPropRows = [
{ prop: "size", type: "number", defaultValue: "24", desc: "图标边长（px），等价于同时设置 width/height；项目内更推荐用 className 的 size-* 控制", descEn: "Icon edge length in px (sets width/height). Prefer size-* via className in this project" },
{ prop: "stroke", type: "number", defaultValue: "2", desc: "线宽；项目用全局 .tabler-icon = 1.75 统一覆盖，一般不单独传", descEn: "Stroke width; globally overridden to 1.75 via .tabler-icon, rarely set per-icon" },
{ prop: "title", type: "string", defaultValue: "—", desc: "图标本身有独立语义时提供可访问名称；纯装饰图标保持 aria-hidden。", descEn: "Provide an accessible name when an icon has standalone meaning; keep decorative icons aria-hidden." },
{ prop: "className", type: "string", defaultValue: "—", desc: "追加 Tailwind 类，常用 size-* 控制尺寸、text-* 控制颜色。", descEn: "Extra Tailwind classes; commonly size-* for sizing and text-* for color." },
{ prop: "SVG / ARIA 属性", type: "SVGProps<SVGSVGElement>", defaultValue: "—", desc: "其余原生 SVG 与 ARIA 属性透传；操作语义由 Button 或 Link 承担。", descEn: "Other native SVG and ARIA attributes pass through; Button or Link owns action semantics." },
];


type IconPlaygroundColor = "foreground" | "muted" | "primary" | "success" | "warning" | "destructive" | "info";

const iconPlaygroundSizeClass: Record<string, string> = {
  "12": "size-3",
  "16": "size-4",
  "20": "size-5",
  "24": "size-6",
  "32": "size-8"
};

const iconPlaygroundColors: {value: IconPlaygroundColor;label: string;labelEn: string;className: string;}[] = [
{ value: "foreground", label: "正文", labelEn: "Foreground", className: "text-foreground" },
{ value: "muted", label: "次要", labelEn: "Muted", className: "text-muted-foreground" },
{ value: "primary", label: "主题", labelEn: "Primary", className: "text-primary" },
{ value: "success", label: "成功", labelEn: "Success", className: "text-success" },
{ value: "warning", label: "警告", labelEn: "Warning", className: "text-warning" },
{ value: "destructive", label: "危险", labelEn: "Danger", className: "text-destructive" },
{ value: "info", label: "信息", labelEn: "Info", className: "text-info" }];

function getIconPlaygroundColor(value: string) {
  return iconPlaygroundColors.find((item) => item.value === value) ?? iconPlaygroundColors[0];
}

function iconVariantNames(icon: IconCatalogItem) {
  const lineName = icon.name.replace("FilledIcon", "Icon")
  const fillName = lineName.replace(/Icon$/, "FilledIcon")
  return [lineName, fillName].filter((name, index, names) => iconCatalogByName.has(name) && names.indexOf(name) === index)
}

function iconComponent(name: string) {
  return Icons[name as keyof typeof Icons] as IconComponent
}

function renderIconPlayground(c: Record<string, string>, selectedIcon: IconCatalogItem) {
  const Icon = iconComponent(selectedIcon.name);
  const sizeKey = c.size || "20";
  const color = getIconPlaygroundColor(c.color);
  const iconSizeClass = iconPlaygroundSizeClass[sizeKey] ?? iconPlaygroundSizeClass["20"];
  return <Icon className={`${iconSizeClass} ${color.className}`} />
}

function genIconPlaygroundCode(c: Record<string, string>, selectedIcon: IconCatalogItem) {
  const sizeKey = c.size || "20";
  const color = getIconPlaygroundColor(c.color);
  const componentName = selectedIcon.name;
  const importCode = `import { ${componentName} } from "@/lib/icons"`;
  const iconSizeClass = iconPlaygroundSizeClass[sizeKey] ?? iconPlaygroundSizeClass["20"];
  return `${importCode}\n\n<${componentName} className="${iconSizeClass} ${color.className}" />`;
}

export function IconPage({ actions, lang }: { actions: ReactNode; lang: IconPageLang }) {
  const [selectedIconName, setSelectedIconName] = useState("HomeIcon")
  const selectedIcon = iconCatalogByName.get(selectedIconName) ?? iconCatalog[0]
  const SelectedIcon = iconComponent(selectedIcon.name)
  const selectedIconVariants = iconVariantNames(selectedIcon)
  const iconPlaygroundConfig = {
    storySource: "docs/data/component-playgrounds.manifest.json#components.icon",
    props: componentPlaygroundPropsFromManifest(componentPlaygroundsManifest.components.icon),
    initial: componentPlaygroundsManifest.components.icon.initial,
    guidanceKey: componentPlaygroundsManifest.components.icon.guidanceKey,
    leadingControls: [
      {
        key: "style",
        zh: "类型",
        en: "Style",
        control: selectedIconVariants.length > 1 ? (
          <PlaygroundSegmentedControl
            value={selectedIcon.name}
            onChange={setSelectedIconName}
            options={selectedIconVariants.map((name) => ({
              value: name,
              label: name.endsWith("FilledIcon") ? (lang === "en" ? "Filled" : "面型") : (lang === "en" ? "Line" : "线性"),
            }))}
          />
        ) : null,
      },
    ],
    renderOne: (values: Record<string, string>) => renderIconPlayground(values, selectedIcon),
    genCode: (values: Record<string, string>) => genIconPlaygroundCode(values, selectedIcon),
  }
  const iconSemanticRows = [
  { part: "svg.tabler-icon", desc: "每个图标渲染为带 .tabler-icon 类的 <svg>，全局在此类上统一 stroke-width，不要逐个图标改线宽。", descEn: "Each icon renders as <svg class=\"tabler-icon\">; stroke-width is set globally on this class." },
  { part: "currentColor", desc: "描边/填充默认取 currentColor，跟随父级 text-* 语义色；改色改父级文字色即可。", descEn: "Stroke/fill default to currentColor and follow the parent text color." },
  { part: "data-icon", desc: "图标放进 Button 时用 data-icon=\"inline-start | inline-end\" 标位，由 Button 决定尺寸与间距。", descEn: "Inside Button, data-icon marks placement; Button owns size and spacing." }];


  const iconDoDontRows = [
  { do: "颜色用 currentColor / text-* 跟随语义色。", doEn: "Use currentColor / text-* to follow semantic color.", dont: "给图标写死 color=\"#FF8000\" 等颜色。", dontEn: "Hard-code icon color like color=\"#FF8000\"." },
  { do: "按钮内图标用 data-icon 标位，尺寸交给 Button。", doEn: "Mark icons in Button with data-icon; Button owns size.", dont: "给按钮内图标手写 size-4 等尺寸。", dontEn: "Hard-code icon size like size-4 inside Button." },
  { do: "纯图标按钮加 aria-label。", doEn: "Give icon-only buttons an aria-label.", dont: "纯图标按钮不给可访问名称。", dontEn: "Omit accessible names on icon-only buttons." },
  { do: "统一从 @/lib/icons 导入。", doEn: "Import from @/lib/icons.", dont: "引入第二个图标库（如 lucide-react）。", dontEn: "Add a second icon library like lucide-react." }];

  return (
    <div className={docsSpacing.pageStack}>
      <section id="icon-library" className="flex flex-col gap-2">
        <PageLead
          crumb={lang === "en" ? "General / Icon" : "通用 / Icon"}
          title={lang === "en" ? "Icon" : "Icon 图标"}
          lead={lang === "en" ?
          "Icons convey actions, status, and objects. fx-ui uses Tabler line icons, imported from @/lib/icons." :
          "图标用于传达动作、状态与对象。fx-ui 统一使用 Tabler 线性图标，从 @/lib/icons 导入。"}
          actions={actions} />
        
      </section>

      <section id="icon-playground" className={docsSpacing.sectionStack}>
        <SectionLead
          title={lang === "en" ? "Playground" : "调试台"}
          description={lang === "en" ?
          "Tune the live icon properties. The preview and generated code update together." :
          "实时调图标属性，预览随之变化，写法可一键复制。"} />
        <ComponentPlayground config={iconPlaygroundConfig} lang={lang} />
      </section>

      <section id="icon-composition" className={docsSpacing.sectionStack}>
        <SectionLead
          title={lang === "en" ? "Composition examples" : "组合示例"}
          description={lang === "en" ? "These are calling-side structures, not Icon props. Use Button or Link whenever the icon performs an action." : "以下是调用侧结构，不是 Icon 属性。图标承担操作时，必须交给 Button 或 Link。"}
        />
        <DocSurfaceCard className="grid gap-(--fx-panel-gap) p-(--fx-panel-padding) md:grid-cols-3">
          <div className="flex items-center gap-(--fx-control-gap-tight) text-muted-foreground">
            <SelectedIcon className="size-5" aria-hidden="true" />
            <span>{lang === "en" ? "Icon with text" : "图标配文字"}</span>
          </div>
          <div className="flex items-center gap-(--fx-control-gap-tight)">
            <span className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <SelectedIcon className="size-5" aria-hidden="true" />
            </span>
            <span>{lang === "en" ? "Supported icon" : "色块承托"}</span>
          </div>
          <Button variant="outline" aria-label={lang === "en" ? "Open icon action" : "打开图标操作"}>
            <SelectedIcon data-icon="inline-start" />
            {lang === "en" ? "Action" : "操作"}
          </Button>
        </DocSurfaceCard>
      </section>

      <section id="icon-props" className={docsSpacing.sectionStack}>
        <h2 className="text-xl font-bold tracking-tight">{lang === "en" ? "API Props" : "API 属性"}</h2>
        <DocSurfaceTableCard>
          <Table className="min-w-[640px]">
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">{lang === "en" ? "Prop" : "属性"}</TableHead>
                <TableHead>{lang === "en" ? "Type" : "类型"}</TableHead>
                <TableHead>{lang === "en" ? "Default" : "默认值"}</TableHead>
                <TableHead className="pr-4">{lang === "en" ? "Description" : "描述"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {iconPropRows.map((row) =>
              <TableRow key={row.prop}>
                  <TableCell className="pl-4 font-medium">{row.prop}</TableCell>
                  <TableCell><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.type}</code></TableCell>
                  <TableCell><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.defaultValue}</code></TableCell>
                  <TableCell className="pr-4 text-muted-foreground">{lang === "en" ? row.descEn : row.desc}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </DocSurfaceTableCard>
      </section>

      <section id="icon-semantic-dom" className={docsSpacing.sectionStack}>
        <SectionLead title={
        lang === "en" ? "Semantic DOM" : "语义 DOM"} description={

        lang === "en" ?
        "Icons come from Tabler. These are the semantic parts AI and engineers should understand." :
        "图标来自 Tabler。这里记录 AI 和工程师应该理解的语义部位。"} />

        
        <DocSurfaceTableCard>
          <Table className="min-w-[560px]">
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">{lang === "en" ? "Part" : "部位"}</TableHead>
                <TableHead className="pr-4">{lang === "en" ? "Description" : "说明"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {iconSemanticRows.map((row) =>
              <TableRow key={row.part}>
                  <TableCell className="pl-4 font-medium">
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.part}</code>
                  </TableCell>
                  <TableCell className="pr-4 text-muted-foreground">{lang === "en" ? row.descEn : row.desc}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </DocSurfaceTableCard>
      </section>

      <section id="icon-do-dont" className={docsSpacing.sectionStack}>
        <SectionLead title={
        lang === "en" ? "Do / Don’t" : "正误示例"} description={

        lang === "en" ?
        "The most common icon mistakes for engineers and AI-generated code." :
        "工程师和 AI 生成代码最容易犯的图标错误。"} />

        
        <DocDoDont lang={lang} rows={iconDoDontRows} />
      </section>
    </div>);

}
