"use client";

import React, { useState, useCallback, useLayoutEffect } from "react";
import { cx } from "../../utils/cx";
import {
  type Color,
  getColorValue,
  availableColors,
} from "../../utils/chartColors";
import { getArcDash, getSegmentArcs, getNeedleAngle } from "../../utils/arc";

export interface GaugeMultiDatum {
  [key: string]: string | number;
}

export interface GaugeMultiProps {
  /** Array of data objects */
  data: GaugeMultiDatum[];
  /** Key in each datum that holds the category/label string */
  category: string;
  /** Key in each datum that holds the numeric value */
  value: string;
  /** Color tokens, one per data item (cycles if fewer) */
  colors?: Color[];
  /** Center label text (e.g. "Total Revenue") */
  label?: string;
  /** Show a tooltip on hover (default: true) */
  showTooltip?: boolean;
  /** Called when a segment is clicked or deselected (null) */
  onValueChange?: (datum: GaugeMultiDatum | null) => void;
  /**
   * Externally controlled active/highlighted segment name.
   * When set, this segment is highlighted and others are dimmed.
   * Use together with `onValueChange` for bidirectional sync with GaugeLegend.
   */
  activeName?: string;
  /** Custom tooltip renderer */
  customTooltip?: (props: {
    datum: GaugeMultiDatum;
    color: Color;
  }) => React.ReactNode;
  /** Format values in the default tooltip */
  valueFormatter?: (value: number) => string;
  /** Optional marker value shown as a tick on the arc */
  marker?: { value: number; label?: string };
  /** Arc span in degrees (default: 180) */
  arcSpan?: 180 | 240 | 270;
  /** Stroke width (default: 12) */
  strokeWidth?: number;
  /** Show animation (default: true) */
  showAnimation?: boolean;
  /** Additional class name */
  className?: string;
}

const SIZE = 200;
const CX = SIZE / 2;
const CY = SIZE / 2;

