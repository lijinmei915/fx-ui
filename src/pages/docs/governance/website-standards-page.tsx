import type { ReactNode } from "react";
import { PageLead as FxPageLead } from "@/components/fx/page-lead";
import { SectionLead } from "@/components/fx/section-lead";
import { WebsiteStandardsPlayground } from "@/pages/docs/governance/website-standards-playground";
import { docsSpacing } from "@/lib/docs-spacing";
import { PageActions as DocumentPageActions, PageStepActions as DocumentPageStepActions, type DocumentPageActionText } from "@/lib/document-page-actions";
import { FxInternalComponentsBaseline } from "@/pages/docs/governance/fx-internal-components-baseline";
import { WebsiteRulePanel, WebsiteRulePopover, WebsiteRuleValueList } from "@/components/fx/website-rule-panel";
import { WebsiteCardContainer, WebsiteCardContainerPreview } from "@/components/fx/website-card-container";
import { WebsiteSpacingRhythm } from "@/components/fx/website-spacing-rhythm";
import { CardContent } from "@/components/ui/card";

type Lang = "zh" | "en";
type SlotValue = (slot: string) => string;
type WebsiteStandardsManifest = { [key: string]: any };

type Props = {
  actions: ReactNode;
  lang: Lang;
  websiteStandardsManifest: WebsiteStandardsManifest;
  websiteStandardsDoc: { title: string; path: string; markdown: string };
  uiText: Record<Lang, DocumentPageActionText>;
  pageLeadSlotGuideMap: Record<string, string>;
  sectionLeadSlotGuideMap: Record<string, string>;
  websiteRulePopoverSlotGuideMap: Record<string, string>;
  websiteSpacingRhythmSlotGuideMap: Record<string, string>;
  websiteCardContainerSlotGuideMap: Record<string, string>;
  getPageLeadSlotValue: SlotValue;
  getSectionLeadSlotValue: SlotValue;
  getWebsiteRulePopoverSlotValue: SlotValue;
  getWebsiteSpacingRhythmSlotValue: SlotValue;
  getWebsiteCardContainerSlotValue: SlotValue;
};

