"use client";

import React from "react";
import { cx } from "../../utils/cx";
import { type Color, colorBgClasses } from "../../utils/chartColors";

export interface GaugeLegendItem {
  name: string;
  value: number;
  color: Color;
}

export interface GaugeLegendProps {
  /** Legend items to display */
  items: GaugeLegendItem[];
  /** Format the displayed value */
  valueFormatter?: (value: number) => string;
  /** Show percentage share badge next to each value (default: false) */
  showShare?: boolean;
  /** Currently active/highlighted item name */
  activeName?: string;
  /** Called when an item is clicked */
  onItemClick?: (name: string) => void;
  /** Additional class name for the root element */
  className?: string;
}

export const GaugeLegend = React.forwardRef<HTMLOListElement, GaugeLegendProps>(
  (
    {
      items,
      valueFormatter = (v) => `${v}`,
      showShare = false,
      activeName,
      onItemClick,
      className,
    },
    ref,
  ) => {
    const total = items.reduce((sum, item) => sum + item.value, 0);

    return (
      <ol
        ref={ref}
        className={cx(
          "flex flex-col divide-y divide-gray-200 dark:divide-gray-800",
          className,
        )}
        aria-label="Gauge legend"
      >
        {items.map((item) => {
          const isActive =
            activeName === undefined || activeName === item.name;
          const isClickable = onItemClick !== undefined;
          const share =
            total > 0 ? ((item.value / total) * 100).toFixed(1) : "0.0";

          return (
            <li key={item.name}>
              <button
                type="button"
                className={cx(
                  "flex w-full items-center justify-between gap-4 px-2 py-2.5 text-sm",
                  "transition-opacity duration-150",
                  isClickable &&
                    "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900",
                  !isClickable && "cursor-default",
                  !isActive && "opacity-30",
                )}
                onClick={() => onItemClick?.(item.name)}
                tabIndex={isClickable ? 0 : -1}
              >
                <span className="flex items-center gap-2 truncate">
                  <span
                    className={cx(
                      "size-2.5 shrink-0 rounded-sm",
                      colorBgClasses[item.color],
                    )}
                    aria-hidden="true"
                  />
                  <span className="truncate text-gray-700 dark:text-gray-300">
                    {item.name}
                  </span>
                </span>
                <span className="flex items-center gap-2">
                  <span className="font-medium tabular-nums text-gray-900 dark:text-gray-50">
                    {valueFormatter(item.value)}
                  </span>
                  {showShare && (
                    <span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs font-medium tabular-nums text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                      {share}%
                    </span>
                  )}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    );
  },
);

GaugeLegend.displayName = "GaugeLegend";
