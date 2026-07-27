import * as React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Link } from "@/components/ui/link"
import { Pagination } from "@/components/ui/pagination"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tag } from "@/components/ui/tag"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage, avatarInitials } from "@/components/ui/avatar"
import { ChevronDownIcon, DatabaseIcon, EyeIcon, LockIcon, PencilIcon, SearchIcon, Trash2Icon } from "@/lib/icons"
import componentPlaygroundsManifestRaw from "../../../../docs/data/component-playgrounds.manifest.json?raw"
import {
  componentPlaygroundStoriesFromManifest,
  type ComponentPlaygroundsManifest,
} from "@/pages/docs/components/component-playground-manifest"

// 表格操作列纯图标按钮：无底色（variant=plain）、按语义分色（tone）、hover 只变色 + Tooltip + aria-label
function IconAction({ icon, label, tone = "default" }: {icon: React.ReactNode;label: string;tone?: "default" | "primary" | "danger";}) {
  return (
    <Tooltip>
      <TooltipTrigger render={<Button variant="plain" tone={tone} size="icon-sm" aria-label={label}>{icon}</Button>} />
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>);

}

function TablePreviewWithPagination({
  children,
  page = 1,
  total = tableBizRows.length,
  pageSize = TABLE_PAGE_SIZE,
  status = "default",
  onPageChange
}: {
  children: React.ReactNode
  page?: number
  total?: number
  pageSize?: number
  status?: "default" | "loading" | "empty"
  onPageChange?: (page: number) => void
}) {
  const showPagination = status === "loading" || total > 0;

  return (
    <div className="overflow-hidden">
      <div className="overflow-x-auto">
        {children}
      </div>
      {showPagination ? (
        <div className="border-t border-border-subtle">
          <Pagination page={page} total={total} pageSize={pageSize} showTotal={false} onPageChange={onPageChange} className="px-2 py-3" />
        </div>
      ) : null}
    </div>);
}

// 客户级别 Tag：统一走 color 这条分类标签轴，中性客户也用灰色软标签，避免和 secondary 状态标签混用。
function LevelTag({ level, color }: {level: string;color: "amber" | "green" | "gray";}) {
  return <Tag color={color}>{level}</Tag>;
}

// 业务表演示数据（对齐公司 Figma：链接首列 / 头像 / 级别 Tag / 金额右对齐 / 操作）
const tableBizRows = [
{ id: 1, name: "三川德众血浆采集有限公司", owner: "陈昊", avatar: "/avatars/01.jpg", level: "VIP客户", levelColor: "amber" as const, tags: [{ label: "高意向", color: "purple" as const }, { label: "华东区", color: "blue" as const }], dept: "销售部", product: "罗技 G604 LIGHTSPEED 无线游戏鼠…", amount: 1530.17, date: "2023-12-17" },
{ id: 2, name: "邱特云顶生态环境技术有限公司", owner: "林夕", avatar: "/avatars/02.jpg", level: "重要客户", levelColor: "green" as const, tags: [{ label: "待续约", color: "green" as const }], dept: "市场部", product: "Razer DeathAdder V2 无线游戏鼠标…", amount: 1634.25, date: "2023-12-18" },
{ id: 3, name: "洛阳金升玄经贸有限公司", owner: "周婷", avatar: "/avatars/03.jpg", level: "一般客户", levelColor: "gray" as const, tags: [{ label: "待跟进", color: "amber" as const }], dept: "研发部", product: "Corsair Dark Core RGB SE 无线游戏…", amount: 1745.09, date: "2023-12-19" },
{ id: 4, name: "绵阳中诚祥财鑫管理有限公司", owner: "吴桐", avatar: "/avatars/04.jpg", level: "一般客户", levelColor: "gray" as const, tags: [{ label: "新客", color: "cyan" as const }], dept: "人事部", product: "华硕 ROG Gladius II 烈焰战刃竞技版…", amount: 1862.47, date: "2023-12-20" },
{ id: 5, name: "鹤庆华聚顺科技有限公司", owner: "陈昊", avatar: "/avatars/01.jpg", level: "VIP客户", levelColor: "amber" as const, tags: [{ label: "高意向", color: "purple" as const }, { label: "大客户", color: "red" as const }], dept: "财务部", product: "HyperX Pulsefire Haste 无线轻量竞技…", amount: 1960.68, date: "2023-12-21" },
{ id: 6, name: "平顶山泽大壵贸科技公司", owner: "林夕", avatar: "/avatars/02.jpg", level: "重要客户", levelColor: "green" as const, tags: [{ label: "待续约", color: "green" as const }], dept: "客服部", product: "SteelSeries Rival 3 无线雷神游戏…", amount: 2101.58, date: "2023-12-22" },
{ id: 7, name: "新乡市佳谷投资有限公司", owner: "周婷", avatar: "/avatars/03.jpg", level: "VIP客户", levelColor: "amber" as const, tags: [{ label: "高意向", color: "purple" as const }], dept: "IT部", product: "Cooler Master MM821 无线竞技游戏…", amount: 2224.13, date: "2023-12-23" },
{ id: 8, name: "信阳瑞丰文化传播有限公司", owner: "吴桐", avatar: "/avatars/04.jpg", level: "一般客户", levelColor: "gray" as const, tags: [{ label: "待跟进", color: "amber" as const }], dept: "法务部", product: "Logitech G Pro X Superlight 无线游…", amount: 2345.99, date: "2023-12-24" }];

const TABLE_PAGE_SIZE = 5;

