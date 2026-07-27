import type { ReactNode } from "react";
import { useState } from "react";

import { CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DocSurfaceCard,
  DocSurfaceTableCard,
} from "@/components/fx/doc-surface";
import {
  NavMenu,
  NavMenuFooter,
  NavMenuGroupLabel,
  NavMenuHeader,
  NavMenuItem,
  NavMenuList,
  NavMenuSearch,
  NavRail,
  NavRailItem,
} from "@/components/fx/nav-menu";
import { PageLead } from "@/components/fx/page-lead";
import { SectionLead } from "@/components/fx/section-lead";
import { DocDoDont } from "@/components/fx/doc-do-dont";
import { StandardScenarioPlayground } from "@/pages/docs/components/standard-scenario-playground";
import { ScenarioTable, CopyCodeBlock } from "@/pages/docs/components/standard-doc-page";
import { docsSpacing } from "@/lib/docs-spacing";
import componentPlaygroundsManifestRaw from "../../../../docs/data/component-playgrounds.manifest.json?raw";
import {
  standardScenarioExamplesFromManifest,
  type ComponentPlaygroundsManifest,
} from "@/pages/docs/components/component-playground-manifest";
import {
  BellIcon,
  BoxIcon,
  BriefcaseFilledIcon,
  BriefcaseIcon,
  BuildingIcon,
  CalendarFilledIcon,
  CalendarIcon,
  ChartLineIcon,
  ChartPieFilledIcon,
  ChartPieIcon,
  CheckCircleFilledIcon,
  CheckCircleIcon,
  DatabaseIcon,
  HeadsetFilledIcon,
  HeadsetIcon,
  HomeIcon,
  LayoutGridFilledIcon,
  LayoutGridIcon,
  MapPinIcon,
  MessageCircleFilledIcon,
  MessageCircleIcon,
  ReportMoneyIcon,
  SchoolFilledIcon,
  SchoolIcon,
  SettingsIcon,
  SitemapIcon,
  StarIcon,
  TargetIcon,
  UserIcon,
} from "@/lib/icons";

export type NavMenuPageLang = "zh" | "en";

const componentPlaygroundsManifest = JSON.parse(
  componentPlaygroundsManifestRaw,
) as ComponentPlaygroundsManifest;
const navMenuScenarioExamples = standardScenarioExamplesFromManifest(
  componentPlaygroundsManifest,
  "nav-menu",
);

type NavMenuPropRow = {
  prop: string;
  type: string;
  defaultValue: string;
  desc: string;
  descEn: string;
};
type NavMenuSemanticRow = { part: string; desc: string; descEn: string };
type NavMenuDoDontRow = {
  do: string;
  doEn: string;
  dont: string;
  dontEn: string;
};