export function WebsiteStandardsPage({
  actions,
  lang,
  websiteStandardsManifest,
  websiteStandardsDoc,
  uiText,
  pageLeadSlotGuideMap,
  sectionLeadSlotGuideMap,
  websiteRulePopoverSlotGuideMap,
  websiteSpacingRhythmSlotGuideMap,
  websiteCardContainerSlotGuideMap,
  getPageLeadSlotValue,
  getSectionLeadSlotValue,
  getWebsiteRulePopoverSlotValue,
  getWebsiteSpacingRhythmSlotValue,
  getWebsiteCardContainerSlotValue,
}: Props) {
    return (
      <div className={docsSpacing.pageStack}>
        <section id="website-standards" className="flex flex-col gap-3">
          <FxPageLead
            crumb={lang === "en" ? "Governance / Website Standards" : "治理中心 / 网站规范"}
            title={lang === "en" ? "Website Standards" : "网站规范"}
            titleMeta={lang === "en" ? undefined : "Website Standards"}
            lead={lang === "en" ? "Reusable page components for this docs website. Keep page chrome here, and keep business admin patterns in compositions." : "本站文档页的页面组件规范。文档站外壳放这里，业务后台模式仍放业务组合。"}
            actions={actions} />
        </section>

        <section id="website-standards-components" className={docsSpacing.sectionStack}>
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-3">
              <div className="flex items-start justify-between gap-4">
                <SectionLead title="PageLead" description="用于文档页顶部，固定承载面包屑、标题、说明和右侧页面动作。" />
                <WebsiteRulePopover>
                    {websiteStandardsManifest.pageLead.rulePanel.sections.includes("values") ? (
                      <WebsiteRulePanel
                        title="视觉取值"
                        badge="PageLead 插槽"
                        sources={websiteStandardsManifest.pageLead.rulePanel.sections.includes("sources") ? websiteStandardsManifest.pageLead.rulePanel.sources : []}
                      >
                        <WebsiteRuleValueList
                          items={websiteStandardsManifest.pageLead.visualBaseline.map((item: any) => ({
                            title: item.title,
                            meta: item.slot,
                            description: pageLeadSlotGuideMap[item.slot],
                            value: getPageLeadSlotValue(item.slot)
                          }))}
                        />
                      </WebsiteRulePanel>
                    ) : null}
                </WebsiteRulePopover>
              </div>
              <WebsiteCardContainer>
                <CardContent className="flex flex-col gap-5 p-5">
                  <FxPageLead
                  crumb="治理中心 / 网站规范"
                  title="页面标题区"
                  titleMeta="PageLead"
                  lead="这里展示页面标题区的真实组件形态。标题下只保留一句说明，不再额外加线。"
                  actions={
                    <DocumentPageActions
                      doc={websiteStandardsDoc}
                      demo
                      lang={lang}
                      labels={uiText[lang]}
                      navActions={<DocumentPageStepActions demo previous={null} next={null} lang={lang} />}
                      viewMode="page"
                      onViewModeChange={() => {}}
                    />
                  } />
                </CardContent>
              </WebsiteCardContainer>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-start justify-between gap-4">
                <SectionLead
                  title={lang === "en" ? "Component Playground" : "组件调试台"}
                  description={lang === "en" ? "Website standards display the shared playground truth source. Component pages read the same source and render real components." : "网站规范这里只展示统一调试台真相源；组件页读取同一份数据，再渲染对应真实组件。"}
                />
                <WebsiteRulePopover>
                  {websiteStandardsManifest.componentPlayground.rulePanel.sections.includes("values") ? (
                    <WebsiteRulePanel
                      title="视觉取值"
                      badge="ComponentPlayground"
                      sources={websiteStandardsManifest.componentPlayground.rulePanel.sections.includes("sources") ? websiteStandardsManifest.componentPlayground.rulePanel.sources : []}
                    >
                      <WebsiteRuleValueList
                        items={websiteStandardsManifest.componentPlayground.rules.map((item: any) => ({
                          title: item.title,
                          meta: item.value,
                          description: item.logic,
                          value: "从 docs/data/website-standards.manifest.json 读取；真实调试内容从 docs/data/component-playgrounds.manifest.json 渲染。"
                        }))}
                      />
                    </WebsiteRulePanel>
                  ) : null}
                </WebsiteRulePopover>
              </div>
              <WebsiteStandardsPlayground lang={lang} componentKey={websiteStandardsManifest.componentPlayground.componentKey} />
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-start justify-between gap-4">
                <SectionLead title="SectionLead" description="用于内容区小标题；标题和说明固定 4px 间距。" />
                <WebsiteRulePopover>
                    {websiteStandardsManifest.sectionLead.rulePanel.sections.includes("values") ? (
                      <WebsiteRulePanel
                        title="视觉取值"
                        badge="SectionLead 插槽"
                        sources={websiteStandardsManifest.sectionLead.rulePanel.sections.includes("sources") ? websiteStandardsManifest.sectionLead.rulePanel.sources : []}
                      >
                        <WebsiteRuleValueList
                          items={websiteStandardsManifest.sectionLead.visualBaseline.map((item: any) => ({
                            title: item.title,
                            meta: item.slot,
                            description: sectionLeadSlotGuideMap[item.slot],
                            value: getSectionLeadSlotValue(item.slot)
                          }))}
                        />
                        {websiteStandardsManifest.sectionLead.rulePanel.sections.includes("usage") ? (
                          <div className="mt-4 grid gap-2 text-sm text-muted-foreground">
                            {websiteStandardsManifest.sectionLead.usageBullets.map((item: any) => (
                              <p key={item}>{item}</p>
                            ))}
                          </div>
                        ) : null}
                      </WebsiteRulePanel>
                    ) : null}
                </WebsiteRulePopover>
              </div>
              <WebsiteCardContainer>
                <CardContent className="p-5">
                  <SectionLead title="小标题" description="说明固定 14px，内容紧跟说明下方。" />
                </CardContent>
              </WebsiteCardContainer>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-start justify-between gap-4">
                <SectionLead title="WebsiteRulePopover" description="用于网站规范页的查看规则入口；按钮、箭头、弹窗定位和规则面板统一维护。" />
                <WebsiteRulePopover>
                    {websiteStandardsManifest.websiteRulePopover.rulePanel.sections.includes("values") ? (
                      <WebsiteRulePanel
                        title="视觉取值"
                        badge="WebsiteRulePopover 插槽"
                        sources={websiteStandardsManifest.websiteRulePopover.rulePanel.sections.includes("sources") ? websiteStandardsManifest.websiteRulePopover.rulePanel.sources : []}
                      >
                        <WebsiteRuleValueList
                          items={websiteStandardsManifest.websiteRulePopover.visualBaseline.map((item: any) => ({
                            title: item.title,
                            meta: item.slot,
                            description: websiteRulePopoverSlotGuideMap[item.slot],
                            value: getWebsiteRulePopoverSlotValue(item.slot)
                          }))}
                        />
                      </WebsiteRulePanel>
                    ) : null}
                </WebsiteRulePopover>
              </div>
              <WebsiteCardContainer>
                <CardContent className="p-5">
                  <WebsiteRulePopover>
                  <WebsiteRulePanel title="视觉取值" badge="示例">
                    <WebsiteRuleValueList
                      items={[
                        {
                          title: "查看规则",
                          meta: "trigger",
                          description: "点击后展开规则弹窗；再次点击收起。",
                          value: "按钮、箭头和弹窗定位均由 WebsiteRulePopover 统一控制。"
                        }
                      ]}
                    />
                  </WebsiteRulePanel>
                  </WebsiteRulePopover>
                </CardContent>
              </WebsiteCardContainer>
            </div>

            <div className="flex flex-col gap-3">
              <SectionLead title="PageActions" description="页面级动作只放在标题右侧：复制、更多、上一页、下一页。" />
              <WebsiteCardContainer>
                <CardContent className="flex p-5">
                  <DocumentPageActions
                  doc={websiteStandardsDoc}
                  demo
                  lang={lang}
                  labels={uiText[lang]}
                  navActions={<DocumentPageStepActions demo previous={{ label: "文档规范", labelEn: "Documentation", href: "#documentation" }} next={{ label: "检查命令", labelEn: "Checks", href: "#checks" }} lang={lang} />}
                  viewMode="page"
                    onViewModeChange={() => {}}
                  />
                </CardContent>
              </WebsiteCardContainer>
            </div>
            <FxInternalComponentsBaseline lang={lang} />
          </div>
        </section>

        <section id="website-standards-spacing" className={docsSpacing.sectionStack}>
          <div className="flex items-start justify-between gap-4">
            <SectionLead
              title={lang === "en" ? "Spacing Rhythm" : "间距节奏"}
              description={lang === "en" ? "Use a page-section diagram to show page padding, page lead to first section, and section-to-section rhythm." : "用页面截面示意页面边距、标题组到首个小标题、小标题之间的节奏。"} />
            <WebsiteRulePopover>
              {websiteStandardsManifest.spacingRhythm.rulePanel.sections.includes("values") ? (
                <WebsiteRulePanel
                  title="视觉取值"
                  badge="WebsiteSpacingRhythm"
                  sources={websiteStandardsManifest.spacingRhythm.rulePanel.sections.includes("sources") ? websiteStandardsManifest.spacingRhythm.rulePanel.sources : []}
                >
                  <WebsiteRuleValueList
                    items={[
                      ...websiteStandardsManifest.spacingRhythm.items.map((item: any) => ({
                        title: item.label,
                        meta: item.value,
                        description: item.logic,
                        value: "从 docs/data/website-standards.manifest.json 读取；页面示意只渲染组件。"
                      })),
                      ...websiteStandardsManifest.spacingRhythm.visualBaseline.map((item: any) => ({
                        title: item.title,
                        meta: item.slot,
                        description: websiteSpacingRhythmSlotGuideMap[item.slot],
                        value: getWebsiteSpacingRhythmSlotValue(item.slot)
                      }))
                    ]}
                  />
                </WebsiteRulePanel>
              ) : null}
            </WebsiteRulePopover>
          </div>
          <WebsiteSpacingRhythm items={websiteStandardsManifest.spacingRhythm.items} />
        </section>

        <section id="website-standards-boundaries" className={docsSpacing.sectionStack}>
          <div className="flex items-start justify-between gap-4">
            <SectionLead
              title={lang === "en" ? "Website Card Container" : "网站卡片容器"}
              description={lang === "en" ? "The docs site card surface for standalone information blocks, previews, internal areas, and elevated containers." : "文档站承载独立信息块、示例预览、内部区域和浮层容器的卡片表面。"} />
            <WebsiteRulePopover>
              {websiteStandardsManifest.websiteCardContainer.rulePanel.sections.includes("values") ? (
                <WebsiteRulePanel
                  title="视觉取值"
                  badge="WebsiteCardContainer"
                  sources={websiteStandardsManifest.websiteCardContainer.rulePanel.sections.includes("sources") ? websiteStandardsManifest.websiteCardContainer.rulePanel.sources : []}
                >
                  <WebsiteRuleValueList
                    items={[
                      ...websiteStandardsManifest.websiteCardContainer.rules.map((item: any) => ({
                        title: item.title,
                        meta: item.value,
                        description: item.logic,
                        value: "从 docs/data/website-standards.manifest.json 读取；页面预览只渲染组件。"
                      })),
                      ...websiteStandardsManifest.websiteCardContainer.visualBaseline.map((item: any) => ({
                        title: item.title,
                        meta: item.slot,
                        description: websiteCardContainerSlotGuideMap[item.slot],
                        value: getWebsiteCardContainerSlotValue(item.slot)
                      }))
                    ]}
                  />
                </WebsiteRulePanel>
              ) : null}
            </WebsiteRulePopover>
          </div>
          <WebsiteCardContainerPreview label={lang === "en" ? "Internal area" : "内部区域"} />
        </section>
      </div>);


}
