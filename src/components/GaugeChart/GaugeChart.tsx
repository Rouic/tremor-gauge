"use client";

import React, { useId } from "react";
import { cx } from "../../utils/cx";
import { type Color, getColorValue } from "../../utils/chartColors";
import { getArcDash, getNeedleAngle, getSegmentArcs, degToRad } from "../../utils/arc";

export interface GaugeThreshold {
  /** Value at which this zone starts */
  value: number;
  /** Color for this zone */
  color: Color;
}

export interface GaugeChartProps {
  /** Current value */
  value: number;
  /** Minimum value (default: 0) */
  min?: number;
  /** Maximum value (default: 100) */
  max?: number;
  /** Color token from Tremor palette (used when thresholds are not set) */
  color?: Color;
  /**
   * Value-based color thresholds. Each entry defines a zone starting at
   * `value`. The fill arc color changes based on the highest threshold
   * the current value has reached.
   *
   * @example
   * thresholds={[
   *   { value: 0,  color: "emerald" },
   *   { value: 60, color: "amber" },
   *   { value: 80, color: "pink" },
   * ]}
   */
  thresholds?: GaugeThreshold[];
  /**
   * How to visualize threshold zones on the background track.
   * - `"bands"` — colored arc segments behind the fill (default when showThresholdArc is true)
   * - `"ticks"` — thin tick marks at each threshold boundary
   * - `false` / not set — plain gray track
   */
  showThresholdArc?: boolean | "bands" | "ticks";
  /**
   * Apply a gradient to the fill arc. Provide two color tokens.
   */
  gradient?: { from: Color; to: Color };
  /** Format the displayed center value */
  valueFormatter?: (value: number) => string;
  /** Show the center value label (default: true) */
  showLabel?: boolean;
  /** Secondary label text below the value (e.g. "Completion Rate") */
  label?: string;
  /** Show min/max labels at the arc ends (default: false) */
  showMinMax?: boolean;
  /** Animate on mount (default: true) */
  showAnimation?: boolean;
  /** Arc span in degrees: 180 (half), 240, or 270 (default: 180) */
  arcSpan?: 180 | 240 | 270;
  /** Show a needle indicator (default: false) */
  showNeedle?: boolean;
  /** Stroke width of the arc track and fill (default: 10) */
  strokeWidth?: number;
  /** Additional class name for the root element */
  className?: string;
}

const SIZE = 200;
const CX = SIZE / 2;
const CY = SIZE / 2;

/** Resolve the fill color from thresholds or plain color prop */
function resolveColor(
  value: number,
  color: Color,
  thresholds?: GaugeThreshold[],
): Color {
  if (!thresholds || thresholds.length === 0) return color;
  const sorted = [...thresholds].sort((a, b) => a.value - b.value);
  let resolved = sorted[0].color;
  for (const t of sorted) {
    if (value >= t.value) resolved = t.color;
    else break;
  }
  return resolved;
}

