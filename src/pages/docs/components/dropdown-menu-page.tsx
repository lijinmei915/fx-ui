import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CardContent } from "@/components/ui/card"
import {
  DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DocSurfaceCard } from "@/components/fx/doc-surface"
import { StandardDocPage, type StandardDocLang } from "@/pages/docs/components/standard-doc-page"
import { ChevronDownIcon, ChevronRightIcon, CreditCardIcon, LogOutIcon, PlusIcon, SearchIcon, SettingsIcon, UserIcon } from "@/lib/icons"
import type { StandardScenarioExample } from "@/pages/docs/components/standard-scenario-playground"

type Lang = StandardDocLang
type PropRow = { prop: string; type: string; defaultValue: string; desc: string }
type SemanticDomRow = { part: string; desc: string }
type DoDontRow = { do: string; dont: string }
type ScenarioFilter = { value: string; label: string; labelEn?: string }

export const dropdownMenuAnchors = [
  { label: "组件总览", href: "#dropdown-menu-overview" },
  { label: "场景示例", href: "#dropdown-menu-preview" },
  { label: "使用方式", href: "#dropdown-menu-usage" },
  { label: "API", href: "#dropdown-menu-props" },
  { label: "语义 DOM", href: "#dropdown-menu-semantic-dom" },
  { label: "正误示例", href: "#dropdown-menu-do-dont" },
]

export const dropdownMenuScenarioFilters = [
  { value: "type", label: "类型" },
  { value: "state", label: "选项状态" },
]

export const dropdownMenuPropRows = [
  { prop: "DropdownMenu / DropdownMenuTrigger", type: "MenuPrimitive.Root.Props / Trigger.Props", defaultValue: "—", desc: "根节点与触发器，常用 render 包裹 Button 自定义外观。" },
  { prop: "DropdownMenuContent", type: "side? / align? / sideOffset?", defaultValue: "side=\"bottom\" align=\"start\"", desc: "菜单弹层，定位 props 决定弹出方向与对齐方式。尺寸规范：默认宽度按内容自适应（内容窄时即最小宽 160px，最宽 320px、超长截断），最大高 320px（约 10 项，超出滚动）；选择型可加 w-(--anchor-width) 跟随触发器。" },
  { prop: "DropdownMenuItem", type: "variant?: \"default\" | \"destructive\" / inset?", defaultValue: "\"default\"", desc: "菜单项，destructive 用于危险操作的视觉强调。" },
  { prop: "DropdownMenuLabel / DropdownMenuSeparator", type: "—", defaultValue: "—", desc: "分组标题与分隔线，用于组织菜单结构。" },
  { prop: "DropdownMenuShortcut", type: "React.ComponentProps<\"span\">", defaultValue: "—", desc: "靠右展示的快捷键提示文案。" },
  { prop: "DropdownMenuCheckboxItem", type: "checked? / onCheckedChange?", defaultValue: "—", desc: "复选型菜单项（菜单内多选开关，勾选不自动关闭）。" },
  { prop: "DropdownMenuRadioGroup / RadioItem", type: "value? / onValueChange? / value", defaultValue: "—", desc: "单选组与单选项，菜单内单选一个值（排序、密度等）。" },
  { prop: "DropdownMenuSub / SubTrigger / SubContent", type: "—", defaultValue: "—", desc: "子菜单（二级展开），用于「移动到→」这类有下一级的操作。" },
]

export const dropdownMenuSemanticDomRows = [
  { part: "[data-slot=\"dropdown-menu-trigger\"]", desc: "触发器，自动同步 aria-expanded / aria-haspopup。" },
  { part: "[data-slot=\"dropdown-menu-content\"]", desc: "菜单弹层容器，定位与动画都挂载在此。" },
  { part: "[data-slot=\"dropdown-menu-item\"][data-variant]", desc: "菜单项，data-variant 区分默认与危险操作样式。" },
  { part: "[data-slot=\"dropdown-menu-separator\"] / [data-slot=\"dropdown-menu-label\"]", desc: "分隔线与分组标题，组织菜单内部结构。" },
]

