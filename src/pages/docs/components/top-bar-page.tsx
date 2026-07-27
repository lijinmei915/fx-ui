import { useState } from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { TooltipProvider } from "@/components/ui/tooltip"
import { BellIcon, CheckCircleIcon, HelpIcon, InboxIcon, MessageCircleIcon } from "@/lib/icons"
import { StandardDocPage, type StandardDocLang } from "@/pages/docs/components/standard-doc-page"
import { TopBar, TopBarActions, TopBarApps, TopBarBrand, TopBarDivider, TopBarIconButton, TopBarSearch } from "@/components/fx/top-bar"

type ScenarioExample = { id: string; title: string; intent: string; rule: string; code: string; group?: string; spec?: string }
type PropRow = { prop: string; type: string; defaultValue: string; desc: string; descEn?: string }
type SemanticDomRow = { part: string; desc: string; descEn?: string }
type DoDontRow = { do: string; doEn?: string; dont: string; dontEn?: string }

export const topBarAnchors = [
  { label: "组件总览", labelEn: "Overview", href: "#top-bar-overview" },
  { label: "场景示例", labelEn: "Scenario examples", href: "#top-bar-preview" },
  { label: "使用方式", labelEn: "Usage", href: "#top-bar-usage" },
  { label: "API", href: "#top-bar-props" },
  { label: "语义 DOM", labelEn: "Semantic DOM", href: "#top-bar-semantic-dom" },
  { label: "正误示例", labelEn: "Do / Don’t", href: "#top-bar-do-dont" },
]

export const topBarPropRows = [
  { prop: "TopBar", type: "header 容器", defaultValue: "—", desc: "全局应用顶栏外壳（48px，自身不设底色/分割线，由宿主决定），两端对齐布局子件。", descEn: "Global app top bar shell (48px, no own bg/divider)." },
  { prop: "TopBarBrand", type: "logo?, name", defaultValue: "—", desc: "左侧品牌：logo + 公司/产品名（超长截断）。", descEn: "Brand: logo + product name." },
  { prop: "TopBarApps", type: "current, apps, onSelect?", defaultValue: "—", desc: "应用切换：当前应用名 + 下拉选择（受控）。", descEn: "App switcher dropdown (controlled)." },
  { prop: "TopBarSearch", type: "value, onValueChange, scope?, scopes?, onScopeChange?, placeholder?", defaultValue: "—", desc: "中部全局搜索：范围下拉 + 输入框（受控）。", descEn: "Global search: scope dropdown + input (controlled)." },
  { prop: "TopBarActions / TopBarIconButton", type: "icon, label, dot?, count?, onClick?", defaultValue: "—", desc: "右侧工具区与图标按钮：无底色 + Tooltip + aria-label，可选角标。", descEn: "Right tools: icon buttons + tooltip + optional badge." },
]

export const topBarSemanticDomRows = [
  { part: "[data-slot=\"top-bar\"]", desc: "顶栏根节点（header），48px，自身不设底色/分割线。", descEn: "Top bar root (header), 48px." },
  { part: "[data-slot=\"top-bar-brand\"] / -divider", desc: "品牌区与竖向分隔线。", descEn: "Brand region and vertical divider." },
  { part: "[data-slot=\"top-bar-search\"]", desc: "搜索容器，focus-within 高亮边框。", descEn: "Search container; focus-within ring." },
  { part: "[data-slot=\"top-bar-actions\"]", desc: "右侧工具按钮区。", descEn: "Right-side tool actions." },
]

export const topBarDoDontRows = [
  { do: "用子件组合：Brand / Apps / Search / Actions 各司其职。", doEn: "Compose with Brand / Apps / Search / Actions.", dont: "把整条顶栏写成一坨裸 div + 手写样式。", dontEn: "Hand-roll the whole bar as raw divs." },
  { do: "应用切换、搜索、范围都受控，状态由页面持有。", doEn: "Keep app/search/scope controlled by the page.", dont: "把跳转/搜索逻辑塞进顶栏组件内部。", dontEn: "Bury navigation/search logic inside the bar." },
  { do: "工具图标必带 aria-label + Tooltip，未读用角标。", doEn: "Icon buttons need aria-label + tooltip; badge for unread.", dont: "纯图标无说明、未读数硬塞文字里。", dontEn: "Unlabeled icons; counts crammed into text." },
]

