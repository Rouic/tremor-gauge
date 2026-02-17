import type { Meta } from "@storybook/react";
import { useState } from "react";
import { GaugeChart } from "../components/GaugeChart/GaugeChart";
import { GaugeMulti } from "../components/GaugeMulti/GaugeMulti";
import { GaugeLegend } from "../components/GaugeLegend/GaugeLegend";
import type { Color } from "../utils/chartColors";

const meta: Meta = {
  title: "Examples",
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

// ─── 1. Revenue gauge + legend (chart above, legend below) ──────

const revenueData = [
  { source: "Direct", revenue: 4520 },
  { source: "Organic Search", revenue: 2890 },
  { source: "Referral", revenue: 1340 },
  { source: "Social Media", revenue: 780 },
];
const revenueColors: Color[] = ["blue", "cyan", "violet", "amber"];
const revenueLegend = revenueData.map((d, i) => ({
  name: d.source,
  value: d.revenue,
  color: revenueColors[i],
}));

export const RevenueBreakdown = () => {
  const [active, setActive] = useState<string | undefined>(undefined);
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
        className="mt-8"
        onValueChange={(d) =>
          setActive(d ? String(d.source) : undefined)
        }
      />
      <GaugeLegend
        items={revenueLegend}
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
};
RevenueBreakdown.storyName = "Revenue breakdown (gauge + legend)";

// ─── 2. Side-by-side: gauge left, legend right ─────────────────

const budgetData = [
  { dept: "Engineering", spend: 280000 },
  { dept: "Marketing", spend: 145000 },
  { dept: "Sales", spend: 98000 },
  { dept: "Operations", spend: 67000 },
  { dept: "HR", spend: 42000 },
];
const budgetColors: Color[] = ["blue", "emerald", "violet", "amber", "pink"];
const budgetLegend = budgetData.map((d, i) => ({
  name: d.dept,
  value: d.spend,
  color: budgetColors[i],
}));

export const BudgetSideBySide = () => {
  const [active, setActive] = useState<string | undefined>(undefined);
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
          arcSpan={270}
          strokeWidth={14}
          onValueChange={(d) =>
            setActive(d ? String(d.dept) : undefined)
          }
        />
        <GaugeLegend
          items={budgetLegend}
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
};
BudgetSideBySide.storyName = "Budget allocation (side-by-side)";

// ─── 3. KPI row: three needle gauges with labels ────────────────

export const KPIDashboard = () => (
  <div className="mx-auto max-w-4xl">
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
      <Card>
        <CardTitle>CPU Usage</CardTitle>
        <GaugeChart
          value={73}
          color="blue"
          label="Current"
          valueFormatter={pct}
          showNeedle
          className="mt-6"
        />
      </Card>
      <Card>
        <CardTitle>Memory</CardTitle>
        <GaugeChart
          value={45}
          color="emerald"
          label="Allocated"
          valueFormatter={pct}
          showNeedle
          className="mt-6"
        />
      </Card>
      <Card>
        <CardTitle>Disk I/O</CardTitle>
        <GaugeChart
          value={88}
          color="amber"
          label="Utilization"
          valueFormatter={pct}
          showNeedle
          className="mt-6"
        />
      </Card>
    </div>
  </div>
);
KPIDashboard.storyName = "KPI dashboard (gauge row)";

// ─── 4. Threshold gauge with zones ──────────────────────────────

export const ServerHealth = () => (
  <Card className="sm:mx-auto sm:max-w-sm">
    <CardTitle>Server Health</CardTitle>
    <CardDescription>
      Current health score based on response time, error rate, and uptime.
    </CardDescription>
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
);
ServerHealth.storyName = "Server health (threshold zones + needle)";

// ─── 5. Dual gauges side-by-side in one card ────────────────────

export const DualGaugeComparison = () => (
  <Card className="sm:mx-auto sm:max-w-xl">
    <CardTitle>Performance Comparison</CardTitle>
    <CardDescription>
      Frontend vs. backend performance scores this month.
    </CardDescription>
    <div className="mt-6 grid grid-cols-2 gap-6">
      <div>
        <GaugeChart
          value={92}
          color="blue"
          label="Frontend"
          valueFormatter={pct}
          strokeWidth={12}
          arcSpan={240}
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
          value={78}
          color="violet"
          label="Backend"
          valueFormatter={pct}
          strokeWidth={12}
          arcSpan={240}
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
);
DualGaugeComparison.storyName = "Dual gauge comparison";

// ─── 6. Gradient gauge with performance score + stats ───────────

export const PerformanceScore = () => (
  <Card className="sm:mx-auto sm:max-w-sm">
    <CardTitle>Performance Score</CardTitle>
    <CardDescription>
      Overall application performance based on Core Web Vitals.
    </CardDescription>
    <GaugeChart
      value={92}
      gradient={{ from: "cyan", to: "blue" }}
      label="Excellent"
      showMinMax
      arcSpan={240}
      strokeWidth={14}
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
);
PerformanceScore.storyName = "Performance score (gradient + stats)";

// ─── 7. Gauge + legend + single gauge in a dashboard row ────────

const trafficData = [
  { channel: "Organic", sessions: 12400 },
  { channel: "Paid", sessions: 8200 },
  { channel: "Social", sessions: 4100 },
  { channel: "Direct", sessions: 6800 },
];
const trafficColors: Color[] = ["emerald", "blue", "pink", "amber"];
const trafficLegend = trafficData.map((d, i) => ({
  name: d.channel,
  value: d.sessions,
  color: trafficColors[i],
}));

export const DashboardRow = () => {
  const [active, setActive] = useState<string | undefined>(undefined);
  return (
    <div className="mx-auto max-w-4xl">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Multi-gauge with legend — spans 3 columns */}
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
              strokeWidth={14}
              onValueChange={(d) =>
                setActive(d ? String(d.channel) : undefined)
              }
            />
            <GaugeLegend
              items={trafficLegend}
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

        {/* Threshold gauge — spans 2 columns */}
        <Card className="lg:col-span-2">
          <CardTitle>Bounce Rate</CardTitle>
          <CardDescription>
            Lower is better. Threshold zones indicate severity.
          </CardDescription>
          <GaugeChart
            value={34}
            showNeedle
            arcSpan={240}
            strokeWidth={12}
            label="Current"
            valueFormatter={pct}
            thresholds={[
              { value: 0, color: "emerald" },
              { value: 35, color: "amber" },
              { value: 60, color: "pink" },
            ]}
            showThresholdArc
            className="mt-6"
          />
        </Card>
      </div>
    </div>
  );
};
DashboardRow.storyName = "Dashboard row (multi-gauge + threshold)";

