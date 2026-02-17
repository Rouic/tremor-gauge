import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { GaugeChart } from "./GaugeChart";

describe("GaugeChart", () => {
  it("renders an SVG with role meter", () => {
    render(<GaugeChart value={50} />);
    const meter = screen.getByRole("meter");
    expect(meter).toBeInTheDocument();
    expect(meter.tagName).toBe("svg");
  });

  it("sets ARIA attributes correctly", () => {
    render(<GaugeChart value={42} min={0} max={200} />);
    const meter = screen.getByRole("meter");
    expect(meter).toHaveAttribute("aria-valuenow", "42");
    expect(meter).toHaveAttribute("aria-valuemin", "0");
    expect(meter).toHaveAttribute("aria-valuemax", "200");
  });

  it("includes label in aria-label when provided", () => {
    render(<GaugeChart value={72} label="Completion Rate" />);
    const meter = screen.getByRole("meter");
    expect(meter).toHaveAttribute("aria-label", "Completion Rate: 72");
  });

  it("displays the formatted value label by default", () => {
    render(<GaugeChart value={75} />);
    expect(screen.getByText("75")).toBeInTheDocument();
  });

  it("uses valueFormatter for the label", () => {
    render(
      <GaugeChart
        value={0.85}
        min={0}
        max={1}
        valueFormatter={(v) => `${(v * 100).toFixed(0)}%`}
      />,
    );
    expect(screen.getByText("85%")).toBeInTheDocument();
  });

  it("renders secondary label text", () => {
    render(<GaugeChart value={72} label="Completion Rate" />);
    expect(screen.getByText("Completion Rate")).toBeInTheDocument();
  });

  it("hides the label when showLabel is false", () => {
    render(<GaugeChart value={50} showLabel={false} />);
    expect(screen.queryByText("50")).not.toBeInTheDocument();
  });

  it("shows min/max labels when showMinMax is true", () => {
    render(<GaugeChart value={50} min={0} max={100} showMinMax />);
    expect(screen.getByText("0")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
  });

  it("shows min/max for non-180 arcs too", () => {
    render(
      <GaugeChart value={50} min={0} max={100} showMinMax arcSpan={270} />,
    );
    expect(screen.getByText("0")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
  });

  it("renders the needle when showNeedle is true", () => {
    const { container } = render(<GaugeChart value={50} showNeedle />);
    // Tapered needle is a <path>, hub is circles
    const paths = container.querySelectorAll("path");
    expect(paths.length).toBeGreaterThanOrEqual(1);
  });

  it("does not render the needle by default", () => {
    const { container } = render(<GaugeChart value={50} />);
    const paths = container.querySelectorAll("path");
    expect(paths).toHaveLength(0);
  });

  it("accepts custom className", () => {
    render(<GaugeChart value={50} className="w-48" />);
    const meter = screen.getByRole("meter");
    expect(meter.getAttribute("class")).toContain("w-48");
  });

  it("forwards ref to the SVG element", () => {
    const ref = { current: null as SVGSVGElement | null };
    render(<GaugeChart ref={ref} value={50} />);
    expect(ref.current).toBeInstanceOf(SVGSVGElement);
  });

  it("renders two circle elements (track + fill) by default", () => {
    const { container } = render(<GaugeChart value={50} />);
    const circles = container.querySelectorAll("circle");
    expect(circles.length).toBeGreaterThanOrEqual(2);
  });

  // ── Threshold tests ─────────────────────────────────────────────

  it("uses threshold color based on value", () => {
    const { container } = render(
      <GaugeChart
        value={75}
        thresholds={[
          { value: 0, color: "emerald" },
          { value: 60, color: "amber" },
          { value: 80, color: "pink" },
        ]}
      />,
    );
    // value=75 falls in amber zone (>=60, <80)
    const circles = container.querySelectorAll("circle");
    // Last non-needle circle is the fill arc
    const fillCircle = circles[1];
    expect(fillCircle).toHaveAttribute("stroke", "#f59e0b"); // amber
  });

  it("uses highest matching threshold", () => {
    const { container } = render(
      <GaugeChart
        value={90}
        thresholds={[
          { value: 0, color: "emerald" },
          { value: 60, color: "amber" },
          { value: 80, color: "pink" },
        ]}
      />,
    );
    const circles = container.querySelectorAll("circle");
    const fillCircle = circles[1];
    expect(fillCircle).toHaveAttribute("stroke", "#ec4899"); // pink
  });

  it("renders threshold tick marks when showThresholdArc is true", () => {
    const { container } = render(
      <GaugeChart
        value={50}
        thresholds={[
          { value: 0, color: "emerald" },
          { value: 60, color: "amber" },
          { value: 80, color: "pink" },
        ]}
        showThresholdArc
      />,
    );
    // 2 tick lines (at boundaries 60 and 80, first threshold is arc start)
    const lines = container.querySelectorAll("line");
    expect(lines).toHaveLength(2);
  });

  it("renders threshold bands when showThresholdArc is 'bands'", () => {
    const { container } = render(
      <GaugeChart
        value={50}
        thresholds={[
          { value: 0, color: "emerald" },
          { value: 60, color: "amber" },
          { value: 80, color: "pink" },
        ]}
        showThresholdArc="bands"
      />,
    );
    // gray base + 3 band circles + 1 fill circle = 5
    const circles = container.querySelectorAll("circle");
    expect(circles.length).toBeGreaterThanOrEqual(5);
  });

  // ── Gradient tests ──────────────────────────────────────────────

  it("renders a gradient definition when gradient prop is set", () => {
    const { container } = render(
      <GaugeChart
        value={70}
        gradient={{ from: "blue", to: "violet" }}
      />,
    );
    const gradients = container.querySelectorAll("linearGradient");
    expect(gradients).toHaveLength(1);
    const stops = gradients[0].querySelectorAll("stop");
    expect(stops).toHaveLength(2);
    expect(stops[0]).toHaveAttribute("stop-color", "#3b82f6"); // blue
    expect(stops[1]).toHaveAttribute("stop-color", "#8b5cf6"); // violet
  });

  it("uses gradient url as fill stroke", () => {
    const { container } = render(
      <GaugeChart
        value={70}
        gradient={{ from: "emerald", to: "cyan" }}
      />,
    );
    const circles = container.querySelectorAll("circle");
    const fillCircle = circles[1];
    expect(fillCircle.getAttribute("stroke")).toMatch(/^url\(#/);
  });
});
