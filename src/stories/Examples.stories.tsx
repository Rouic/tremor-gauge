import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { GaugeChart } from "../components/GaugeChart/GaugeChart";
import { GaugeMulti } from "../components/GaugeMulti/GaugeMulti";
import { GaugeLegend } from "../components/GaugeLegend/GaugeLegend";
import type { Color } from "../utils/chartColors";

const meta: Meta = {
  title: "Examples",
  tags: ["autodocs"],
};

export default meta;

// ─── Shared helpers ────────────────────────────────────────────────

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative w-full rounded-lg border border-gray-200 bg-white p-6 text-left shadow-sm dark:border-gray-800 dark:bg-gray-950 ${className}`}
    >
      {children}
    </div>
  );
}

function CardTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm font-medium text-gray-900 dark:text-gray-50">
      {children}
    </p>
  );
}

function CardDescription({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-1 text-sm leading-6 text-gray-500 dark:text-gray-500">
      {children}
    </p>
  );
}

const gbp = (v: number) =>
  v.toLocaleString("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  });

const pct = (v: number) => `${v}%`;
const compact = (v: number) =>
  v >= 1000 ? `${(v / 1000).toFixed(1)}k` : `${v}`;

// ─── Shared argTypes ──────────────────────────────────────────────

const arcSpanArg = {
  control: "select" as const,
  options: [180, 240, 270],
};
const strokeWidthArg = {
  control: { type: "range" as const, min: 4, max: 24, step: 2 },
};
const colorArg = {
  control: "select" as const,
  options: [
    "blue", "emerald", "violet", "amber", "gray",
    "cyan", "pink", "lime", "fuchsia",
  ],
};

// ─── 1. Revenue gauge + legend (chart above, legend below) ──────

const revenueData = [
  { source: "Direct", revenue: 4520 },
  { source: "Organic Search", revenue: 2890 },
  { source: "Referral", revenue: 1340 },
  { source: "Social Media", revenue: 780 },
];
const revenueColors: Color[] = ["blue", "cyan", "violet", "amber"];

type RevenueArgs = {
  arcSpan: 180 | 240 | 270;
  strokeWidth: number;
  showAnimation: boolean;
};

export const RevenueBreakdown: StoryObj<RevenueArgs> = {
  name: "Revenue breakdown (gauge + legend)",
  args: {
    arcSpan: 180,
    strokeWidth: 10,
    showAnimation: true,
  },
  argTypes: {
    arcSpan: arcSpanArg,
    strokeWidth: strokeWidthArg,
  },
  parameters: {
    docs: {
      source: {
        code: `import { useState } from "react";
import { GaugeMulti, GaugeLegend } from "tremor-gauge";

const data = [
  { source: "Direct", revenue: 4520 },
  { source: "Organic Search", revenue: 2890 },
  { source: "Referral", revenue: 1340 },
  { source: "Social Media", revenue: 780 },
];
const colors = ["blue", "cyan", "violet", "amber"];
const gbp = (v) =>
  v.toLocaleString("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 });

function RevenueBreakdown() {
  const [active, setActive] = useState(undefined);
  const legend = data.map((d, i) => ({ name: d.source, value: d.revenue, color: colors[i] }));
  return (
    <>
      <GaugeMulti
        data={data}
        category="source"
        value="revenue"
        colors={colors}
        label="Total Revenue"
        valueFormatter={gbp}
        activeName={active}
        onValueChange={(d) => setActive(d ? d.source : undefined)}
      />
      <GaugeLegend
        items={legend}
        valueFormatter={gbp}
        showShare
        activeName={active}
        onItemClick={(name) => setActive(active === name ? undefined : name)}
      />
    </>
  );
}`,
      },
    },
  },
  render: (args) => {
    const [active, setActive] = useState<string | undefined>(undefined);
    const legend = revenueData.map((d, i) => ({
      name: d.source,
      value: d.revenue,
      color: revenueColors[i],
    }));
    return (
      <Card className="sm:mx-auto sm:max-w-lg">
        <CardTitle>Revenue by Source</CardTitle>
        <CardDescription>
          Breakdown of revenue across acquisition channels for Q4 2025.
        </CardDescription>
        <GaugeMulti
          data={revenueData}
          category="source"
          value="revenue"
          colors={revenueColors}
          label="Total Revenue"
          valueFormatter={gbp}
          arcSpan={args.arcSpan}
          strokeWidth={args.strokeWidth}
          showAnimation={args.showAnimation}
          activeName={active}
          className="mt-8"
          onValueChange={(d) =>
            setActive(d ? String(d.source) : undefined)
          }
        />
        <GaugeLegend
          items={legend}
          valueFormatter={gbp}
          showShare
          activeName={active}
          onItemClick={(name) =>
            setActive(active === name ? undefined : name)
          }
          className="mt-2"
        />
      </Card>
    );
  },
};

// ─── 2. Side-by-side: gauge left, legend right ─────────────────

const budgetData = [
  { dept: "Engineering", spend: 280000 },
  { dept: "Marketing", spend: 145000 },
  { dept: "Sales", spend: 98000 },
  { dept: "Operations", spend: 67000 },
  { dept: "HR", spend: 42000 },
];
const budgetColors: Color[] = ["blue", "emerald", "violet", "amber", "pink"];

type BudgetArgs = {
  arcSpan: 180 | 240 | 270;
  strokeWidth: number;
  showAnimation: boolean;
};

export const BudgetSideBySide: StoryObj<BudgetArgs> = {
  name: "Budget allocation (side-by-side)",
  args: {
    arcSpan: 270,
    strokeWidth: 14,
    showAnimation: true,
  },
  argTypes: {
    arcSpan: arcSpanArg,
    strokeWidth: strokeWidthArg,
  },
  parameters: {
    docs: {
      source: {
        code: `import { useState } from "react";
import { GaugeMulti, GaugeLegend } from "tremor-gauge";

const data = [
  { dept: "Engineering", spend: 280000 },
  { dept: "Marketing", spend: 145000 },
  { dept: "Sales", spend: 98000 },
  { dept: "Operations", spend: 67000 },
  { dept: "HR", spend: 42000 },
];
const colors = ["blue", "emerald", "violet", "amber", "pink"];

function BudgetAllocation() {
  const [active, setActive] = useState(undefined);
  const legend = data.map((d, i) => ({ name: d.dept, value: d.spend, color: colors[i] }));
  return (
    <div className="grid grid-cols-2 gap-8">
      <GaugeMulti
        data={data}
        category="dept"
        value="spend"
        colors={colors}
        label="Total Spend"
        valueFormatter={(v) => \`£\${(v / 1000).toFixed(0)}k\`}
        arcSpan={270}
        strokeWidth={14}
        activeName={active}
        onValueChange={(d) => setActive(d ? d.dept : undefined)}
      />
      <GaugeLegend
        items={legend}
        valueFormatter={(v) => \`£\${(v / 1000).toFixed(0)}k\`}
        showShare
        activeName={active}
        onItemClick={(name) => setActive(active === name ? undefined : name)}
      />
    </div>
  );
}`,
      },
    },
  },
  render: (args) => {
    const [active, setActive] = useState<string | undefined>(undefined);
    const legend = budgetData.map((d, i) => ({
      name: d.dept,
      value: d.spend,
      color: budgetColors[i],
    }));
    return (
      <Card className="sm:mx-auto sm:max-w-xl">
        <CardTitle>Budget Allocation</CardTitle>
        <CardDescription>
          Department spending distribution for the current fiscal year.
        </CardDescription>
        <div className="mt-6 grid grid-cols-1 gap-0 sm:grid-cols-2 sm:gap-8">
          <GaugeMulti
            data={budgetData}
            category="dept"
            value="spend"
            colors={budgetColors}
            label="Total Spend"
            valueFormatter={(v) => `£${(v / 1000).toFixed(0)}k`}
            arcSpan={args.arcSpan}
            strokeWidth={args.strokeWidth}
            showAnimation={args.showAnimation}
            activeName={active}
            onValueChange={(d) =>
              setActive(d ? String(d.dept) : undefined)
            }
          />
          <GaugeLegend
            items={legend}
            valueFormatter={(v) => `£${(v / 1000).toFixed(0)}k`}
            showShare
            activeName={active}
            onItemClick={(name) =>
              setActive(active === name ? undefined : name)
            }
            className="self-center"
          />
        </div>
      </Card>
    );
  },
};

