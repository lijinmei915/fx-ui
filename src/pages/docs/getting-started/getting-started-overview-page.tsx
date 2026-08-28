import type { ReactNode } from "react";
import { PageLead } from "@/components/fx/page-lead";
import { SectionLead } from "@/components/fx/section-lead";
import { WebsiteCardContainer } from "@/components/fx/website-card-container";
import { CopyCodeBlock } from "@/pages/docs/components/standard-doc-page";
import { docsSpacing } from "@/lib/docs-spacing";
import { Tag } from "@/components/ui/tag";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BoltIcon, PackageIcon, PaletteIcon } from "@/lib/icons";

type Lang = "zh" | "en";

type OverviewManifest = {
  positioning: { title: string; desc: string }[];
  layers: { layer: string; directory: string; responsibility: string }[];
  audience: string[];
};

type Props = {
  actions: ReactNode;
  lang: Lang;
  overview: OverviewManifest;
  themeImportCode: string;
  installCommandsCode: string;
};

export function GettingStartedOverviewPage({
  actions,
  lang,
  overview,
  themeImportCode,
  installCommandsCode,
}: Props) {
  return (
    <div className={docsSpacing.pageStack}>
      <section id="intro" className="flex flex-col gap-8">
        <PageLead
          crumb={lang === "en" ? "Getting Started / Overview" : "开始使用 / 概览"}
          title={lang === "en" ? "FX.UI Getting Started" : "FX.UI 开始使用"}
          lead={
            lang === "en"
              ? "fx-ui is a shadcn open-code design system powered by company tokens, reusable business compositions, documentation contracts, and AI-readable rules."
              : "欢迎使用 FX.UI。这是一套基于 shadcn open-code、公司 token、业务组合组件、文档契约和 AI 可读规则的前端生产体系。"
          }
          actions={actions}
        />

        <div className="grid gap-4 md:grid-cols-3">
          <WebsiteCardContainer>
            <CardHeader>
              <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary-light text-primary">
                <PackageIcon className="size-5" />
              </div>
              <CardTitle className="text-base">{lang === "en" ? "Open-code components" : "组件开箱可改"}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-6 text-muted-foreground">
              {lang === "en"
                ? "Base controls live in src/components/ui as shadcn source code. We use existing components first, not hand-written lookalikes."
                : "基础组件进入 src/components/ui，源码可见可改。优先使用现成 shadcn 组件，不手写一个“看起来像”的控件。"}
            </CardContent>
          </WebsiteCardContainer>
          <WebsiteCardContainer>
            <CardHeader>
              <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary-light text-primary">
                <PaletteIcon className="size-5" />
              </div>
              <CardTitle className="text-base">{lang === "en" ? "Token-driven theme" : "公司视觉靠 token 注入"}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-6 text-muted-foreground">
              {lang === "en"
                ? "foundation.css owns physical values; fx-theme.css is the single semantic runtime entry. Components consume semantic slots instead of hard-coded values."
                : "foundation.css 管物理值，fx-theme.css 是唯一语义运行时入口。组件只消费语义 token，不在调用处硬编码视觉值。"}
            </CardContent>
          </WebsiteCardContainer>
          <WebsiteCardContainer>
            <CardHeader>
              <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary-light text-primary">
                <BoltIcon className="size-5" />
              </div>
              <CardTitle className="text-base">{lang === "en" ? "Governed delivery" : "规则和检查兜底"}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-6 text-muted-foreground">
              {lang === "en"
                ? "Docs, manifests, and checks move together, so UI changes are reviewable and AI agents have a stable contract."
                : "文档、manifest 和检查联动，保证组件能力、token、页面路由和 AI 规则不会各自漂移。"}
            </CardContent>
          </WebsiteCardContainer>
        </div>
      </section>

      <section id="intro-positioning" className={docsSpacing.sectionStack}>
        <SectionLead
          title={lang === "en" ? "Positioning" : "定位"}
          description={lang === "en" ? "fx-ui is not a theme skin or a black-box ProTable. It is a governed open-code system for real product pages." : "fx-ui 不是一套皮肤，也不是黑盒 ProTable，而是服务真实业务页面的 open-code 生产体系。"}
        />
        <div className="grid gap-4 md:grid-cols-3">
          {overview.positioning.map((item) => (
            <WebsiteCardContainer key={item.title}>
              <CardHeader><CardTitle className="text-base">{item.title}</CardTitle></CardHeader>
              <CardContent className="text-sm leading-6 text-muted-foreground">{item.desc}</CardContent>
            </WebsiteCardContainer>
          ))}
        </div>
      </section>

      <section id="intro-install" className={docsSpacing.sectionStack}>
        <SectionLead
          title={lang === "en" ? "How to Install and Use" : "如何安装和引入"}
          description={lang === "en" ? "Start from shadcn, add only the components you need, then import the fx-ui theme tokens." : "从 shadcn 项目起步，按需拉取组件，再引入 fx-ui 公司主题 token。"}
        />
        <WebsiteCardContainer>
          <CardHeader>
            <div className="flex items-start justify-between gap-3">
              <div>
                <CardTitle className="text-base">{lang === "en" ? "Method 1: shadcn CLI" : "方法一：使用 shadcn CLI（推荐）"}</CardTitle>
                <CardDescription>{lang === "en" ? "Initialize shadcn, add components, and keep components open-code in your repository." : "初始化 shadcn，按需添加组件，并保持组件源码进入项目。"}</CardDescription>
              </div>
              <Tag color="amber">Recommended</Tag>
            </div>
          </CardHeader>
          <CardContent>
            <CopyCodeBlock code={`# 1. 初始化 shadcn 配置\nnpx shadcn@latest init\n\n# 2. 按需添加 fx-ui 当前使用的基础组件\n${installCommandsCode}`} label="install commands" lang={lang} />
          </CardContent>
        </WebsiteCardContainer>
        <WebsiteCardContainer>
          <CardHeader>
            <CardTitle className="text-base">{lang === "en" ? "Method 2: Copy & Paste" : "方法二：手动 Copy & Paste"}</CardTitle>
            <CardDescription>{lang === "en" ? "Use this when you are moving selected pieces into an existing project." : "如果不想走 CLI，也可以把所需源码和 token 手动搬进现有项目。"}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
            <p><span className="font-medium text-foreground">1. 依赖安装：</span><code className="rounded bg-muted px-1.5 py-0.5 text-xs">npm install @base-ui/react class-variance-authority clsx tailwind-merge</code></p>
            <p><span className="font-medium text-foreground">2. 复制组件：</span>从 <code className="rounded bg-muted px-1.5 py-0.5 text-xs">src/components/ui</code> 和 <code className="rounded bg-muted px-1.5 py-0.5 text-xs">src/components/fx</code> 复制需要的组件源码。</p>
            <p><span className="font-medium text-foreground">3. 接入主题：</span>复制 <code className="rounded bg-muted px-1.5 py-0.5 text-xs">theme/fx-theme.css</code>，并在入口文件引入。</p>
            <p><span className="font-medium text-foreground">4. 保留契约：</span>不要在业务调用处覆盖组件视觉；需要新外观时在组件层沉淀 variant。</p>
          </CardContent>
        </WebsiteCardContainer>
      </section>

      <section id="theme-source" className={docsSpacing.sectionStack}>
        <SectionLead title={lang === "en" ? "Theme Setup" : "主题接入"} description={lang === "en" ? "fx-ui does not restyle every component by hand. Company visuals are injected through shadcn semantic tokens." : "fx-ui 不逐个重写组件样式。公司视觉通过 shadcn 语义 token 注入。"} />
        <WebsiteCardContainer>
          <CardContent className="grid gap-4 p-5 md:grid-cols-2">
            <div><Tag variant="secondary">ENTRY</Tag><h3 className="mt-3 font-medium">theme/fx-theme.css</h3><p className="mt-2 text-sm text-muted-foreground">{lang === "en" ? "Single runtime entry for protected Foundation values and semantic mappings." : "统一装配受保护的 Foundation 物理值与语义映射。"}</p></div>
            <CopyCodeBlock code={themeImportCode} label="src/main.tsx" lang={lang} />
          </CardContent>
        </WebsiteCardContainer>
      </section>

      <section id="theme-slots" className={docsSpacing.sectionStack}>
        <SectionLead title={lang === "en" ? "Semantic Slots" : "shadcn 语义槽"} description={lang === "en" ? "Components consume semantic token names, so product code does not need page-level visual overrides." : "组件消费语义 token，业务调用处不需要再覆盖颜色、边框、圆角和阴影。"} />
        <WebsiteCardContainer>
          <CardContent className="p-0">
            <Table className="min-w-[760px]">
              <TableHeader><TableRow><TableHead className="pl-4">Layer</TableHead><TableHead>{lang === "en" ? "Directory" : "目录"}</TableHead><TableHead className="pr-4">{lang === "en" ? "Responsibility" : "职责"}</TableHead></TableRow></TableHeader>
              <TableBody>{overview.layers.map((item) => <TableRow key={item.layer}><TableCell className="pl-4 font-medium">{item.layer}</TableCell><TableCell><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{item.directory}</code></TableCell><TableCell className="pr-4 text-muted-foreground">{item.responsibility}</TableCell></TableRow>)}</TableBody>
            </Table>
          </CardContent>
        </WebsiteCardContainer>
      </section>

      <section id="intro-audience" className={docsSpacing.sectionStack}>
        <SectionLead title={lang === "en" ? "Team Workflow and Deployment" : "团队协同和项目部署"} description={lang === "en" ? "A small checklist for keeping the project reviewable and deployable." : "维护时保持可审查、可回滚、可部署的一组最小规则。"} />
        <WebsiteCardContainer>
          <CardContent className="flex flex-col gap-5 p-5 text-sm leading-6 text-muted-foreground">
            <div><h3 className="font-semibold text-foreground">1. 分支与代码审查</h3><p className="mt-2">功能变更走独立分支；涉及组件 API、token、页面结构的改动，需要说明影响范围和验证结果。</p></div>
            <div><h3 className="font-semibold text-foreground">2. 代码风格与契约</h3><p className="mt-2">使用 TypeScript、Tailwind token 和现有组件 API；不要绕开组件在页面里临时覆盖视觉。</p></div>
            <div><h3 className="font-semibold text-foreground">3. 变更记录</h3><p className="mt-2">结构性变化记录到 <code className="rounded bg-muted px-1.5 py-0.5 text-xs">docs/CHANGELOG.md</code>；长期决策记录到 <code className="rounded bg-muted px-1.5 py-0.5 text-xs">docs/DECISIONS.md</code>。</p></div>
            <div><h3 className="font-semibold text-foreground">4. 项目部署</h3><p className="mt-2">在项目根目录运行构建命令，生成的 <code className="rounded bg-muted px-1.5 py-0.5 text-xs">dist</code> 可托管到 Vercel、Netlify 或内部 Nginx。</p><div className="mt-3"><CopyCodeBlock code="npm run build" label="build" lang={lang} /></div></div>
            <div className="grid gap-3 border-t border-border-subtle pt-5 md:grid-cols-3">{overview.audience.map((item) => <p key={item} className="rounded-lg bg-muted p-3">{item}</p>)}</div>
          </CardContent>
        </WebsiteCardContainer>
      </section>
    </div>
  );
}
