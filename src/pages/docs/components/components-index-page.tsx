import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import {
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tag } from "@/components/ui/tag";
import { WebsiteCardContainer } from "@/components/fx/website-card-container";
import { PageLead } from "@/components/fx/page-lead";
import { SectionLead } from "@/components/fx/section-lead";
import { docsSpacing } from "@/lib/docs-spacing";

export type ComponentsIndexLang = "zh" | "en";

export type ComponentsIndexSection = {
  title: string;
  titleEn: string;
  items: { label: string; labelEn: string; href: string }[];
};

export const componentsIndexAnchors = [
  { label: "基础组件", labelEn: "UI Components", href: "#components-ui" },
  { label: "业务组合", labelEn: "Compositions", href: "#components-fx" },
  {
    label: "生成式UI组件",
    labelEn: "Generative UI",
    href: "#components-agent-ui",
  },
];

function ComponentIndexGrid({
  sections,
  lang,
}: {
  sections: ComponentsIndexSection[];
  lang: ComponentsIndexLang;
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {sections.map((section) => (
        <WebsiteCardContainer key={section.title} size="sm">
          <CardHeader>
            <div>
              <CardTitle>
                {lang === "en" ? section.titleEn : section.title}
              </CardTitle>
            </div>
            <CardAction>
              <Tag variant="outline">{section.items.length}</Tag>
            </CardAction>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 sm:grid-cols-2">
              {section.items.map((item) => (
                <Button
                  key={item.href}
                  variant="secondary"
                  size="md"
                  nativeButton={false}
                  render={<a href={item.href} />}
                  className="w-full justify-start"
                >
                  <span className="truncate text-sm font-medium">
                    {item.label}
                  </span>
                  <span className="truncate text-xs font-normal text-muted-foreground">
                    {item.labelEn}
                  </span>
                </Button>
              ))}
            </div>
          </CardContent>
        </WebsiteCardContainer>
      ))}
    </div>
  );
}

export function ComponentsIndexPage({
  actions,
  lang,
  sections,
}: {
  actions: ReactNode;
  lang: ComponentsIndexLang;
  sections: ComponentsIndexSection[];
}) {
  const uiSections = sections.filter(
    (section) => !["业务组合组件", "Agent 界面"].includes(section.title),
  );
  const fxSections = sections.filter(
    (section) => section.title === "业务组合组件",
  );
  const agentSections = sections.filter(
    (section) => section.title === "Agent 界面",
  );

  return (
    <div className={docsSpacing.pageStack}>
      <section id="components" className="flex flex-col gap-2">
        <PageLead
          crumb={lang === "en" ? "Components / Index" : "组件 / 概览"}
          title={lang === "en" ? "Components" : "组件"}
          lead={
            lang === "en"
              ? "Find every component currently available in fx-ui. Base controls come from shadcn open-code; company compositions are listed separately."
              : "这里可以找到 fx-ui 当前可用的组件。基础控件来自 shadcn open-code，公司组合组件单独列出。"
          }
          actions={actions}
        />
      </section>

      <section id="components-ui" className={docsSpacing.sectionStack}>
        <SectionLead
          title={lang === "en" ? "UI Components" : "基础组件"}
          description={
            lang === "en"
              ? "Installed shadcn/ui components and local documentation pages."
              : "已安装并在本站沉淀文档的 shadcn/ui 基础组件。"
          }
        />
        <ComponentIndexGrid sections={uiSections} lang={lang} />
      </section>

      <section id="components-fx" className={docsSpacing.sectionStack}>
        <SectionLead
          title={lang === "en" ? "Compositions" : "业务组合"}
          description={
            lang === "en"
              ? "Company-level patterns composed from shadcn primitives."
              : "由 shadcn 基础组件组合出来的公司级模式。"
          }
        />
        <ComponentIndexGrid sections={fxSections} lang={lang} />
      </section>

      <section id="components-agent-ui" className={docsSpacing.sectionStack}>
        <SectionLead
          title="Agent 界面"
          description={
            lang === "en"
              ? "Controlled generative UI surfaces for Agent responses. Agents send JSON intent; fx-ui renders trusted React components."
              : "承载 Agent 回复里的受控生成式 UI。Agent 发 JSON 意图，fx-ui 渲染可信 React 组件。"
          }
        />
        <ComponentIndexGrid sections={agentSections} lang={lang} />
      </section>
    </div>
  );
}
