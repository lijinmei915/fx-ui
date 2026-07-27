import type { ReactNode } from "react"

import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DocSurfaceTableCard } from "@/components/fx/doc-surface"
import { PageLead } from "@/components/fx/page-lead"
import { WebsiteCardContainer } from "@/components/fx/website-card-container"
import { docsSpacing } from "@/lib/docs-spacing"
import { AreaChart, Area, BarChart, Bar, CartesianGrid, Cell, ComposedChart, FunnelChart, Funnel, LabelList, LineChart, Line, PieChart, Pie, PolarAngleAxis, PolarGrid, RadarChart, Radar, RadialBarChart, RadialBar, ScatterChart, Scatter, Treemap, XAxis, YAxis, ZAxis } from "recharts"

export type ChartPageLang = "zh" | "en"

const chartLineData = [
{ month: "1月", 成交额: 420, 目标: 500 },
{ month: "2月", 成交额: 380, 目标: 500 },
{ month: "3月", 成交额: 610, 目标: 550 },
{ month: "4月", 成交额: 730, 目标: 600 },
{ month: "5月", 成交额: 690, 目标: 650 },
{ month: "6月", 成交额: 870, 目标: 700 }];


const chartBarData = [
{ stage: "线索", count: 240 },
{ stage: "意向", count: 180 },
{ stage: "报价", count: 120 },
{ stage: "谈判", count: 72 },
{ stage: "成交", count: 38 }];


const chartPieData = [
{ name: "直销", value: 48 },
{ name: "渠道", value: 28 },
{ name: "合作", value: 14 },
{ name: "其他", value: 10 }];


const lineChartConfig: ChartConfig = {
  成交额: { label: "成交额（万）", color: "var(--chart-1)" },
  目标: { label: "目标（万）", color: "var(--chart-2)" }
};

const barChartConfig: ChartConfig = {
  count: { label: "商机数", color: "var(--chart-1)" }
};

const pieColors = [
"var(--chart-1)",
"var(--chart-2)",
"var(--chart-3)",
"var(--chart-4)"];


const pieChartConfig: ChartConfig = {
  直销: { label: "直销", color: "var(--chart-1)" },
  渠道: { label: "渠道", color: "var(--chart-2)" },
  合作: { label: "合作", color: "var(--chart-3)" },
  其他: { label: "其他", color: "var(--chart-4)" }
};

// 面积图
const areaChartConfig: ChartConfig = {
  成交额: { label: "成交额（万）", color: "var(--chart-6)" },
  目标: { label: "目标（万）", color: "var(--chart-8)" }
};

// 组合图（柱+折线）
const chartComposedData = [
{ month: "1月", 成交额: 420, 赢单率: 32 },
{ month: "2月", 成交额: 380, 赢单率: 28 },
{ month: "3月", 成交额: 610, 赢单率: 41 },
{ month: "4月", 成交额: 730, 赢单率: 45 },
{ month: "5月", 成交额: 690, 赢单率: 38 },
{ month: "6月", 成交额: 870, 赢单率: 52 }];

const composedChartConfig: ChartConfig = {
  成交额: { label: "成交额（万）", color: "var(--chart-3)" },
  赢单率: { label: "赢单率（%）", color: "var(--chart-9)" }
};

// 散点图
const chartScatterData = [
{ 金额: 120, 概率: 80 },
{ 金额: 350, 概率: 60 },
{ 金额: 80, 概率: 90 },
{ 金额: 520, 概率: 40 },
{ 金额: 200, 概率: 70 },
{ 金额: 95, 概率: 85 },
{ 金额: 680, 概率: 35 },
{ 金额: 310, 概率: 55 }];

const scatterChartConfig: ChartConfig = {
  商机: { label: "商机", color: "var(--chart-9)" }
};

// 雷达图
const chartRadarData = [
{ dimension: "新客开拓", A: 85, B: 65 },
{ dimension: "客户维系", A: 72, B: 88 },
{ dimension: "成交转化", A: 90, B: 75 },
{ dimension: "客单价", A: 68, B: 82 },
{ dimension: "跟进速度", A: 78, B: 60 },
{ dimension: "赢单率", A: 82, B: 70 }];

const radarChartConfig: ChartConfig = {
  A: { label: "张三", color: "var(--chart-3)" },
  B: { label: "李四", color: "var(--chart-9)" }
};

