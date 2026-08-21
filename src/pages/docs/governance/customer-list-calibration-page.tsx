import { ComponentPlayground, type ComponentPlaygroundConfig } from "@/components/fx/component-playground"
import { PageLead } from "@/components/fx/page-lead"
import { SectionLead } from "@/components/fx/section-lead"
import { CustomerListFrame } from "@/pages/templates/customer-list-template"
import { docsSpacing } from "@/lib/docs-spacing"

type CustomerListCalibrationLang = "zh" | "en"

export const customerListCalibrationConfig: ComponentPlaygroundConfig = {
  initial: { frame: "inset", density: "default" },
  guidanceKey: "frame",
  storyPresentation: "presets",
  previewClassName: "min-h-[200px] overflow-x-auto bg-card p-[calc(var(--card-spacing)*2)]",
  previewItemsClassName: "min-w-max",
  stories: [
    {
      id: "reference",
      values: { frame: "inset", density: "default" },
      matchKeys: ["frame", "density"],
      title: "参考基线",
      titleEn: "Reference baseline",
      intent: "保留导航与内容工作区的明确分层，作为与 Figma 对照的起点。",
      intentEn: "Keep a distinct navigation and content work surface as the Figma comparison baseline.",
      constraint: "这是当前正式列表页的默认组合；确认前不改 token。",
      constraintEn: "This is the current production-list combination. Do not change tokens before review.",
    },
    {
      id: "continuous-compact",
      values: { frame: "continuous", density: "compact" },
      matchKeys: ["frame", "density"],
      title: "连续高密度",
      titleEn: "Continuous and compact",
      intent: "弱化内层卡片边界并压缩表格行高，用于高频扫描任务的对照。",
      intentEn: "Reduce the inner card boundary and tighten table rows for high-frequency scanning.",
      constraint: "仅用于视觉评审；若采用，必须提升为 Block 变体并更新基线。",
      constraintEn: "For visual review only. Promotion requires a Block variant and a new baseline.",
    },
  ],
  props: [
    {
      key: "frame",
      zh: "页面框架",
      en: "Work surface",
      propName: "CrmAppShell.frame",
      type: "segment",
      controlGroup: "structure",
      options: [
        {
          value: "inset",
          label: "嵌入卡片",
          labelEn: "Inset",
          intent: "让内容工作区与导航以留白和圆角形成明确层次。",
          intentEn: "Separate the content work surface from navigation with space and corners.",
          constraint: "复用 CrmAppShell 的 frame=\"inset\"，不在页面覆盖背景或圆角。",
          constraintEn: "Use CrmAppShell frame=\"inset\"; do not override page background or radius.",
        },
        {
          value: "continuous",
          label: "连续工作区",
          labelEn: "Continuous",
          intent: "移除内容区的内层卡片轮廓，让 CRM 工作区更连续。",
          intentEn: "Remove the inner content-card outline for a more continuous CRM workspace.",
          constraint: "复用 CrmAppShell 的 frame=\"continuous\"；外层网站卡片不变。",
          constraintEn: "Use CrmAppShell frame=\"continuous\"; the outer website card remains unchanged.",
        },
      ],
    },
    {
      key: "density",
      zh: "表格密度",
      en: "Table density",
      propName: "DataTable.density",
      type: "segment",
      controlGroup: "appearance",
      options: [
        {
          value: "default",
          label: "标准",
          labelEn: "Default",
          intent: "使用 36px 默认行高，兼顾信息密度与可读性。",
          intentEn: "Use 36px default rows for a balanced information density.",
          constraint: "透传现有 shadcn Table density=\"default\"。",
          constraintEn: "Delegate to the existing shadcn Table density=\"default\".",
        },
        {
          value: "compact",
          label: "紧凑",
          labelEn: "Compact",
          intent: "使用 28px 行高，在客户高频扫描时提高同屏信息量。",
          intentEn: "Use 28px rows to increase the amount of data visible during frequent scans.",
          constraint: "透传现有 shadcn Table density=\"compact\"；不改单元格字体或 token。",
          constraintEn: "Delegate to the existing shadcn Table density=\"compact\"; do not change cell typography or tokens.",
        },
      ],
    },
  ],
  renderOne: (values) => (
    <div data-slot="customer-list-calibration-preview" className="min-w-[960px]">
      <CustomerListFrame frame={values.frame as "inset" | "continuous"} density={values.density as "default" | "compact"} height={520} />
    </div>
  ),
  genCode: (values) => `<CustomerListFrame\n  frame="${values.frame}"\n  density="${values.density}"\n/>`,
}

export function CustomerListCalibrationPage({ actions, lang }: { actions: React.ReactNode; lang: CustomerListCalibrationLang }) {
  return (
    <div className={docsSpacing.pageStack}>
      <section id="customer-list-calibration" className="flex flex-col gap-2">
        <PageLead
          crumb={lang === "en" ? "Maintain / Page calibration" : "维护 / 页面校准"}
          title={lang === "en" ? "List Page Calibration" : "列表页视觉校准"}
          lead={lang === "en" ? "Compare only declared work-surface and density variants on the real customer list. Pick a direction here, then promote it to the owning Block or token before shipping." : "在真实客户列表上比较已声明的工作区与密度变体。先在此选定方向，再回写到对应 Block 或 token 后发布。"}
          actions={actions}
        />
      </section>

      <section id="customer-list-calibration-playground" className={docsSpacing.sectionStack}>
        <SectionLead title={lang === "en" ? "Calibration workspace" : "校准工作区"} description={lang === "en" ? "This is not a free-form style editor. Every control maps to a real Block API and the selected combination is covered by visual regression." : "这不是自由样式编辑器。每个控制项都映射到真实 Block API，选定组合受视觉回归覆盖。"} />
        <ComponentPlayground config={customerListCalibrationConfig} lang={lang} />
      </section>
    </div>
  )
}
