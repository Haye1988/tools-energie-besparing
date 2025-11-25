"use client";

import { cn } from "@/lib/utils";

interface ScenarioRange {
  optimistisch: number;
  normaal: number;
  pessimistisch: number;
}

interface ResultRangeProps {
  title: string;
  range: ScenarioRange;
  unit?: string;
  className?: string;
  formatValue?: (value: number) => string;
}

export default function ResultRange({
  title,
  range,
  unit,
  className,
  formatValue,
}: ResultRangeProps) {
  const defaultFormat = (value: number) => {
    if (unit === "€") {
      return `€${value.toLocaleString("nl-NL", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    }
    return `${value.toLocaleString("nl-NL")}${unit ? ` ${unit}` : ""}`;
  };

  const format = formatValue || defaultFormat;

  return (
    <div className={cn("space-y-2", className)}>
      <h4 className="text-sm font-medium text-gray-700">{title}</h4>
      <div className="grid grid-cols-3 gap-2 text-sm">
        <div className="bg-green-50 p-3 rounded border border-green-200">
          <div className="text-green-700 font-medium text-xs mb-1">Optimistisch</div>
          <div className="text-green-900 text-lg font-bold">{format(range.optimistisch)}</div>
        </div>
        <div className="bg-blue-50 p-3 rounded border border-blue-200">
          <div className="text-blue-700 font-medium text-xs mb-1">Normaal</div>
          <div className="text-blue-900 text-lg font-bold">{format(range.normaal)}</div>
        </div>
        <div className="bg-orange-50 p-3 rounded border border-orange-200">
          <div className="text-orange-700 font-medium text-xs mb-1">Pessimistisch</div>
          <div className="text-orange-900 text-lg font-bold">{format(range.pessimistisch)}</div>
        </div>
      </div>
    </div>
  );
}
