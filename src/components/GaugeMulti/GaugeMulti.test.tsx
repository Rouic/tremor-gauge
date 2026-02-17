import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { GaugeMulti } from "./GaugeMulti";

const sampleData = [
  { name: "Sales", amount: 450 },
  { name: "Returns", amount: 120 },
  { name: "Pending", amount: 30 },
];

describe("GaugeMulti", () => {
  it("renders an SVG with role img", () => {
    render(
      <GaugeMulti data={sampleData} category="name" value="amount" />,
    );
    const img = screen.getByRole("img", { name: "Multi-segment gauge" });
    expect(img).toBeInTheDocument();
  });

  it("renders one segment per data item", () => {
    const { container } = render(
      <GaugeMulti data={sampleData} category="name" value="amount" />,
    );
    // Background track + 3 segments
    const circles = container.querySelectorAll("circle");
    expect(circles).toHaveLength(4);
  });

  it("calls onValueChange when a segment is clicked", () => {
    const onChange = vi.fn();
    render(
      <GaugeMulti
        data={sampleData}
        category="name"
        value="amount"
        onValueChange={onChange}
      />,
    );
    fireEvent.click(screen.getByTestId("segment-0"));
    expect(onChange).toHaveBeenCalledWith(sampleData[0]);
  });

  it("calls onValueChange with null when same segment clicked again", () => {
    const onChange = vi.fn();
    render(
      <GaugeMulti
        data={sampleData}
        category="name"
        value="amount"
        onValueChange={onChange}
      />,
    );
    const segment = screen.getByTestId("segment-0");
    fireEvent.click(segment);
    fireEvent.click(segment);
    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onChange).toHaveBeenLastCalledWith(null);
  });

  it("renders a marker tick when marker is provided", () => {
    const { container } = render(
      <GaugeMulti
        data={sampleData}
        category="name"
        value="amount"
        marker={{ value: 300 }}
      />,
    );
    const lines = container.querySelectorAll("line");
    expect(lines.length).toBeGreaterThanOrEqual(1);
  });

  it("does not render marker when not provided", () => {
    const { container } = render(
      <GaugeMulti data={sampleData} category="name" value="amount" />,
    );
    const lines = container.querySelectorAll("line");
    expect(lines).toHaveLength(0);
  });

  it("uses custom colors", () => {
    const { container } = render(
      <GaugeMulti
        data={sampleData}
        category="name"
        value="amount"
        colors={["violet", "pink", "cyan"]}
      />,
    );
    const segments = container.querySelectorAll(
      "[data-testid^='segment-']",
    );
    expect(segments[0]).toHaveAttribute("stroke", "#8b5cf6");
  });

  it("renders center label when label prop is provided", () => {
    render(
      <GaugeMulti
        data={sampleData}
        category="name"
        value="amount"
        label="Total"
      />,
    );
    expect(screen.getByText("Total")).toBeInTheDocument();
    // Shows total value (450+120+30 = 600)
    expect(screen.getByText("600")).toBeInTheDocument();
  });

  it("uses valueFormatter for center label and tooltip", () => {
    render(
      <GaugeMulti
        data={sampleData}
        category="name"
        value="amount"
        label="Revenue"
        valueFormatter={(v) => `$${v}`}
      />,
    );
    expect(screen.getByText("$600")).toBeInTheDocument();
  });

  it("forwards ref to the SVG element", () => {
    const ref = { current: null as SVGSVGElement | null };
    render(
      <GaugeMulti
        ref={ref}
        data={sampleData}
        category="name"
        value="amount"
      />,
    );
    expect(ref.current).toBeInstanceOf(SVGSVGElement);
  });
});