export const dropdownMenuDoDontRows = [
  { do: "把危险操作放在末尾并用 destructive 变体区分。", dont: "把删除按钮和普通操作并排放置，容易误触。" },
  { do: "用 Separator 和 Label 给菜单项分组。", dont: "把十几个操作平铺成一长串列表，找不到重点。" },
  { do: "为常用操作标注快捷键（DropdownMenuShortcut）。", dont: "重要的快捷键信息只放在帮助文档里，菜单上不可见。" },
]

function StaticMenu({ children, className, label = "打开菜单" }: { children: React.ReactNode; className?: string; label?: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button size="sm" variant="outline">{label}<ChevronDownIcon data-icon="inline-end" /></Button>} />
      <DropdownMenuContent className={className}>{children}</DropdownMenuContent>
    </DropdownMenu>
  )
}
function MItem({ icon, label, selected, checked, arrow, danger, disabled, onClick }: { icon?: React.ReactNode; label: string; selected?: boolean; checked?: boolean; arrow?: boolean; danger?: boolean; disabled?: boolean; onClick?: () => void }) {
  if (checked !== undefined) {
    return <DropdownMenuCheckboxItem checked={checked} disabled={disabled} onCheckedChange={() => onClick?.()}>{icon}<span className="flex-1 truncate">{label}</span></DropdownMenuCheckboxItem>
  }
  return <DropdownMenuItem disabled={disabled} selected={selected} variant={danger ? "destructive" : "default"} onClick={onClick}>{icon}<span className="flex-1 truncate">{label}</span>{arrow && <ChevronRightIcon className="ml-auto size-3 text-muted-foreground" />}</DropdownMenuItem>
}
function MGroup({ children }: {children: React.ReactNode;}) {
  return <DropdownMenuLabel>{children}</DropdownMenuLabel>
}
function MLine({ full }: {full?: boolean;}) {
  return <DropdownMenuSeparator className={full ? "-mx-1" : undefined} />
}
// 多选：点击切换勾选
function CheckboxMenuDemo() {
  const [on, setOn] = useState<Record<string, boolean>>({ 姓名: true, 状态: true, 创建时间: false });
  return (
    <StaticMenu>
      <MGroup>显示列</MGroup>
      {["姓名", "状态", "创建时间"].map((k) =>
      <MItem key={k} label={k} selected={on[k]} onClick={() => setOn((s) => ({ ...s, [k]: !s[k] }))} />
      )}
    </StaticMenu>);

}
// 单选 / 选中态：点击切换唯一选中项；mode=check 用普通对勾，mode=selected 用橙字+对勾
function ChoiceMenuDemo({ label, options, initial, mode, className }: {label?: string;options: string[];initial: string;mode: "check" | "selected";className?: string;}) {
  const [val, setVal] = useState(initial);
  return (
    <StaticMenu className={className}>
      {label && <MGroup>{label}</MGroup>}
      {options.map((o) =>
      <MItem
        key={o}
        label={o}
        onClick={() => setVal(o)}
        {...mode === "selected" ? { selected: val === o } : { checked: val === o }} />

      )}
    </StaticMenu>);

}
// 有搜索：输入实时过滤 + 可点选
function SearchMenuDemo() {
  const all = ["张三", "李四", "王五", "赵六"];
  const [q, setQ] = useState("");
  const list = all.filter((n) => n.includes(q));
  return (
    <StaticMenu>
      <div className="p-1">
        <div className="flex h-7 items-center gap-1.5 rounded-lg border border-input px-2 text-base">
          <SearchIcon className="size-3.5 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="搜索"
            className="w-full bg-transparent outline-none placeholder:text-foreground-disabled" />
          
        </div>
      </div>
      {list.length ?
      list.map((n) => <MItem key={n} label={n} />) :

      <div className="px-1.5 py-6 text-center text-base text-muted-foreground">无匹配结果</div>
      }
    </StaticMenu>);

}

