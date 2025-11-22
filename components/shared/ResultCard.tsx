"use client";

import { cn } from "@/lib/utils";
import { formatCurrency, formatNumber, formatPercentage } from "@/lib/utils";

interface ResultCardProps {
  title: string;
  value: string | number;
  unit?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  variant?: "default" | "success" | "warning" | "info";
  className?: string;
}

export default function ResultCard({
  title,
  value,
  unit,
  subtitle,
  icon,
  variant = "default",
  className,
}: ResultCardProps) {
  const formatValue = (val: string | number): string => {
    if (typeof val === "string") return val;
    if (unit === "€" || unit === "EUR") return formatCurrency(val);
    if (unit === "%") return formatPercentage(val);
    return formatNumber(val, 1);
  };

  const variantStyles = {
    default: "bg-white border border-gray-100",
    success: "bg-gradient-card-success border border-success-200",
    warning: "bg-gradient-card-warning border border-yellow-200",
    info: "bg-gradient-card-info border border-blue-200",
  };

  const iconColors = {
    default: "text-totaaladvies-orange",
    success: "text-success-600",
    warning: "text-yellow-600",
    info: "text-totaaladvies-blue-light",
  };

  return (
    <div
      className={cn(
        "card-hover p-6 rounded-card shadow-card border text-center animate-slide-up",
        variantStyles[variant],
        className
      )}
    >
      {icon && (
        <div className={cn("flex justify-center mb-3", iconColors[variant])}>
          <div className="text-3xl">{icon}</div>
        </div>
      )}
      <h3 className="text-sm font-medium text-totaaladvies-gray-medium mb-3">{title}</h3>
      <div className="flex items-baseline justify-center gap-2">
        <span className="text-4xl lg:text-5xl font-extrabold text-totaaladvies-blue">
          {formatValue(value)}
        </span>
        {unit && unit !== "€" && unit !== "EUR" && (
          <span className="text-xl font-medium text-totaaladvies-gray-medium">{unit}</span>
        )}
      </div>
      {subtitle && <p className="text-sm text-totaaladvies-gray-medium mt-3">{subtitle}</p>}
    </div>
  );
}
