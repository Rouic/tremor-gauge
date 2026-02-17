/**
 * SVG math utilities for gauge rendering.
 *
 * The gauge is rendered using SVG `<circle>` elements with `stroke-dasharray`
 * and `stroke-dashoffset` to draw partial arcs. The arc origin starts at
 * the bottom-center and extends symmetrically.
 */

/** Convert degrees to radians */
export function degToRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/** Convert polar coordinates to cartesian (SVG coordinate system) */
export function polarToCartesian(
  cx: number,
  cy: number,
  radius: number,
  angleDeg: number,
): { x: number; y: number } {
  const rad = degToRad(angleDeg - 90); // SVG: 0° is top, we want 0° at right
  return {
    x: cx + radius * Math.cos(rad),
    y: cy + radius * Math.sin(rad),
  };
}

/**
 * For a circle-based arc gauge, calculate stroke-dasharray and stroke-dashoffset.
 *
 * @param radius - circle radius
 * @param arcSpan - total arc span in degrees (e.g. 180, 240, 270)
 * @param fraction - how much of the arc to fill (0..1)
 * @returns { circumference, dashArray, dashOffset, rotationDeg }
 */
export function getArcDash(
  radius: number,
  arcSpan: number,
  fraction: number,
): {
  circumference: number;
  dashArray: string;
  dashOffset: number;
  rotationDeg: number;
} {
  const circumference = 2 * Math.PI * radius;
  const arcLength = (arcSpan / 360) * circumference;
  const filledLength = arcLength * Math.max(0, Math.min(1, fraction));

  // dashArray: show arcLength of the total circumference
  // dashOffset: shift to show only the filled portion
  const dashArray = `${arcLength} ${circumference}`;
  const dashOffset = arcLength - filledLength;

  // Rotate so the arc starts at the bottom-left
  // For a 180° arc: rotation = 180° (starts at left, ends at right)
  // For a 270° arc: rotation = 135° (centered at bottom)
  const rotationDeg = 90 + (360 - arcSpan) / 2;

  return { circumference, dashArray, dashOffset, rotationDeg };
}

/**
 * Calculate needle CSS rotation angle for a given value in range [min, max].
 * Returns degrees for CSS `rotate()` where 0° = 12 o'clock (up), 90° = 3 o'clock.
 *
 * The SVG circle path starts at 3 o'clock and the arc is rotated by
 * `baseRotation` degrees. An additional +90° converts from SVG circle
 * coordinates (0° = right) to CSS rotation coordinates (0° = up).
 */
export function getNeedleAngle(
  value: number,
  min: number,
  max: number,
  arcSpan: number,
): number {
  const clamped = Math.max(min, Math.min(max, value));
  const fraction = max === min ? 0 : (clamped - min) / (max - min);
  // Base rotation: where the arc starts (same formula as getArcDash)
  const baseRotation = 90 + (360 - arcSpan) / 2;
  // +90 converts from SVG circle coords (0°=right) to CSS rotation (0°=up)
  return baseRotation + fraction * arcSpan + 90;
}

/**
 * For multi-segment gauges, compute per-segment dasharray/offset values.
 *
 * @param radius - circle radius
 * @param arcSpan - total arc span in degrees
 * @param segments - array of fractional sizes (should sum to 1)
 * @returns array of { dashArray, dashOffset } per segment
 */
export function getSegmentArcs(
  radius: number,
  arcSpan: number,
  segments: number[],
): Array<{ dashArray: string; dashOffset: number }> {
  const circumference = 2 * Math.PI * radius;
  const totalArcLength = (arcSpan / 360) * circumference;

  let consumedLength = 0;

  return segments.map((fraction) => {
    const segmentLength = totalArcLength * fraction;
    // Each segment: its own dashArray shows only its length
    const dashArray = `${segmentLength} ${circumference}`;
    // Offset to position this segment after all previous ones
    const dashOffset = -consumedLength;
    consumedLength += segmentLength;
    return { dashArray, dashOffset };
  });
}