function TableSelectionHeader({
  checked,
  indeterminate,
  selectedIds,
  pageIds,
  allIds,
  onCheckedChange,
  onSelectionChange,
}: {
  checked: boolean;
  indeterminate: boolean;
  selectedIds: Set<number>;
  pageIds: number[];
  allIds: number[];
  onCheckedChange: () => void;
  onSelectionChange: React.Dispatch<React.SetStateAction<Set<number>>>;
}) {
  const hasSelected = selectedIds.size > 0;
  const hasPageRows = pageIds.length > 0;

  const selectPage = () =>
  onSelectionChange((s) => {
    const next = new Set(s);
    pageIds.forEach((id) => next.add(id));
    return next;
  });

  const invertPage = () =>
  onSelectionChange((s) => {
    const next = new Set(s);
    pageIds.forEach((id) => next.has(id) ? next.delete(id) : next.add(id));
    return next;
  });

  return (
    <div className="-mx-2 flex h-full w-8 items-center justify-center">
      <Checkbox checked={checked} indeterminate={indeterminate} onCheckedChange={onCheckedChange} aria-label="全选" />
      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label="批量选择菜单"
          className="relative z-10 inline-flex size-3.5 shrink-0 items-center justify-center rounded text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:bg-muted focus-visible:text-foreground data-popup-open:bg-muted data-popup-open:text-foreground [&_svg]:size-3"
        >
          <ChevronDownIcon />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem disabled={!hasPageRows} onClick={selectPage}>选择当前页</DropdownMenuItem>
          <DropdownMenuItem disabled={allIds.length === 0} onClick={() => onSelectionChange(new Set(allIds))}>选择全部数据</DropdownMenuItem>
          <DropdownMenuItem disabled={!hasPageRows} onClick={invertPage}>反选当前页</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem disabled={!hasSelected} onClick={() => onSelectionChange(new Set())}>清空选择</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>);
}