export const navMenuAnchors = [
  { label: "调试台", labelEn: "Playground", href: "#nav-menu-playground" },
  { label: "API", href: "#nav-menu-props" },
  {
    label: "语义 DOM",
    labelEn: "Semantic DOM",
    href: "#nav-menu-semantic-dom",
  },
  { label: "正误示例", labelEn: "Do / Don’t", href: "#nav-menu-do-dont" },
];
export const navMenuPropRows = [
  {
    prop: "NavRail / NavRailItem",
    type: "icon, activeIcon?, label?, active?, boxed?",
    defaultValue: "—",
    desc: "一级应用栏（64px）与项；boxed=页面入口形态（白底方块、无白底左圆角选中）。",
    descEn: "64px app rail and items; boxed = page-entry style.",
  },
  {
    prop: "NavMenu.collapsed",
    type: "boolean",
    defaultValue: "false",
    desc: "二级面板收起为 48px 图标栏。",
    descEn: "Collapse the panel to a 48px rail.",
  },
  {
    prop: "NavMenuItem",
    type: "icon?, label, active?, indent?, expandable?, expanded?, collapsed?",
    defaultValue: "—",
    desc: "菜单项；active 选中、indent 嵌套缩进、expandable 可折叠分组。",
    descEn: "Menu item; active/indent/expandable group.",
  },
  {
    prop: "NavMenuHeader / NavMenuSearch / NavMenuFooter",
    type: "title, viewName? / placeholder, onAdd? / onToggle?",
    defaultValue: "—",
    desc: "头部、搜索行和底部分区。",
    descEn: "Header, search row, and footer regions.",
  },
];
export const navMenuSemanticDomRows = [
  {
    part: '[data-slot="nav-rail"] / [data-slot="nav-rail-item"][data-active]',
    desc: "一级应用栏与项，data-active 标记选中。",
    descEn: "App rail and items; data-active marks selection.",
  },
  {
    part: '[data-slot="nav-menu"][data-collapsed]',
    desc: "二级面板根，data-collapsed 标记收起态。",
    descEn: "Second-level panel; data-collapsed marks collapsed.",
  },
  {
    part: '[data-slot="nav-menu-item"][data-active]',
    desc: "菜单项，data-active 标记选中。",
    descEn: "Menu item; data-active marks selection.",
  },
  {
    part: '[data-slot="nav-menu-header"] / -search / -list / -footer',
    desc: "头部、搜索、列表和底部分区。",
    descEn: "Header, search, list, and footer regions.",
  },
];
export const navMenuDoDontRows = [
  {
    do: "一级用 NavRail、二级用 NavMenu，可单用也可组合。",
    doEn: "Use NavRail for level-1, NavMenu for level-2; standalone or combined.",
    dont: "把整套导航重写成裸 div + 手写样式。",
    dontEn: "Rewrite the whole nav as raw divs with hand-written styles.",
  },
  {
    do: "选中态用 active。",
    doEn: "Use active for selection.",
    dont: "手写 bg-[#xxx] 表达选中。",
    dontEn: "Hand-code bg-[#xxx] for the selected state.",
  },
  {
    do: "收起用 collapsed；信息不全处靠气泡补全文案。",
    doEn: "Use collapsed; rely on tooltip to complete labels.",
    dont: "收起后直接截断文案不给气泡。",
    dontEn: "Clip labels on collapse without a tooltip.",
  },
  {
    do: "图标走 @/lib/icons；选中用面型 activeIcon。",
    doEn: "Icons from @/lib/icons; use filled activeIcon when selected.",
    dont: "塞裸 <svg> 或写死图标尺寸/颜色。",
    dontEn: "Inline raw <svg> or hard-code icon size/color.",
  },
];