export const GaugeMulti = React.forwardRef<SVGSVGElement, GaugeMultiProps>(
  (
    {
      data,
      category,
      value,
      colors = availableColors,
      label,
      showTooltip = true,
      onValueChange,
      activeName,
      customTooltip,
      valueFormatter = (v) => `${v}`,
      marker,
      arcSpan = 180,
      strokeWidth = 12,
      showAnimation = true,
      className,
    },
    ref,
  ) => {
    const [mounted, setMounted] = useState(!showAnimation);
    useLayoutEffect(() => {
      if (!showAnimation) return;
      const id = requestAnimationFrame(() => setMounted(true));
      return () => cancelAnimationFrame(id);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Internal click selection (used when activeName is not controlled externally)
    const [clickedIndex, setClickedIndex] = useState<number | null>(null);
    // Hover state — only for tooltip, separate from highlight
    const [hoverIndex, setHoverIndex] = useState<number | null>(null);
    const [tooltipPos, setTooltipPos] = useState<{
      x: number;
      y: number;
    } | null>(null);

    const radius = (SIZE - strokeWidth * 2) / 2;
    const total = data.reduce(
      (sum, d) => sum + (Number(d[value]) || 0),
      0,
    );
    const fractions = data.map((d) =>
      total === 0 ? 0 : (Number(d[value]) || 0) / total,
    );

    // Background track
    const track = getArcDash(radius, arcSpan, 1);
    const rotationDeg = track.rotationDeg;

    // Per-segment arcs — start at zero and animate to real values
    const zeroFractions = data.map(() => 0);
    const segments = getSegmentArcs(
      radius,
      arcSpan,
      mounted ? fractions : zeroFractions,
    );

    // Resolve which segment index is "active" for highlight purposes
    const resolvedActiveIndex = (() => {
      // External control via activeName takes precedence
      if (activeName !== undefined) {
        const idx = data.findIndex(
          (d) => String(d[category]) === activeName,
        );
        return idx >= 0 ? idx : null;
      }
      // Fall back to internal click state
      return clickedIndex;
    })();

    const handleSegmentClick = useCallback(
      (index: number) => {
        const isDeselect = resolvedActiveIndex === index;
        if (activeName === undefined) {
          // Uncontrolled: toggle internal state
          setClickedIndex(isDeselect ? null : index);
        }
        onValueChange?.(isDeselect ? null : data[index]);
      },
      [resolvedActiveIndex, activeName, data, onValueChange],
    );

    const handleMouseEnter = useCallback(
      (e: React.MouseEvent<SVGCircleElement>, index: number) => {
        if (!showTooltip) return;
        const svg = (e.target as SVGCircleElement).closest("svg");
        if (!svg) return;
        const rect = svg.getBoundingClientRect();
        setTooltipPos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
        setHoverIndex(index);
      },
      [showTooltip],
    );

    const handleMouseMove = useCallback(
      (e: React.MouseEvent<SVGCircleElement>) => {
        if (!showTooltip) return;
        const svg = (e.target as SVGCircleElement).closest("svg");
        if (!svg) return;
        const rect = svg.getBoundingClientRect();
        setTooltipPos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      },
      [showTooltip],
    );

    const handleMouseLeave = useCallback(() => {
      setTooltipPos(null);
      setHoverIndex(null);
    }, []);

    // Tooltip shows for hover OR active segment
    const tooltipIndex = hoverIndex ?? resolvedActiveIndex;

    // Marker
    const markerAngle =
      marker !== undefined
        ? getNeedleAngle(marker.value, 0, total, arcSpan)
        : null;

    // Center label positioning (computed first so viewBox can account for it)
    const valueFontSize = 26;
    const labelFontSize = 12;
    const centerValueY = arcSpan <= 180 ? CY - 4 : CY + 2;
    const centerLabelY = centerValueY + valueFontSize * 0.7 + 2;

    // ViewBox sizing — account for center label bottom edge
    const arcBottom = arcSpan <= 180 ? CY + strokeWidth + 8 : SIZE;
    const centerLabelBottom = label ? centerLabelY + labelFontSize : 0;
    const viewBoxHeight = Math.max(arcBottom, centerLabelBottom);

    return (
      <div className={cx("relative", className)}>
        <svg
          ref={ref}
          viewBox={`0 0 ${SIZE} ${viewBoxHeight}`}
          className="w-full"
          role="img"
          aria-label="Multi-segment gauge"
        >
          {/* Background track */}
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
            transform={`rotate(${rotationDeg} ${CX} ${CY})`}
          />

          {/* Segments */}
          {segments.map((seg, i) => {
            const segColor = colors[i % colors.length];
            const isActive =
              resolvedActiveIndex === null || resolvedActiveIndex === i;

            return (
              <circle
                key={`${data[i][category]}`}
                cx={CX}
                cy={CY}
                r={radius}
                fill="none"
                stroke={getColorValue(segColor)}
                strokeWidth={strokeWidth}
                strokeDasharray={seg.dashArray}
                strokeDashoffset={seg.dashOffset}
                transform={`rotate(${rotationDeg} ${CX} ${CY})`}
                className={cx(
                  "cursor-pointer transition-opacity duration-150",
                  !isActive && "opacity-30",
                )}
                style={
                  showAnimation
                    ? {
                        transition:
                          "stroke-dasharray 1s ease-out, stroke-dashoffset 1s ease-out, opacity 0.15s ease",
                      }
                    : undefined
                }
                onClick={() => handleSegmentClick(i)}
                onMouseEnter={(e) => handleMouseEnter(e, i)}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                data-testid={`segment-${i}`}
              />
            );
          })}

          {/* Marker tick */}
          {markerAngle !== null && (
            <line
              x1={CX}
              y1={CY - radius + strokeWidth / 2 + 2}
              x2={CX}
              y2={CY - radius - strokeWidth / 2 - 2}
              className="stroke-gray-700 dark:stroke-gray-200"
              strokeWidth={2.5}
              strokeLinecap="round"
              transform={`rotate(${markerAngle} ${CX} ${CY})`}
            />
          )}

          {/* Center label */}
          {label && (
            <>
              <text
                x={CX}
                y={centerValueY}
                textAnchor="middle"
                dominantBaseline="central"
                className="fill-gray-900 dark:fill-gray-50"
                style={{
                  fontSize: `${valueFontSize}px`,
                  fontWeight: 600,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {valueFormatter(total)}
              </text>
              <text
                x={CX}
                y={centerLabelY}
                textAnchor="middle"
                dominantBaseline="central"
                className="fill-gray-500 dark:fill-gray-500"
                style={{ fontSize: `${labelFontSize}px`, fontWeight: 500 }}
              >
                {label}
              </text>
            </>
          )}
        </svg>

        {/* Tooltip */}
        {showTooltip && tooltipIndex !== null && tooltipPos && (
          <div
            className="pointer-events-none absolute z-10 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm shadow-sm dark:border-gray-800 dark:bg-gray-950"
            style={{
              left: tooltipPos.x,
              top: tooltipPos.y - 44,
              transform: "translateX(-50%)",
            }}
          >
            {customTooltip ? (
              customTooltip({
                datum: data[tooltipIndex],
                color: colors[tooltipIndex % colors.length],
              })
            ) : (
              <div className="flex items-center gap-2 whitespace-nowrap">
                <span
                  className="size-2.5 shrink-0 rounded-sm"
                  style={{
                    backgroundColor: getColorValue(
                      colors[tooltipIndex % colors.length],
                    ),
                  }}
                />
                <span className="text-gray-500 dark:text-gray-500">
                  {String(data[tooltipIndex][category])}
                </span>
                <span className="font-medium tabular-nums text-gray-900 dark:text-gray-50">
                  {valueFormatter(Number(data[tooltipIndex][value]))}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    );
  },
);

GaugeMulti.displayName = "GaugeMulti";
