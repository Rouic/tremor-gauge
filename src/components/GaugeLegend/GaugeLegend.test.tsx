import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { GaugeLegend, type GaugeLegendItem } from "./GaugeLegend";

const items: GaugeLegendItem[] = [
  { name: "Sales", value: 450, color: "blue" },
  { name: "Returns", value: 120, color: "emerald" },
  { name: "Pending", value: 30, color: "amber" },
];

describe("GaugeLegend", () => {
  it("renders all items", () => {
    render(<GaugeLegend items={items} />);
    expect(screen.getByText("Sales")).toBeInTheDocument();
    expect(screen.getByText("Returns")).toBeInTheDocument();
    expect(screen.getByText("Pending")).toBeInTheDocument();
  });

  it("displays formatted values", () => {
    render(<GaugeLegend items={items} valueFormatter={(v) => `$${v}`} />);
    expect(screen.getByText("$450")).toBeInTheDocument();
    expect(screen.getByText("$120")).toBeInTheDocument();
  });

  it("renders as a list with aria-label", () => {
    render(<GaugeLegend items={items} />);
    const list = screen.getByRole("list", { name: "Gauge legend" });
    expect(list).toBeInTheDocument();
  });

  it("calls onItemClick when an item is clicked", async () => {
    const onClick = vi.fn();
    render(<GaugeLegend items={items} onItemClick={onClick} />);
    await userEvent.click(screen.getByText("Sales"));
    expect(onClick).toHaveBeenCalledWith("Sales");
  });

  it("dims inactive items when activeName is set", () => {
    const { container } = render(
      <GaugeLegend items={items} activeName="Sales" />,
    );
    const buttons = container.querySelectorAll("button");
    expect(buttons[0].className).not.toContain("opacity-30");
    expect(buttons[1].className).toContain("opacity-30");
  });

  it("shows all items at full opacity when activeName is undefined", () => {
    const { container } = render(<GaugeLegend items={items} />);
    const buttons = container.querySelectorAll("button");
    buttons.forEach((btn) => {
      expect(btn.className).not.toContain("opacity-30");
    });
  });

  it("shows percentage share badges when showShare is true", () => {
    render(<GaugeLegend items={items} showShare />);
    // Sales: 450/600 = 75.0%
    expect(screen.getByText("75.0%")).toBeInTheDocument();
    // Returns: 120/600 = 20.0%
    expect(screen.getByText("20.0%")).toBeInTheDocument();
    // Pending: 30/600 = 5.0%
    expect(screen.getByText("5.0%")).toBeInTheDocument();
  });

  it("does not show share badges by default", () => {
    render(<GaugeLegend items={items} />);
    expect(screen.queryByText("75.0%")).not.toBeInTheDocument();
  });

  it("forwards ref", () => {
    const ref = { current: null as HTMLOListElement | null };
    render(<GaugeLegend ref={ref} items={items} />);
    expect(ref.current).toBeInstanceOf(HTMLOListElement);
  });

  it("accepts custom className", () => {
    render(<GaugeLegend items={items} className="mt-4" />);
    const list = screen.getByRole("list");
    expect(list.getAttribute("class")).toContain("mt-4");
  });
});