// ─── 3. KPI row: three needle gauges with labels ────────────────

type KPIArgs = {
  cpu: number;
  memory: number;
  diskIO: number;
  arcSpan: 180 | 240 | 270;
  strokeWidth: number;
  showNeedle: boolean;
  showAnimation: boolean;
};

export const KPIDashboard: StoryObj<KPIArgs> = {
  name: "KPI dashboard (gauge row)",
  args: {
    cpu: 73,
    memory: 45,
    diskIO: 88,
    arcSpan: 180,
    strokeWidth: 10,
    showNeedle: true,
    showAnimation: true,
  },
  argTypes: {
    cpu: { control: { type: "range", min: 0, max: 100 } },
    memory: { control: { type: "range", min: 0, max: 100 } },
    diskIO: { control: { type: "range", min: 0, max: 100 } },
    arcSpan: arcSpanArg,
    strokeWidth: strokeWidthArg,
  },
  parameters: {
    docs: {
      source: {
        code: `import { GaugeChart } from "tremor-gauge";

<div className="grid grid-cols-3 gap-6">
  <GaugeChart
    value={73}
    color="blue"
    label="Current"
    valueFormatter={(v) => \`\${v}%\`}
    showNeedle
  />
  <GaugeChart
    value={45}
    color="emerald"
    label="Allocated"
    valueFormatter={(v) => \`\${v}%\`}
    showNeedle
  />
  <GaugeChart
    value={88}
    color="amber"
    label="Utilization"
    valueFormatter={(v) => \`\${v}%\`}
    showNeedle
  />
</div>`,
      },
    },
  },
  render: (args) => (
    <div className="mx-auto max-w-4xl">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <Card>
          <CardTitle>CPU Usage</CardTitle>
          <GaugeChart
            value={args.cpu}
            color="blue"
            label="Current"
            valueFormatter={pct}
            showNeedle={args.showNeedle}
            arcSpan={args.arcSpan}
            strokeWidth={args.strokeWidth}
            showAnimation={args.showAnimation}
            className="mt-6"
          />
        </Card>
        <Card>
          <CardTitle>Memory</CardTitle>
          <GaugeChart
            value={args.memory}
            color="emerald"
            label="Allocated"
            valueFormatter={pct}
            showNeedle={args.showNeedle}
            arcSpan={args.arcSpan}
            strokeWidth={args.strokeWidth}
            showAnimation={args.showAnimation}
            className="mt-6"
          />
        </Card>
        <Card>
          <CardTitle>Disk I/O</CardTitle>
          <GaugeChart
            value={args.diskIO}
            color="amber"
            label="Utilization"
            valueFormatter={pct}
            showNeedle={args.showNeedle}
            arcSpan={args.arcSpan}
            strokeWidth={args.strokeWidth}
            showAnimation={args.showAnimation}
            className="mt-6"
          />
        </Card>
      </div>
    </div>
  ),
};

// ─── 4. Threshold gauge with zones ──────────────────────────────

type ServerHealthArgs = {
  value: number;
  arcSpan: 180 | 240 | 270;
  strokeWidth: number;
  showNeedle: boolean;
  showMinMax: boolean;
  showThresholdArc: boolean | "bands" | "ticks";
  showAnimation: boolean;
};

export const ServerHealth: StoryObj<ServerHealthArgs> = {
  name: "Server health (threshold zones + needle)",
  args: {
    value: 72,
    arcSpan: 240,
    strokeWidth: 14,
    showNeedle: true,
    showMinMax: true,
    showThresholdArc: "bands",
    showAnimation: true,
  },
  argTypes: {
    value: { control: { type: "range", min: 0, max: 100 } },
    arcSpan: arcSpanArg,
    strokeWidth: strokeWidthArg,
    showThresholdArc: { control: "select", options: [false, true, "ticks", "bands"] },
  },
  parameters: {
    docs: {
      source: {
        code: `import { GaugeChart } from "tremor-gauge";

<GaugeChart
  value={72}
  showNeedle
  showMinMax
  arcSpan={240}
  strokeWidth={14}
  label="Health Score"
  thresholds={[
    { value: 0, color: "pink" },
    { value: 40, color: "amber" },
    { value: 70, color: "emerald" },
  ]}
  showThresholdArc="bands"
/>`,
      },
    },
  },
  render: (args) => (
    <Card className="sm:mx-auto sm:max-w-sm">
      <CardTitle>Server Health</CardTitle>
      <CardDescription>
        Current health score based on response time, error rate, and uptime.
      </CardDescription>
      <GaugeChart
        value={args.value}
        showNeedle={args.showNeedle}
        showMinMax={args.showMinMax}
        arcSpan={args.arcSpan}
        strokeWidth={args.strokeWidth}
        showAnimation={args.showAnimation}
        label="Health Score"
        thresholds={[
          { value: 0, color: "pink" },
          { value: 40, color: "amber" },
          { value: 70, color: "emerald" },
        ]}
        showThresholdArc={args.showThresholdArc}
        className="mt-8"
      />
      <div className="mt-4 flex items-center justify-center gap-5 text-xs">
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-pink-500" />
          <span className="text-gray-500">Critical &lt;40</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-amber-500" />
          <span className="text-gray-500">Warning 40–70</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-emerald-500" />
          <span className="text-gray-500">Healthy &ge;70</span>
        </span>
      </div>
    </Card>
  ),
};

