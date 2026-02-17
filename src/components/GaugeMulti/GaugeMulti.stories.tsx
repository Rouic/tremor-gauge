import type { Meta, StoryObj } from "@storybook/react";
import { GaugeMulti } from "./GaugeMulti";

const meta: Meta<typeof GaugeMulti> = {
  title: "Components/GaugeMulti",
  component: GaugeMulti,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="mx-auto max-w-xs rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    arcSpan: { control: "select", options: [180, 240, 270] },
    strokeWidth: { control: { type: "range", min: 4, max: 24, step: 2 } },
  },
};

export default meta;
type Story = StoryObj<typeof GaugeMulti>;

const data = [
  { source: "Direct", revenue: 4520 },
  { source: "Organic Search", revenue: 2890 },
  { source: "Referral", revenue: 1340 },
  { source: "Social Media", revenue: 780 },
];

const fmt = (v: number) =>
  v.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

export const Default: Story = {
  args: {
    data,
    category: "source",
    value: "revenue",
    colors: ["blue", "cyan", "violet", "amber"],
    label: "Total Revenue",
    valueFormatter: fmt,
  },
};

export const WithMarker: Story = {
  args: {
    data,
    category: "source",
    value: "revenue",
    colors: ["blue", "cyan", "violet", "amber"],
    label: "Total Revenue",
    valueFormatter: fmt,
    marker: { value: 8000, label: "Target" },
  },
};

export const Arc270: Story = {
  name: "270-degree arc",
  args: {
    data,
    category: "source",
    value: "revenue",
    colors: ["blue", "cyan", "violet", "amber"],
    arcSpan: 270,
    label: "Revenue",
    valueFormatter: fmt,
  },
};
