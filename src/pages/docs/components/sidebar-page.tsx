import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { FolderIcon, HomeIcon } from "@/lib/icons";
import { StandardDocPage, type StandardDocLang } from "@/pages/docs/components/standard-doc-page";

type ScenarioExample = {
  id: string;
  title: string;
  intent: string;
  rule: string;
  code: string;
  group?: string;
  spec?: string;
};
type PropRow = {
  prop: string;
  type: string;
  defaultValue: string;
  desc: string;
};
type SemanticDomRow = { part: string; desc: string };
type DoDontRow = { do: string; dont: string };

export const sidebarAnchors = [
  { label: "调试台", labelEn: "Playground", href: "#sidebar-playground" },
  { label: "API", href: "#sidebar-props" },
  { label: "语义 DOM", href: "#sidebar-semantic-dom" },
  { label: "正误示例", href: "#sidebar-do-dont" },
];

export const sidebarPropRows = [
  {
    prop: "SidebarProvider",
    type: "open? / onOpenChange? / defaultOpen?",
    defaultValue: "defaultOpen=true",
    desc: "提供折叠状态上下文，必须包裹在 Sidebar 外层（含移动端逻辑）。",
  },
  {
    prop: "Sidebar",
    type: "side? / variant? / collapsible?",
    defaultValue: 'side="left" variant="sidebar" collapsible="offcanvas"',
    desc: '侧边栏根容器，collapsible="none" 时退化为普通固定面板。',
  },
  {
    prop: "SidebarHeader / SidebarContent / SidebarFooter",
    type: 'React.ComponentProps<"div">',
    defaultValue: "—",
    desc: "侧边栏的头部、主体、底部分区。",
  },
  {
    prop: "SidebarGroup / SidebarGroupLabel / SidebarGroupContent",
    type: "—",
    defaultValue: "—",
    desc: "菜单分组容器、分组标题与分组内容区。",
  },
  {
    prop: "SidebarMenu / SidebarMenuItem / SidebarMenuButton",
    type: "isActive? / size?",
    defaultValue: "—",
    desc: "菜单列表、菜单项与可点击按钮，isActive 标记当前选中项。",
  },
  {
    prop: "SidebarTrigger",
    type: 'React.ComponentProps<"button">',
    defaultValue: "—",
    desc: "折叠/展开侧边栏的触发按钮，通常放在页面头部。",
  },
];

export const sidebarSemanticDomRows = [
  {
    part: '[data-slot="sidebar"][data-state][data-collapsible]',
    desc: "侧边栏根节点，data-state 标记展开/折叠，驱动布局动画。",
  },
  {
    part: '[data-slot="sidebar-menu-button"][data-active]',
    desc: "菜单按钮，data-active 标记当前选中项。",
  },
  {
    part: '[data-slot="sidebar-group-label"] / [data-slot="sidebar-group-content"]',
    desc: "分组标题与分组内容区，组织菜单层级结构。",
  },
  {
    part: '[data-slot="sidebar-trigger"]',
    desc: "折叠触发按钮，绑定快捷键 Cmd/Ctrl+B。",
  },
];

export const sidebarDoDontRows = [
  {
    do: "用 SidebarProvider 统一管理展开/折叠状态，并持久化用户偏好。",
    dont: "在多个地方各自维护一份折叠状态，导致刷新后状态不一致。",
  },
  {
    do: "用 isActive 与当前路由强绑定来高亮菜单项。",
    dont: "高亮状态和实际页面内容对不上，用户会怀疑导航是否生效。",
  },
  {
    do: "分组数量和每组菜单项数量保持克制。",
    dont: "把所有功能塞进一个侧边栏，造成超长滚动列表。",
  },
];

export function SidebarPage({
  actions,
  lang,
  scenarioExamples,
  propRows,
  semanticDomRows,
  doDontRows,
  autoScenarioSlugs,
}: {
  actions: React.ReactNode;
  lang: StandardDocLang;
  scenarioExamples: ScenarioExample[];
  propRows: PropRow[];
  semanticDomRows: SemanticDomRow[];
  doDontRows: DoDontRow[];
  autoScenarioSlugs: string[];
}) {
  const sidebarPreview = (scenario: string) => (
    <div className="relative h-[260px] w-[200px] overflow-hidden rounded-lg border">
      <SidebarProvider
        style={{ "--sidebar-width": "200px" } as React.CSSProperties}
      >
        <Sidebar collapsible="none" className="h-[260px] border-r">
          <SidebarHeader>
            <span className="px-2 text-sm font-semibold">fx-ui</span>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>
                {scenario === "nested-project-navigation"
                  ? "项目管理"
                  : "工作台"}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive>
                      <HomeIcon /> 概览
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={scenario === "nested-project-navigation"}
                    >
                      <FolderIcon /> 项目列表
                    </SidebarMenuButton>
                    {scenario === "nested-project-navigation" && (
                      <SidebarMenuSub>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton isActive>
                            项目概览
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton>成员</SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      </SidebarMenuSub>
                    )}
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>
    </div>
  );

  return (
    <StandardDocPage
      slug="sidebar"
      title="Sidebar 侧边栏"
      lead="后台类产品最常见的主导航容器，提供分组菜单、折叠状态管理与移动端适配，需配合 SidebarProvider 使用。"
      overview={sidebarPreview("nav-groups")}
      scenarioExamples={scenarioExamples}
      renderScenarioPreview={(id) => sidebarPreview(id)}
      importCode={`import {\n  Sidebar,\n  SidebarContent,\n  SidebarGroup,\n  SidebarGroupContent,\n  SidebarGroupLabel,\n  SidebarHeader,\n  SidebarMenu,\n  SidebarMenuButton,\n  SidebarMenuItem,\n  SidebarProvider,\n} from "@/components/ui/sidebar"`}
      usageCode={`<SidebarProvider>\n  <Sidebar>\n    <SidebarHeader>fx-ui</SidebarHeader>\n    <SidebarContent>\n      <SidebarGroup>\n        <SidebarGroupLabel>工作台</SidebarGroupLabel>\n        <SidebarGroupContent>\n          <SidebarMenu>\n            <SidebarMenuItem>\n              <SidebarMenuButton isActive>概览</SidebarMenuButton>\n            </SidebarMenuItem>\n          </SidebarMenu>\n        </SidebarGroupContent>\n      </SidebarGroup>\n    </SidebarContent>\n  </Sidebar>\n  <SidebarInset>{/* 页面主体 */}</SidebarInset>\n</SidebarProvider>`}
      propRows={propRows}
      semanticDomRows={semanticDomRows}
      doDontRows={doDontRows}
      autoScenarioSlugs={autoScenarioSlugs}
      actions={actions}
      lang={lang}
    />
  );
}
