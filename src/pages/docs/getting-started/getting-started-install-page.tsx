import { CardContent } from "@/components/ui/card"
import { WebsiteCardContainer } from "@/components/fx/website-card-container"
import { PageLead } from "@/components/fx/page-lead"
import { CheckCircleIcon } from "@/lib/icons"
import { CopyCodeBlock } from "@/pages/docs/components/standard-doc-page"
import { docsSpacing } from "@/lib/docs-spacing"

type InstallManifest = {
  prerequisites: string[]
  structure: string[]
  verify: string[]
}

export function GettingStartedInstallPage({
  actions,
  lang,
  install,
  initShadcnCode,
  installCommandsCode,
  themeSetupCode,
  themeDistributionCode,
}: {
  actions: React.ReactNode
  lang: "zh" | "en"
  install: InstallManifest
  initShadcnCode: string
  installCommandsCode: string
  themeSetupCode: string
  themeDistributionCode: string
}) {
  return (
    <div className={docsSpacing.pageStack}>
      <section id="install" className="flex flex-col gap-2">
        <PageLead
          crumb={lang === "en" ? "Getting Started / Installation" : "开始使用 / 安装"}
          title={lang === "en" ? "Installation" : "安装"}
          lead={lang === "en" ? "Start from a shadcn project, add the fx-ui component set, then import the company theme tokens." : "从 shadcn 项目起步，安装 fx-ui 所需基础组件，再接入公司主题 token。"}
          actions={actions}
        />
      </section>

      <section id="install-prerequisites" className={docsSpacing.sectionStack}>
        <h2 className="text-xl font-bold tracking-tight">{lang === "en" ? "Prerequisites" : "接入前提"}</h2>
        <WebsiteCardContainer>
          <CardContent className="flex flex-col gap-3 p-5 text-sm text-muted-foreground">
            {install.prerequisites.map((item) => <div key={item} className="flex gap-2"><CheckCircleIcon className="mt-1 size-4 text-primary" /> <span>{item}</span></div>)}
          </CardContent>
        </WebsiteCardContainer>
        <CopyCodeBlock code={initShadcnCode} label="shadcn" lang={lang} />
      </section>

      <section id="install-components" className={docsSpacing.sectionStack}>
        <h2 className="text-xl font-bold tracking-tight">{lang === "en" ? "Install Components" : "安装组件"}</h2>
        <p className="text-base text-muted-foreground">{lang === "en" ? "fx-ui uses shadcn open-code components. Add components through the CLI instead of hand-writing base controls." : "fx-ui 使用 shadcn open-code 组件。基础控件通过 CLI 拉取，不手写 Button/Input/Dialog 这类组件。"}</p>
        <CopyCodeBlock code={installCommandsCode} label="shadcn" lang={lang} />
      </section>

      <section id="install-theme" className={docsSpacing.sectionStack}>
        <h2 className="text-xl font-bold tracking-tight">{lang === "en" ? "Install Theme" : "接入主题"}</h2>
        <p className="text-base text-muted-foreground">{lang === "en" ? "Use theme/fx-theme.css as the runtime token source. For distribution, publish registry/fx-theme.json as a shadcn registry theme." : "运行时使用 theme/fx-theme.css 作为 token 真相源；对外分发时使用 registry/fx-theme.json 作为 shadcn registry:theme。"}</p>
        <div className="grid gap-4 md:grid-cols-2">
          <CopyCodeBlock code={themeSetupCode} label="runtime theme" lang={lang} />
          <CopyCodeBlock code={themeDistributionCode} label="registry theme" lang={lang} />
        </div>
      </section>

      <section id="install-structure" className={docsSpacing.sectionStack}>
        <h2 className="text-xl font-bold tracking-tight">{lang === "en" ? "Structure" : "目录约定"}</h2>
        <WebsiteCardContainer>
          <CardContent className="flex flex-col gap-3 p-5 text-sm text-muted-foreground">{install.structure.map((item) => <p key={item}>{item}</p>)}</CardContent>
        </WebsiteCardContainer>
      </section>

      <section id="install-verify" className={docsSpacing.sectionStack}>
        <h2 className="text-xl font-bold tracking-tight">{lang === "en" ? "Verify" : "启动检查"}</h2>
        <WebsiteCardContainer>
          <CardContent className="flex flex-col gap-3 p-5 text-sm text-muted-foreground">{install.verify.map((item) => <div key={item} className="flex gap-2"><CheckCircleIcon className="mt-1 size-4 text-primary" /> <span>{item}</span></div>)}</CardContent>
        </WebsiteCardContainer>
      </section>
    </div>
  )
}