// ─── 5. Dual gauges side-by-side in one card ────────────────────

type DualArgs = {
  frontend: number;
  backend: number;
  frontendColor: Color;
  backendColor: Color;
  arcSpan: 180 | 240 | 270;
  strokeWidth: number;
  showAnimation: boolean;
};

export const DualGaugeComparison: StoryObj<DualArgs> = {
  name: "Dual gauge comparison",
  args: {
    frontend: 92,
    backend: 78,
    frontendColor: "blue",
    backendColor: "violet",
    arcSpan: 240,
    strokeWidth: 12,
    showAnimation: true,
  },
  argTypes: {
    frontend: { control: { type: "range", min: 0, max: 100 } },
    backend: { control: { type: "range", min: 0, max: 100 } },
    frontendColor: colorArg,
    backendColor: colorArg,
    arcSpan: arcSpanArg,
    strokeWidth: strokeWidthArg,
  },
  parameters: {
    docs: {
      source: {
        code: `import { GaugeChart } from "tremor-gauge";

<div className="grid grid-cols-2 gap-6">
  <GaugeChart
    value={92}
    color="blue"
    label="Frontend"
    valueFormatter={(v) => \`\${v}%\`}
    arcSpan={240}
    strokeWidth={12}
  />
  <GaugeChart
    value={78}
    color="violet"
    label="Backend"
    valueFormatter={(v) => \`\${v}%\`}
    arcSpan={240}
    strokeWidth={12}
  />
</div>`,
      },
    },
  },
  render: (args) => (
    <Card className="sm:mx-auto sm:max-w-xl">
      <CardTitle>Performance Comparison</CardTitle>
      <CardDescription>
        Frontend vs. backend performance scores this month.
      </CardDescription>
      <div className="mt-6 grid grid-cols-2 gap-6">
        <div>
          <GaugeChart
            value={args.frontend}
            color={args.frontendColor}
            label="Frontend"
            valueFormatter={pct}
            strokeWidth={args.strokeWidth}
            arcSpan={args.arcSpan}
            showAnimation={args.showAnimation}
          />
          <div className="mt-2 grid grid-cols-2 gap-2 border-t border-gray-200 pt-2 dark:border-gray-800">
            <div className="text-center">
              <p className="text-[10px] font-medium text-gray-500">LCP</p>
              <p className="text-xs font-semibold tabular-nums text-gray-900 dark:text-gray-50">
                1.2s
              </p>
            </div>
            <div className="text-center">
              <p className="text-[10px] font-medium text-gray-500">CLS</p>
              <p className="text-xs font-semibold tabular-nums text-gray-900 dark:text-gray-50">
                0.04
              </p>
            </div>
          </div>
        </div>
        <div>
          <GaugeChart
            value={args.backend}
            color={args.backendColor}
            label="Backend"
            valueFormatter={pct}
            strokeWidth={args.strokeWidth}
            arcSpan={args.arcSpan}
            showAnimation={args.showAnimation}
          />
          <div className="mt-2 grid grid-cols-2 gap-2 border-t border-gray-200 pt-2 dark:border-gray-800">
            <div className="text-center">
              <p className="text-[10px] font-medium text-gray-500">P95</p>
              <p className="text-xs font-semibold tabular-nums text-gray-900 dark:text-gray-50">
                320ms
              </p>
            </div>
            <div className="text-center">
              <p className="text-[10px] font-medium text-gray-500">Err%</p>
              <p className="text-xs font-semibold tabular-nums text-gray-900 dark:text-gray-50">
                0.3%
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  ),
};

// ─── 6. Gradient gauge with performance score + stats ───────────

type PerfArgs = {
  value: number;
  arcSpan: 180 | 240 | 270;
  strokeWidth: number;
  showMinMax: boolean;
  gradientFrom: Color;
  gradientTo: Color;
  showAnimation: boolean;
};

export const PerformanceScore: StoryObj<PerfArgs> = {
  name: "Performance score (gradient + stats)",
  args: {
    value: 92,
    arcSpan: 240,
    strokeWidth: 14,
    showMinMax: true,
    gradientFrom: "cyan",
    gradientTo: "blue",
    showAnimation: true,
  },
  argTypes: {
    value: { control: { type: "range", min: 0, max: 100 } },
    arcSpan: arcSpanArg,
    strokeWidth: strokeWidthArg,
    gradientFrom: colorArg,
    gradientTo: colorArg,
  },
  parameters: {
    docs: {
      source: {
        code: `import { GaugeChart } from "tremor-gauge";

<GaugeChart
  value={92}
  gradient={{ from: "cyan", to: "blue" }}
  label="Excellent"
  showMinMax
  arcSpan={240}
  strokeWidth={14}
  valueFormatter={(v) => \`\${v}%\`}
/>`,
      },
    },
  },
  render: (args) => (
    <Card className="sm:mx-auto sm:max-w-sm">
      <CardTitle>Performance Score</CardTitle>
      <CardDescription>
        Overall application performance based on Core Web Vitals.
      </CardDescription>
      <GaugeChart
        value={args.value}
        gradient={{ from: args.gradientFrom, to: args.gradientTo }}
        label="Excellent"
        showMinMax={args.showMinMax}
        arcSpan={args.arcSpan}
        strokeWidth={args.strokeWidth}
        showAnimation={args.showAnimation}
        valueFormatter={pct}
        className="mt-8"
      />
      <div className="mt-4 grid grid-cols-3 gap-4 border-t border-gray-200 pt-4 dark:border-gray-800">
        {[
          { label: "LCP", value: "1.2s" },
          { label: "FID", value: "18ms" },
          { label: "CLS", value: "0.04" },
        ].map((metric) => (
          <div key={metric.label} className="text-center">
            <p className="text-xs font-medium text-gray-500">
              {metric.label}
            </p>
            <p className="mt-0.5 text-sm font-semibold tabular-nums text-gray-900 dark:text-gray-50">
              {metric.value}
            </p>
          </div>
        ))}
      </div>
    </Card>
  ),
};

// ─── 7. Gauge + legend + single gauge in a dashboard row ────────

const trafficData = [
  { channel: "Organic", sessions: 12400 },
  { channel: "Paid", sessions: 8200 },
  { channel: "Social", sessions: 4100 },
  { channel: "Direct", sessions: 6800 },
];
const trafficColors: Color[] = ["emerald", "blue", "pink", "amber"];

type DashboardRowArgs = {
  bounceRate: number;
  arcSpan: 180 | 240 | 270;
  strokeWidth: number;
  showNeedle: boolean;
  showThresholdArc: boolean | "bands" | "ticks";
  showAnimation: boolean;
};