function TableBusinessDemo({
  surface,
  density,
  selection,
  filter,
  fixed,
}: {
  surface: "plain" | "bordered" | "striped";
  density: "compact" | "default" | "comfortable";
  selection: "off" | "multiple" | "multiple-menu" | "single";
  filter: "off" | "on";
  fixed: "off" | "on";
}) {
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [selectedOne, setSelectedOne] = useState<number | null>(null);
  const [sort, setSort] = useState<{key: "amount" | "date";dir: "asc" | "desc";} | null>(null);
  const [page, setPage] = useState(1);
  const [levelFilter, setLevelFilter] = useState<string[]>([]);
  const [draftLevelFilter, setDraftLevelFilter] = useState<string[]>([]);
  const [levelFilterQuery, setLevelFilterQuery] = useState("");
  const [frozenCount, setFrozenCount] = useState(0);

  const filterEnabled = filter === "on";
  const freezeCapabilityEnabled = fixed === "on";
  const sortedFor = (key: "amount" | "date") => sort?.key === key ? sort.dir : false;
  const toggleSort = (key: "amount" | "date") =>
  setSort((s) => s?.key !== key ? { key, dir: "asc" } : s.dir === "asc" ? { key, dir: "desc" } : null);

  const levelFilterGroups = [
  { label: "重点客户", options: ["VIP客户", "重要客户"] },
  { label: "普通客户", options: ["一般客户"] }];
  const levelFilterOptions = levelFilterGroups.flatMap((g) => g.options);
  const visibleLevelFilterGroups = levelFilterGroups.
  map((group) => ({ ...group, options: group.options.filter((option) => option.includes(levelFilterQuery.trim())) })).
  filter((group) => group.options.length > 0);
  const allDraftLevelsChecked = levelFilterOptions.every((option) => draftLevelFilter.includes(option));
  const someDraftLevelsChecked = levelFilterOptions.some((option) => draftLevelFilter.includes(option));
  const toggleDraftLevel = (level: string) =>
  setDraftLevelFilter((current) => current.includes(level) ? current.filter((item) => item !== level) : [...current, level]);
  const levelFilterPanel = (
    <div className="flex flex-col">
      <div className="border-b border-border-subtle p-2">
        <div className="relative">
          <SearchIcon className="pointer-events-none absolute left-2 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input value={levelFilterQuery} onChange={(event) => setLevelFilterQuery(event.currentTarget.value)} placeholder="在筛选项中搜索" className="h-(--fx-control-sm-height) rounded-md pl-7" />
        </div>
      </div>
      <div className="max-h-60 overflow-y-auto p-2">
        <label className="flex h-8 items-center gap-2 rounded px-1.5 text-base hover:bg-muted">
          <Checkbox checked={allDraftLevelsChecked} indeterminate={!allDraftLevelsChecked && someDraftLevelsChecked} onCheckedChange={() => setDraftLevelFilter(allDraftLevelsChecked ? [] : levelFilterOptions)} aria-label="全选客户级别" />
          <span>全选</span>
        </label>
        {visibleLevelFilterGroups.map((group) =>
        <div key={group.label} className="mt-1">
            <div className="flex h-8 items-center gap-2 px-1.5 text-base font-medium">
              <ChevronDownIcon className="size-3.5 text-muted-foreground" />
              <span>{group.label}</span>
            </div>
            <div className="ml-7">
              {group.options.map((option) =>
            <label key={option} className="flex h-8 items-center gap-2 rounded px-1.5 text-base hover:bg-muted">
                  <Checkbox checked={draftLevelFilter.includes(option)} onCheckedChange={() => toggleDraftLevel(option)} aria-label={`筛选 ${option}`} />
                  <span>{option}</span>
                </label>
            )}
            </div>
          </div>
        )}
        {visibleLevelFilterGroups.length === 0 ? <div className="px-1.5 py-6 text-center text-base text-muted-foreground">无匹配筛选项</div> : null}
      </div>
      <div className="flex items-center justify-between border-t border-border-subtle p-2">
        <Button variant="plain" disabled={draftLevelFilter.length === 0 && levelFilter.length === 0} onClick={() => {
          setDraftLevelFilter([]);
          setLevelFilter([]);
        }}>重置</Button>
        <Button size="sm" onClick={() => {
          setLevelFilter(draftLevelFilter);
          setPage(1);
        }}>确定</Button>
      </div>
    </div>);

  let sorted = filterEnabled && levelFilter.length > 0 ? tableBizRows.filter((r) => levelFilter.includes(r.level)) : [...tableBizRows];
  if (sort) {
    sorted = [...sorted].sort((a, b) => {
      const v = sort.key === "amount" ? a.amount - b.amount : a.date.localeCompare(b.date);
      return sort.dir === "asc" ? v : -v;
    });
  }
  const pageRows = sorted.slice((page - 1) * TABLE_PAGE_SIZE, page * TABLE_PAGE_SIZE);
  const pageIds = pageRows.map((r) => r.id);
  const allIds = sorted.map((r) => r.id);
  const allChecked = pageIds.every((id) => selected.has(id));
  const someChecked = pageIds.some((id) => selected.has(id));
  const isFrozen = (i: number) => i < frozenCount;
  const frozenLeftOf = (i: number) => isFrozen(i) ? FROZEN_W.slice(0, i).reduce((a, b) => a + b, 0) : undefined;
  const freezeMenu = (i: number) => [
  ...(frozenCount !== i + 1 ? [{ label: `冻结到第 ${i + 1} 列`, icon: <LockIcon />, onClick: () => setFrozenCount(i + 1) }] : []),
  ...(frozenCount > 0 ? [{ label: "取消冻结", onClick: () => setFrozenCount(0) }] : [])];

  const toggleAll = () =>
  setSelected((s) => {
    const next = new Set(s);
    if (allChecked) pageIds.forEach((id) => next.delete(id));else
    pageIds.forEach((id) => next.add(id));
    return next;
  });
  const toggleOne = (id: number) =>
  setSelected((s) => {
    const next = new Set(s);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });
  const isMultipleSelection = selection === "multiple" || selection === "multiple-menu";
  const showSelection = isMultipleSelection || selection === "single";
  const frozenStyle = (width: number) => freezeCapabilityEnabled ? { width, minWidth: width, maxWidth: width } : undefined;
  const actionStyle = { width: 128, minWidth: 128, maxWidth: 128 };

  return (
    <div className="overflow-hidden">
      {isMultipleSelection && selected.size > 0 &&
      <div className="flex items-center gap-3 border-b border-border-subtle bg-muted px-3 py-2 text-base">
          <span className="text-muted-foreground">已选 <span className="font-medium text-foreground">{selected.size}</span> 项</span>
          <Button size="sm" variant="outline">批量导出</Button>
          <Button size="sm" variant="ghost" onClick={() => setSelected(new Set())}>取消选择</Button>
        </div>
      }
      <RadioGroup value={selectedOne == null ? "" : String(selectedOne)} onValueChange={(value) => setSelectedOne(Number(value))} className="block">
          <Table
            variant={surface}
            density={density}
            className="min-w-[920px]"
            maxHeight={freezeCapabilityEnabled ? 288 : undefined}
          >
            <TableHeader sticky={freezeCapabilityEnabled}>
              <TableRow>
                {showSelection ? (
                  <TableHead data-selection-cell>
                    {selection === "multiple-menu" ? (
                      <TableSelectionHeader checked={allChecked} indeterminate={!allChecked && someChecked} selectedIds={selected} pageIds={pageIds} allIds={allIds} onCheckedChange={toggleAll} onSelectionChange={setSelected} />
                    ) : isMultipleSelection ? (
                      <Checkbox checked={allChecked} indeterminate={!allChecked && someChecked} onCheckedChange={toggleAll} aria-label="全选" />
                    ) : null}
                  </TableHead>
                ) : null}
                <TableHead style={frozenStyle(FROZEN_W[0])} frozenLeft={frozenLeftOf(0)} frozenEdge={frozenCount > 0 && frozenCount - 1 === 0} menuActions={freezeCapabilityEnabled ? freezeMenu(0) : undefined}>客户名称</TableHead>
                <TableHead style={frozenStyle(FROZEN_W[1])} frozenLeft={frozenLeftOf(1)} frozenEdge={frozenCount > 0 && frozenCount - 1 === 1} menuActions={freezeCapabilityEnabled ? freezeMenu(1) : undefined}>负责人</TableHead>
                <TableHead filterContent={filterEnabled ? levelFilterPanel : undefined} filtered={filterEnabled && levelFilter.length > 0}>客户级别{filterEnabled && levelFilter.length > 0 ? `（${levelFilter.length}）` : ""}</TableHead>
                <TableHead>标签</TableHead>
                <TableHead>负责人部门</TableHead>
                <TableHead>产品名称</TableHead>
                <TableHead align="right" sortable sorted={sortedFor("amount")} onSort={() => toggleSort("amount")}>金额(元)</TableHead>
                <TableHead sortable sorted={sortedFor("date")} onSort={() => toggleSort("date")}>最后修改时间</TableHead>
                <TableHead pinned="right" style={actionStyle}>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageRows.map((row) =>
              <TableRow key={row.id} data-state={(isMultipleSelection && selected.has(row.id)) || (selection === "single" && selectedOne === row.id) ? "selected" : undefined}>
                  {showSelection ? (
                    <TableCell data-selection-cell>
                      {isMultipleSelection ? (
                        <Checkbox checked={selected.has(row.id)} onCheckedChange={() => toggleOne(row.id)} aria-label={`选择 ${row.name}`} />
                      ) : (
                        <RadioGroupItem value={String(row.id)} aria-label={`选择 ${row.name}`} />
                      )}
                    </TableCell>
                  ) : null}
                <TableCell frozenLeft={frozenLeftOf(0)} frozenEdge={frozenCount > 0 && frozenCount - 1 === 0}><Link href="#table">{row.name}</Link></TableCell>
                <TableCell frozenLeft={frozenLeftOf(1)} frozenEdge={frozenCount > 0 && frozenCount - 1 === 1}>
                  <span className="inline-flex items-center gap-1.5">
                    <Avatar className="size-5"><AvatarImage src={row.avatar} alt={row.owner} /><AvatarFallback colorful>{avatarInitials(row.owner)}</AvatarFallback></Avatar>
                    {row.owner}
                  </span>
                </TableCell>
                <TableCell><LevelTag level={row.level} color={row.levelColor} /></TableCell>
                <TableCell>
                  <span className="inline-flex gap-1">
                    {row.tags.map((t) => <Tag key={t.label} color={t.color}>{t.label}</Tag>)}
                  </span>
                </TableCell>
                <TableCell>{row.dept}</TableCell>
                <TableCell className="max-w-[200px] truncate">{row.product}</TableCell>
                <TableCell align="right" className="tabular-nums">{row.amount.toLocaleString("zh-CN", { minimumFractionDigits: 2 })}</TableCell>
                <TableCell>{row.date}</TableCell>
                <TableCell pinned="right" style={actionStyle}>
                  <TooltipProvider delay={100}>
                    <span className="inline-flex items-center gap-1">
                      <IconAction icon={<EyeIcon />} label="查看" />
                      <IconAction icon={<PencilIcon />} label="编辑" />
                      <IconAction icon={<Trash2Icon />} label="删除" tone="danger" />
                    </span>
                  </TooltipProvider>
                </TableCell>
              </TableRow>
              )}
            </TableBody>
          </Table>
        </RadioGroup>
      <div className="border-t border-border-subtle">
        <Pagination page={page} total={sorted.length} pageSize={TABLE_PAGE_SIZE} showTotal={false} onPageChange={setPage} className="px-2 py-3" />
      </div>
    </div>);

}

