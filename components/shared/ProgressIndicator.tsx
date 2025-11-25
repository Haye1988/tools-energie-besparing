"use client";

import { cn } from "@/lib/utils";

interface ProgressIndicatorProps {
  label: string;
  value: number; // jaren
  max?: number; // max jaren (default 20)
  className?: string;
}

export default function ProgressIndicator({
  label,
  value,
  max = 20,
  className,
}: ProgressIndicatorProps) {
  const percentage = Math.min((value / max) * 100, 100);
  const isGood = value <= 10; // Goed als <10 jaar
  const isModerate = value > 10 && value <= 15; // Matig als 10-15 jaar
  const isBad = value > 15; // Slecht als >15 jaar

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-semibold text-totaaladvies-blue">
          {value.toFixed(1)} jaar
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className={cn(
            "h-full transition-all duration-500 rounded-full",
            isGood && "bg-green-500",
            isModerate && "bg-yellow-500",
            isBad && "bg-red-500"
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-500">
        <span>0 jaar</span>
        <span>{max} jaar</span>
      </div>
    </div>
  );
}

