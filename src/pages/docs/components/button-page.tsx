import { PageLead } from "@/components/fx/page-lead"
import { SectionLead } from "@/components/fx/section-lead"
import { DocDoDont } from "@/components/fx/doc-do-dont"
import { DocSurfaceTableCard } from "@/components/fx/doc-surface"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { docsSpacing } from "@/lib/docs-spacing"
import type { StandardDocLang } from "@/pages/docs/components/standard-doc-page"
import { ButtonPlayground } from "@/pages/docs/components/button-playground"

type PropRow = { prop: string; type: string; defaultValue: string; desc: string; descEn?: string }
type SemanticDomRow = { part: string; desc: string; descEn?: string }
type DoDontRow = { do: string; doEn?: string; dont: string; dontEn?: string }

export const buttonPropRows = [
  { prop: "variant", type: "'default' | 'outline' | 'secondary' | 'ghost' | 'destructive' | 'plain'", defaultValue: "'default'", desc: "来自 Button 源码的样式变体", descEn: "Style variant from the Button source" },
  { prop: "tone", type: "'default' | 'primary' | 'info' | 'danger'", defaultValue: "'default'", desc: "仅 plain 使用的语义色调", descEn: "Semantic tone for the plain variant only" },
  { prop: "size", type: "'xs' | 'sm' | 'md' | 'lg' | 'icon-xs' | 'icon-sm' | 'icon-md' | 'icon-lg'", defaultValue: "'sm'", desc: "来自 Button 源码的尺寸变体；不写 size 即 28px", descEn: "Size variant from the Button source; omitted size renders 28px" },
  { prop: "disabled", type: "boolean", defaultValue: "false", desc: "是否禁用", descEn: "Whether the button is disabled" },
  { prop: "aria-invalid", type: "boolean", defaultValue: "false", desc: "错误态样式，继承 shadcn 语义 token", descEn: "Invalid state styling based on semantic tokens" },
  { prop: "render", type: "ReactElement | (props, state) => ReactElement", defaultValue: "undefined", desc: "把按钮样式渲染到自定义元素上（如 <a>），相当于 Base UI 版本的 asChild", descEn: "Render the button styling onto a custom element (e.g. <a>); Base UI's equivalent of asChild" },
]

export const buttonSemanticDomRows = [
  { part: "root", desc: "按钮根节点，承载 variant、size、disabled、aria-invalid 和焦点态样式。", descEn: "Button root node for variant, size, disabled, aria-invalid, and focus styles." },
  { part: "icon", desc: "图标区域，用 data-icon=\"inline-start\"（前置）或 \"inline-end\"（后置）标记位置，不手写尺寸覆盖。", descEn: "Icon region. Mark placement with data-icon=\"inline-start\" (leading) or \"inline-end\" (trailing); do not override sizing manually." },
  { part: "content", desc: "按钮文本内容，保持单行动作短语，避免塞入说明文案。", descEn: "Button text content. Keep it as a concise action phrase." },
]

export const buttonDoDontRows = [
  { do: "用默认样式与语义 token，颜色交给主题。", doEn: "Use default styles and semantic tokens; leave color to the theme.", dont: "手写 bg-[#FF8000] 等品牌色硬编码。", dontEn: "Hard-code brand colors like bg-[#FF8000]." },
  { do: "危险操作用 variant=\"destructive\"。", doEn: "Use variant=\"destructive\" for dangerous actions.", dont: "用默认按钮承载删除等危险操作。", dontEn: "Use a default button for destructive actions like delete." },
  { do: "加载态用 disabled + Spinner 组合。", doEn: "Compose loading with disabled + Spinner.", dont: "发明 loading prop（<Button loading>）。", dontEn: "Invent a loading prop (<Button loading>)." },
  { do: "按钮内图标用 data-icon 标位，尺寸交给 Button。", doEn: "Mark icons with data-icon; let Button own the size.", dont: "给按钮内图标手写 size-4 等尺寸。", dontEn: "Hard-code icon size like size-4 inside Button." },
  { do: "一组操作只突出一个主按钮，其余用次按钮。", doEn: "Keep a single primary button per group; make the rest secondary.", dont: "同时摆多个主按钮，主次不分。", dontEn: "Stack multiple primary buttons with no clear hierarchy." },
  { do: "操作无明显主次时，整组用次按钮最稳妥。", doEn: "When actions are equal in weight, an all-secondary group is safest.", dont: "无主次却全用主按钮抢视觉。", dontEn: "Make every button primary when none truly leads." },
  { do: "多个按钮之间留出间隔。", doEn: "Leave spacing between adjacent buttons.", dont: "按钮连在一起，易和 Radio / 分段控件混淆。", dontEn: "Glue buttons together so they look like a radio / segmented control." },
  { do: "删除等高风险操作用 destructive 红色按钮，搭配“取消”。", doEn: "Use a destructive (red) button for risky actions like delete, paired with “Cancel”.", dont: "把主按钮“保存”和红色“删除”并排，误导用户。", dontEn: "Place a primary “Save” next to a red “Delete”, misleading users." },
  { do: "文案用明确动词传达操作结果（发布 / 删除 / 登录）。", doEn: "Use clear verbs that convey the outcome (Publish / Delete / Sign in).", dont: "用含糊文案（保存 / 保存并新建）说不清后果。", dontEn: "Use vague labels that don’t spell out the consequence." },
]