// 冻结到此列（Excel 模型）：前两列定宽，便于算累加 left 偏移
const FROZEN_W = [240, 140]; // 客户名称 / 负责人 列宽

function TableLoadingDemo({ surface }: { surface: "plain" | "bordered" | "striped" }) {
  return (
    <TablePreviewWithPagination pageSize={5} status="loading">
      <Table variant={surface}>
        <TableHeader>
          <TableRow>
            <TableHead>客户名称</TableHead>
            <TableHead>负责人</TableHead>
            <TableHead>客户级别</TableHead>
            <TableHead align="right">金额(元)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, i) =>
          <TableRow key={i} variant="static">
              <TableCell><Skeleton className="h-4 w-44" /></TableCell>
              <TableCell><Skeleton className="h-4 w-16" /></TableCell>
              <TableCell><Skeleton className="h-5 w-14 rounded-full" /></TableCell>
              <TableCell align="right"><Skeleton className="ml-auto h-4 w-16" /></TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TablePreviewWithPagination>);

}

function TableEmptyDemo({ surface }: { surface: "plain" | "bordered" | "striped" }) {
  return (
    <TablePreviewWithPagination total={0} pageSize={5} status="empty">
      <Table variant={surface}>
        <TableHeader>
          <TableRow>
            <TableHead>客户名称</TableHead>
            <TableHead>负责人</TableHead>
            <TableHead>客户级别</TableHead>
            <TableHead align="right">金额(元)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow variant="static">
            <TableCell colSpan={4}>
              <div className="flex flex-col items-center justify-center gap-1 py-12 text-muted-foreground">
                <DatabaseIcon className="size-7 opacity-40" />
                <span className="text-base">暂无数据</span>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TablePreviewWithPagination>);

}