const apps = [
  { key: "crm", label: "CRM" },
  { key: "marketing", label: "营销通" },
  { key: "service", label: "服务通" },
  { key: "bi", label: "BI 智能分析" },
]
const scopes = [
  { key: "all", label: "全部" },
  { key: "cust", label: "客户" },
  { key: "contact", label: "联系人" },
  { key: "opp", label: "商机" },
]

function TopBarPreview({ showScope = true }: { showScope?: boolean }) {
  const [app, setApp] = useState("crm")
  const [query, setQuery] = useState("")
  const [scope, setScope] = useState("all")

  return (
    <TooltipProvider>
      <div className="w-full bg-background">
        <TopBar>
          <TopBarBrand logo={<img src="/LOGO.svg" alt="纷享销客" className="size-5 shrink-0 object-contain" />} name="北京易动纷享科技有限责任公司" />
          <TopBarDivider />
          <TopBarApps current={apps.find((item) => item.key === app)!.label} apps={apps} onSelect={setApp} />
          <TopBarSearch value={query} onValueChange={setQuery} scope={showScope ? scope : undefined} scopes={showScope ? scopes : undefined} onScopeChange={setScope} placeholder="搜索" />
          <TopBarActions>
            <TopBarIconButton icon={<MessageCircleIcon />} label="企信" count={3} />
            <TopBarIconButton icon={<BellIcon />} label="CRM提醒" dot />
            <TopBarIconButton icon={<CheckCircleIcon />} label="待办" />
            <TopBarIconButton icon={<InboxIcon />} label="草稿箱" />
            <TopBarIconButton icon={<HelpIcon />} label="帮助" />
          </TopBarActions>
          <DropdownMenu>
            <DropdownMenuTrigger render={<Avatar className="size-8 cursor-pointer outline-none transition-opacity hover:opacity-90 focus-visible:ring-3 focus-visible:ring-ring/50"><AvatarImage src="/avatars/01.jpg" alt="李明" /><AvatarFallback colorful>李</AvatarFallback></Avatar>} />
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem>个人中心</DropdownMenuItem>
              <DropdownMenuItem>账号设置</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive">退出登录</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TopBar>
      </div>
    </TooltipProvider>
  )
}

export function TopBarPage({
  actions,
  lang,
  scenarioExamples,
  propRows,
  semanticDomRows,
  doDontRows,
}: {
  actions: React.ReactNode
  lang: StandardDocLang
  scenarioExamples: ScenarioExample[]
  propRows: PropRow[]
  semanticDomRows: SemanticDomRow[]
  doDontRows: DoDontRow[]
}) {
  return (
    <StandardDocPage
      slug="top-bar"
      title="顶栏"
      lead="全局应用顶栏：品牌、应用切换、全局搜索、工具图标与头像，48px 白底两端对齐。"
      overview={<TopBarPreview />}
      scenarioExamples={scenarioExamples}
      scenarioLayout="stack"
      renderScenarioPreview={(id) => id === "search-scope" ? <TopBarPreview /> : <TopBarPreview showScope={false} />}
      importCode={`import {\n  TopBar, TopBarBrand, TopBarDivider,\n  TopBarApps, TopBarSearch,\n  TopBarActions, TopBarIconButton,\n} from "@/components/fx/top-bar"`}
      usageCode={`const [app, setApp] = useState("crm")\nconst [q, setQ] = useState("")\nconst [scope, setScope] = useState("all")\n\n<TopBar>\n  <TopBarBrand logo={<Logo />} name="纷享销客" />\n  <TopBarDivider />\n  <TopBarApps current="CRM" apps={apps} onSelect={setApp} />\n  <TopBarSearch value={q} onValueChange={setQ} scope={scope} scopes={scopes} onScopeChange={setScope} />\n  <TopBarActions>\n    <TopBarIconButton icon={<MessageCircleIcon />} label="消息" count={3} />\n    <TopBarIconButton icon={<BellIcon />} label="通知" dot />\n  </TopBarActions>\n  <Avatar>…</Avatar>\n</TopBar>`}
      propRows={propRows}
      semanticDomRows={semanticDomRows}
      doDontRows={doDontRows}
      actions={actions}
      lang={lang}
    />
  )
}