export const DashboardRow: StoryObj<DashboardRowArgs> = {
  name: "Dashboard row (multi-gauge + threshold)",
  args: {
    bounceRate: 34,
    arcSpan: 240,
    strokeWidth: 12,
    showNeedle: true,
    showThresholdArc: true,
    showAnimation: true,
  },
  argTypes: {
    bounceRate: { control: { type: "range", min: 0, max: 100 } },
    arcSpan: arcSpanArg,
    strokeWidth: strokeWidthArg,
    showThresholdArc: { control: "select", options: [false, true, "ticks", "bands"] },
  },
  parameters: {
    docs: {
      source: {
        code: `import { useState } from "react";
import { GaugeChart, GaugeMulti, GaugeLegend } from "tremor-gauge";

const trafficData = [
  { channel: "Organic", sessions: 12400 },
  { channel: "Paid", sessions: 8200 },
  { channel: "Social", sessions: 4100 },
  { channel: "Direct", sessions: 6800 },
];
const colors = ["emerald", "blue", "pink", "amber"];

function DashboardRow() {
  const [active, setActive] = useState(undefined);
  const legend = trafficData.map((d, i) => ({ name: d.channel, value: d.sessions, color: colors[i] }));
  return (
    <div className="grid grid-cols-5 gap-6">
      <div className="col-span-3">
        <GaugeMulti
          data={trafficData}
          category="channel"
          value="sessions"
          colors={colors}
          label="Total Sessions"
          valueFormatter={(v) => (v >= 1000 ? \`\${(v / 1000).toFixed(1)}k\` : \`\${v}\`)}
          activeName={active}
          onValueChange={(d) => setActive(d ? d.channel : undefined)}
        />
        <GaugeLegend
          items={legend}
          valueFormatter={(v) => v.toLocaleString()}
          showShare
          activeName={active}
          onItemClick={(name) => setActive(active === name ? undefined : name)}
        />
      </div>
      <div className="col-span-2">
        <GaugeChart
          value={34}
          showNeedle
          arcSpan={240}
          strokeWidth={12}
          label="Current"
          valueFormatter={(v) => \`\${v}%\`}
          thresholds={[
            { value: 0, color: "emerald" },
            { value: 35, color: "amber" },
            { value: 60, color: "pink" },
          ]}
          showThresholdArc
        />
      </div>
    </div>
  );
}`,
      },
    },
  },
  render: (args) => {
    const [active, setActive] = useState<string | undefined>(undefined);
    const legend = trafficData.map((d, i) => ({
      name: d.channel,
      value: d.sessions,
      color: trafficColors[i],
    }));
    return (
      <div className="mx-auto max-w-4xl">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          <Card className="lg:col-span-3">
            <CardTitle>Traffic Sources</CardTitle>
            <CardDescription>
              Session distribution by acquisition channel.
            </CardDescription>
            <div className="mt-6 grid grid-cols-1 gap-0 sm:grid-cols-2 sm:gap-6">
              <GaugeMulti
                data={trafficData}
                category="channel"
                value="sessions"
                colors={trafficColors}
                label="Total Sessions"
                valueFormatter={compact}
                strokeWidth={args.strokeWidth}
                showAnimation={args.showAnimation}
                activeName={active}
                onValueChange={(d) =>
                  setActive(d ? String(d.channel) : undefined)
                }
              />
              <GaugeLegend
                items={legend}
                valueFormatter={(v) => v.toLocaleString()}
                showShare
                activeName={active}
                onItemClick={(name) =>
                  setActive(active === name ? undefined : name)
                }
                className="self-center"
              />
            </div>
          </Card>

          <Card className="lg:col-span-2">
            <CardTitle>Bounce Rate</CardTitle>
            <CardDescription>
              Lower is better. Threshold zones indicate severity.
            </CardDescription>
            <GaugeChart
              value={args.bounceRate}
              showNeedle={args.showNeedle}
              arcSpan={args.arcSpan}
              strokeWidth={args.strokeWidth}
              showAnimation={args.showAnimation}
              label="Current"
              valueFormatter={pct}
              thresholds={[
                { value: 0, color: "emerald" },
                { value: 35, color: "amber" },
                { value: 60, color: "pink" },
              ]}
              showThresholdArc={args.showThresholdArc}
              className="mt-6"
            />
          </Card>
        </div>
      </div>
    );
  },
};

// ─── 8. Temperature gauge (needle + min/max + zones) ────────────

type TempArgs = {
  value: number;
  min: number;
  max: number;
  arcSpan: 180 | 240 | 270;
  strokeWidth: number;
  showNeedle: boolean;
  showMinMax: boolean;
  showThresholdArc: boolean | "bands" | "ticks";
  showAnimation: boolean;
};

export const TemperatureGauge: StoryObj<TempArgs> = {
  name: "Temperature gauge (zones + needle)",
  args: {
    value: 67,
    min: 20,
    max: 100,
    arcSpan: 270,
    strokeWidth: 12,
    showNeedle: true,
    showMinMax: true,
    showThresholdArc: true,
    showAnimation: true,
  },
  argTypes: {
    value: { control: { type: "range", min: 0, max: 120 } },
    min: { control: { type: "number" } },
    max: { control: { type: "number" } },
    arcSpan: arcSpanArg,
    strokeWidth: strokeWidthArg,
    showThresholdArc: { control: "select", options: [false, true, "ticks", "bands"] },
  },
  parameters: {
    docs: {
      source: {
        code: `import { GaugeChart } from "tremor-gauge";

<GaugeChart
  value={67}
  min={20}
  max={100}
  showNeedle
  showMinMax
  arcSpan={270}
  strokeWidth={12}
  label="°C"
  thresholds={[
    { value: 20, color: "emerald" },
    { value: 70, color: "amber" },
    { value: 85, color: "pink" },
  ]}
  showThresholdArc
/>`,
      },
    },
  },
  render: (args) => (
    <Card className="sm:mx-auto sm:max-w-xs">
      <CardTitle>Server Temperature</CardTitle>
      <CardDescription>Current CPU core temperature reading.</CardDescription>
      <GaugeChart
        value={args.value}
        min={args.min}
        max={args.max}
        showNeedle={args.showNeedle}
        showMinMax={args.showMinMax}
        arcSpan={args.arcSpan}
        strokeWidth={args.strokeWidth}
        showAnimation={args.showAnimation}
        label="°C"
        thresholds={[
          { value: 20, color: "emerald" },
          { value: 70, color: "amber" },
          { value: 85, color: "pink" },
        ]}
        showThresholdArc={args.showThresholdArc}
        className="mt-6"
      />
      <div className="mt-3 flex items-center justify-center gap-4 text-xs">
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-emerald-500" />
          <span className="text-gray-500">Normal &lt;70°C</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-amber-500" />
          <span className="text-gray-500">Warning &lt;85°C</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-pink-500" />
          <span className="text-gray-500">Critical &ge;85°C</span>
        </span>
      </div>
    </Card>
  ),
};

