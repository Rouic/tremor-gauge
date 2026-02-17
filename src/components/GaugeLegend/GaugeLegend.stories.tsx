import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { GaugeLegend } from "./GaugeLegend";

const meta: Meta<typeof GaugeLegend> = {
  title: "Components/GaugeLegend",
  component: GaugeLegend,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="mx-auto max-w-sm rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof GaugeLegend>;

const items = [
  { name: "Direct", value: 4520, color: "blue" as const },
  { name: "Organic Search", value: 2890, color: "cyan" as const },
  { name: "Referral", value: 1340, color: "violet" as const },
  { name: "Social Media", value: 780, color: "amber" as const },
];

export const Default: Story = {
  args: {
    items,
    valueFormatter: (v: number) =>
      v.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }),
  },
};

export const WithShareBadges: Story = {
  args: {
    items,
    showShare: true,
    valueFormatter: (v: number) =>
      v.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }),
  },
};

export const Interactive = () => {
  const [active, setActive] = useState<string | undefined>(undefined);
  return (
    <GaugeLegend
      items={items}
      activeName={active}
      onItemClick={(name) => setActive(active === name ? undefined : name)}
      showShare
      valueFormatter={(v) =>
        v.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })
      }
    />
  );
};
Interactive.storyName = "Interactive selection";