export const GaugeChart = React.forwardRef<SVGSVGElement, GaugeChartProps>(
  (
    {
      value,
      min = 0,
      max = 100,
      color = "blue",
      thresholds,
      showThresholdArc = false,
      gradient,
      valueFormatter = (v) => `${v}`,
      showLabel = true,
      label,
      showMinMax = false,
      showAnimation = true,
      arcSpan = 180,
      showNeedle = false,
      strokeWidth = 10,
      className,
    },
    ref,
  ) => {
    const gradientId = useId();
    const radius = (SIZE - strokeWidth * 2) / 2;
    const range = max - min;
    const fraction =
      range <= 0
        ? 0
        : (Math.max(min, Math.min(max, value)) - min) / range;

    // Resolve fill color
    const activeColor = resolveColor(value, color, thresholds);
    const fillHex = gradient
      ? `url(#${gradientId})`
      : getColorValue(activeColor);

    // Background track (full arc)
    const track = getArcDash(radius, arcSpan, 1);
    // Filled arc
    const fill = getArcDash(radius, arcSpan, fraction);

    // Threshold arc mode
    const thresholdMode =
      showThresholdArc === true
        ? "ticks"
        : showThresholdArc === "bands"
          ? "bands"
          : showThresholdArc === "ticks"
            ? "ticks"
            : false;

    // Threshold zone bands
    const thresholdBands = (() => {
      if (
        thresholdMode !== "bands" ||
        !thresholds ||
        thresholds.length === 0 ||
        range <= 0
      )
        return null;
      const sorted = [...thresholds].sort((a, b) => a.value - b.value);
      const fracs = sorted.map((t, i) => {
        const start = (Math.max(min, t.value) - min) / range;
        const end =
          i < sorted.length - 1
            ? (Math.max(min, sorted[i + 1].value) - min) / range
            : 1;
        return { fraction: Math.max(0, end - start), color: t.color };
      });
      const arcs = getSegmentArcs(
        radius,
        arcSpan,
        fracs.map((f) => f.fraction),
      );
      return fracs.map((f, i) => ({ ...arcs[i], color: f.color }));
    })();

    // Threshold tick positions
    const thresholdTicks = (() => {
      if (
        thresholdMode !== "ticks" ||
        !thresholds ||
        thresholds.length < 2 ||
        range <= 0
      )
        return null;
      const sorted = [...thresholds].sort((a, b) => a.value - b.value);
      // Skip the first threshold (it's the arc start), draw ticks at boundaries
      return sorted.slice(1).map((t) => {
        const angle = getNeedleAngle(t.value, min, max, arcSpan);
        return { angle, color: t.color };
      });
    })();

    // Needle
    const needleAngle = showNeedle
      ? getNeedleAngle(value, min, max, arcSpan)
      : 0;
    const needleLength = radius - 4;

    // ── Label positioning ──────────────────────────────────────────
    const valueFontSize = arcSpan <= 180 ? 28 : 26;
    const labelFontSize = 12;

    const valueY = (() => {
      if (showNeedle) {
        const offset = label ? radius * 0.42 : radius * 0.35;
        return CY - offset;
      }
      if (arcSpan <= 180) return CY - (label ? 4 : -4);
      return CY + (label ? 2 : 6);
    })();
    const labelY = valueY + valueFontSize * 0.65 + 4;

    // ── ViewBox sizing ─────────────────────────────────────────────
    const minMaxLabelBottom = (() => {
      if (!showMinMax) return 0;
      if (arcSpan <= 180) return CY + strokeWidth + 14 + 12;
      const halfAngle = ((arcSpan - 180) / 2) * (Math.PI / 180);
      return (
        CY + radius * Math.cos(halfAngle) + strokeWidth + 10 + 12
      );
    })();
    const centerLabelBottom =
      showLabel && label
        ? labelY + labelFontSize
        : showLabel
          ? valueY + valueFontSize * 0.5
          : 0;
    const arcBottom =
      arcSpan <= 180 ? CY + strokeWidth + 8 : SIZE;
    const viewBoxHeight = Math.max(
      arcBottom,
      minMaxLabelBottom,
      centerLabelBottom,
    );

    const gradientAngle = track.rotationDeg;

    // Tapered needle path (triangle: narrow tip, wide base)
    const needleBaseHalf = 3.5;
    const needlePath = `M ${CX} ${CY - needleLength} L ${CX - needleBaseHalf} ${CY - 2} L ${CX + needleBaseHalf} ${CY - 2} Z`;

    return (
      <svg
        ref={ref}
        viewBox={`0 0 ${SIZE} ${viewBoxHeight}`}
        className={cx("w-full", className)}
        role="meter"
        aria-valuenow={value}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-label={
          label
            ? `${label}: ${valueFormatter(value)}`
            : `Gauge: ${valueFormatter(value)}`
        }
      >
        {/* Defs */}
        <defs>
          {gradient && (
            <linearGradient
              id={gradientId}
              gradientTransform={`rotate(${gradientAngle})`}
            >
              <stop
                offset="0%"
                stopColor={getColorValue(gradient.from)}
              />
              <stop
                offset="100%"
                stopColor={getColorValue(gradient.to)}
              />
            </linearGradient>
          )}
          {showNeedle && (
            <filter id={`${gradientId}-shadow`}>
              <feDropShadow
                dx="0"
                dy="1"
                stdDeviation="1.5"
                floodOpacity="0.15"
              />
            </filter>
          )}
        </defs>

        {/* Background track */}
        {thresholdBands ? (
          <>
            {/* Gray base with round caps for clean ends */}
            <circle
              cx={CX}
              cy={CY}
              r={radius}
              fill="none"
              className="stroke-gray-200 dark:stroke-gray-800"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={track.dashArray}
              strokeDashoffset={track.dashOffset}
              transform={`rotate(${track.rotationDeg} ${CX} ${CY})`}
            />
            {/* Colored bands (butt caps, tiled cleanly) */}
            {thresholdBands.map((zone, i) => (
              <circle
                key={i}
                cx={CX}
                cy={CY}
                r={radius}
                fill="none"
                stroke={getColorValue(zone.color)}
                strokeWidth={strokeWidth - 2}
                strokeLinecap="butt"
                strokeDasharray={zone.dashArray}
                strokeDashoffset={zone.dashOffset}
                transform={`rotate(${track.rotationDeg} ${CX} ${CY})`}
                className="opacity-15 dark:opacity-[0.12]"
              />
            ))}
          </>
        ) : (
          <circle
            cx={CX}
            cy={CY}
            r={radius}
            fill="none"
            className="stroke-gray-200 dark:stroke-gray-800"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={track.dashArray}
            strokeDashoffset={track.dashOffset}
            transform={`rotate(${track.rotationDeg} ${CX} ${CY})`}
          />
        )}

        {/* Threshold tick marks */}
        {thresholdTicks &&
          thresholdTicks.map((tick, i) => {
            const tickLen = strokeWidth + 6;
            const outerR = radius + strokeWidth / 2 + 2;
            const rad = degToRad(tick.angle - 90);
            const x1 = CX + (outerR - tickLen) * Math.cos(rad);
            const y1 = CY + (outerR - tickLen) * Math.sin(rad);
            const x2 = CX + outerR * Math.cos(rad);
            const y2 = CY + outerR * Math.sin(rad);
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={getColorValue(tick.color)}
                strokeWidth={2}
                strokeLinecap="round"
                className="opacity-50"
              />
            );
          })}

        {/* Filled arc */}
        <circle
          cx={CX}
          cy={CY}
          r={radius}
          fill="none"
          stroke={fillHex}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={fill.dashArray}
          strokeDashoffset={fill.dashOffset}
          transform={`rotate(${fill.rotationDeg} ${CX} ${CY})`}
          className={cx(
            showAnimation &&
              "motion-safe:transition-[stroke-dashoffset] motion-safe:duration-1000 motion-safe:ease-out",
          )}
        />

        {/* Needle — tapered triangle with drop shadow and hub ring */}
        {showNeedle && (
          <g
            style={{
              transform: `rotate(${needleAngle}deg)`,
              transformOrigin: `${CX}px ${CY}px`,
              ...(showAnimation
                ? {
                    transition:
                      "transform 1s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  }
                : undefined),
            }}
          >
            {/* Tapered needle body */}
            <path
              d={needlePath}
              className="fill-gray-700 dark:fill-gray-300"
              filter={`url(#${gradientId}-shadow)`}
            />
            {/* Hub outer ring */}
            <circle
              cx={CX}
              cy={CY}
              r={6}
              className="fill-white stroke-gray-700 dark:fill-gray-950 dark:stroke-gray-300"
              strokeWidth={3}
            />
            {/* Hub center dot */}
            <circle
              cx={CX}
              cy={CY}
              r={2.5}
              className="fill-gray-700 dark:fill-gray-300"
            />
          </g>
        )}

        {/* Center value + label */}
        {showLabel && (
          <>
            <text
              x={CX}
              y={valueY}
              textAnchor="middle"
              dominantBaseline="central"
              className="fill-gray-900 dark:fill-gray-50"
              style={{
                fontSize: `${valueFontSize}px`,
                fontWeight: 600,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {valueFormatter(value)}
            </text>
            {label && (
              <text
                x={CX}
                y={labelY}
                textAnchor="middle"
                dominantBaseline="central"
                className="fill-gray-500 dark:fill-gray-500"
                style={{
                  fontSize: `${labelFontSize}px`,
                  fontWeight: 500,
                }}
              >
                {label}
              </text>
            )}
          </>
        )}

        {/* Min/Max labels */}
        {showMinMax && (
          <>
            <text
              x={
                arcSpan <= 180
                  ? CX - radius - 2
                  : CX -
                    radius *
                      Math.sin(
                        ((arcSpan - 180) / 2) * (Math.PI / 180),
                      )
              }
              y={
                arcSpan <= 180
                  ? CY + strokeWidth + 14
                  : CY +
                    radius *
                      Math.cos(
                        ((arcSpan - 180) / 2) * (Math.PI / 180),
                      ) +
                    strokeWidth +
                    10
              }
              textAnchor="middle"
              className="fill-gray-400 dark:fill-gray-600"
              style={{ fontSize: "11px", fontWeight: 500 }}
            >
              {valueFormatter(min)}
            </text>
            <text
              x={
                arcSpan <= 180
                  ? CX + radius + 2
                  : CX +
                    radius *
                      Math.sin(
                        ((arcSpan - 180) / 2) * (Math.PI / 180),
                      )
              }
              y={
                arcSpan <= 180
                  ? CY + strokeWidth + 14
                  : CY +
                    radius *
                      Math.cos(
                        ((arcSpan - 180) / 2) * (Math.PI / 180),
                      ) +
                    strokeWidth +
                    10
              }
              textAnchor="middle"
              className="fill-gray-400 dark:fill-gray-600"
              style={{ fontSize: "11px", fontWeight: 500 }}
            >
              {valueFormatter(max)}
            </text>
          </>
        )}
      </svg>
    );
  },
);

GaugeChart.displayName = "GaugeChart";