function TableBasicDemo({
  surface,
  density,
  summary,
  selection,
}: {
  surface: "plain" | "bordered" | "striped";
  density: "compact" | "default" | "comfortable";
  summary: "off" | "on";
  selection: "off" | "multiple" | "multiple-menu" | "single";
}) {
  const rows = tableBizRows.slice(0, 3);
  const total = rows.reduce((sum, row) => sum + row.amount, 0);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [selectedOne, setSelectedOne] = useState<number | null>(null);
  const isMultipleSelection = selection === "multiple" || selection === "multiple-menu";
  const showSelection = isMultipleSelection || selection === "single";
  const pageIds = rows.map((row) => row.id);
  const allIds = rows.map((row) => row.id);
  const allChecked = pageIds.every((id) => selected.has(id));
  const someChecked = pageIds.some((id) => selected.has(id));

  const toggleAll = () =>
  setSelected((s) => {
    const next = new Set(s);
    if (allChecked) pageIds.forEach((id) => next.delete(id));else
    pageIds.forEach((id) => next.add(id));
    return next;
  });
  const toggleOne = (id: number) =>
  setSelected((s) => {
    const next = new Set(s);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  return (
    <TablePreviewWithPagination pageSize={3}>
      <RadioGroup value={selectedOne == null ? "" : String(selectedOne)} onValueChange={(value) => setSelectedOne(Number(value))} className="block">
        <Table variant={surface} density={density}>
          <TableHeader>
            <TableRow>
              {showSelection ? (
                <TableHead data-selection-cell>
                  {selection === "multiple-menu" ? (
                    <TableSelectionHeader checked={allChecked} indeterminate={!allChecked && someChecked} selectedIds={selected} pageIds={pageIds} allIds={allIds} onCheckedChange={toggleAll} onSelectionChange={setSelected} />
                  ) : isMultipleSelection ? (
                    <Checkbox checked={allChecked} indeterminate={!allChecked && someChecked} onCheckedChange={toggleAll} aria-label="全选" />
                  ) : null}
                </TableHead>
              ) : null}
              <TableHead>客户名称</TableHead>
              <TableHead>负责人</TableHead>
              <TableHead>客户级别</TableHead>
              <TableHead align="right">金额(元)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id} data-state={(isMultipleSelection && selected.has(row.id)) || (selection === "single" && selectedOne === row.id) ? "selected" : undefined}>
                {showSelection ? (
                  <TableCell data-selection-cell>
                    {isMultipleSelection ? (
                      <Checkbox checked={selected.has(row.id)} onCheckedChange={() => toggleOne(row.id)} aria-label={`选择 ${row.name}`} />
                    ) : (
                      <RadioGroupItem value={String(row.id)} aria-label={`选择 ${row.name}`} />
                    )}
                  </TableCell>
                ) : null}
                <TableCell><Link href="#table">{row.name}</Link></TableCell>
                <TableCell>{row.owner}</TableCell>
                <TableCell><LevelTag level={row.level} color={row.levelColor} /></TableCell>
                <TableCell align="right" className="tabular-nums">{row.amount.toLocaleString("zh-CN", { minimumFractionDigits: 2 })}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          {summary === "on" ? (
            <TableFooter>
            <TableRow>
              {showSelection ? <TableCell data-selection-cell /> : null}
              <TableCell colSpan={3}>合计</TableCell>
              <TableCell align="right">{total.toLocaleString("zh-CN", { minimumFractionDigits: 2 })}</TableCell>
            </TableRow>
          </TableFooter>
          ) : null}
        </Table>
      </RadioGroup>
    </TablePreviewWithPagination>);
}

type TableComposition = "basic" | "business";
type TableSurface = "plain" | "bordered" | "striped";
type TableDensity = "compact" | "default" | "comfortable";
type TableSummary = "off" | "on";
type TableStatus = "default" | "loading" | "empty";
type TableSelection = "off" | "multiple" | "multiple-menu" | "single";
type TableFilter = "off" | "on";
type TableFixed = "off" | "on";
function genTableCodeWithoutSurface(composition: TableComposition, density: TableDensity, summary: TableSummary, status: TableStatus, selection: TableSelection, filter: TableFilter, fixed: TableFixed): string {
  if (status === "loading") {
    return `<Table density="${density}">\n  <TableHeader>\n    <TableRow>\n      <TableHead>客户名称</TableHead>\n      <TableHead>负责人</TableHead>\n      <TableHead>客户级别</TableHead>\n      <TableHead align="right">金额(元)</TableHead>\n    </TableRow>\n  </TableHeader>\n  <TableBody>\n    {Array.from({ length: 5 }).map((_, i) => (\n      <TableRow key={i} className="hover:bg-transparent">\n        <TableCell><Skeleton className="h-4 w-44" /></TableCell>\n        <TableCell><Skeleton className="h-4 w-16" /></TableCell>\n        <TableCell><Skeleton className="h-5 w-14 rounded-full" /></TableCell>\n        <TableCell align="right"><Skeleton className="ml-auto h-4 w-16" /></TableCell>\n      </TableRow>\n    ))}\n  </TableBody>\n</Table>\n<Pagination page={1} total={48} pageSize={5} showTotal={false} onPageChange={() => {}} />`;
  }
  if (status === "empty") {
    return `<Table density="${density}">\n  <TableHeader>\n    <TableRow>\n      <TableHead>客户名称</TableHead>\n      <TableHead>负责人</TableHead>\n      <TableHead>客户级别</TableHead>\n      <TableHead align="right">金额(元)</TableHead>\n    </TableRow>\n  </TableHeader>\n  <TableBody>\n    <TableRow className="hover:bg-transparent">\n      <TableCell colSpan={4}>\n        <EmptyState title="暂无数据" />\n      </TableCell>\n    </TableRow>\n  </TableBody>\n</Table>`;
  }
  if (composition === "business") {
    const multipleSelectionHead = selection === "multiple-menu" ? "<TableHead><TableSelectionHeader /></TableHead>\\n      " : "<TableHead><Checkbox aria-label=\"全选\" /></TableHead>\\n      ";
    const isMultipleSelection = selection === "multiple" || selection === "multiple-menu";
    const selectionHead = isMultipleSelection ? multipleSelectionHead : selection === "single" ? "<TableHead />\\n      " : "";
    const rowState = isMultipleSelection ? " data-state={selected.has(customer.id) ? \"selected\" : undefined}" : selection === "single" ? " data-state={selectedId === customer.id ? \"selected\" : undefined}" : "";
    const selectionCell = isMultipleSelection ? "<TableCell><Checkbox disabled={customer.disabled} aria-label={`选择 ${customer.name}`} /></TableCell>\\n        " : selection === "single" ? "<TableCell><RadioGroupItem value={String(customer.id)} disabled={customer.disabled} aria-label={`选择 ${customer.name}`} /></TableCell>\\n        " : "";
    const fixedTableAttrs = fixed === "on" ? ` maxHeight={288} className="min-w-[920px]"` : ` className="min-w-[920px]"`;
    const stickyHeader = fixed === "on" ? " sticky" : "";
    const customerHead = fixed === "on" ? `<TableHead frozenLeft={0} frozenEdge menuActions={freezeMenu(0)}>客户名称</TableHead>` : `<TableHead>客户名称</TableHead>`;
    const ownerHead = fixed === "on" ? `<TableHead frozenLeft={240} frozenEdge menuActions={freezeMenu(1)}>负责人</TableHead>` : `<TableHead>负责人</TableHead>`;
    const levelHead = filter === "on" ? `<TableHead filterContent={levelFilterPanel} filtered={levelFilter.length > 0}>客户级别</TableHead>` : `<TableHead>客户级别</TableHead>`;
    return `<Table density="${density}"${fixedTableAttrs}>\n  <TableHeader${stickyHeader}>\n    <TableRow>\n      ${selectionHead}${customerHead}\n      ${ownerHead}\n      ${levelHead}\n      <TableHead align="right" sortable sorted={sortedFor("amount")} onSort={() => toggleSort("amount")}>金额(元)</TableHead>\n      <TableHead sortable sorted={sortedFor("date")} onSort={() => toggleSort("date")}>最后修改时间</TableHead>\n      <TableHead pinned="right">操作</TableHead>\n    </TableRow>\n  </TableHeader>\n  <TableBody>\n    {pageRows.map((customer) => (\n      <TableRow key={customer.id}${rowState}>\n        ${selectionCell}<TableCell><a href={customer.href}>{customer.name}</a></TableCell>\n        <TableCell>{customer.owner}</TableCell>\n        <TableCell>{customer.level}</TableCell>\n        <TableCell align="right">{customer.amount}</TableCell>\n        <TableCell>{customer.date}</TableCell>\n        <TableCell pinned="right">...</TableCell>\n      </TableRow>\n    ))}\n  </TableBody>\n</Table>\n<Pagination page={page} total={total} pageSize={pageSize} onPageChange={setPage} />`;
  }
  if (summary === "on") {
    const multipleSelectionHead = selection === "multiple-menu" ? "<TableHead><TableSelectionHeader /></TableHead>\\n      " : "<TableHead><Checkbox aria-label=\"全选\" /></TableHead>\\n      ";
    const isMultipleSelection = selection === "multiple" || selection === "multiple-menu";
    const selectionHead = isMultipleSelection ? multipleSelectionHead : selection === "single" ? "<TableHead />\\n      " : "";
    const rowState = isMultipleSelection ? " data-state={selected.has(customer.id) ? \"selected\" : undefined}" : selection === "single" ? " data-state={selectedId === customer.id ? \"selected\" : undefined}" : "";
    const selectionCell = isMultipleSelection ? "<TableCell><Checkbox aria-label={`选择 ${customer.name}`} /></TableCell>\\n        " : selection === "single" ? "<TableCell><RadioGroupItem value={String(customer.id)} aria-label={`选择 ${customer.name}`} /></TableCell>\\n        " : "";
    const footerSelectionCell = selection === "off" ? "" : "<TableCell />\\n      ";
    return `<Table density="${density}">\n  <TableHeader>\n    <TableRow>\n      ${selectionHead}<TableHead>客户名称</TableHead>\n      <TableHead>负责人</TableHead>\n      <TableHead>客户级别</TableHead>\n      <TableHead align="right">金额(元)</TableHead>\n    </TableRow>\n  </TableHeader>\n  <TableBody>\n    {customers.map((customer) => (\n      <TableRow key={customer.id}${rowState}>\n        ${selectionCell}<TableCell><a href={customer.href}>{customer.name}</a></TableCell>\n        <TableCell>{customer.owner}</TableCell>\n        <TableCell>{customer.level}</TableCell>\n        <TableCell align="right">{customer.amount}</TableCell>\n      </TableRow>\n    ))}\n  </TableBody>\n  <TableFooter>\n    <TableRow>\n      ${footerSelectionCell}<TableCell colSpan={3}>合计</TableCell>\n      <TableCell align="right">{totalAmount}</TableCell>\n    </TableRow>\n  </TableFooter>\n</Table>`;
  }
  return `<Table density="${density}">\n  <TableHeader>\n    <TableRow>\n      <TableHead>客户名称</TableHead>\n      <TableHead>负责人</TableHead>\n      <TableHead>客户级别</TableHead>\n      <TableHead align="right">金额(元)</TableHead>\n    </TableRow>\n  </TableHeader>\n  <TableBody>\n    {customers.map((customer) => (\n      <TableRow key={customer.id}>\n        <TableCell><a href={customer.href}>{customer.name}</a></TableCell>\n        <TableCell>{customer.owner}</TableCell>\n        <TableCell>{customer.level}</TableCell>\n        <TableCell align="right">{customer.amount}</TableCell>\n      </TableRow>\n    ))}\n  </TableBody>\n</Table>`;
}

function genTableCode(composition: TableComposition, surface: TableSurface, density: TableDensity, summary: TableSummary, status: TableStatus, selection: TableSelection, filter: TableFilter, fixed: TableFixed): string {
  return genTableCodeWithoutSurface(composition, density, summary, status, selection, filter, fixed)
    .replace("<Table ", `<Table variant="${surface}" `)
    .split('className="hover:bg-transparent"').join('variant="static"')
}

const componentPlaygroundsManifest = JSON.parse(componentPlaygroundsManifestRaw) as ComponentPlaygroundsManifest
const tablePlaygroundManifest = componentPlaygroundsManifest.components.table

const tablePlaygroundConfig = {
  storySource: "docs/data/component-playgrounds.manifest.json#components.table",
  stories: componentPlaygroundStoriesFromManifest(tablePlaygroundManifest),
  previewItemsClassName: "w-full",
  props: [
    {
      key: "composition",
      zh: "变体",
      en: "Variant",
      propName: "composition",
      type: "segment" as const,
      options: [
        {
          value: "basic",
          label: "基础",
          labelEn: "Basic",
          intent: "最常见的默认表格，用于稳定展示结构化数据。",
          intentEn: "The default table form for stable, structured data display.",
          constraint: "先用默认表格；只有出现真实业务需求时，再加分页、排序、冻结列等能力。",
          constraintEn: "Start with the default table and only add paging, sorting, or frozen columns when the use case truly needs them.",
        },
        {
          value: "business",
          label: "业务列表",
          labelEn: "Business list",
          intent: "用于后台最常见的资源列表；排序、筛选、固定列、选择等能力可以叠加出现。",
          intentEn: "Use for common resource lists. Sorting, filtering, frozen columns, and selection can be combined.",
          constraint: "业务列表不是把交互切成多个变体；金额、日期等可比较列默认支持排序，分页默认跟随表格外层结构。",
          constraintEn: "Business list does not split interactions into variants; comparable columns such as amount or date sort by default, and pagination belongs to the table shell.",
        },
      ],
    },
    {
      key: "surface",
      zh: "表面",
      en: "Surface",
      propName: "variant",
      type: "segment" as const,
      options: [
        { value: "plain", label: "无容器", labelEn: "Plain" },
        { value: "bordered", label: "描边", labelEn: "Bordered" },
        { value: "striped", label: "斑马纹", labelEn: "Striped" },
      ],
    },
    {
      key: "density",
      zh: "行高",
      en: "Row height",
      propName: "density",
      type: "segment" as const,
      hasAll: true,
      options: [
        {
          value: "compact",
          label: "紧凑28",
          labelEn: "Compact 28",
          intent: "用于信息密度更高的列表，一屏能看到更多行。",
          intentEn: "Use for dense lists where more rows should fit on one screen.",
          constraint: "只用于可扫读的数据；如果单元格内容较长或有复杂控件，不要压到 28px。",
          constraintEn: "Use only for scannable data; avoid 28px rows when cells contain long text or complex controls.",
        },
        {
          value: "default",
          label: "舒适36",
          labelEn: "Default 36",
          intent: "默认表格行高，兼顾信息密度和可读性。",
          intentEn: "The default row height, balancing density and readability.",
          constraint: "没有明确业务理由时保持默认 36px，避免每张表都重新定义节奏。",
          constraintEn: "Keep 36px unless the use case clearly needs a denser or looser rhythm.",
        },
        {
          value: "comfortable",
          label: "宽松42",
          labelEn: "Comfortable 42",
          intent: "用于需要更强可读性、点击余量或内容更复杂的表格。",
          intentEn: "Use for tables that need stronger readability, larger hit areas, or richer cell content.",
          constraint: "宽松行高会降低一屏信息量，只在阅读优先或操作优先的表格里使用。",
          constraintEn: "Comfortable rows reduce visible density, so reserve them for read-heavy or action-heavy tables.",
        },
      ],
    },
    {
      key: "summary",
      zh: "汇总",
      en: "Summary",
      propName: "summary",
      type: "segment" as const,
      options: [
        {
          value: "off",
          label: "无",
          labelEn: "Off",
          intent: "基础表格默认不带汇总，专注展示明细行。",
          intentEn: "The basic table omits summaries by default and focuses on row-level details.",
          constraint: "如果没有合计、均值或小计等明确计算结果，不要为了占位加表尾。",
          constraintEn: "Do not add a footer unless there is a real total, average, or subtotal to show.",
        },
        {
          value: "on",
          label: "表尾汇总",
          labelEn: "Footer summary",
          intent: "用于金额、数量等需要合计或小计的表格。",
          intentEn: "Use for tables with totals or subtotals such as amount and quantity.",
          constraint: "汇总属于另一个属性，不改变基础表格本身；只在数据口径稳定时展示。",
          constraintEn: "Summary is a separate property, not a new base variant; show it only when the calculation is stable.",
        },
      ],
    },
    {
      key: "selection",
      zh: "选择",
      en: "Selection",
      propName: "selection",
      type: "segment" as const,
      hasAll: true,
      options: [
        {
          value: "off",
          label: "无",
          labelEn: "Off",
          intent: "默认不提供批量选择，表格只承担阅读和单行操作。",
          intentEn: "By default, the table supports reading and row actions without batch selection.",
          constraint: "没有批量动作时不要加复选框列，避免误导用户以为可以批处理。",
          constraintEn: "Do not add a checkbox column unless batch actions actually exist.",
        },
        {
          value: "multiple",
          label: "多选",
          labelEn: "Multiple",
          intent: "用于批量导出、批量删除、批量分配等资源列表操作。",
          intentEn: "Use for bulk export, delete, assignment, and similar resource-list actions.",
          constraint: "选择态要有明确的选中反馈和批量操作区；只靠行高亮不够。",
          constraintEn: "Selection needs clear selected feedback and a batch action area; row highlight alone is not enough.",
        },
        {
          value: "multiple-menu",
          label: "多选+菜单",
          labelEn: "Multiple + menu",
          intent: "用于需要选择当前页、选择全部、反选、清空等快捷项的批量选择表格。",
          intentEn: "Use for multiple selection with shortcuts such as page, all, invert, or clear.",
          constraint: "这是多选的增强能力，不是另一套选择模型；简单多选优先用“多选”。",
          constraintEn: "This enhances multiple selection, not a separate selection model; prefer plain multiple selection for simple cases.",
        },
        {
          value: "single",
          label: "单选",
          labelEn: "Single",
          intent: "用于只能选择一条记录继续下一步的列表，例如选择主联系人、默认地址或归属对象。",
          intentEn: "Use when the next step can accept exactly one row, such as choosing a primary contact, default address, or owner object.",
          constraint: "单选列不提供表头全选；禁用行的 radio 和行内容要同步禁用反馈。",
          constraintEn: "Single selection has no select-all header; disabled rows need disabled radio and matching row feedback.",
        },
      ],
    },
    {
      key: "filter",
      zh: "筛选",
      en: "Filter",
      propName: "filter",
      type: "segment" as const,
      options: [
        {
          value: "off",
          label: "无",
          labelEn: "Off",
          intent: "不展示列筛选入口，适合字段少、条件简单的表格。",
          intentEn: "Hide column filters for small tables or simple conditions.",
          constraint: "筛选是列能力，不应被做成一个新的表格变体。",
          constraintEn: "Filtering is a column capability, not a separate table variant.",
        },
        {
          value: "on",
          label: "列筛选",
          labelEn: "Column filter",
          intent: "在客户级别等枚举列提供搜索、多选、确认和重置。",
          intentEn: "Adds search, multi-select, confirm, and reset to enum-like columns.",
          constraint: "适合枚举、状态、负责人等可筛选列；金额/日期更多使用排序或范围筛选。",
          constraintEn: "Best for enum, status, or owner columns; amount/date usually use sorting or range filters.",
        },
      ],
      hiddenWhen: (v: Record<string, string>) => v.composition !== "business",
    },
    {
      key: "fixed",
      zh: "固定列",
      en: "Frozen columns",
      propName: "fixed",
      type: "segment" as const,
      options: [
        {
          value: "off",
          label: "无",
          labelEn: "Off",
          intent: "不提供冻结列能力，按普通业务表展示。",
          intentEn: "No frozen-column capability; show the table as a standard business list.",
          constraint: "字段不多或无需局部冻结时，保持普通滚动即可。",
          constraintEn: "Keep standard scrolling when the table is not wide enough to need frozen controls.",
        },
        {
          value: "on",
          label: "开启冻结能力",
          labelEn: "Enable freeze",
          intent: "开启表头 hover 冻结能力，由用户自行冻结首列或前两列。",
          intentEn: "Expose hover-based freeze actions so users can choose the first column or first two columns.",
          constraint: "冻结列是布局增强，可以和排序、筛选、选择同时存在，但不应默认替用户冻好。",
          constraintEn: "Frozen columns are a layout enhancement and can coexist with sorting, filtering, and selection, but should not be pre-frozen by default.",
        },
      ],
      hiddenWhen: (v: Record<string, string>) => v.composition !== "business",
    },
    {
      key: "status",
      zh: "状态",
      en: "State",
      propName: "status",
      type: "segment" as const,
      hasAll: true,
      options: [
        {
          value: "default",
          label: "正常",
          labelEn: "Default",
          intent: "默认数据态，展示真实表格行。",
          intentEn: "The default data state, showing real table rows.",
          constraint: "状态是业务组合，不是 Table 原生 prop；页面根据数据请求结果决定渲染哪种内容。",
          constraintEn: "State is a business composition, not a native Table prop; render it from request/data state.",
        },
        {
          value: "loading",
          label: "加载",
          labelEn: "Loading",
          intent: "用于数据请求中，保持表头结构稳定，同时用骨架行提示正在加载。",
          intentEn: "Use while data is loading, keeping headers stable and showing skeleton rows.",
          constraint: "加载态不要放进高级变体；它是所有表格都可能出现的状态。",
          constraintEn: "Loading is not an advanced variant; every table may need it.",
        },
        {
          value: "empty",
          label: "空",
          labelEn: "Empty",
          intent: "用于请求成功但没有数据，保留表头并在表体展示空状态。",
          intentEn: "Use after a successful request returns no rows, keeping headers and showing an empty state in the body.",
          constraint: "空状态要明确占满列数，避免只在某个单元格里挤一行文字。",
          constraintEn: "Empty state should span the table columns instead of being squeezed into one cell.",
        },
      ],
    },
  ],
  initial: tablePlaygroundManifest.initial,
  guidanceKey: "composition",
  renderOne: (v: Record<string, string>) => {
    const composition = (v.composition as TableComposition) || "basic";
    const surface = (v.surface as TableSurface) || "plain";
    const density = (v.density as TableDensity) || "default";
    const summary = (v.summary as TableSummary) || "off";
    const status = (v.status as TableStatus) || "default";
    const selection = (v.selection as TableSelection) || "off";
    const filter = (v.filter as TableFilter) || "off";
    const fixed = (v.fixed as TableFixed) || "off";
    if (status === "loading") {
      return <TableLoadingDemo surface={surface} />;
    }
    if (status === "empty") {
      return <TableEmptyDemo surface={surface} />;
    }
    if (composition === "business") {
      return <TableBusinessDemo surface={surface} density={density} selection={selection} filter={filter} fixed={fixed} />;
    }
    return <TableBasicDemo surface={surface} density={density} summary={summary} selection={selection} />;
  },
  genCode: (v: Record<string, string>) => genTableCode((v.composition as TableComposition) || "basic", (v.surface as TableSurface) || "plain", (v.density as TableDensity) || "default", (v.summary as TableSummary) || "off", (v.status as TableStatus) || "default", (v.selection as TableSelection) || "off", (v.filter as TableFilter) || "off", (v.fixed as TableFixed) || "off"),
};

export { tablePlaygroundConfig }
