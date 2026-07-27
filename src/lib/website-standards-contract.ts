import { pageLeadSlots } from "@/components/fx/page-lead";
import { sectionLeadSlots } from "@/components/fx/section-lead";
import {
  websiteRulePanelSlots,
  websiteRulePopoverSlots,
  websiteRuleValueListSlots,
} from "@/components/fx/website-rule-panel";
import { websiteSpacingRhythmSlots } from "@/components/fx/website-spacing-rhythm";
import { websiteCardContainerSlots } from "@/components/fx/website-card-container";

export type PageLeadWebsiteSlot = "root" | "crumb" | "title" | "titleMeta" | "lead" | "actions";
export type SectionLeadWebsiteSlot = "root" | "title" | "description";
export type WebsiteRulePopoverSlot =
  | "popoverRoot"
  | "trigger"
  | "content"
  | "defaultWidth"
  | "panelRoot"
  | "panelSources"
  | "valueList";
export type WebsiteSpacingRhythmSlot =
  | "root"
  | "viewport"
  | "page"
  | "pagePaddingMeasure"
  | "titleToSectionMeasure"
  | "sectionGapMeasure"
  | "label";
export type WebsiteCardContainerSlot =
  | "root"
  | "innerPanel"
  | "divider"
  | "controlShell"
  | "elevatedPanel"
  | "label";

export const pageLeadSlotGuideMap = {
  root: "负责把标题区和右侧动作排成同一行，桌面端顶部对齐。",
  crumb: "显示页面层级路径，弱化呈现，最后一段自动作为当前页强调。",
  title: "承载页面唯一主标题，是这一页最强的视觉焦点。",
  titleMeta: "用于标题旁的补充英文或副标题，弱于主标题但保持同一基线。",
  lead: "只放一两句页面说明，解释这一页是做什么的，不重复标题。",
  actions: "放页面级动作，比如复制、更多、上一页、下一页，固定在右侧。",
} satisfies Record<PageLeadWebsiteSlot, string>;

export const sectionLeadSlotGuideMap = {
  root: "负责标题与说明的纵向堆叠，只表达节标题，不承载业务内容。",
  title: "承载内容区小标题，层级低于页面标题但高于正文。",
  description: "承载一句说明文案；没有说明时整个说明行不渲染。",
} satisfies Record<SectionLeadWebsiteSlot, string>;

export const websiteRulePopoverSlotGuideMap = {
  popoverRoot: "承载查看规则的展开状态和定位上下文，本身不写规则内容。",
  trigger: "统一查看规则按钮，使用 secondary / sm，并在展开时旋转右侧箭头。",
  content: "弹窗固定从按钮右下方展开，层级高于内容卡片。",
  defaultWidth: "默认用于视觉取值类规则；宽度上限是 44rem，同时会避开视口左右边距，窄规则可以通过 widthClassName 覆盖。",
  panelRoot: "弹窗里的规则面板外壳，统一边框、底色和内边距。",
  panelSources: "展示源码、规则和映射来源，作为轻量来源标签行。",
  valueList: "展示具体取值逻辑，默认两列排列，移动端自然单列。",
} satisfies Record<WebsiteRulePopoverSlot, string>;

export const websiteSpacingRhythmSlotGuideMap = {
  root: "承载间距节奏示意图，统一卡片边框、底色和外层内边距。",
  viewport: "模拟文档页内容视口，用来表达页面内容与容器边界的距离。",
  page: "把页面截面拆成三段：页面内边距、标题到首节、小标题之间。",
  pagePaddingMeasure: "用短色条标记页面左右内边距的基准值。",
  titleToSectionMeasure: "用虚线块标记页面标题组到第一个内容小标题的距离。",
  sectionGapMeasure: "用弱虚线块标记两个内容小标题模块之间的距离。",
  label: "显示对应数值名称，字重和正文说明保持可读但不抢主标题。",
} satisfies Record<WebsiteSpacingRhythmSlot, string>;

export const websiteCardContainerSlotGuideMap = {
  root: "承载文档站独立信息块、示例预览或说明区域，是网站卡片容器的外层表面。",
  innerPanel: "用于卡片内部的辅助区域或分组区域，边框比外层更弱。",
  divider: "用于卡片内部内容分隔，不另起一套外层卡片边框。",
  controlShell: "用于卡片内部的控件壳、筛选壳或浅辅助区域。",
  elevatedPanel: "只在需要浮层感或强调调试容器时使用阴影层级。",
  label: "用于说明容器内部区域，不抢页面标题层级。",
} satisfies Record<WebsiteCardContainerSlot, string>;