// 径向柱图
const chartRadialData = [
{ name: "张三", value: 112, fill: "var(--chart-1)" },
{ name: "李四", value: 89, fill: "var(--chart-8)" },
{ name: "王五", value: 134, fill: "var(--chart-3)" },
{ name: "赵六", value: 76, fill: "var(--chart-4)" },
{ name: "陈七", value: 98, fill: "var(--chart-6)" }];

const radialChartConfig: ChartConfig = {
  value: { label: "配额完成率（%）" }
};

const chartStackedBarData = [
{ month: "1月", 新客: 180, 老客: 120, 渠道: 80 },
{ month: "2月", 新客: 160, 老客: 140, 渠道: 72 },
{ month: "3月", 新客: 220, 老客: 180, 渠道: 96 },
{ month: "4月", 新客: 260, 老客: 210, 渠道: 110 },
{ month: "5月", 新客: 240, 老客: 230, 渠道: 128 },
{ month: "6月", 新客: 300, 老客: 260, 渠道: 150 }];

const stackedBarChartConfig: ChartConfig = {
  新客: { label: "新客", color: "var(--chart-8)" },
  老客: { label: "老客", color: "var(--chart-6)" },
  渠道: { label: "渠道", color: "var(--chart-3)" }
};

const chartHorizontalBarData = [
{ product: "CRM", value: 860 },
{ product: "BI", value: 620 },
{ product: "协同", value: 480 },
{ product: "营销", value: 360 },
{ product: "服务", value: 280 }];

const horizontalBarChartConfig: ChartConfig = {
  value: { label: "活跃客户", color: "var(--chart-9)" }
};

const chartFunnelData = [
{ name: "访问", value: 2400, fill: "var(--chart-8)" },
{ name: "注册", value: 1680, fill: "var(--chart-7)" },
{ name: "试用", value: 980, fill: "var(--chart-6)" },
{ name: "报价", value: 420, fill: "var(--chart-3)" },
{ name: "成交", value: 160, fill: "var(--chart-1)" }];

const funnelChartConfig: ChartConfig = {
  value: { label: "数量" }
};

const chartTreemapData = [
{ name: "企业微信", size: 420, fill: "var(--chart-8)" },
{ name: "CRM", size: 360, fill: "var(--chart-9)" },
{ name: "BI", size: 260, fill: "var(--chart-6)" },
{ name: "审批", size: 180, fill: "var(--chart-3)" },
{ name: "营销", size: 150, fill: "var(--chart-1)" },
{ name: "服务", size: 120, fill: "var(--chart-10)" }];

const treemapChartConfig: ChartConfig = {
  size: { label: "使用量" }
};

