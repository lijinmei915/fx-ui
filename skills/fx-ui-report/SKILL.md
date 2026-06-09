---
name: fx-ui-report
zh_name: "fx-ui 报告美化"
en_name: "fx-ui Report Beautifier"
emoji: "📊"
description: "把任意格式的报告数据（HTML/JSON/Markdown/纯文字）转成符合 fx-ui 设计规范的独立 HTML 报告页。"
en_description: "Turn any report data (HTML / JSON / Markdown / plain text) into a polished standalone HTML report using the fx-ui design system."
category: data
tags: ["report", "data", "fx-ui", "crm", "dashboard", "美化", "报告"]
example_name: "商机预测报告 · 2026年5月"
example_format: html
example_tagline: "KPI 卡 + 趋势 Sparkline + Chart.js 图表 + 数据表 + 洞察块"
---

【技能：fx-ui 报告美化】

接受任意格式的报告数据，输出一份完整的、视觉规范严格对齐 fx-ui 设计系统的独立 HTML 文件。

**你的职责**：只管"怎么好看"，不修改数据事实。入参随意，出参严格。

---

## 第一步：识别内容结构

不管入参是什么格式，先识别以下语义块：

| 语义块 | 识别信号 |
|--------|---------|
| **报告头** | 标题、日期、数据来源、制表人 |
| **KPI** | 核心数字指标，通常 2–6 个 |
| **图表** | 有数字序列、分类对比、趋势的数据集 |
| **数据表** | 多列多行明细 |
| **洞察** | 结论性文字，常带风险 / 警告 / 建议语气 |
| **方法论** | 计算规则、数据口径说明 |

识别完成后，按下面的规则输出对应 HTML 组件。

---

## fx-ui Design Token（只用这些值，不得自造颜色）

```css
--bg:           #F7F8FA;   /* 页面底色 */
--surface:      #FFFFFF;   /* 卡片 */
--surface-sub:  #F2F3F5;   /* 弱背景 */
--fg-1:         #181C25;   /* 主文字 */
--fg-2:         #545861;   /* 次级文字 */
--fg-3:         #91959E;   /* 辅助 / 标签 */
--fg-4:         #C1C5CE;   /* 最弱，仅用于占位 */
--border:       #DEE1E8;
--border-soft:  #EAEBEE;
--primary:      #FF8000;   /* 品牌橙 */
--primary-soft: #FFF7E6;   /* 橙浅底 */
--success:      #30C776;   --success-soft: #DCFAE6;
--warning:      #FF7C19;   --warning-soft: #FFF5E6;
--danger:       #FF522A;   --danger-soft:  #FFDCCC;
--info:         #0C6CFF;   --info-soft:    #E6F4FF;
/* BI 图表色板（多系列按序取） */
--chart-1:#FF7383; --chart-2:#FF7752; --chart-3:#FF9B29;
--chart-4:#FFDA54; --chart-5:#DDF2BB; --chart-6:#55D48C;
--chart-7:#5BCFC1; --chart-8:#40B6FF; --chart-9:#368DFF;
--chart-10:#976AEB;
--radius: 10px;
--font: 'PingFang SC','Microsoft YaHei',sans-serif;
```

---

## 组件规则

### 报告头
- 顶部 4px 橙→浅橙渐变横条（`linear-gradient(90deg, #FF8000, #FFB452)`）
- 左侧：eyebrow 小标（11px 大写橙色英文副标题）+ 主标题（22px 700 fg-1）+ meta 信息行（12px fg-3，含日期/来源/制表人）
- 右侧：状态芯片（success 色系，带绿点前缀）+ 来源名称（fg-3）

### Section 标题
- 14px 700 fg-1，左侧 3px 品牌橙竖条，UPPERCASE，`letter-spacing: .06em`

### KPI 卡片
- 白底，顶部 2px 品牌橙边，`border-radius: 10px`
- label 图标：22×22px 圆角方块，`background: --primary-soft`，图标色 `--primary`
- label 文字：12px 500 **fg-1**（标题都是最黑的）
- 数值：28px 700 fg-1，单位 small 13px fg-3，`margin-left: 6px`
- 补充说明：11px fg-3
- 右下角：80×36 SVG sparkline，橙色折线 + 12% 透明度填充（趋势示意，非精确数据）

### 图表卡片
- 白底 border 卡片，card-title 13px 600 fg-1，card-sub 11px fg-3
- 使用 `<script src="https://cdn.jsdelivr.net/npm/chart.js@4"></script>`
- 图表容器必须有 `<div style="position:relative;height:220px">`，否则 Chart.js 会死循环撑高
- 柱图：`--primary`（#FF8000）；折线：`--chart-9`（#368DFF）；圆环 cutout 62%
- 网格线色：`--border`；轴标签色：`--fg-3`；Tooltip 白底 + border

### 数据表
- 表头：`--surface-sub` 底 + 12px 600 fg-2；行分割线 `--border-soft`；hover 行 `--primary-soft`
- Badge 着色规则：≥70% 或"谈判审核" → success；40–69% → info；20–39% → warning；<20% → danger；阶段文字同颜色
- Badge 形状：`border-radius: 20px`，`padding: 1px 8px`，彩色浅底

### 洞察块
- flex 行，`align-items: center`（单行）
- 图标块 28×28px 圆角 8px，**彩色实底 + 反白图标**（不是浅底彩色）
- level 判断：人员/数据丢失 → danger；集中度/健康 → warning；客观分析 → info；行动建议 → primary
- 正文 13.5px fg-1，标题加粗

### 方法论
- `<details>` 折叠，summary 带 `›` 箭头，展开时旋转 90°

---

## 文字层级规则（最重要）

- 所有"标题类"文字（section title / kpi label / card title）一律用 **fg-1**（#181C25）
- 辅助说明用 fg-3，最弱占位用 fg-4
- 报告里不得出现看不清的文字——fg-4 只能用于真正可以忽略的装饰性内容

---

## 输出规范

1. 输出完整单文件 HTML，样式全部 inline 或 `<style>` 内嵌，无外部依赖（Chart.js 和 Lucide 除外）
2. 不输出任何解释文字，只输出 HTML
3. 颜色只用上方 token 表里的值，不自造颜色
4. 如果入参缺少某个语义块，跳过该块，不补造数据
5. 参考 `example.html` 的完整结构和视觉效果
