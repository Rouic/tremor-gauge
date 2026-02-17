"use client";

import React, { useState, useCallback } from "react";
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
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
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

    // Per-segment arcs
    const segments = getSegmentArcs(radius, arcSpan, fractions);

    const handleSegmentClick = useCallback(
      (index: number) => {
        if (activeIndex === index) {
          setActiveIndex(null);
          onValueChange?.(null);
        } else {
          setActiveIndex(index);
          onValueChange?.(data[index]);
        }
      },
      [activeIndex, data, onValueChange],
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
        setActiveIndex(index);
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
      if (showTooltip) {
        setTooltipPos(null);
        setActiveIndex(null);
      }
    }, [showTooltip]);

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
            const isActive = activeIndex === null || activeIndex === i;

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
                          "stroke-dashoffset 1s ease-out, opacity 0.15s ease",
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
        {showTooltip && activeIndex !== null && tooltipPos && (
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
                datum: data[activeIndex],
                color: colors[activeIndex % colors.length],
              })
            ) : (
              <div className="flex items-center gap-2 whitespace-nowrap">
                <span
                  className="size-2.5 shrink-0 rounded-sm"
                  style={{
                    backgroundColor: getColorValue(
                      colors[activeIndex % colors.length],
                    ),
                  }}
                />
                <span className="text-gray-500 dark:text-gray-500">
                  {String(data[activeIndex][category])}
                </span>
                <span className="font-medium tabular-nums text-gray-900 dark:text-gray-50">
                  {valueFormatter(Number(data[activeIndex][value]))}
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