export function NavMenuPage({
  actions,
  lang,
  propRows,
  semanticDomRows,
  doDontRows,
}: {
  actions: ReactNode;
  lang: NavMenuPageLang;
  propRows: NavMenuPropRow[];
  semanticDomRows: NavMenuSemanticRow[];
  doDontRows: NavMenuDoDontRow[];
}) {
  const [selected, setSelected] = useState("home");
  const [open, setOpen] = useState<Record<string, boolean>>({ cust: true });
  const [pinned, setPinned] = useState(true);
  const [hovered, setHovered] = useState(false);
  const toggle = (id: string) => setOpen((o) => ({ ...o, [id]: !o[id] }));
  // 固定导航：pinned 固定展开；未固定时折叠成 48px 图标栏，hover 临时展开（flyout）
  const c = !pinned && !hovered;
  const custChildren = [
    { label: "客户", icon: <BuildingIcon /> },
    { label: "销售记录", icon: <ChartLineIcon /> },
    { label: "客户地址", icon: <MapPinIcon /> },
    { label: "客户财务信息", icon: <ReportMoneyIcon /> },
    { label: "联系人", icon: <UserIcon /> },
    { label: "商机2.0", icon: <TargetIcon /> },
    { label: "商机评审", icon: <SitemapIcon /> },
  ];

  const demo = (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <NavMenu collapsed={c}>
        <NavMenuHeader
          title="CRM"
          viewName={lang === "en" ? "View" : "视图名称"}
          collapsed={c}
        />
        <NavMenuSearch
          placeholder={lang === "en" ? "Search" : "搜索"}
          onAdd={() => {}}
          collapsed={c}
        />
        <NavMenuList>
          <NavMenuItem
            icon={<HomeIcon />}
            label={lang === "en" ? "Home" : "首页"}
            active={selected === "home"}
            collapsed={c}
            onClick={() => setSelected("home")}
          />
          <NavMenuItem
            icon={<StarIcon />}
            label={lang === "en" ? "Recent" : "最近使用"}
            active={selected === "recent"}
            collapsed={c}
            onClick={() => setSelected("recent")}
          />
          <NavMenuItem
            icon={<BellIcon />}
            label="CRM提醒"
            active={selected === "remind"}
            collapsed={c}
            onClick={() => setSelected("remind")}
          />
          <NavMenuItem
            icon={<CheckCircleIcon />}
            label="CRM待办"
            active={selected === "todo"}
            collapsed={c}
            onClick={() => setSelected("todo")}
          />
          {/* 对象分组：展开=折叠分类标题（无图标）；收起=分类退化为短横线 + 对象图标平铺（CRM 厂商式） */}
          {c ? (
            <>
              <NavMenuGroupLabel collapsed>
                {lang === "en" ? "Customers & deals" : "客户及商机管理"}
              </NavMenuGroupLabel>
              {custChildren.map((cc) => (
                <NavMenuItem
                  key={cc.label}
                  icon={cc.icon}
                  label={cc.label}
                  active={selected === cc.label}
                  collapsed
                  onClick={() => setSelected(cc.label)}
                />
              ))}
            </>
          ) : (
            <>
              <NavMenuItem
                expandable
                expanded={open.cust}
                label={lang === "en" ? "Customers & deals" : "客户及商机管理"}
                onClick={() => toggle("cust")}
              />
              {open.cust &&
                custChildren.map((cc) => (
                  <NavMenuItem
                    key={cc.label}
                    indent
                    icon={cc.icon}
                    label={cc.label}
                    active={selected === cc.label}
                    onClick={() => setSelected(cc.label)}
                  />
                ))}
            </>
          )}
          <NavMenuItem
            icon={<ReportMoneyIcon />}
            label={lang === "en" ? "Orders & payments" : "订单及回款管理"}
            active={selected === "order"}
            collapsed={c}
            onClick={() => setSelected("order")}
          />
          <NavMenuItem
            icon={<DatabaseIcon />}
            label={lang === "en" ? "Dashboard" : "数据驾驶舱"}
            active={selected === "dash"}
            collapsed={c}
            onClick={() => setSelected("dash")}
          />
          <NavMenuItem
            icon={<UserIcon />}
            label={lang === "en" ? "People" : "人员"}
            active={selected === "people"}
            collapsed={c}
            onClick={() => setSelected("people")}
          />
        </NavMenuList>
        <NavMenuFooter
          collapsed={c}
          pinned={pinned}
          onToggle={() => setPinned(false)}
          onPin={() => setPinned(true)}
        />
      </NavMenu>
    </div>
  );

  // 无图标版：菜单项不带图标；收起态(48px)显示居中文案而非图标。折叠/固定交互与前台统一。
  const [niSel, setNiSel] = useState("首页");
  const [niPinned, setNiPinned] = useState(true);
  const [niHovered, setNiHovered] = useState(false);
  const nc = !niPinned && !niHovered;
  const niItems = [
    "首页",
    "最近使用",
    "CRM提醒",
    "CRM待办",
    "客户及商机管理",
    "订单及回款管理",
    "售前项目管理",
    "交付实施项目",
    "项目损失管理",
    "数据驾驶舱",
    "人员",
  ];
  const noIconDemo = (
    <div
      onMouseEnter={() => setNiHovered(true)}
      onMouseLeave={() => setNiHovered(false)}
    >
      <NavMenu collapsed={nc}>
        <NavMenuHeader
          title="CRM"
          viewName={lang === "en" ? "View" : "视图名称"}
          collapsed={nc}
        />
        <NavMenuSearch
          placeholder={lang === "en" ? "Search" : "搜索"}
          onAdd={() => {}}
          collapsed={nc}
        />
        <NavMenuList>
          {niItems.map((n) => (
            <NavMenuItem
              key={n}
              label={n}
              active={niSel === n}
              collapsed={nc}
              onClick={() => setNiSel(n)}
            />
          ))}
        </NavMenuList>
        <NavMenuFooter
          collapsed={nc}
          pinned={niPinned}
          onToggle={() => setNiPinned(false)}
          onPin={() => setNiPinned(true)}
        />
      </NavMenu>
    </div>
  );

  // 一级导航 + 二级菜单组合（左 64px 应用栏紧贴右侧菜单面板）。
  const [railApp, setRailApp] = useState("crm");
  const railApps = [
    {
      id: "qx",
      icon: <MessageCircleIcon />,
      activeIcon: <MessageCircleFilledIcon />,
      label: "企信",
    },
    {
      id: "crm",
      icon: <ChartPieIcon />,
      activeIcon: <ChartPieFilledIcon />,
      label: "CRM",
    },
    {
      id: "work",
      icon: <BriefcaseIcon />,
      activeIcon: <BriefcaseFilledIcon />,
      label: "工作",
    },
    {
      id: "todo",
      icon: <CheckCircleIcon />,
      activeIcon: <CheckCircleFilledIcon />,
      label: "待办",
    },
    {
      id: "cal",
      icon: <CalendarIcon />,
      activeIcon: <CalendarFilledIcon />,
      label: "日程",
    },
    {
      id: "train",
      icon: <SchoolIcon />,
      activeIcon: <SchoolFilledIcon />,
      label: "培训助手",
    },
    {
      id: "agent",
      icon: <HeadsetIcon />,
      activeIcon: <HeadsetFilledIcon />,
      label: "代理通",
    },
    {
      id: "more",
      icon: <LayoutGridIcon />,
      activeIcon: <LayoutGridFilledIcon />,
      label: "更多",
    },
  ];

  const comboDemo = (
    <div className="flex h-full">
      <NavRail
        footer={<NavRailItem boxed icon={<SettingsIcon />} aria-label="设置" />}
      >
        {railApps.map((a) => (
          <NavRailItem
            key={a.id}
            icon={a.icon}
            activeIcon={a.activeIcon}
            label={a.label}
            active={railApp === a.id}
            onClick={() => setRailApp(a.id)}
          />
        ))}
      </NavRail>
      {demo}
    </div>
  );

  const railDemo = (
    <NavRail
      footer={<NavRailItem boxed icon={<SettingsIcon />} aria-label="设置" />}
    >
      {railApps.map((a) => (
        <NavRailItem
          key={a.id}
          icon={a.icon}
          activeIcon={a.activeIcon}
          label={a.label}
          active={railApp === a.id}
          onClick={() => setRailApp(a.id)}
        />
      ))}
    </NavRail>
  );

  // 后台菜单：顶部仅搜索；不可选灰色分组标题（折叠成短横线）；可折叠成 48px 图标栏、hover 悬浮展开、底部锁固定。
  // 支持一级展开（分组下的功能项）与二级展开（expandable 项内联展开子项）。
  const [backPinned, setBackPinned] = useState(true);
  const [backHovered, setBackHovered] = useState(false);
  const [backOpen, setBackOpen] = useState<Record<string, boolean>>({
    "b-ent": true,
  });
  const bc = !backPinned && !backHovered;
  const backToggle = (id: string) =>
    setBackOpen((o) => ({ ...o, [id]: !o[id] }));
  const backDemo = (
    <div
      onMouseEnter={() => setBackHovered(true)}
      onMouseLeave={() => setBackHovered(false)}
    >
      <NavMenu collapsed={bc}>
        <NavMenuSearch placeholder="搜索" collapsed={bc} />
        <NavMenuList>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <NavMenuGroupLabel collapsed={bc}>系统管理</NavMenuGroupLabel>
              <div className="flex flex-col gap-2">
                <NavMenuItem
                  icon={<HomeIcon />}
                  label="管理首页"
                  collapsed={bc}
                  active={selected === "b-home"}
                  onClick={() => setSelected("b-home")}
                />
                <NavMenuItem
                  icon={<BuildingIcon />}
                  label="企业设置"
                  expandable
                  expanded={backOpen["b-ent"]}
                  collapsed={bc}
                  onClick={() => backToggle("b-ent")}
                />
                {!bc && backOpen["b-ent"] && (
                  <>
                    {[
                      "许可信息",
                      "企业信息设置",
                      "多组织设置",
                      "员工功能设置",
                      "工作时间",
                      "假期",
                      "手机号隐私设置",
                      "个性化推荐设置",
                      "域名管理",
                      "强制通知设置",
                    ].map((l) => (
                      <NavMenuItem
                        key={l}
                        indent
                        label={l}
                        active={selected === l}
                        onClick={() => setSelected(l)}
                      />
                    ))}
                    {/* 二级展开：企业安全设置 → 子项再缩进一级 */}
                    <NavMenuItem
                      indent
                      label="企业安全设置"
                      expandable
                      expanded={backOpen["b-ent-sec"]}
                      onClick={() => backToggle("b-ent-sec")}
                    />
                    {backOpen["b-ent-sec"] &&
                      [
                        "分管小组",
                        "账号安全设置",
                        "通讯录安全设置",
                        "设备绑定",
                        "单点登录",
                      ].map((l) => (
                        <NavMenuItem
                          key={l}
                          indent={2}
                          label={l}
                          active={selected === l}
                          onClick={() => setSelected(l)}
                        />
                      ))}
                  </>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <NavMenuItem
                icon={<SitemapIcon />}
                label="组织架构管理"
                arrow
                collapsed={bc}
                active={selected === "b-org"}
                onClick={() => setSelected("b-org")}
              />
              <NavMenuItem
                icon={<UserIcon />}
                label="角色权限管理"
                arrow
                collapsed={bc}
                active={selected === "b-role"}
                onClick={() => setSelected("b-role")}
              />
            </div>

            <div className="flex flex-col gap-1">
              <NavMenuGroupLabel collapsed={bc}>CRM平台管理</NavMenuGroupLabel>
              <div className="flex flex-col gap-2">
                <NavMenuItem
                  icon={<BoxIcon />}
                  label="对象管理"
                  expandable
                  expanded={backOpen["b-obj"]}
                  collapsed={bc}
                  onClick={() => backToggle("b-obj")}
                />
                {!bc && backOpen["b-obj"] && (
                  <>
                    <NavMenuItem
                      indent
                      label="预设对象"
                      active={selected === "b-obj-1"}
                      onClick={() => setSelected("b-obj-1")}
                    />
                    <NavMenuItem
                      indent
                      label="自定义对象"
                      active={selected === "b-obj-2"}
                      onClick={() => setSelected("b-obj-2")}
                    />
                  </>
                )}
                <NavMenuItem
                  icon={<SitemapIcon />}
                  label="流程管理"
                  arrow
                  collapsed={bc}
                  active={selected === "b-flow"}
                  onClick={() => setSelected("b-flow")}
                />
                <NavMenuItem
                  icon={<ReportMoneyIcon />}
                  label="数据权限管理"
                  arrow
                  collapsed={bc}
                  active={selected === "b-data"}
                  onClick={() => setSelected("b-data")}
                />
              </div>
            </div>
          </div>
        </NavMenuList>
        <NavMenuFooter
          collapsed={bc}
          pinned={backPinned}
          onToggle={() => setBackPinned(false)}
          onPin={() => setBackPinned(true)}
        />
      </NavMenu>
    </div>
  );

  const box = (node: React.ReactNode) => (
    <div className="flex h-[420px] overflow-auto rounded-lg bg-muted/40 p-3">
      {node}
    </div>
  );
  const navMenuPreviews = {
    rail: box(railDemo),
    second: box(demo),
    "no-icon": box(noIconDemo),
    back: box(backDemo),
  };
  const navMenuScenarioRows = navMenuScenarioExamples.map((example) => ({
    key: example.id,
    title: lang === "en" ? (example.titleEn ?? example.title) : example.title,
    preview:
      navMenuPreviews[example.id as keyof typeof navMenuPreviews] ??
      navMenuPreviews.rail,
    intent:
      lang === "en" ? (example.intentEn ?? example.intent) : example.intent,
    constraint: lang === "en" ? (example.ruleEn ?? example.rule) : example.rule,
    code: example.code,
  }));

  const importCode = `import {\n  NavRail, NavRailItem,\n  NavMenu, NavMenuHeader, NavMenuSearch, NavMenuList, NavMenuItem, NavMenuFooter,\n} from "@/components/fx/nav-menu"`;
  const usageCode = `<NavMenu>\n  <NavMenuHeader title="CRM" viewName="视图名称" />\n  <NavMenuSearch placeholder="搜索" onAdd={() => {}} />\n  <NavMenuList>\n    <NavMenuItem icon={<HomeIcon />} label="首页" active />\n    <NavMenuItem expandable expanded label="客户及商机管理" />\n    <NavMenuItem indent icon={<BuildingIcon />} label="客户" />\n  </NavMenuList>\n  <NavMenuFooter onToggle={...} />\n</NavMenu>`;
  return (
    <div className={docsSpacing.pageStack}>
      <section id="nav-menu" className="flex flex-col gap-2">
        <PageLead
          crumb={lang === "en" ? "Components / Nav Menu" : "组件 / 导航菜单"}
          title={lang === "en" ? "Nav Menu 导航菜单" : "导航菜单"}
          lead={
            lang === "en"
              ? "Company two-tier navigation: 64px app rail + single-panel menu (200/48px). 1:1 with the design spec, fx-ui tokens."
              : "公司双层导航：64px 一级应用栏 + 单面板二级菜单（展开 200 / 收起 48px）。1:1 还原设计稿，token 用 fx-ui。"
          }
          actions={actions}
        />
      </section>

      <section id="nav-menu-playground" className={docsSpacing.sectionStack}>
        <SectionLead
          title={lang === "en" ? "Playground" : "调试台"}
          description={
            lang === "en"
              ? "Switch between the existing Nav Menu scenarios and copy the matching composition."
              : "切换现有导航菜单场景，复制对应真实组合写法。"
          }
        />
        <StandardScenarioPlayground
          slug="nav-menu"
          examples={navMenuScenarioRows.map((row) => ({
            id: row.key,
            title: row.title,
            intent: row.intent,
            rule: row.constraint,
            code: row.code,
          }))}
          renderScenarioPreview={(id) =>
            navMenuScenarioRows.find((row) => row.key === id)?.preview ??
            navMenuScenarioRows[0].preview
          }
          importCode={importCode}
          lang={lang}
        />
      </section>

      <section id="nav-menu-overview" className={docsSpacing.sectionStack}>
        <SectionLead
          title={lang === "en" ? "Overview" : "组件总览"}
          description={
            lang === "en"
              ? "App rail + second-level menu working together; click apps / items to switch, the footer arrow collapses the panel."
              : "一级应用栏 + 二级菜单的组合形态；点应用 / 菜单项切换，底部箭头收起面板。"
          }
        />

        <DocSurfaceCard className="w-fit">
          <CardContent className="flex h-[560px] bg-muted/40 p-5">
            {comboDemo}
          </CardContent>
        </DocSurfaceCard>
      </section>

      <section id="nav-menu-preview" className={docsSpacing.sectionStack}>
        <SectionLead
          title={lang === "en" ? "Scenario examples" : "场景示例"}
          description={
            lang === "en"
              ? "Forms and states; all from the same building blocks."
              : "各形态与状态；均由同一套零件组合。"
          }
        />

        <ScenarioTable lang={lang} rows={navMenuScenarioRows} elevated />
      </section>

      <section id="nav-menu-usage" className={docsSpacing.sectionStack}>
        <SectionLead
          title={lang === "en" ? "Usage" : "使用方式"}
          description={
            lang === "en"
              ? "Import the parts and compose; rail and menu are independent."
              : "按需导入零件组合；一级栏与二级菜单相互独立。"
          }
        />

        <DocSurfaceCard>
          <CardContent className="flex flex-col gap-4 p-5">
            <CopyCodeBlock code={importCode} label="Import" lang={lang} />
            <CopyCodeBlock code={usageCode} label="Usage" lang={lang} />
          </CardContent>
        </DocSurfaceCard>
      </section>

      <section id="nav-menu-props" className={docsSpacing.sectionStack}>
        <h2 className="text-xl font-bold tracking-tight">
          {lang === "en" ? "API Props" : "API 属性"}
        </h2>
        <DocSurfaceTableCard>
          <Table className="min-w-[640px]">
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">
                  {lang === "en" ? "Prop" : "属性"}
                </TableHead>
                <TableHead>{lang === "en" ? "Type" : "类型"}</TableHead>
                <TableHead>{lang === "en" ? "Default" : "默认值"}</TableHead>
                <TableHead className="pr-4">
                  {lang === "en" ? "Description" : "描述"}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {propRows.map((row) => (
                <TableRow key={row.prop}>
                  <TableCell className="pl-4 font-medium">{row.prop}</TableCell>
                  <TableCell>
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
                      {row.type}
                    </code>
                  </TableCell>
                  <TableCell>
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
                      {row.defaultValue}
                    </code>
                  </TableCell>
                  <TableCell className="pr-4 text-muted-foreground">
                    {lang === "en" ? row.descEn : row.desc}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DocSurfaceTableCard>
      </section>

      <section id="nav-menu-semantic-dom" className={docsSpacing.sectionStack}>
        <SectionLead
          title={lang === "en" ? "Semantic DOM" : "语义 DOM"}
          description={
            lang === "en"
              ? "Semantic parts AI and engineers should target."
              : "AI 和工程师应该理解的语义部位。"
          }
        />

        <DocSurfaceTableCard>
          <Table className="min-w-[560px]">
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">
                  {lang === "en" ? "Part" : "部位"}
                </TableHead>
                <TableHead className="pr-4">
                  {lang === "en" ? "Description" : "说明"}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {semanticDomRows.map((row) => (
                <TableRow key={row.part}>
                  <TableCell className="pl-4 font-medium">
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
                      {row.part}
                    </code>
                  </TableCell>
                  <TableCell className="pr-4 text-muted-foreground">
                    {lang === "en" ? row.descEn : row.desc}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DocSurfaceTableCard>
      </section>

      <section id="nav-menu-do-dont" className={docsSpacing.sectionStack}>
        <SectionLead title={lang === "en" ? "Do / Don’t" : "正误示例"} />
        <DocDoDont lang={lang} rows={doDontRows} />
      </section>
    </div>
  );
}