function DropdownMenuOverview({ lang }: {lang: Lang;}) {
  return (
    <DocSurfaceCard>
      <CardContent className="grid gap-6 p-6">
      <div className="grid gap-3">
        <h3 className="text-sm font-medium text-muted-foreground">{lang === "en" ? "Types" : "类型"}</h3>
        <div className="flex flex-wrap items-start gap-4">
          {/* 普通 */}
          <StaticMenu>
            <MItem label="编辑" />
            <MItem label="复制" />
            <MItem label="删除" danger />
          </StaticMenu>
          {/* 有图标 */}
          <StaticMenu>
            <MItem icon={<UserIcon />} label="个人资料" />
            <MItem icon={<CreditCardIcon />} label="账单与订阅" />
            <MItem icon={<LogOutIcon />} label="退出登录" danger />
          </StaticMenu>
          {/* 文字分组 */}
          <StaticMenu>
            <MGroup>账户</MGroup>
            <MItem label="个人资料" />
            <MGroup>偏好</MGroup>
            <MItem label="通知" />
          </StaticMenu>
          {/* 线分组 */}
          <StaticMenu>
            <MItem label="编辑" />
            <MItem label="复制" />
            <MLine />
            <MItem label="删除" danger />
          </StaticMenu>
          {/* 有子级 */}
          <StaticMenu>
            <MItem label="重命名" />
            <MItem label="移动到" arrow />
            <MItem label="删除" danger />
          </StaticMenu>
          {/* 有搜索 */}
          <StaticMenu>
            <div className="p-1">
              <div className="flex h-7 items-center gap-1.5 rounded-lg border border-input px-2 text-base text-foreground-disabled">
                <SearchIcon className="size-3.5" /> 搜索
              </div>
            </div>
            <MItem label="张三" />
            <MItem label="李四" />
          </StaticMenu>
          {/* 有吸底 */}
          <StaticMenu>
            <MItem label="项目 A" />
            <MItem label="项目 B" />
            <MLine full />
            <MItem icon={<PlusIcon />} label="新建项目" />
          </StaticMenu>
        </div>
      </div>
      <div className="border-t border-dashed border-border" />
      <div className="grid gap-3">
        <h3 className="text-sm font-medium text-muted-foreground">{lang === "en" ? "Option states" : "选项状态"}</h3>
        <div className="flex flex-wrap items-start gap-4">
          {/* 多选 */}
          <StaticMenu>
            <MGroup>多选</MGroup>
            <MItem label="姓名" selected />
            <MItem label="状态" selected />
            <MItem label="创建时间" />
          </StaticMenu>
          {/* 单选 */}
          <StaticMenu>
            <MGroup>单选</MGroup>
            <MItem label="最新优先" selected />
            <MItem label="最早优先" />
          </StaticMenu>
          {/* 禁用 */}
          <StaticMenu>
            <MItem label="编辑" />
            <MItem label="归档" disabled />
            <MItem label="删除" danger />
          </StaticMenu>
        </div>
      </div>
      </CardContent>
    </DocSurfaceCard>);

}