export const buttonAnchors = [
  { label: "调试台", labelEn: "Playground", href: "#playground" },
  { label: "API", href: "#props" },
  { label: "语义 DOM", labelEn: "Semantic DOM", href: "#semantic-dom" },
  { label: "正误示例", labelEn: "Do / Don’t", href: "#do-dont" },
]

export function ButtonPage({ actions, lang, propRows, semanticDomRows, doDontRows }: {
  actions: React.ReactNode
  lang: StandardDocLang
  propRows: PropRow[]
  semanticDomRows: SemanticDomRow[]
  doDontRows: DoDontRow[]
}) {
  return (
    <div className={docsSpacing.pageStack}>
      <section id="button" className="flex flex-col gap-2">
        <PageLead
          crumb={lang === "en" ? "Components / Button" : "组件 / 按钮"}
          title={lang === "en" ? "Button" : "按钮"}
          lead={lang === "en" ? "Trigger immediate actions such as submit, save, create, or delete." : "用于触发提交、保存、新建、删除等即时操作。"}
          actions={actions}
        />
      </section>
      <section id="playground" className={docsSpacing.sectionStack}>
        <SectionLead title={lang === "en" ? "Playground" : "调试台"} description={lang === "en" ? "Pick a usage mode or tweak props live, then copy the generated code." : "选模式或实时调属性，预览随之变化，写法可一键复制。"} />
        <ButtonPlayground lang={lang} />
      </section>
      <section id="props" className={docsSpacing.sectionStack}>
        <h2 className="text-xl font-bold tracking-tight">{lang === "en" ? "API Props" : "API 属性"}</h2>
        <DocSurfaceTableCard><Table className="min-w-[640px]"><TableHeader><TableRow><TableHead className="pl-4">{lang === "en" ? "Prop" : "属性"}</TableHead><TableHead>{lang === "en" ? "Type" : "类型"}</TableHead><TableHead>{lang === "en" ? "Default" : "默认值"}</TableHead><TableHead className="pr-4">{lang === "en" ? "Description" : "描述"}</TableHead></TableRow></TableHeader><TableBody>{propRows.map((row) => <TableRow key={row.prop}><TableCell className="pl-4 font-medium">{row.prop}</TableCell><TableCell><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.type}</code></TableCell><TableCell><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.defaultValue}</code></TableCell><TableCell className="pr-4 text-muted-foreground">{lang === "en" ? (row.descEn ?? row.desc) : row.desc}</TableCell></TableRow>)}</TableBody></Table></DocSurfaceTableCard>
      </section>
      <section id="semantic-dom" className={docsSpacing.sectionStack}>
        <SectionLead title={lang === "en" ? "Semantic DOM" : "语义 DOM"} description={lang === "en" ? "Button source comes from shadcn/ui and remains open-code. This section records the semantic parts AI and engineers should understand." : "Button 源码来自 shadcn/ui，保持 open-code。这里记录 AI 和工程师应该理解的语义部位。"} />
        <DocSurfaceTableCard><Table className="min-w-[560px]"><TableHeader><TableRow><TableHead className="pl-4">{lang === "en" ? "Part" : "部位"}</TableHead><TableHead className="pr-4">{lang === "en" ? "Description" : "说明"}</TableHead></TableRow></TableHeader><TableBody>{semanticDomRows.map((row) => <TableRow key={row.part}><TableCell className="pl-4 font-medium"><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.part}</code></TableCell><TableCell className="pr-4 text-muted-foreground">{lang === "en" ? (row.descEn ?? row.desc) : row.desc}</TableCell></TableRow>)}</TableBody></Table></DocSurfaceTableCard>
      </section>
      <section id="do-dont" className={docsSpacing.sectionStack}>
        <SectionLead title={lang === "en" ? "Do / Don’t" : "正误示例"} description={lang === "en" ? "These examples capture the most common mistakes for engineers and AI-generated code." : "这些例子记录工程师和 AI 生成代码最容易犯的错误。"} />
        <DocDoDont lang={lang} rows={doDontRows} />
      </section>
    </div>
  )
}
