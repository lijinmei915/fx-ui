import type { ReactNode } from "react";
import { SectionLead } from "@/components/fx/section-lead";
import { DocumentPageLead as PageLead } from "@/lib/document-page-lead";
import { uiText } from "@/lib/theme-runtime";
import { websiteStandardsDoc } from "@/lib/document-sources";
import {
  getPageLeadSlotValue,
  getSectionLeadSlotValue,
  getWebsiteCardContainerSlotValue,
  getWebsiteRulePopoverSlotValue,
  getWebsiteSpacingRhythmSlotValue,
  pageLeadSlotGuideMap,
  sectionLeadSlotGuideMap,
  websiteCardContainerSlotGuideMap,
  websiteRulePopoverSlotGuideMap,
  websiteSpacingRhythmSlotGuideMap,
} from "@/lib/website-standards-contract";
import { GovernanceFreshnessAssets } from "@/pages/docs/governance/governance-freshness-assets";
import { GovernanceLoop } from "@/pages/docs/governance/governance-loop";
import { GovernanceMaintenanceModel } from "@/pages/docs/governance/governance-maintenance-model";
import { GovernanceMapPage } from "@/pages/docs/governance/governance-map-page";
import { GovernanceQuickLinks } from "@/pages/docs/governance/governance-quick-links";
import { GovernanceReferenceTodo } from "@/pages/docs/governance/governance-reference-todo";
import { GovernanceStatusCards } from "@/pages/docs/governance/governance-status-cards";
import { GovernanceSystemMap } from "@/pages/docs/governance/governance-system-map";
import { FxUiSystemDiagram } from "@/pages/docs/governance/governance-system-diagram";
import { GraphCockpit } from "@/pages/docs/governance/graph-cockpit";
import { GettingStartedPage } from "./getting-started-page";
import { governanceQuickLinks, type GettingStartedPage as GettingStartedSlug } from "./getting-started-navigation";
import { installCommandsCode, initShadcnCode, themeDistributionCode, themeImportCode, themeSetupCode } from "./getting-started-content";
import componentsManifestRaw from "../../../../docs/data/components.manifest.json?raw";
import designTokensManifestRaw from "../../../../docs/data/design-tokens.json?raw";
import docSiteManifestRaw from "../../../../docs/data/doc-site.manifest.json?raw";
import governancePagesManifestRaw from "../../../../docs/data/governance-pages.manifest.json?raw";
import governanceStatusRaw from "../../../../docs/data/governance-status.json?raw";
import governanceTodoRaw from "../../../../docs/data/governance-todo.json?raw";
import projectGraphRaw from "../../../../docs/data/project-graph.json?raw";
import systemRelationsRaw from "../../../../docs/data/system-relations.json?raw";
import websiteStandardsManifestRaw from "../../../../docs/data/website-standards.manifest.json?raw";

type Lang = "zh" | "en";

const componentsManifest = JSON.parse(componentsManifestRaw);
const designTokensManifest = JSON.parse(designTokensManifestRaw);
const docSiteManifest = JSON.parse(docSiteManifestRaw);
const governancePagesManifest = JSON.parse(governancePagesManifestRaw);
const governanceStatus = JSON.parse(governanceStatusRaw);
const governanceTodo = JSON.parse(governanceTodoRaw);
const projectGraph = JSON.parse(projectGraphRaw);
const systemRelations = JSON.parse(systemRelationsRaw);
const websiteStandardsManifest = JSON.parse(websiteStandardsManifestRaw);

const allManifestComponents = [...componentsManifest.uiComponents, ...componentsManifest.fxComponents];
const completeManifestComponents = allManifestComponents.filter((component: { docStatus?: string }) => component.docStatus === "complete");
const governanceSnapshot = {
  componentContracts: `${completeManifestComponents.length}/${allManifestComponents.length}`,
  docSiteRegions: `${docSiteManifest.regions.length} 区`,
  tokenFacts: `${designTokensManifest.primitive.length + designTokensManifest.semantic.length + designTokensManifest.componentUsage.length} 条`,
  projectGraph: `${projectGraph.summary.nodeCount} 点 / ${projectGraph.summary.edgeCount} 边`,
  defaultGate: "npm run check",
  staleNodes: `${projectGraph.summary.staleCount}`,
};
const projectGraphCockpit = {
  nodeCount: projectGraph.summary.nodeCount,
  edgeCount: projectGraph.summary.edgeCount,
  staleCount: projectGraph.summary.staleCount,
  relationCount: projectGraph.systemRelations?.summary.relationCount ?? projectGraph.summary.systemRelationCount ?? 0,
  relationGroupCount: projectGraph.systemRelations?.summary.groupCount ?? projectGraph.summary.systemRelationGroupCount ?? 0,
  siteRelationCount: projectGraph.systemRelations?.summary.siteRelationCount ?? 0,
  projectRelationCount: projectGraph.systemRelations?.summary.projectRelationCount ?? 0,
  groups: projectGraph.systemRelations?.groups ?? [],
};
const governanceFreshness = {
  componentsManifest: componentsManifest.updatedAt,
  designTokens: designTokensManifest.updatedAt,
  docSite: docSiteManifest.updatedAt,
  governanceStatus: governanceStatus.updatedAt,
  projectGraph: projectGraph.generatedAt,
  systemRelations: systemRelations.updatedAt,
};

