import { CircleIcon, Code2Icon, CopyIcon } from "@/lib/icons"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
} from "@/components/ui/sidebar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const codeSample = `import { Button } from "fx-ui"

export default function Demo() {
  return (
    <Button>Primary Button</Button>
  )
}`

export function SidebarRight({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      side="right"
      collapsible="none"
      className="hidden w-80 border-l bg-background xl:flex"
      style={{ "--sidebar-width": "320px" } as React.CSSProperties}
      {...props}
    >
      <SidebarContent className="gap-4 p-4">
        <SidebarGroup className="p-0">
          <SidebarGroupContent>
            <Card>
              <CardContent className="p-0">
                <Tabs defaultValue="preview">
                  <div className="border-b border-border px-4 pt-3">
                    <TabsList variant="line" className="w-full justify-start">
                      <TabsTrigger value="preview" className="flex-1">
                        预览
                      </TabsTrigger>
                      <TabsTrigger value="code" className="flex-1">
                        代码
                      </TabsTrigger>
                    </TabsList>
                  </div>
                  <div className="flex h-32 items-center justify-center">
                    <Button>Primary Button</Button>
                  </div>
                </Tabs>
              </CardContent>
            </Card>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="p-0">
          <SidebarGroupContent>
            <Card>
              <CardHeader className="flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm text-primary">React</CardTitle>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="text-xs">TSX</span>
                  <CircleIcon className="size-3" />
                  <CopyIcon className="size-3.5" />
                </div>
              </CardHeader>
              <CardContent>
                <pre className="overflow-x-auto rounded-md bg-muted/50 p-3 text-xs leading-6 text-muted-foreground">
                  <code>{codeSample}</code>
                </pre>
              </CardContent>
            </Card>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="p-0">
          <SidebarGroupContent>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">CLI</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-border bg-muted/50 p-3 text-xs leading-6 text-muted-foreground">
                  <div>npm install fx-ui</div>
                  <div>pnpm add fx-ui</div>
                  <Separator className="my-2" />
                  <div className="flex items-center gap-2 text-foreground">
                    <Code2Icon className="size-3.5" />
                    <span>npx shadcn add button</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
