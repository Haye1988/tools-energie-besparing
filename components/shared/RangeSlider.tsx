"use client";

import { cn } from "@/lib/utils";

interface RangeSliderProps {
  label: string;
  name: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  helpText?: string;
  className?: string;
}

export default function RangeSlider({
  label,
  name,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  unit,
  helpText,
  className,
}: RangeSliderProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <label htmlFor={name} className="block text-sm font-medium text-totaaladvies-gray-medium">
          {label}
        </label>
        <span className="text-sm font-semibold text-totaaladvies-blue">
          {value}
          {unit && ` ${unit}`}
        </span>
      </div>
      <input
        type="range"
        id={name}
        name={name}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        min={min}
        max={max}
        step={step}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-totaaladvies-orange"
        style={{
          background: `linear-gradient(to right, #f97316 0%, #f97316 ${((value - min) / (max - min)) * 100}%, #e5e7eb ${((value - min) / (max - min)) * 100}%, #e5e7eb 100%)`,
        }}
      />
      <div className="flex justify-between text-xs text-totaaladvies-gray-medium">
        <span>
          {min}
          {unit && ` ${unit}`}
        </span>
        <span>
          {max}
          {unit && ` ${unit}`}
        </span>
      </div>
      {helpText && <p className="text-xs text-totaaladvies-gray-medium">{helpText}</p>}
    </div>
  );
}
