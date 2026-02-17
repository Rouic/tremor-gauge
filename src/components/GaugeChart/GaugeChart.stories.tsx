import type { Meta, StoryObj } from "@storybook/react";
import { GaugeChart } from "./GaugeChart";

const meta: Meta<typeof GaugeChart> = {
  title: "Components/GaugeChart",
  component: GaugeChart,
  tags: ["autodocs"],
  parameters: { docs: { source: { excludeDecorators: true } } },
  decorators: [
    (Story) => (
      <div className="mx-auto max-w-xs rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    color: {
      control: "select",
      options: [
        "blue", "emerald", "violet", "amber", "gray",
        "cyan", "pink", "lime", "fuchsia",
      ],
    },
    arcSpan: { control: "select", options: [180, 240, 270] },
    strokeWidth: { control: { type: "range", min: 4, max: 24, step: 2 } },
    value: { control: { type: "range", min: 0, max: 100 } },
    showThresholdArc: { control: "select", options: [false, true, "ticks", "bands"] },
  },
};

export default meta;
type Story = StoryObj<typeof GaugeChart>;

export const Default: Story = {
  args: {
    value: 72,
    color: "blue",
    label: "Performance",
  },
};

export const WithNeedle: Story = {
  args: {
    value: 65,
    showNeedle: true,
    color: "emerald",
    label: "CPU Usage",
    valueFormatter: (v: number) => `${v}%`,
  },
};

export const ThresholdWithTicks: Story = {
  name: "Thresholds with tick marks",
  args: {
    value: 73,
    showNeedle: true,
    label: "Health",
    valueFormatter: (v: number) => `${v}%`,
    thresholds: [
      { value: 0, color: "emerald" },
      { value: 60, color: "amber" },
      { value: 80, color: "pink" },
    ],
    showThresholdArc: true,
    arcSpan: 240,
    strokeWidth: 12,
  },
};

export const ThresholdWithBands: Story = {
  name: "Thresholds with colored bands",
  args: {
    value: 42,
    showNeedle: true,
    label: "Score",
    thresholds: [
      { value: 0, color: "pink" },
      { value: 40, color: "amber" },
      { value: 70, color: "emerald" },
    ],
    showThresholdArc: "bands",
    arcSpan: 240,
    strokeWidth: 14,
  },
};

export const Gradient: Story = {
  name: "Gradient fill",
  args: {
    value: 78,
    gradient: { from: "cyan", to: "violet" },
    label: "Progress",
    valueFormatter: (v: number) => `${v}%`,
    strokeWidth: 14,
  },
};

export const Arc270WithNeedle: Story = {
  name: "270-degree arc with needle",
  args: {
    value: 35,
    arcSpan: 270,
    color: "amber",
    showNeedle: true,
    showMinMax: true,
    label: "Temperature",
    valueFormatter: (v: number) => `${v}°C`,
  },
};

export const Percentage: Story = {
  args: {
    value: 0.85,
    min: 0,
    max: 1,
    valueFormatter: (v: number) => `${(v * 100).toFixed(0)}%`,
    color: "cyan",
    label: "Conversion Rate",
  },
};

export const MinimalNoLabel: Story = {
  name: "Minimal (no label)",
  args: {
    value: 60,
    showLabel: false,
    color: "pink",
    strokeWidth: 8,
  },
};
