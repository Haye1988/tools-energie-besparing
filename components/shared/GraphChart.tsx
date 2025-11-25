"use client";

import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";

// Lazy load recharts to reduce initial bundle size (~290 kB)
const RechartsChart = dynamic(
  () => import("./GraphChartInternal"),
  { ssr: false, loading: () => <div className="h-[300px] flex items-center justify-center text-gray-500">Grafiek laden...</div> }
);

interface GraphChartProps {
  type?: "line" | "bar";
  data: Array<Record<string, string | number>>;
  dataKey: string;
  lines?: Array<{ key: string; name: string; color?: string }>;
  bars?: Array<{ key: string; name: string; color?: string }>;
  title?: string;
  className?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
}

export default function GraphChart(props: GraphChartProps) {
  return (
    <div className={cn("w-full", props.className)}>
      {props.title && <h4 className="text-lg font-semibold text-gray-900 mb-4">{props.title}</h4>}
      <RechartsChart {...props} />
    </div>
  );
}