export function DropdownMenuPage({ actions, lang, scenarioExamples, scenarioFilters, propRows, semanticDomRows, doDontRows, autoScenarioSlugs }: {actions: React.ReactNode;lang: Lang;scenarioExamples: StandardScenarioExample[];scenarioFilters: ScenarioFilter[];propRows: PropRow[];semanticDomRows: SemanticDomRow[];doDontRows: DoDontRow[];autoScenarioSlugs: string[];}) {
  return (
    <StandardDocPage
      slug="dropdown-menu"
      title="Dropdown Menu 下拉菜单"
      lead="点击触发器后弹出的操作菜单，用于在有限空间里收纳多个次级操作。"
      overview={null}
      overviewMatrix={<DropdownMenuOverview lang={lang} />}
      scenarioExamples={scenarioExamples}
      scenarioFilters={scenarioFilters}
      renderScenarioPreview={(id) =>
      id === "normal" ?
      <StaticMenu>
            <MItem label="编辑" />
            <MItem label="复制" />
            <MItem label="重命名" />
            <MItem label="删除" danger />
          </StaticMenu> :
      id === "icon" ?
      <StaticMenu>
            <MItem icon={<UserIcon />} label="个人资料" />
            <MItem icon={<CreditCardIcon />} label="账单与订阅" />
            <MItem icon={<SettingsIcon />} label="设置" />
            <MItem icon={<LogOutIcon />} label="退出登录" danger />
          </StaticMenu> :
      id === "submenu" ?
      <DropdownMenu>
            <DropdownMenuTrigger render={<Button size="sm" variant="outline">操作 <ChevronDownIcon data-icon="inline-end" /></Button>} />
            <DropdownMenuContent>
              <DropdownMenuItem>重命名</DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>移动到</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>我的文档</DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem>工作</DropdownMenuItem>
                      <DropdownMenuItem>个人</DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                  <DropdownMenuItem>共享空间</DropdownMenuItem>
                  <DropdownMenuItem>收藏夹</DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuItem variant="destructive">删除</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> :
      id === "checkbox" ?
      <CheckboxMenuDemo /> :
      id === "radio" ?
      <ChoiceMenuDemo label="排序方式" options={["最新优先", "最早优先", "按名称"]} initial="最新优先" mode="selected" /> :
      id === "disabled" ?
      <StaticMenu>
            <MItem label="编辑" />
            <MItem label="复制" />
            <MItem label="归档" disabled />
            <MItem label="删除" danger />
          </StaticMenu> :
      id === "search" ?
      <SearchMenuDemo /> :
      id === "sticky" ?
      <StaticMenu>
            <div className="scrollbar-thin -mx-1 -mt-1 max-h-40 overflow-y-auto px-1 pt-1">
              {["项目 A", "项目 B", "项目 C", "项目 D", "项目 E", "项目 F", "项目 G"].map((i) =>
          <MItem key={i} label={i} />
          )}
            </div>
            <MLine full />
            <MItem icon={<PlusIcon />} label="新建项目" />
          </StaticMenu> :
      id === "divider" ?
      <StaticMenu>
            <MItem label="编辑" />
            <MItem label="复制" />
            <MLine />
            <MItem label="归档" />
            <MLine />
            <MItem label="删除" danger />
          </StaticMenu> :

      <StaticMenu>
            <MGroup>账户</MGroup>
            <MItem label="个人资料" />
            <MItem label="账单与订阅" />
            <MGroup>偏好</MGroup>
            <MItem label="通知" />
            <MItem label="外观" />
          </StaticMenu>

      }
      importCode={`import {\n  DropdownMenu,\n  DropdownMenuContent,\n  DropdownMenuItem,\n  DropdownMenuLabel,\n  DropdownMenuSeparator,\n  DropdownMenuTrigger,\n} from "@/components/ui/dropdown-menu"`}
      usageCode={`<DropdownMenu>\n  <DropdownMenuTrigger render={<Button variant="ghost" size="icon-md">⋯</Button>} />\n  <DropdownMenuContent>\n    <DropdownMenuItem>编辑</DropdownMenuItem>\n    <DropdownMenuSeparator />\n    <DropdownMenuItem variant="destructive">删除</DropdownMenuItem>\n  </DropdownMenuContent>\n</DropdownMenu>`}
      propRows={propRows}
      semanticDomRows={semanticDomRows}
      doDontRows={doDontRows}
      actions={actions}
      lang={lang}
      autoScenarioSlugs={autoScenarioSlugs} />);


}
