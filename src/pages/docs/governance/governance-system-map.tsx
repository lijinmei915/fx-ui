import type { ReactNode } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SectionLead } from "@/components/fx/section-lead"
import { docsSpacing } from "@/lib/docs-spacing"

export function GovernanceSystemMap({ lang, site, project }: { lang: "zh" | "en"; site: ReactNode; project: ReactNode }) {
  return <section id="governance-map-system" className={docsSpacing.sectionStack}><SectionLead title={lang === "en" ? "System Map" : "工程运行图"} description={lang === "en" ? "Use the category view to see responsibility layers, and the file relation view to see which files import, read, check, constrain, or produce each other." : "分类视图看模块职责；文件关系看真实文件之间如何 import、读取、检查、约束和产出。这里关注工程文件怎么互相作用，不是时间顺序。"} /><Tabs defaultValue="site" className="flex flex-col gap-4"><TabsList className="w-fit"><TabsTrigger value="site">网站</TabsTrigger><TabsTrigger value="project">项目</TabsTrigger></TabsList><TabsContent value="site" className="mt-0">{site}</TabsContent><TabsContent value="project" className="mt-0">{project}</TabsContent></Tabs></section>
}