export function describeTailwindTokenValue(classes: string) {
  const parts: string[] = [];
  const sizeMap: Record<string, string> = {
    "text-sm": "14px",
    "text-base": "16px",
    "text-lg": "18px",
    "text-xl": "20px / 28px",
    "text-3xl": "30px / 36px",
  };
  const weightMap: Record<string, string> = {
    "font-normal": "400",
    "font-medium": "500",
    "font-semibold": "600",
    "font-bold": "700",
  };
  const colorMap: Record<string, string> = {
    "text-foreground": "主文字色",
    "text-muted-foreground": "弱文字色",
  };

  Object.entries(sizeMap).find(([token]) => classes.includes(token))?.[1] && parts.push(`字号 ${Object.entries(sizeMap).find(([token]) => classes.includes(token))?.[1]}`);
  Object.entries(weightMap).find(([token]) => classes.includes(token))?.[1] && parts.push(`字重 ${Object.entries(weightMap).find(([token]) => classes.includes(token))?.[1]}`);
  Object.entries(colorMap).find(([token]) => classes.includes(token))?.[1] && parts.push(`颜色 ${Object.entries(colorMap).find(([token]) => classes.includes(token))?.[1]}`);

  if (classes.includes("grid")) parts.push("布局 grid");
  if (classes.includes("flex")) parts.push("布局 flex");
  if (classes.includes("flex-col")) parts.push("纵向排列");
  if (classes.includes("gap-1")) parts.push("间距 4px");
  if (classes.includes("gap-2.5")) parts.push("间距 10px");
  if (classes.includes("gap-3")) parts.push("间距 12px");
  if (classes.includes("right-0")) parts.push("右侧对齐");
  if (classes.includes("top-full")) parts.push("位于触发器下方");
  if (classes.includes("z-20")) parts.push("层级 z-20");
  if (classes.includes("mt-2")) parts.push("顶部偏移 8px");
  if (classes.includes("rounded-2xl")) parts.push("圆角 16px");
  if (classes.includes("border-border-subtle")) parts.push("边框 弱分隔色");
  else if (classes.includes("border-border")) parts.push("边框 标准边框色");
  if (classes.includes("bg-card")) parts.push("底色 卡片色");
  if (classes.includes("bg-background")) parts.push("底色 页面底色");
  if (classes.includes("bg-muted/30")) parts.push("底色 弱辅助填充");
  if (classes.includes("shadow-l1")) parts.push("阴影 L1");
  if (classes.includes("p-4")) parts.push("内边距 16px");
  if (classes.includes("p-5")) parts.push("内边距 20px");
  if (classes.includes("md:p-6")) parts.push("桌面端内边距 24px");
  if (classes.includes("gap-6")) parts.push("间距 24px");
  if (classes.includes("md:grid-cols-[0.95fr_1.05fr_1fr]")) parts.push("桌面端三列页面截面");
  if (classes.includes("h-3")) parts.push("标尺高度 12px");
  if (classes.includes("h-10")) parts.push("标尺高度 40px");
  if (classes.includes("bg-primary/15")) parts.push("标尺色 主题色浅层");
  if (classes.includes("border-primary/55")) parts.push("虚线边框 主题色");
  if (classes.includes("border-dashed")) parts.push("边框 虚线");
  const responsiveWidth = classes.match(/w-\[min\(([^,]+),calc\(100vw-([^)]+)\)\)\]/);
  if (responsiveWidth) parts.push(`宽度 最大 ${responsiveWidth[1]}，且不超过视口宽度减 ${responsiveWidth[2]}`);
  if (classes.includes("md:grid-cols-2")) parts.push("桌面端两列");
  if (classes.includes("md:grid-cols-[minmax(0,1fr)_auto]")) parts.push("桌面端左内容 / 右动作双列");
  if (classes.includes("md:items-start")) parts.push("桌面端顶部对齐");
  if (classes.includes("md:col-span-2")) parts.push("桌面端横跨整行");
  if (classes.includes("shrink-0")) parts.push("在横向布局中保持自身宽度，不被挤窄");
  if (classes.includes("md:justify-self-end")) parts.push("桌面端右对齐");

  return parts.join("；");
}

export function getPageLeadSlotValue(slot: PageLeadWebsiteSlot) {
  return describeTailwindTokenValue(pageLeadSlots[slot]) || "由 PageLead 源码插槽控制。";
}

export function getSectionLeadSlotValue(slot: SectionLeadWebsiteSlot) {
  return describeTailwindTokenValue(sectionLeadSlots[slot]) || "由 SectionLead 源码插槽控制。";
}

export function getWebsiteRulePopoverSlotValue(slot: WebsiteRulePopoverSlot) {
  const classBySlot: Record<WebsiteRulePopoverSlot, string> = {
    popoverRoot: websiteRulePopoverSlots.root,
    trigger: websiteRulePopoverSlots.trigger,
    content: websiteRulePopoverSlots.content,
    defaultWidth: websiteRulePopoverSlots.defaultWidth,
    panelRoot: websiteRulePanelSlots.root,
    panelSources: websiteRulePanelSlots.sources,
    valueList: websiteRuleValueListSlots.root,
  };
  return describeTailwindTokenValue(classBySlot[slot]) || "由 WebsiteRulePopover 源码插槽控制。";
}

export function getWebsiteSpacingRhythmSlotValue(slot: WebsiteSpacingRhythmSlot) {
  return describeTailwindTokenValue(websiteSpacingRhythmSlots[slot]) || "由 WebsiteSpacingRhythm 源码插槽控制。";
}

export function getWebsiteCardContainerSlotValue(slot: WebsiteCardContainerSlot) {
  return describeTailwindTokenValue(websiteCardContainerSlots[slot]) || "由 WebsiteCardContainer 源码插槽控制。";
}