// ─── 9. Compact grid: four gauges + legends beneath each ────────

type GridArgs = {
  uptime: number;
  latency: number;
  errorRate: number;
  throughput: number;
  strokeWidth: number;
  showAnimation: boolean;
};

export const CompactHealthGrid: StoryObj<GridArgs> = {
  name: "Service health (compact grid)",
  args: {
    uptime: 99.9,
    latency: 42,
    errorRate: 0.3,
    throughput: 84,
    strokeWidth: 8,
    showAnimation: true,
  },
  argTypes: {
    uptime: { control: { type: "range", min: 0, max: 100, step: 0.1 } },
    latency: { control: { type: "range", min: 0, max: 200 } },
    errorRate: { control: { type: "range", min: 0, max: 5, step: 0.1 } },
    throughput: { control: { type: "range", min: 0, max: 100 } },
    strokeWidth: strokeWidthArg,
  },
  parameters: {
    docs: {
      source: {
        code: `import { GaugeChart } from "tremor-gauge";

const metrics = [
  { name: "Uptime", value: 99.9, max: 100, color: "emerald", fmt: (v) => \`\${v}%\` },
  { name: "Latency", value: 42, max: 200, color: "blue", fmt: (v) => \`\${v}ms\` },
  { name: "Error Rate", value: 0.3, max: 5, color: "amber", fmt: (v) => \`\${v}%\` },
  { name: "Throughput", value: 84, max: 100, color: "violet", fmt: (v) => \`\${v}%\` },
];

<div className="grid grid-cols-2 gap-6">
  {metrics.map((m) => (
    <GaugeChart
      key={m.name}
      value={m.value}
      max={m.max}
      color={m.color}
      showLabel
      valueFormatter={m.fmt}
      strokeWidth={8}
    />
  ))}
</div>`,
      },
    },
  },
  render: (args) => {
    const metrics = [
      { name: "Uptime", value: args.uptime, max: 100, color: "emerald" as Color, fmt: (v: number) => `${v}%` },
      { name: "Latency", value: args.latency, max: 200, color: "blue" as Color, fmt: (v: number) => `${v}ms` },
      { name: "Error Rate", value: args.errorRate, max: 5, color: "amber" as Color, fmt: (v: number) => `${v}%` },
      { name: "Throughput", value: args.throughput, max: 100, color: "violet" as Color, fmt: (v: number) => `${v}%` },
    ];
    return (
      <Card className="sm:mx-auto sm:max-w-lg">
        <CardTitle>Service Health</CardTitle>
        <CardDescription>
          Real-time monitoring across key infrastructure metrics.
        </CardDescription>
        <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4">
          {metrics.map((m) => (
            <div key={m.name} className="text-center">
              <GaugeChart
                value={m.value}
                max={m.max}
                color={m.color}
                showLabel
                valueFormatter={m.fmt}
                strokeWidth={args.strokeWidth}
                showAnimation={args.showAnimation}
                className="mx-auto w-28"
              />
              <p className="mt-1 text-xs font-medium text-gray-700 dark:text-gray-300">
                {m.name}
              </p>
            </div>
          ))}
        </div>
      </Card>
    );
  },
};

// ─── 10. Users by region: custom tooltip + legend ───────────────

type RegionArgs = {
  arcSpan: 180 | 240 | 270;
  strokeWidth: number;
  showAnimation: boolean;
};

export const UsersByRegion: StoryObj<RegionArgs> = {
  name: "Users by region (custom tooltip + legend)",
  args: {
    arcSpan: 240,
    strokeWidth: 16,
    showAnimation: true,
  },
  argTypes: {
    arcSpan: arcSpanArg,
    strokeWidth: strokeWidthArg,
  },
  parameters: {
    docs: {
      source: {
        code: `import { useState } from "react";
import { GaugeMulti, GaugeLegend } from "tremor-gauge";

const data = [
  { region: "North America", users: 48200 },
  { region: "Europe", users: 31500 },
  { region: "Asia Pacific", users: 22800 },
  { region: "Latin America", users: 8900 },
];
const colors = ["blue", "violet", "cyan", "pink"];

function UsersByRegion() {
  const [selected, setSelected] = useState(undefined);
  return (
    <>
      <GaugeMulti
        data={data}
        category="region"
        value="users"
        colors={colors}
        label="Total Users"
        valueFormatter={(v) => (v >= 1000 ? \`\${(v / 1000).toFixed(1)}k\` : \`\${v}\`)}
        arcSpan={240}
        strokeWidth={16}
        customTooltip={({ datum }) => (
          <div>
            <span>{datum.region}</span>
            <span>{Number(datum.users).toLocaleString()} users</span>
          </div>
        )}
        activeName={selected}
        onValueChange={(d) => setSelected(d ? d.region : undefined)}
      />
      <GaugeLegend
        items={data.map((d, i) => ({ name: d.region, value: d.users, color: colors[i] }))}
        valueFormatter={(v) => v.toLocaleString()}
        showShare
        activeName={selected}
        onItemClick={(name) => setSelected(selected === name ? undefined : name)}
      />
    </>
  );
}`,
      },
    },
  },
  render: (args) => {
    const data = [
      { region: "North America", users: 48200 },
      { region: "Europe", users: 31500 },
      { region: "Asia Pacific", users: 22800 },
      { region: "Latin America", users: 8900 },
    ];
    const colors: Color[] = ["blue", "violet", "cyan", "pink"];
    const [selected, setSelected] = useState<string | undefined>(undefined);

    return (
      <Card className="sm:mx-auto sm:max-w-lg">
        <CardTitle>Active Users by Region</CardTitle>
        <CardDescription>
          Distribution of monthly active users across global regions.
        </CardDescription>
        <GaugeMulti
          data={data}
          category="region"
          value="users"
          colors={colors}
          label="Total Users"
          valueFormatter={compact}
          arcSpan={args.arcSpan}
          strokeWidth={args.strokeWidth}
          showAnimation={args.showAnimation}
          className="mt-8"
          customTooltip={({ datum }) => (
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-gray-500">
                {String(datum.region)}
              </span>
              <span className="text-sm font-semibold tabular-nums text-gray-900 dark:text-gray-50">
                {Number(datum.users).toLocaleString()} users
              </span>
            </div>
          )}
          activeName={selected}
          onValueChange={(d) =>
            setSelected(d ? String(d.region) : undefined)
          }
        />
        <GaugeLegend
          items={data.map((d, i) => ({
            name: d.region,
            value: d.users,
            color: colors[i],
          }))}
          valueFormatter={(v) => v.toLocaleString()}
          showShare
          activeName={selected}
          onItemClick={(name) =>
            setSelected(selected === name ? undefined : name)
          }
          className="mt-2"
        />
      </Card>
    );
  },
};

