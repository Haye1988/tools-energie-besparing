"use client";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface GraphChartInternalProps {
  type?: "line" | "bar";
  data: Array<Record<string, string | number>>;
  dataKey: string;
  lines?: Array<{ key: string; name: string; color?: string }>;
  bars?: Array<{ key: string; name: string; color?: string }>;
  xAxisLabel?: string;
  yAxisLabel?: string;
}

export default function GraphChartInternal({
  type = "line",
  data,
  dataKey,
  lines,
  bars,
  xAxisLabel,
  yAxisLabel,
}: GraphChartInternalProps) {
  const defaultColors = ["#f97316", "#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

  return (
    <ResponsiveContainer width="100%" height={300}>
      {type === "line" ? (
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey={dataKey}
            label={
              xAxisLabel ? { value: xAxisLabel, position: "insideBottom", offset: -5 } : undefined
            }
          />
          <YAxis
            label={
              yAxisLabel ? { value: yAxisLabel, angle: -90, position: "insideLeft" } : undefined
            }
          />
          <Tooltip />
          <Legend />
          {lines?.map((line, index) => (
            <Line
              key={line.key}
              type="monotone"
              dataKey={line.key}
              name={line.name}
              stroke={line.color || defaultColors[index % defaultColors.length]}
              strokeWidth={2}
            />
          ))}
        </LineChart>
      ) : (
        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey={dataKey}
            label={
              xAxisLabel ? { value: xAxisLabel, position: "insideBottom", offset: -5 } : undefined
            }
          />
          <YAxis
            label={
              yAxisLabel ? { value: yAxisLabel, angle: -90, position: "insideLeft" } : undefined
            }
          />
          <Tooltip />
          <Legend />
          {bars?.map((bar, index) => (
            <Bar
              key={bar.key}
              dataKey={bar.key}
              name={bar.name}
              fill={bar.color || defaultColors[index % defaultColors.length]}
            />
          ))}
        </BarChart>
      )}
    </ResponsiveContainer>
  );
}