// ─── 8. Temperature gauge (needle + min/max + zones) ────────────

export const TemperatureGauge = () => (
  <Card className="sm:mx-auto sm:max-w-xs">
    <CardTitle>Server Temperature</CardTitle>
    <CardDescription>Current CPU core temperature reading.</CardDescription>
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
);
TemperatureGauge.storyName = "Temperature gauge (zones + needle)";

// ─── 9. Compact grid: four gauges + legends beneath each ────────

const healthMetrics = [
  { name: "Uptime", value: 99.9, color: "emerald" as Color, fmt: (v: number) => `${v}%` },
  { name: "Latency", value: 42, max: 200, color: "blue" as Color, fmt: (v: number) => `${v}ms` },
  { name: "Error Rate", value: 0.3, max: 5, color: "amber" as Color, fmt: (v: number) => `${v}%` },
  { name: "Throughput", value: 84, color: "violet" as Color, fmt: (v: number) => `${v}%` },
];

export const CompactHealthGrid = () => (
  <Card className="sm:mx-auto sm:max-w-lg">
    <CardTitle>Service Health</CardTitle>
    <CardDescription>
      Real-time monitoring across key infrastructure metrics.
    </CardDescription>
    <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4">
      {healthMetrics.map((m) => (
        <div key={m.name} className="text-center">
          <GaugeChart
            value={m.value}
            max={m.max ?? 100}
            color={m.color}
            showLabel
            valueFormatter={m.fmt}
            strokeWidth={8}
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
CompactHealthGrid.storyName = "Service health (compact grid)";

// ─── 10. Users by region: custom tooltip + legend ───────────────

export const UsersByRegion = () => {
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
        arcSpan={240}
        strokeWidth={16}
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
};
UsersByRegion.storyName = "Users by region (custom tooltip + legend)";

// ─── 11. System overview: multi-gauge row with status ───────────

const statusData = [
  { name: "API Gateway", health: 98, color: "emerald" as Color },
  { name: "Database", health: 94, color: "blue" as Color },
  { name: "Cache Layer", health: 100, color: "violet" as Color },
  { name: "CDN", health: 87, color: "amber" as Color },
];

export const SystemOverview = () => (
  <Card className="sm:mx-auto sm:max-w-3xl">
    <CardTitle>System Overview</CardTitle>
    <CardDescription>
      Health scores across core infrastructure components.
    </CardDescription>
    <div className="mt-8 flex flex-1 items-end justify-center gap-8">
      {statusData.map((s) => (
        <div key={s.name} className="text-center">
          <GaugeChart
            value={s.health}
            color={s.color}
            showLabel
            valueFormatter={pct}
            strokeWidth={8}
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
SystemOverview.storyName = "System overview (multi-gauge row)";

// ─── 12. Single gauge + legend next to it (flex row) ────────────

export const GaugeWithLegendRow = () => {
  const items = [
    { name: "Completed", value: 68, color: "emerald" as Color },
    { name: "In Progress", value: 22, color: "blue" as Color },
    { name: "Failed", value: 10, color: "pink" as Color },
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
          value={68}
          color="emerald"
          label="Completed"
          valueFormatter={pct}
          strokeWidth={12}
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
};
GaugeWithLegendRow.storyName = "Single gauge + legend (flex row)";

// ─── 13. Two threshold gauges side-by-side ──────────────────────

export const DualThresholdGauges = () => (
  <div className="mx-auto max-w-2xl">
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <Card>
        <CardTitle>CPU Temperature</CardTitle>
        <CardDescription>Sensor 1 — Primary core</CardDescription>
        <GaugeChart
          value={62}
          min={20}
          max={100}
          showNeedle
          arcSpan={240}
          strokeWidth={12}
          label="°C"
          thresholds={[
            { value: 20, color: "emerald" },
            { value: 65, color: "amber" },
            { value: 85, color: "pink" },
          ]}
          showThresholdArc
          className="mt-6"
        />
      </Card>
      <Card>
        <CardTitle>GPU Temperature</CardTitle>
        <CardDescription>Sensor 2 — Graphics processor</CardDescription>
        <GaugeChart
          value={78}
          min={20}
          max={100}
          showNeedle
          arcSpan={240}
          strokeWidth={12}
          label="°C"
          thresholds={[
            { value: 20, color: "emerald" },
            { value: 65, color: "amber" },
            { value: 85, color: "pink" },
          ]}
          showThresholdArc
          className="mt-6"
        />
      </Card>
    </div>
  </div>
);
DualThresholdGauges.storyName = "Dual threshold gauges (CPU + GPU)";

// ─── 14. Multi-gauge with marker + gauge + unified legend ───────

const salesData = [
  { team: "Enterprise", closed: 3200000 },
  { team: "Mid-Market", closed: 1800000 },
  { team: "SMB", closed: 950000 },
];
const salesColors: Color[] = ["blue", "violet", "cyan"];
const salesLegend = salesData.map((d, i) => ({
  name: d.team,
  value: d.closed,
  color: salesColors[i],
}));

export const SalesWithTarget = () => {
  const [active, setActive] = useState<string | undefined>(undefined);
  const total = salesData.reduce((s, d) => s + d.closed, 0);
  const target = 7000000;
  const attainment = Math.round((total / target) * 100);

  return (
    <Card className="sm:mx-auto sm:max-w-xl">
      <CardTitle>Sales Attainment</CardTitle>
      <CardDescription>
        Revenue closed by team vs. quarterly target of £7M.
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
            marker={{ value: target }}
            strokeWidth={14}
            onValueChange={(d) =>
              setActive(d ? String(d.team) : undefined)
            }
          />
          <p className="mt-1 text-center text-xs text-gray-500">
            Marker = £7M target
          </p>
        </div>
        <div className="flex flex-col justify-between">
          <GaugeLegend
            items={salesLegend}
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
};
SalesWithTarget.storyName = "Sales attainment (multi-gauge + marker + legend)";

// ─── 15. Gradient gauges row ────────────────────────────────────

export const GradientGaugesRow = () => (
  <div className="mx-auto max-w-4xl">
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
      <Card>
        <CardTitle>Upload Speed</CardTitle>
        <GaugeChart
          value={78}
          gradient={{ from: "cyan", to: "blue" }}
          label="Mbps"
          strokeWidth={14}
          className="mt-6"
        />
      </Card>
      <Card>
        <CardTitle>Download Speed</CardTitle>
        <GaugeChart
          value={92}
          gradient={{ from: "emerald", to: "cyan" }}
          label="Mbps"
          strokeWidth={14}
          className="mt-6"
        />
      </Card>
      <Card>
        <CardTitle>Latency</CardTitle>
        <GaugeChart
          value={23}
          gradient={{ from: "violet", to: "pink" }}
          label="ms"
          strokeWidth={14}
          className="mt-6"
        />
      </Card>
    </div>
  </div>
);
GradientGaugesRow.storyName = "Gradient gauges row (network stats)";

// ─── 16. Full dashboard card: gauge + multi-gauge + legend ──────

export const FullDashboard = () => {
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
        {/* Portfolio return */}
        <Card>
          <CardTitle>Portfolio Return</CardTitle>
          <CardDescription>Year-to-date performance</CardDescription>
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
            valueFormatter={(v) => `${v > 0 ? "+" : ""}${v}%`}
            className="mt-6"
          />
        </Card>

        {/* Asset allocation — spans 2 columns */}
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
              strokeWidth={14}
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
};
FullDashboard.storyName = "Full dashboard (gauge + multi-gauge + legend)";