// ─── 11. System overview: multi-gauge row with status ───────────

type SystemArgs = {
  apiGateway: number;
  database: number;
  cacheLayer: number;
  cdn: number;
  strokeWidth: number;
  showAnimation: boolean;
};

export const SystemOverview: StoryObj<SystemArgs> = {
  name: "System overview (multi-gauge row)",
  args: {
    apiGateway: 98,
    database: 94,
    cacheLayer: 100,
    cdn: 87,
    strokeWidth: 8,
    showAnimation: true,
  },
  argTypes: {
    apiGateway: { control: { type: "range", min: 0, max: 100 } },
    database: { control: { type: "range", min: 0, max: 100 } },
    cacheLayer: { control: { type: "range", min: 0, max: 100 } },
    cdn: { control: { type: "range", min: 0, max: 100 } },
    strokeWidth: strokeWidthArg,
  },
  parameters: {
    docs: {
      source: {
        code: `import { GaugeChart } from "tremor-gauge";

const items = [
  { name: "API Gateway", health: 98, color: "emerald" },
  { name: "Database", health: 94, color: "blue" },
  { name: "Cache Layer", health: 100, color: "violet" },
  { name: "CDN", health: 87, color: "amber" },
];

<div className="flex items-end justify-center gap-8">
  {items.map((s) => (
    <GaugeChart
      key={s.name}
      value={s.health}
      color={s.color}
      showLabel
      valueFormatter={(v) => \`\${v}%\`}
      strokeWidth={8}
    />
  ))}
</div>`,
      },
    },
  },
  render: (args) => {
    const items = [
      { name: "API Gateway", health: args.apiGateway, color: "emerald" as Color },
      { name: "Database", health: args.database, color: "blue" as Color },
      { name: "Cache Layer", health: args.cacheLayer, color: "violet" as Color },
      { name: "CDN", health: args.cdn, color: "amber" as Color },
    ];
    return (
      <Card className="sm:mx-auto sm:max-w-3xl">
        <CardTitle>System Overview</CardTitle>
        <CardDescription>
          Health scores across core infrastructure components.
        </CardDescription>
        <div className="mt-8 flex flex-1 items-end justify-center gap-8">
          {items.map((s) => (
            <div key={s.name} className="text-center">
              <GaugeChart
                value={s.health}
                color={s.color}
                showLabel
                valueFormatter={pct}
                strokeWidth={args.strokeWidth}
                showAnimation={args.showAnimation}
                className="w-28"
              />
              <p className="mt-1 text-xs font-medium text-gray-700 dark:text-gray-300">
                {s.name}
              </p>
            </div>
          ))}
        </div>
      </Card>
    );
  },
};

// ─── 12. Single gauge + legend next to it (flex row) ────────────

type PipelineArgs = {
  completed: number;
  inProgress: number;
  failed: number;
  color: Color;
  strokeWidth: number;
  showAnimation: boolean;
};

export const GaugeWithLegendRow: StoryObj<PipelineArgs> = {
  name: "Single gauge + legend (flex row)",
  args: {
    completed: 68,
    inProgress: 22,
    failed: 10,
    color: "emerald",
    strokeWidth: 12,
    showAnimation: true,
  },
  argTypes: {
    completed: { control: { type: "range", min: 0, max: 100 } },
    inProgress: { control: { type: "range", min: 0, max: 100 } },
    failed: { control: { type: "range", min: 0, max: 100 } },
    color: colorArg,
    strokeWidth: strokeWidthArg,
  },
  parameters: {
    docs: {
      source: {
        code: `import { useState } from "react";
import { GaugeChart, GaugeLegend } from "tremor-gauge";

const items = [
  { name: "Completed", value: 68, color: "emerald" },
  { name: "In Progress", value: 22, color: "blue" },
  { name: "Failed", value: 10, color: "pink" },
];

function PipelineStatus() {
  const [active, setActive] = useState(undefined);
  return (
    <div className="flex items-center gap-6">
      <GaugeChart
        value={68}
        color="emerald"
        label="Completed"
        valueFormatter={(v) => \`\${v}%\`}
        strokeWidth={12}
      />
      <GaugeLegend
        items={items}
        valueFormatter={(v) => \`\${v}%\`}
        showShare
        activeName={active}
        onItemClick={(name) => setActive(active === name ? undefined : name)}
      />
    </div>
  );
}`,
      },
    },
  },
  render: (args) => {
    const items = [
      { name: "Completed", value: args.completed, color: "emerald" as Color },
      { name: "In Progress", value: args.inProgress, color: "blue" as Color },
      { name: "Failed", value: args.failed, color: "pink" as Color },
    ];
    const [active, setActive] = useState<string | undefined>(undefined);

    return (
      <Card className="sm:mx-auto sm:max-w-lg">
        <CardTitle>Pipeline Status</CardTitle>
        <CardDescription>
          Deployment pipeline completion breakdown.
        </CardDescription>
        <div className="mt-6 flex items-center gap-6">
          <GaugeChart
            value={args.completed}
            color={args.color}
            label="Completed"
            valueFormatter={pct}
            strokeWidth={args.strokeWidth}
            showAnimation={args.showAnimation}
            className="w-40 shrink-0"
          />
          <GaugeLegend
            items={items}
            valueFormatter={pct}
            showShare
            activeName={active}
            onItemClick={(name) =>
              setActive(active === name ? undefined : name)
            }
            className="flex-1"
          />
        </div>
      </Card>
    );
  },
};

// ─── 13. Two threshold gauges side-by-side ──────────────────────

type DualTempArgs = {
  cpuTemp: number;
  gpuTemp: number;
  min: number;
  max: number;
  arcSpan: 180 | 240 | 270;
  strokeWidth: number;
  showNeedle: boolean;
  showThresholdArc: boolean | "bands" | "ticks";
  showAnimation: boolean;
};