export function ChartPage({ actions, lang }: { actions: ReactNode; lang: ChartPageLang }) {
  return (
    <div className={docsSpacing.pageStack}>
      <section id="chart" className="flex flex-col gap-2">
        <PageLead
          crumb={lang === "en" ? "Components / Chart" : "组件 / 图表"}
          title="Chart 图表"
          lead={lang === "en" ?
          "Built on Recharts via shadcn chart. Colors inherit from --chart-1~10 tokens." :
          "基于 shadcn chart（Recharts 封装）。颜色继承 --chart-1~10 token，跟随主题自动切换。"}
          actions={actions} />
      </section>

      <Separator className="my-2" />

      {/* 折线图 */}
      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">{lang === "en" ? "Line Chart" : "折线图"}</h2>
          <p className="text-sm text-muted-foreground mt-1">{lang === "en" ? "Trend comparison over time." : "适合趋势对比，时间轴在 X 轴。"}</p>
        </div>
        <WebsiteCardContainer>
          <CardHeader>
            <CardTitle>{lang === "en" ? "Monthly Revenue vs Target" : "月度成交额 vs 目标"}</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={lineChartConfig} className="h-[260px] w-full">
              <LineChart data={chartLineData} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Line type="monotone" dataKey="成交额" stroke="var(--chart-1)" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="目标" stroke="var(--chart-2)" strokeWidth={2} strokeDasharray="4 2" dot={false} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </WebsiteCardContainer>
      </section>

      <Separator className="my-2" />

      {/* 柱状图 */}
      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">{lang === "en" ? "Bar Chart" : "柱状图"}</h2>
          <p className="text-sm text-muted-foreground mt-1">{lang === "en" ? "Category comparison or funnel stages." : "适合分类对比，也常用于漏斗各阶段数量。"}</p>
        </div>
        <WebsiteCardContainer>
          <CardHeader>
            <CardTitle>{lang === "en" ? "Pipeline Funnel" : "商机漏斗各阶段"}</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={barChartConfig} className="h-[260px] w-full">
              <BarChart data={chartBarData} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="stage" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </WebsiteCardContainer>
      </section>

      <Separator className="my-2" />

      {/* 饼图 */}
      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">{lang === "en" ? "Pie Chart" : "饼图"}</h2>
          <p className="text-sm text-muted-foreground mt-1">{lang === "en" ? "Part-to-whole proportion." : "适合展示占比关系，类别不超过 5 个。"}</p>
        </div>
        <WebsiteCardContainer>
          <CardHeader>
            <CardTitle>{lang === "en" ? "Revenue by Channel" : "成交额来源分布"}</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <ChartContainer config={pieChartConfig} className="h-[260px] w-full max-w-sm">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
                <ChartLegend content={<ChartLegendContent nameKey="name" />} />
                <Pie data={chartPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={100}>
                  {chartPieData.map((_, i) =>
                  <Cell key={i} fill={pieColors[i % pieColors.length]} />
                  )}
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
        </WebsiteCardContainer>
      </section>

      <Separator className="my-2" />

      {/* 面积图 */}
      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">{lang === "en" ? "Area Chart" : "面积图"}</h2>
          <p className="text-sm text-muted-foreground mt-1">{lang === "en" ? "Trend with volume emphasis via fill." : "趋势+量感，填充区域强调累积量级。"}</p>
        </div>
        <WebsiteCardContainer>
          <CardHeader>
            <CardTitle>{lang === "en" ? "Monthly Revenue vs Target" : "月度成交额 vs 目标"}</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={areaChartConfig} className="h-[260px] w-full">
              <AreaChart data={chartLineData} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--chart-6)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--chart-6)" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="fillTarget" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--chart-8)" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="var(--chart-8)" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Area type="monotone" dataKey="成交额" stroke="var(--chart-6)" fill="url(#fillRevenue)" strokeWidth={2} dot={{ r: 3 }} />
                <Area type="monotone" dataKey="目标" stroke="var(--chart-8)" fill="url(#fillTarget)" strokeWidth={2} strokeDasharray="4 2" dot={false} />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </WebsiteCardContainer>
      </section>

      <Separator className="my-2" />

      {/* 组合图 */}
      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">{lang === "en" ? "Composed Chart" : "组合图（柱 + 折线）"}</h2>
          <p className="text-sm text-muted-foreground mt-1">{lang === "en" ? "Quantity and rate on the same canvas." : "量和率共屏，双 Y 轴分别承载。"}</p>
        </div>
        <WebsiteCardContainer>
          <CardHeader>
            <CardTitle>{lang === "en" ? "Revenue & Win Rate" : "成交额与赢单率"}</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={composedChartConfig} className="h-[260px] w-full">
              <ComposedChart data={chartComposedData} margin={{ top: 4, right: 24, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis yAxisId="left" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar yAxisId="left" dataKey="成交额" fill="var(--chart-3)" radius={[4, 4, 0, 0]} />
                <Line yAxisId="right" dataKey="赢单率" stroke="var(--chart-9)" strokeWidth={2} dot={{ r: 3 }} />
              </ComposedChart>
            </ChartContainer>
          </CardContent>
        </WebsiteCardContainer>
      </section>

      <Separator className="my-2" />

      {/* 散点图 */}
      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">{lang === "en" ? "Scatter Chart" : "散点图"}</h2>
          <p className="text-sm text-muted-foreground mt-1">{lang === "en" ? "Distribution and correlation between two metrics." : "展示两个指标的分布和相关性。"}</p>
        </div>
        <WebsiteCardContainer>
          <CardHeader>
            <CardTitle>{lang === "en" ? "Deal Size vs Win Probability" : "商机金额 vs 赢单概率"}</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={scatterChartConfig} className="h-[260px] w-full">
              <ScatterChart margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="金额" name="金额（万）" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} label={{ value: "金额（万）", position: "insideBottom", offset: -2, fontSize: 11 }} />
                <YAxis dataKey="概率" name="赢单概率（%）" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                <ZAxis range={[48, 48]} />
                <ChartTooltip cursor={{ strokeDasharray: "3 3" }} content={<ChartTooltipContent nameKey="name" />} />
                <Scatter data={chartScatterData} fill="var(--chart-9)" fillOpacity={0.75} />
              </ScatterChart>
            </ChartContainer>
          </CardContent>
        </WebsiteCardContainer>
      </section>

      <Separator className="my-2" />

      {/* 雷达图 */}
      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">{lang === "en" ? "Radar Chart" : "雷达图"}</h2>
          <p className="text-sm text-muted-foreground mt-1">{lang === "en" ? "Multi-dimensional comparison across categories." : "多维度能力对比，适合人员 / 产品综合评估。"}</p>
        </div>
        <WebsiteCardContainer>
          <CardHeader>
            <CardTitle>{lang === "en" ? "Sales Rep Performance" : "销售能力雷达"}</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <ChartContainer config={radarChartConfig} className="h-[300px] w-full max-w-md">
              <RadarChart data={chartRadarData} cx="50%" cy="50%" outerRadius="75%">
                <PolarGrid stroke="var(--border)" />
                <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 12 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Radar dataKey="A" stroke="var(--chart-3)" fill="var(--chart-3)" fillOpacity={0.25} strokeWidth={2} />
                <Radar dataKey="B" stroke="var(--chart-9)" fill="var(--chart-9)" fillOpacity={0.15} strokeWidth={2} />
              </RadarChart>
            </ChartContainer>
          </CardContent>
        </WebsiteCardContainer>
      </section>

      <Separator className="my-2" />

      {/* 径向柱图 */}
      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">{lang === "en" ? "Radial Bar Chart" : "径向柱图"}</h2>
          <p className="text-sm text-muted-foreground mt-1">{lang === "en" ? "Circular progress bars for ranking or quota attainment." : "环形进度条，适合配额达成率 / 排行榜。"}</p>
        </div>
        <WebsiteCardContainer>
          <CardHeader>
            <CardTitle>{lang === "en" ? "Quota Attainment by Rep" : "各销售配额完成率（%）"}</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <ChartContainer config={radialChartConfig} className="h-[300px] w-full max-w-sm">
              <RadialBarChart
                data={chartRadialData}
                cx="50%" cy="50%"
                innerRadius="20%" outerRadius="90%"
                startAngle={90} endAngle={-270}>
                
                <PolarAngleAxis type="number" domain={[0, 150]} tick={false} />
                <RadialBar dataKey="value" background={{ fill: "var(--muted)" }} cornerRadius={4} label={{ position: "insideStart", fill: "var(--foreground)", fontSize: 11, formatter: (v: unknown) => `${v}%` }} />
                <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
                <ChartLegend
                  iconSize={10}
                  layout="vertical"
                  verticalAlign="middle"
                  align="right"
                  content={({ payload }) =>
                  <div className="flex flex-col gap-1.5 text-xs">
                      {(payload ?? []).map((p, i) =>
                    <div key={i} className="flex items-center gap-1.5">
                          <span className="inline-block size-2 rounded-sm" style={{ backgroundColor: (p.payload as {fill: string;}).fill }} />
                          <span className="text-foreground">{(p.payload as {name: string;}).name}</span>
                          <span className="text-muted-foreground">{(p.payload as {value: number;}).value}%</span>
                        </div>
                    )}
                    </div>
                  } />
                
              </RadialBarChart>
            </ChartContainer>
          </CardContent>
        </WebsiteCardContainer>
      </section>

      <Separator className="my-2" />

      {/* 堆叠柱状图 */}
      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">{lang === "en" ? "Stacked Bar Chart" : "堆叠柱状图"}</h2>
          <p className="text-sm text-muted-foreground mt-1">{lang === "en" ? "Compare total volume while preserving category composition." : "同时看总量和组成，适合渠道 / 客群拆分。"}</p>
        </div>
        <WebsiteCardContainer>
          <CardHeader>
            <CardTitle>{lang === "en" ? "Revenue Mix by Customer Type" : "成交额客群构成"}</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={stackedBarChartConfig} className="h-[280px] w-full">
              <BarChart data={chartStackedBarData} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="新客" stackId="total" fill="var(--chart-8)" radius={[0, 0, 4, 4]} />
                <Bar dataKey="老客" stackId="total" fill="var(--chart-6)" />
                <Bar dataKey="渠道" stackId="total" fill="var(--chart-3)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </WebsiteCardContainer>
      </section>

      <Separator className="my-2" />

      {/* 横向条形图 */}
      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">{lang === "en" ? "Horizontal Bar Chart" : "横向条形图"}</h2>
          <p className="text-sm text-muted-foreground mt-1">{lang === "en" ? "Rank categories with longer labels." : "适合排行和长分类名称，标签更好读。"}</p>
        </div>
        <WebsiteCardContainer>
          <CardHeader>
            <CardTitle>{lang === "en" ? "Active Customers by Product" : "各产品活跃客户排行"}</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={horizontalBarChartConfig} className="h-[280px] w-full">
              <BarChart data={chartHorizontalBarData} layout="vertical" margin={{ top: 4, right: 24, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="product" width={56} tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="value" fill="var(--chart-9)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </WebsiteCardContainer>
      </section>

      <Separator className="my-2" />

      {/* 漏斗图 */}
      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">{lang === "en" ? "Funnel Chart" : "漏斗图"}</h2>
          <p className="text-sm text-muted-foreground mt-1">{lang === "en" ? "Show conversion across ordered stages." : "展示有顺序的转化过程，适合增长 / 销售漏斗。"}</p>
        </div>
        <WebsiteCardContainer>
          <CardHeader>
            <CardTitle>{lang === "en" ? "Acquisition Conversion" : "获客转化漏斗"}</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <ChartContainer config={funnelChartConfig} className="h-[300px] w-full max-w-lg">
              <FunnelChart>
                <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
                <Funnel dataKey="value" nameKey="name" data={chartFunnelData} isAnimationActive>
                  <LabelList dataKey="name" position="right" fill="var(--foreground)" stroke="none" fontSize={12} />
                </Funnel>
              </FunnelChart>
            </ChartContainer>
          </CardContent>
        </WebsiteCardContainer>
      </section>

      <Separator className="my-2" />

      {/* 树图 */}
      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">{lang === "en" ? "Treemap" : "树图"}</h2>
          <p className="text-sm text-muted-foreground mt-1">{lang === "en" ? "Part-to-whole view for many categories." : "多分类占比总览，适合模块使用量 / 成本拆分。"}</p>
        </div>
        <WebsiteCardContainer>
          <CardHeader>
            <CardTitle>{lang === "en" ? "Module Usage Share" : "模块使用量占比"}</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={treemapChartConfig} className="h-[300px] w-full">
              <Treemap
                data={chartTreemapData}
                dataKey="size"
                nameKey="name"
                stroke="var(--background)"
                fill="var(--chart-8)"
                aspectRatio={4 / 3}
              />
            </ChartContainer>
          </CardContent>
        </WebsiteCardContainer>
      </section>

      <Separator className="my-2" />

      {/* 图表色板 */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-bold tracking-tight">{lang === "en" ? "Chart Tokens" : "图表色板"}</h2>
        <DocSurfaceTableCard>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">{lang === "en" ? "Token" : "Token"}</TableHead>
                <TableHead>{lang === "en" ? "Value" : "值"}</TableHead>
                <TableHead className="pr-4">{lang === "en" ? "Usage" : "用途"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
              { token: "--chart-1", value: "#FF7383", usage: "Pink 05" },
              { token: "--chart-2", value: "#FF7752", usage: "Red 05" },
              { token: "--chart-3", value: "#FF9B29", usage: "Orange 05" },
              { token: "--chart-4", value: "#FFDA54", usage: "Yellow 04" },
              { token: "--chart-5", value: "#DDF2BB", usage: "Yellow Green 03" },
              { token: "--chart-6", value: "#55D48C", usage: "Green 05" },
              { token: "--chart-7", value: "#5BCFC1", usage: "Teal 04" },
              { token: "--chart-8", value: "#40B6FF", usage: "Blue 05" },
              { token: "--chart-9", value: "#368DFF", usage: "Blue 05 deep" },
              { token: "--chart-10", value: "#976AEB", usage: "Purple 05" }].
              map((r) =>
              <TableRow key={r.token}>
                  <TableCell className="pl-4 font-medium">
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{r.token}</code>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="inline-block size-4 rounded-full border border-border" style={{ backgroundColor: r.value }} />
                      <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{r.value}</code>
                    </div>
                  </TableCell>
                  <TableCell className="pr-4 text-muted-foreground">{r.usage}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </DocSurfaceTableCard>
      </section>
    </div>);

}

// ============ 页面模板：CRM 列表页（全部用现有组件拼装，1:1 参照公司 Figma 18906-9135） ============

