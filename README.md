# tremor-gauge

Gauge chart components for the [Tremor](https://www.tremor.so/) design system. Pure SVG rendering with zero charting dependencies.

[Live Examples](https://tremor-gauge.rouic.com/) | [npm](https://www.npmjs.com/package/tremor-gauge) | [GitHub](https://github.com/Rouic/tremor-gauge)

- **`GaugeChart`** — Single-value arc gauge with optional needle, thresholds, and gradient fills
- **`GaugeMulti`** — Multi-segment gauge with interactive segments and tooltips
- **`GaugeLegend`** — Legend companion with colored indicators, values, and share badges

## Install

```bash
npm install tremor-gauge
```

Peer dependencies: `react` and `react-dom` (18 or 19).

## Tailwind CSS Setup

Add the library to your Tailwind `content` config so its classes are included:

```js
// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/tremor-gauge/dist/**/*.{js,cjs}",
  ],
  darkMode: "class",
};
```

Dark mode is supported via Tailwind's `class` strategy.

## Usage

```tsx
import { GaugeChart, GaugeMulti, GaugeLegend } from "tremor-gauge";
```

### Single gauge with needle

```tsx
<GaugeChart
  value={72}
  color="blue"
  label="Performance"
  showNeedle
  arcSpan={240}
  valueFormatter={(v) => `${v}%`}
/>
```

### Threshold zones

```tsx
<GaugeChart
  value={67}
  min={20}
  max={100}
  showNeedle
  arcSpan={270}
  thresholds={[
    { value: 20, color: "emerald" },
    { value: 70, color: "amber" },
    { value: 85, color: "pink" },
  ]}
  showThresholdArc="bands"
/>
```

### Gradient fill

```tsx
<GaugeChart
  value={92}
  gradient={{ from: "cyan", to: "blue" }}
  label="Score"
  strokeWidth={14}
/>
```

### Multi-segment gauge with synced legend

```tsx
const [active, setActive] = useState<string | undefined>();

const data = [
  { name: "Sales", amount: 450 },
  { name: "Returns", amount: 120 },
];
const colors = ["blue", "emerald"];
const items = data.map((d, i) => ({
  name: d.name,
  value: d.amount,
  color: colors[i],
}));

<GaugeMulti
  data={data}
  category="name"
  value="amount"
  colors={colors}
  label="Total"
  activeName={active}
  onValueChange={(d) => setActive(d ? d.name : undefined)}
/>
<GaugeLegend
  items={items}
  showShare
  activeName={active}
  onItemClick={(name) => setActive(active === name ? undefined : name)}
/>
```

Clicking a segment highlights the matching legend item and vice versa.

## GaugeChart Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number` | *required* | Current value |
| `min` | `number` | `0` | Minimum value |
| `max` | `number` | `100` | Maximum value |
| `color` | `Color` | `"blue"` | Tremor color token (ignored when `thresholds` or `gradient` is set) |
| `thresholds` | `GaugeThreshold[]` | — | Value-based color zones (see below) |
| `showThresholdArc` | `boolean \| "bands" \| "ticks"` | `false` | Visualise threshold zones on the track |
| `gradient` | `{ from: Color; to: Color }` | — | Gradient fill across the arc |
| `valueFormatter` | `(v: number) => string` | `String` | Format the center value label |
| `showLabel` | `boolean` | `true` | Show center value label |
| `label` | `string` | — | Secondary label text below the value |
| `showMinMax` | `boolean` | `false` | Show min/max labels at arc ends |
| `showAnimation` | `boolean` | `true` | Animate arc and needle on mount |
| `arcSpan` | `180 \| 240 \| 270` | `180` | Arc span in degrees |
| `showNeedle` | `boolean` | `false` | Show needle indicator |
| `strokeWidth` | `number` | `10` | Arc stroke width |
| `className` | `string` | — | Additional CSS class |

### GaugeThreshold

```ts
{ value: number; color: Color }
```

Each entry defines a zone starting at `value`. The fill color changes to the highest threshold the current value has reached.

## GaugeMulti Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `object[]` | *required* | Data array |
| `category` | `string` | *required* | Key for category labels |
| `value` | `string` | *required* | Key for numeric values |
| `colors` | `Color[]` | all colors | Color tokens per segment |
| `label` | `string` | — | Center label text |
| `showTooltip` | `boolean` | `true` | Show tooltip on hover |
| `onValueChange` | `(datum \| null) => void` | — | Segment click callback |
| `activeName` | `string` | — | Externally controlled highlighted segment name |
| `customTooltip` | `(props) => ReactNode` | — | Custom tooltip renderer |
| `valueFormatter` | `(v: number) => string` | `String` | Format values in tooltip and center label |
| `marker` | `{ value, label? }` | — | Marker line on the arc |
| `arcSpan` | `180 \| 240 \| 270` | `180` | Arc span in degrees |
| `strokeWidth` | `number` | `12` | Arc stroke width |
| `showAnimation` | `boolean` | `true` | Animate segments on mount |
| `className` | `string` | — | Additional CSS class |

## GaugeLegend Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `GaugeLegendItem[]` | *required* | Legend items |
| `valueFormatter` | `(v: number) => string` | `String` | Format values |
| `showShare` | `boolean` | `false` | Show percentage share badge |
| `activeName` | `string` | — | Highlighted item name |
| `onItemClick` | `(name: string) => void` | — | Item click callback |
| `className` | `string` | — | Additional CSS class |

## Colors

9 Tremor-compatible tokens: `blue`, `emerald`, `violet`, `amber`, `gray`, `cyan`, `pink`, `lime`, `fuchsia` (all at 500 shade).

## Features

- Pure SVG via `<circle>` stroke-dasharray — no canvas, no charting library
- Animate on mount with CSS transitions (respects `prefers-reduced-motion`)
- Dark mode via Tailwind `dark:` classes
- Accessible: `role="meter"` with `aria-valuenow/min/max`
- `"use client"` directive for Next.js App Router compatibility
- Fluid sizing via SVG `viewBox` — control width with `className`

## Development

```bash
npm install
npm test          # Run Vitest tests
npm run build     # Build ESM + CJS + types
npm run storybook # Interactive component demos
npm run typecheck # TypeScript check
```

## License

Apache-2.0