export const DualThresholdGauges: StoryObj<DualTempArgs> = {
  name: "Dual threshold gauges (CPU + GPU)",
  args: {
    cpuTemp: 62,
    gpuTemp: 78,
    min: 20,
    max: 100,
    arcSpan: 240,
    strokeWidth: 12,
    showNeedle: true,
    showThresholdArc: true,
    showAnimation: true,
  },
  argTypes: {
    cpuTemp: { control: { type: "range", min: 0, max: 120 } },
    gpuTemp: { control: { type: "range", min: 0, max: 120 } },
    min: { control: { type: "number" } },
    max: { control: { type: "number" } },
    arcSpan: arcSpanArg,
    strokeWidth: strokeWidthArg,
    showThresholdArc: { control: "select", options: [false, true, "ticks", "bands"] },
  },
  parameters: {
    docs: {
      source: {
        code: `import { GaugeChart } from "tremor-gauge";

const thresholds = [
  { value: 20, color: "emerald" },
  { value: 65, color: "amber" },
  { value: 85, color: "pink" },
];

<div className="grid grid-cols-2 gap-6">
  <GaugeChart
    value={62}
    min={20}
    max={100}
    showNeedle
    arcSpan={240}
    strokeWidth={12}
    label="°C"
    thresholds={thresholds}
    showThresholdArc
  />
  <GaugeChart
    value={78}
    min={20}
    max={100}
    showNeedle
    arcSpan={240}
    strokeWidth={12}
    label="°C"
    thresholds={thresholds}
    showThresholdArc
  />
</div>`,
      },
    },
  },
  render: (args) => (
    <div className="mx-auto max-w-2xl">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Card>
          <CardTitle>CPU Temperature</CardTitle>
          <CardDescription>Sensor 1 — Primary core</CardDescription>
          <GaugeChart
            value={args.cpuTemp}
            min={args.min}
            max={args.max}
            showNeedle={args.showNeedle}
            arcSpan={args.arcSpan}
            strokeWidth={args.strokeWidth}
            showAnimation={args.showAnimation}
            label="°C"
            thresholds={[
              { value: 20, color: "emerald" },
              { value: 65, color: "amber" },
              { value: 85, color: "pink" },
            ]}
            showThresholdArc={args.showThresholdArc}
            className="mt-6"
          />
        </Card>
        <Card>
          <CardTitle>GPU Temperature</CardTitle>
          <CardDescription>Sensor 2 — Graphics processor</CardDescription>
          <GaugeChart
            value={args.gpuTemp}
            min={args.min}
            max={args.max}
            showNeedle={args.showNeedle}
            arcSpan={args.arcSpan}
            strokeWidth={args.strokeWidth}
            showAnimation={args.showAnimation}
            label="°C"
            thresholds={[
              { value: 20, color: "emerald" },
              { value: 65, color: "amber" },
              { value: 85, color: "pink" },
            ]}
            showThresholdArc={args.showThresholdArc}
            className="mt-6"
          />
        </Card>
      </div>
    </div>
  ),
};

// ─── 14. Multi-gauge with marker + gauge + unified legend ───────

const salesData = [
  { team: "Enterprise", closed: 3200000 },
  { team: "Mid-Market", closed: 1800000 },
  { team: "SMB", closed: 950000 },
];
const salesColors: Color[] = ["blue", "violet", "cyan"];

type SalesArgs = {
  target: number;
  strokeWidth: number;
  showAnimation: boolean;
};

export const SalesWithTarget: StoryObj<SalesArgs> = {
  name: "Sales attainment (multi-gauge + marker + legend)",
  args: {
    target: 7000000,
    strokeWidth: 14,
    showAnimation: true,
  },
  argTypes: {
    target: { control: { type: "range", min: 3000000, max: 12000000, step: 500000 } },
    strokeWidth: strokeWidthArg,
  },
  parameters: {
    docs: {
      source: {
        code: `import { useState } from "react";
import { GaugeMulti, GaugeLegend } from "tremor-gauge";

const data = [
  { team: "Enterprise", closed: 3200000 },
  { team: "Mid-Market", closed: 1800000 },
  { team: "SMB", closed: 950000 },
];
const colors = ["blue", "violet", "cyan"];

function SalesAttainment() {
  const [active, setActive] = useState(undefined);
  const legend = data.map((d, i) => ({ name: d.team, value: d.closed, color: colors[i] }));
  return (
    <div className="grid grid-cols-2 gap-6">
      <GaugeMulti
        data={data}
        category="team"
        value="closed"
        colors={colors}
        label="Total Closed"
        valueFormatter={(v) => \`£\${(v / 1e6).toFixed(1)}M\`}
        marker={{ value: 7000000 }}
        strokeWidth={14}
        activeName={active}
        onValueChange={(d) => setActive(d ? d.team : undefined)}
      />
      <GaugeLegend
        items={legend}
        valueFormatter={(v) => \`£\${(v / 1e6).toFixed(1)}M\`}
        showShare
        activeName={active}
        onItemClick={(name) => setActive(active === name ? undefined : name)}
      />
    </div>
  );
}`,
      },
    },
  },
  render: (args) => {
    const [active, setActive] = useState<string | undefined>(undefined);
    const legend = salesData.map((d, i) => ({
      name: d.team,
      value: d.closed,
      color: salesColors[i],
    }));
    const total = salesData.reduce((s, d) => s + d.closed, 0);
    const attainment = Math.round((total / args.target) * 100);

    return (
      <Card className="sm:mx-auto sm:max-w-xl">
        <CardTitle>Sales Attainment</CardTitle>
        <CardDescription>
          Revenue closed by team vs. quarterly target of £{(args.target / 1e6).toFixed(0)}M.
        </CardDescription>
        <div className="mt-6 grid grid-cols-1 gap-0 sm:grid-cols-2 sm:gap-6">
          <div>
            <GaugeMulti
              data={salesData}
              category="team"
              value="closed"
              colors={salesColors}
              label="Total Closed"
              valueFormatter={(v) => `£${(v / 1e6).toFixed(1)}M`}
              marker={{ value: args.target }}
              strokeWidth={args.strokeWidth}
              showAnimation={args.showAnimation}
              activeName={active}
              onValueChange={(d) =>
                setActive(d ? String(d.team) : undefined)
              }
            />
            <p className="mt-1 text-center text-xs text-gray-500">
              Marker = £{(args.target / 1e6).toFixed(0)}M target
            </p>
          </div>
          <div className="flex flex-col justify-between">
            <GaugeLegend
              items={legend}
              valueFormatter={(v) => `£${(v / 1e6).toFixed(1)}M`}
              showShare
              activeName={active}
              onItemClick={(name) =>
                setActive(active === name ? undefined : name)
              }
            />
            <div className="mt-4 rounded-md bg-gray-50 px-3 py-2 dark:bg-gray-900">
              <p className="text-xs text-gray-500">Attainment</p>
              <p className="text-lg font-semibold tabular-nums text-gray-900 dark:text-gray-50">
                {attainment}%
              </p>
            </div>
          </div>
        </div>
      </Card>
    );
  },
};

// ─── 15. Gradient gauges row ────────────────────────────────────

type NetArgs = {
  upload: number;
  download: number;
  latency: number;
  strokeWidth: number;
  showAnimation: boolean;
};

