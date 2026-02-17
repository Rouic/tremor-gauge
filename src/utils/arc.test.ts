import { describe, it, expect } from "vitest";
import {
  degToRad,
  polarToCartesian,
  getArcDash,
  getNeedleAngle,
  getSegmentArcs,
} from "./arc";

describe("degToRad", () => {
  it("converts 0 degrees to 0 radians", () => {
    expect(degToRad(0)).toBe(0);
  });

  it("converts 180 degrees to PI radians", () => {
    expect(degToRad(180)).toBeCloseTo(Math.PI);
  });

  it("converts 360 degrees to 2*PI radians", () => {
    expect(degToRad(360)).toBeCloseTo(2 * Math.PI);
  });
});

describe("polarToCartesian", () => {
  it("returns center + radius at 0 degrees (top of circle in SVG)", () => {
    const { x, y } = polarToCartesian(50, 50, 40, 90);
    expect(x).toBeCloseTo(90);
    expect(y).toBeCloseTo(50);
  });

  it("returns correct position at 180 degrees", () => {
    const { x, y } = polarToCartesian(50, 50, 40, 270);
    expect(x).toBeCloseTo(10);
    expect(y).toBeCloseTo(50);
  });
});

describe("getArcDash", () => {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;

  it("returns correct values for a 180° arc at 0% fill", () => {
    const result = getArcDash(radius, 180, 0);
    const arcLength = (180 / 360) * circumference;
    expect(result.circumference).toBeCloseTo(circumference);
    expect(result.dashArray).toBe(`${arcLength} ${circumference}`);
    expect(result.dashOffset).toBeCloseTo(arcLength); // fully hidden
    expect(result.rotationDeg).toBe(180); // 90 + (360-180)/2
  });

  it("returns correct values for a 180° arc at 100% fill", () => {
    const result = getArcDash(radius, 180, 1);
    expect(result.dashOffset).toBeCloseTo(0); // fully visible
  });

  it("returns correct values for a 180° arc at 50% fill", () => {
    const result = getArcDash(radius, 180, 0.5);
    const arcLength = (180 / 360) * circumference;
    expect(result.dashOffset).toBeCloseTo(arcLength * 0.5);
  });

  it("returns correct rotation for 270° arc", () => {
    const result = getArcDash(radius, 270, 0);
    expect(result.rotationDeg).toBe(135); // 90 + (360-270)/2
  });

  it("returns correct rotation for 240° arc", () => {
    const result = getArcDash(radius, 240, 0);
    expect(result.rotationDeg).toBe(150); // 90 + (360-240)/2
  });

  it("clamps fraction to 0..1", () => {
    const overResult = getArcDash(radius, 180, 1.5);
    const fullResult = getArcDash(radius, 180, 1);
    expect(overResult.dashOffset).toBeCloseTo(fullResult.dashOffset);

    const underResult = getArcDash(radius, 180, -0.5);
    const emptyResult = getArcDash(radius, 180, 0);
    expect(underResult.dashOffset).toBeCloseTo(emptyResult.dashOffset);
  });
});

describe("getNeedleAngle", () => {
  // CSS rotation: 0°=up, 90°=right, 180°=down, 270°=left

  it("returns left (270°) when value equals min on 180° arc", () => {
    const angle = getNeedleAngle(0, 0, 100, 180);
    expect(angle).toBe(270); // needle points to arc start (left)
  });

  it("returns right (450°/90°) when value equals max on 180° arc", () => {
    const angle = getNeedleAngle(100, 0, 100, 180);
    expect(angle).toBe(450); // needle points to arc end (right)
  });

  it("returns up (360°) at 50% on 180° arc", () => {
    const angle = getNeedleAngle(50, 0, 100, 180);
    expect(angle).toBe(360); // needle points to arc midpoint (up)
  });

  it("clamps value below min", () => {
    const angle = getNeedleAngle(-10, 0, 100, 180);
    expect(angle).toBe(270);
  });

  it("clamps value above max", () => {
    const angle = getNeedleAngle(200, 0, 100, 180);
    expect(angle).toBe(450);
  });

  it("handles min === max", () => {
    const angle = getNeedleAngle(50, 50, 50, 180);
    expect(angle).toBe(270); // returns start
  });

  it("works with 270° arc span", () => {
    const angle = getNeedleAngle(50, 0, 100, 270);
    // baseRotation=135, +90 offset, 50% of 270=135
    expect(angle).toBe(135 + 135 + 90); // 360 = up (midpoint)
  });
});

describe("getSegmentArcs", () => {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;

  it("returns one segment filling the whole arc", () => {
    const segments = getSegmentArcs(radius, 180, [1]);
    expect(segments).toHaveLength(1);
    const arcLength = (180 / 360) * circumference;
    expect(segments[0].dashArray).toBe(`${arcLength} ${circumference}`);
    expect(segments[0].dashOffset).toBeCloseTo(0);
  });

  it("returns two equal segments", () => {
    const segments = getSegmentArcs(radius, 180, [0.5, 0.5]);
    const arcLength = (180 / 360) * circumference;
    const halfArc = arcLength * 0.5;

    expect(segments).toHaveLength(2);
    expect(segments[0].dashArray).toBe(`${halfArc} ${circumference}`);
    expect(segments[0].dashOffset).toBeCloseTo(0);
    expect(segments[1].dashArray).toBe(`${halfArc} ${circumference}`);
    expect(segments[1].dashOffset).toBeCloseTo(-halfArc);
  });

  it("handles three unequal segments", () => {
    const segments = getSegmentArcs(radius, 270, [0.5, 0.3, 0.2]);
    expect(segments).toHaveLength(3);
    // Each should start where previous ended
    expect(segments[0].dashOffset).toBeCloseTo(0);
    const arcLength = (270 / 360) * circumference;
    expect(segments[1].dashOffset).toBeCloseTo(-(arcLength * 0.5));
    expect(segments[2].dashOffset).toBeCloseTo(-(arcLength * 0.8));
  });
});
