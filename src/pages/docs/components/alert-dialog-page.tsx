import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import componentPlaygroundsManifestRaw from "../../../../docs/data/component-playgrounds.manifest.json?raw";
import {
  standardScenarioExamplesFromManifest,
  type ComponentPlaygroundsManifest,
} from "@/pages/docs/components/component-playground-manifest";
import { StandardDocPage, type StandardDocLang } from "@/pages/docs/components/standard-doc-page";

export const alertDialogAnchors = [
  { label: "组件总览", href: "#alert-dialog-overview" },
  { label: "场景示例", href: "#alert-dialog-preview" },
  { label: "使用方式", href: "#alert-dialog-usage" },
  { label: "API", href: "#alert-dialog-props" },
  { label: "语义 DOM", href: "#alert-dialog-semantic-dom" },
  { label: "正误示例", href: "#alert-dialog-do-dont" },
];

const alertDialogImportCode = `import {\n  AlertDialog,\n  AlertDialogAction,\n  AlertDialogCancel,\n  AlertDialogContent,\n  AlertDialogDescription,\n  AlertDialogFooter,\n  AlertDialogHeader,\n  AlertDialogTitle,\n  AlertDialogTrigger,\n} from "@/components/ui/alert-dialog"`;

const alertDialogUsageCode = `<AlertDialog>\n  <AlertDialogTrigger render={<Button variant="destructive">删除项目</Button>} />\n  <AlertDialogContent>\n    <AlertDialogHeader>\n      <AlertDialogTitle>确认删除该项目？</AlertDialogTitle>\n      <AlertDialogDescription>删除后数据无法恢复，请谨慎操作。</AlertDialogDescription>\n    </AlertDialogHeader>\n    <AlertDialogFooter>\n      <AlertDialogCancel render={<Button variant="outline">取消</Button>} />\n      <AlertDialogAction render={<Button variant="destructive">确认删除</Button>} />\n    </AlertDialogFooter>\n  </AlertDialogContent>\n</AlertDialog>`;

const componentPlaygroundsManifest = JSON.parse(
  componentPlaygroundsManifestRaw,
) as ComponentPlaygroundsManifest;
const alertDialogScenarioExamples = standardScenarioExamplesFromManifest(
  componentPlaygroundsManifest,
  "alert-dialog",
);

function AlertDialogPreview({ id }: { id: string }) {
  const destructive = id === "destructive";
  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={
          <Button size="sm" variant={destructive ? "destructive" : "outline"}>
            {destructive ? "删除项目" : "关闭编辑窗口"}
          </Button>
        }
      />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {destructive ? "确认删除该项目？" : "放弃当前修改？"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {destructive
              ? "删除后数据无法恢复，请谨慎操作。"
              : "未保存的修改将会丢失。"}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            render={
              <Button variant="outline">
                {destructive ? "取消" : "继续编辑"}
              </Button>
            }
          />
          <AlertDialogAction
            render={
              <Button variant="destructive">
                {destructive ? "确认删除" : "放弃修改"}
              </Button>
            }
          />
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

const alertDialogPropRows = [
  {
    prop: "AlertDialog",
    type: "组件",
    defaultValue: "—",
    desc: "根节点，管理弹窗开关状态；Esc 关闭后焦点自动回到触发器",
  },
  {
    prop: "AlertDialogTrigger",
    type: "组件",
    defaultValue: "—",
    desc: "触发器，常用 render 把 Button 作为触发元素",
  },
  {
    prop: "AlertDialogContent",
    type: "组件",
    defaultValue: "—",
    desc: "弹窗主体容器，自带遮罩与动效，语义上标记为 alertdialog",
  },
  {
    prop: "AlertDialogAction",
    type: "组件",
    defaultValue: "—",
    desc: "确认/继续操作的触发器，通常搭配 destructive 或 default Button",
  },
  {
    prop: "AlertDialogCancel",
    type: "组件",
    defaultValue: "—",
    desc: "取消操作的触发器，点击后关闭弹窗且不执行后续动作",
  },
];

const alertDialogSemanticDomRows = [
  {
    part: 'role="alertdialog"',
    desc: "弹窗主体的无障碍角色，区别于普通 dialog，强调需要立即关注",
  },
  {
    part: 'data-slot="alert-dialog-action"',
    desc: "确认/继续操作触发器，承载主操作语义",
  },
  {
    part: 'data-slot="alert-dialog-cancel"',
    desc: "取消触发器，承载次要操作语义",
  },
  {
    part: 'data-slot="alert-dialog-title" / "...-description"',
    desc: "标题与说明，通过 aria 属性与弹窗根节点关联",
  },
];

const alertDialogDoDontRows = [
  {
    do: "只用于不可逆或有重大影响的操作确认。",
    dont: "把它当成普通信息提示弹窗滥用。",
  },
  {
    do: "标题一句话讲清后果，Description 补充细节。",
    dont: "把警示信息和操作步骤混写在标题里。",
  },
  {
    do: "破坏性主操作用 AlertDialogAction + destructive Button。",
    dont: "把取消和确认按钮做成视觉同等强调，让用户难以分辨主次。",
  },
  {
    do: "把不可逆的后果、取消和确认动作写清楚。",
    dont: "把确认框当作 Toast，或让用户无法理解关闭后是否已执行操作。",
  },
];

export function AlertDialogPage({
  actions,
  lang,
  autoScenarioSlugs,
}: {
  actions: React.ReactNode;
  lang: StandardDocLang;
  autoScenarioSlugs: string[];
}) {
  return (
    <StandardDocPage
      slug="alert-dialog"
      title="Alert Dialog 警告对话框"
      lead="用于不可逆或有重大影响操作的明确确认；关闭后焦点会回到触发器。"
      overview={null}
      scenarioExamples={alertDialogScenarioExamples}
      renderScenarioPreview={(id) => <AlertDialogPreview id={id} />}
      importCode={alertDialogImportCode}
      usageCode={alertDialogUsageCode}
      propRows={alertDialogPropRows}
      semanticDomRows={alertDialogSemanticDomRows}
      doDontRows={alertDialogDoDontRows}
      autoScenarioSlugs={autoScenarioSlugs}
      actions={actions}
      lang={lang}
    />
  );
}