export const GradientGaugesRow: StoryObj<NetArgs> = {
  name: "Gradient gauges row (network stats)",
  args: {
    upload: 78,
    download: 92,
    latency: 23,
    strokeWidth: 14,
    showAnimation: true,
  },
  argTypes: {
    upload: { control: { type: "range", min: 0, max: 100 } },
    download: { control: { type: "range", min: 0, max: 100 } },
    latency: { control: { type: "range", min: 0, max: 100 } },
    strokeWidth: strokeWidthArg,
  },
  parameters: {
    docs: {
      source: {
        code: `import { GaugeChart } from "tremor-gauge";

<div className="grid grid-cols-3 gap-6">
  <GaugeChart
    value={78}
    gradient={{ from: "cyan", to: "blue" }}
    label="Mbps"
    strokeWidth={14}
  />
  <GaugeChart
    value={92}
    gradient={{ from: "emerald", to: "cyan" }}
    label="Mbps"
    strokeWidth={14}
  />
  <GaugeChart
    value={23}
    gradient={{ from: "violet", to: "pink" }}
    label="ms"
    strokeWidth={14}
  />
</div>`,
      },
    },
  },
  render: (args) => (
    <div className="mx-auto max-w-4xl">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <Card>
          <CardTitle>Upload Speed</CardTitle>
          <GaugeChart
            value={args.upload}
            gradient={{ from: "cyan", to: "blue" }}
            label="Mbps"
            strokeWidth={args.strokeWidth}
            showAnimation={args.showAnimation}
            className="mt-6"
          />
        </Card>
        <Card>
          <CardTitle>Download Speed</CardTitle>
          <GaugeChart
            value={args.download}
            gradient={{ from: "emerald", to: "cyan" }}
            label="Mbps"
            strokeWidth={args.strokeWidth}
            showAnimation={args.showAnimation}
            className="mt-6"
          />
        </Card>
        <Card>
          <CardTitle>Latency</CardTitle>
          <GaugeChart
            value={args.latency}
            gradient={{ from: "violet", to: "pink" }}
            label="ms"
            strokeWidth={args.strokeWidth}
            showAnimation={args.showAnimation}
            className="mt-6"
          />
        </Card>
      </div>
    </div>
  ),
};

// ─── 16. Full dashboard card: gauge + multi-gauge + legend ──────

type FullArgs = {
  portfolioReturn: number;
  arcSpan: 180 | 240 | 270;
  strokeWidth: number;
  showNeedle: boolean;
  showMinMax: boolean;
  showAnimation: boolean;
};

export const FullDashboard: StoryObj<FullArgs> = {
  name: "Full dashboard (gauge + multi-gauge + legend)",
  args: {
    portfolioReturn: 14.2,
    arcSpan: 240,
    strokeWidth: 12,
    showNeedle: true,
    showMinMax: true,
    showAnimation: true,
  },
  argTypes: {
    portfolioReturn: { control: { type: "range", min: -20, max: 30, step: 0.1 } },
    arcSpan: arcSpanArg,
    strokeWidth: strokeWidthArg,
  },
  parameters: {
    docs: {
      source: {
        code: `import { useState } from "react";
import { GaugeChart, GaugeMulti, GaugeLegend } from "tremor-gauge";

const allocData = [
  { asset: "Equities", amount: 42000 },
  { asset: "Bonds", amount: 28000 },
  { asset: "Real Estate", amount: 18000 },
  { asset: "Cash", amount: 12000 },
];
const colors = ["blue", "emerald", "violet", "amber"];
const gbp = (v) =>
  v.toLocaleString("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 });

function PortfolioDashboard() {
  const [active, setActive] = useState(undefined);
  const legend = allocData.map((d, i) => ({ name: d.asset, value: d.amount, color: colors[i] }));
  return (
    <div className="grid grid-cols-3 gap-6">
      <GaugeChart
        value={14.2}
        min={-20}
        max={30}
        color="emerald"
        label="YTD Return"
        showNeedle
        showMinMax
        arcSpan={240}
        strokeWidth={12}
        valueFormatter={(v) => \`\${v > 0 ? "+" : ""}\${v}%\`}
      />
      <div className="col-span-2 grid grid-cols-2 gap-6">
        <GaugeMulti
          data={allocData}
          category="asset"
          value="amount"
          colors={colors}
          label="Total Value"
          valueFormatter={gbp}
          strokeWidth={12}
          activeName={active}
          onValueChange={(d) => setActive(d ? d.asset : undefined)}
        />
        <GaugeLegend
          items={legend}
          valueFormatter={gbp}
          showShare
          activeName={active}
          onItemClick={(name) => setActive(active === name ? undefined : name)}
        />
      </div>
    </div>
  );
}`,
      },
    },
  },
  render: (args) => {
    const [active, setActive] = useState<string | undefined>(undefined);

    const allocData = [
      { asset: "Equities", amount: 42000 },
      { asset: "Bonds", amount: 28000 },
      { asset: "Real Estate", amount: 18000 },
      { asset: "Cash", amount: 12000 },
    ];
    const allocColors: Color[] = ["blue", "emerald", "violet", "amber"];
    const allocLegend = allocData.map((d, i) => ({
      name: d.asset,
      value: d.amount,
      color: allocColors[i],
    }));

    return (
      <div className="mx-auto max-w-4xl">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card>
            <CardTitle>Portfolio Return</CardTitle>
            <CardDescription>Year-to-date performance</CardDescription>
            <GaugeChart
              value={args.portfolioReturn}
              min={-20}
              max={30}
              color="emerald"
              label="YTD Return"
              showNeedle={args.showNeedle}
              showMinMax={args.showMinMax}
              arcSpan={args.arcSpan}
              strokeWidth={args.strokeWidth}
              showAnimation={args.showAnimation}
              valueFormatter={(v) => `${v > 0 ? "+" : ""}${v}%`}
              className="mt-6"
            />
          </Card>

          <Card className="lg:col-span-2">
            <CardTitle>Asset Allocation</CardTitle>
            <CardDescription>
              Portfolio distribution across asset classes.
            </CardDescription>
            <div className="mt-6 grid grid-cols-1 gap-0 sm:grid-cols-2 sm:gap-6">
              <GaugeMulti
                data={allocData}
                category="asset"
                value="amount"
                colors={allocColors}
                label="Total Value"
                valueFormatter={gbp}
                strokeWidth={args.strokeWidth}
                showAnimation={args.showAnimation}
                activeName={active}
                onValueChange={(d) =>
                  setActive(d ? String(d.asset) : undefined)
                }
              />
              <GaugeLegend
                items={allocLegend}
                valueFormatter={gbp}
                showShare
                activeName={active}
                onItemClick={(name) =>
                  setActive(active === name ? undefined : name)
                }
                className="self-center"
              />
            </div>
          </Card>
        </div>
      </div>
    );
  },
};
