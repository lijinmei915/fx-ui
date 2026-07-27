import type { ReactNode } from "react";
import type { ComponentProps } from "react";
import { GettingStartedInstallPage } from "./getting-started-install-page";
import { GettingStartedThemePage } from "./getting-started-theme-page";
import { GettingStartedAiRulesPage } from "./getting-started-ai-rules-page";
import { GettingStartedDocumentationPage } from "./getting-started-documentation-page";
import { GettingStartedChecksPage } from "./getting-started-checks-page";
import { GettingStartedOverviewPage } from "./getting-started-overview-page";
import { WebsiteStandardsPage } from "@/pages/docs/governance/website-standards-page";
import type { GettingStartedPage as GettingStartedSlug } from "./getting-started-navigation";

type Lang = "zh" | "en";

type PageProps<T extends (props: any) => ReactNode> = ComponentProps<T>;

export type GettingStartedPageProps = {
  actions: ReactNode;
  page: GettingStartedSlug;
  lang: Lang;
  install: Omit<PageProps<typeof GettingStartedInstallPage>, "actions" | "lang">;
  theme: Omit<PageProps<typeof GettingStartedThemePage>, "actions" | "lang">;
  aiRules: Omit<PageProps<typeof GettingStartedAiRulesPage>, "actions" | "lang">;
  documentation: Omit<PageProps<typeof GettingStartedDocumentationPage>, "actions" | "lang">;
  checks: Omit<PageProps<typeof GettingStartedChecksPage>, "actions" | "lang">;
  overview: Omit<PageProps<typeof GettingStartedOverviewPage>, "actions" | "lang">;
  websiteStandards: Omit<PageProps<typeof WebsiteStandardsPage>, "actions" | "lang">;
  renderGovernanceMap: (actions: ReactNode, lang: Lang, page: GettingStartedSlug) => ReactNode;
};

export function GettingStartedPage({
  actions,
  page,
  lang,
  install,
  theme,
  aiRules,
  documentation,
  checks,
  overview,
  websiteStandards,
  renderGovernanceMap,
}: GettingStartedPageProps) {
  if (page === "website-standards") {
    return <WebsiteStandardsPage actions={actions} lang={lang} {...websiteStandards} />;
  }
  if (page === "governance-map") {
    return renderGovernanceMap(actions, lang, page);
  }
  if (page === "install") {
    return <GettingStartedInstallPage actions={actions} lang={lang} {...install} />;
  }
  if (page === "theme") {
    return <GettingStartedThemePage actions={actions} lang={lang} {...theme} />;
  }
  if (page === "ai-rules") {
    return <GettingStartedAiRulesPage actions={actions} lang={lang} {...aiRules} />;
  }
  if (page === "documentation") {
    return <GettingStartedDocumentationPage actions={actions} lang={lang} {...documentation} />;
  }
  if (page === "checks") {
    return <GettingStartedChecksPage actions={actions} lang={lang} {...checks} />;
  }
  return <GettingStartedOverviewPage actions={actions} lang={lang} {...overview} />;
}
