# tremor-gauge

Gauge chart components for the [Tremor](https://www.tremor.so/) design system. Pure SVG rendering with zero charting dependencies.

## Components

- **`GaugeChart`** — Single-value semicircle/arc gauge with optional needle
- **`GaugeMulti`** — Multi-segment gauge (donut-style arc with colored segments)
- **`GaugeLegend`** — Legend companion with colored squares, labels, and values

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
};
```

## Usage

```tsx
import { GaugeChart, GaugeMulti, GaugeLegend } from "tremor-gauge";

// Single gauge
<GaugeChart value={72} color="blue" showNeedle />

// Multi-segment gauge
<GaugeMulti
  data={[
    { name: "Sales", amount: 450 },
    { name: "Returns", amount: 120 },
  ]}
  category="name"
  value="amount"
  colors={["blue", "emerald"]}
/>

// Legend
<GaugeLegend
  items={[
    { name: "Sales", value: 450, color: "blue" },
    { name: "Returns", value: 120, color: "emerald" },
  ]}
  valueFormatter={(v) => `$${v}`}
/>
```

## GaugeChart Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number` | — | Current value (required) |
| `min` | `number` | `0` | Minimum value |
| `max` | `number` | `100` | Maximum value |
| `color` | `Color` | `"blue"` | Tremor color token |
| `valueFormatter` | `(v: number) => string` | `String` | Format the center label |
| `showLabel` | `boolean` | `true` | Show center value |
| `showMinMax` | `boolean` | `false` | Show min/max labels |
| `showAnimation` | `boolean` | `true` | Animate on mount |
| `arcSpan` | `180 \| 240 \| 270` | `180` | Arc span in degrees |
| `showNeedle` | `boolean` | `false` | Show needle indicator |
| `strokeWidth` | `number` | `10` | Arc stroke width |
| `className` | `string` | — | Additional CSS class |

## GaugeMulti Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `object[]` | — | Data array (required) |
| `category` | `string` | — | Key for category labels (required) |
| `value` | `string` | — | Key for numeric values (required) |
| `colors` | `Color[]` | all colors | Color tokens per segment |
| `showTooltip` | `boolean` | `true` | Show tooltip on hover |
| `onValueChange` | `(datum \| null) => void` | — | Segment click callback |
| `customTooltip` | `(props) => ReactNode` | — | Custom tooltip renderer |
| `marker` | `{ value, label? }` | — | Marker line on the arc |
| `arcSpan` | `180 \| 240 \| 270` | `180` | Arc span in degrees |
| `strokeWidth` | `number` | `10` | Arc stroke width |
| `showAnimation` | `boolean` | `true` | Animate on mount |
| `className` | `string` | — | Additional CSS class |

## GaugeLegend Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `GaugeLegendItem[]` | — | Legend items (required) |
| `valueFormatter` | `(v: number) => string` | `String` | Format values |
| `activeName` | `string` | — | Highlighted item name |
| `onItemClick` | `(name: string) => void` | — | Item click callback |
| `className` | `string` | — | Additional CSS class |

## Colors

9 Tremor-compatible tokens: `blue`, `emerald`, `violet`, `amber`, `gray`, `cyan`, `pink`, `lime`, `fuchsia` (all at 500 shade).

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