export function GettingStartedPageAdapter({ actions, page, lang }: { actions: ReactNode; page: GettingStartedSlug; lang: Lang }) {
  return <GettingStartedPage
    actions={actions}
    page={page}
    lang={lang}
    install={{ install: governancePagesManifest.install, initShadcnCode, installCommandsCode, themeSetupCode, themeDistributionCode }}
    theme={{ theme: governancePagesManifest.theme, themeImportCode }}
    aiRules={{ aiRules: governancePagesManifest.aiRules }}
    documentation={{ documentation: governancePagesManifest.documentation, quickLinks: governanceQuickLinks }}
    checks={{ checks: governancePagesManifest.checks, quickLinks: governanceQuickLinks }}
    overview={{ overview: governancePagesManifest.overview, themeImportCode, installCommandsCode }}
    websiteStandards={{ websiteStandardsManifest, websiteStandardsDoc, uiText, pageLeadSlotGuideMap, sectionLeadSlotGuideMap, websiteRulePopoverSlotGuideMap, websiteSpacingRhythmSlotGuideMap, websiteCardContainerSlotGuideMap, getPageLeadSlotValue: (slot) => getPageLeadSlotValue(slot as Parameters<typeof getPageLeadSlotValue>[0]), getSectionLeadSlotValue: (slot) => getSectionLeadSlotValue(slot as Parameters<typeof getSectionLeadSlotValue>[0]), getWebsiteRulePopoverSlotValue: (slot) => getWebsiteRulePopoverSlotValue(slot as Parameters<typeof getWebsiteRulePopoverSlotValue>[0]), getWebsiteSpacingRhythmSlotValue: (slot) => getWebsiteSpacingRhythmSlotValue(slot as Parameters<typeof getWebsiteSpacingRhythmSlotValue>[0]), getWebsiteCardContainerSlotValue: (slot) => getWebsiteCardContainerSlotValue(slot as Parameters<typeof getWebsiteCardContainerSlotValue>[0]) }}
    renderGovernanceMap={(mapActions, mapLang, mapPage) => <GovernanceMapPage
      header={<><PageLead crumb={mapLang === "en" ? "Governance / Overview" : "治理中心 / 概览"} title={mapLang === "en" ? "Governance Overview" : "治理概览"} lead={mapLang === "en" ? "A developer-facing snapshot of fx-ui governance: what is already protected, what is still being structured, and which checks are the current gate." : "给维护者看的 fx-ui 状态快照：哪些规则已经被检查保护，哪些还在结构化，当前交付门禁是什么。"} actions={mapActions} /><GovernanceQuickLinks currentPage={mapPage} lang={mapLang} items={governanceQuickLinks} /></>}
      status={<><SectionLead title={mapLang === "en" ? "Current Status" : "当前状态"} description={mapLang === "en" ? "Start here when you only want to know whether the project is protected enough to keep changing." : "如果你只是想知道“现在能不能继续改、风险在哪”，先看这里。"} /><GovernanceStatusCards cards={governanceStatus.statusCards} snapshot={governanceSnapshot} /><GraphCockpit lang={mapLang} actionFlows={governanceStatus.actionFlows} taskRoutes={governanceStatus.taskRoutes} metrics={projectGraphCockpit} /><GovernanceMaintenanceModel lang={mapLang} model={governanceStatus.maintenanceModel} /></>}
      systemMap={<GovernanceSystemMap lang={mapLang} site={<FxUiSystemDiagram scope="site" systemRelations={systemRelations} />} project={<FxUiSystemDiagram scope="project" systemRelations={systemRelations} />} />}
      freshness={<GovernanceFreshnessAssets lang={mapLang} freshness={governanceStatus.freshness} assets={governanceStatus.assets} values={governanceFreshness} />}
      loop={<GovernanceLoop lang={mapLang} items={governanceStatus.loop} />}
      references={<GovernanceReferenceTodo lang={mapLang} references={governanceStatus.references} items={governanceTodo.items} />} />}
  />;
}
