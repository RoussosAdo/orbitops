"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type OverviewLineChartProps = {
  data: {
    name: string;
    value: number;
  }[];
};

export default function OverviewLineChart({
  data,
}: OverviewLineChartProps) {
  return (
    <div className="h-[260px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="orbitLineFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6d5efc" stopOpacity={0.28} />
              <stop offset="95%" stopColor="#6d5efc" stopOpacity={0.02} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e7eaf3" />
          <XAxis dataKey="name" tick={{ fill: "#667085", fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "#667085", fontSize: 12 }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{
              borderRadius: 16,
              border: "1px solid #e7eaf3",
              boxShadow: "0 10px 24px rgba(15,23,42,0.08)",
            }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#6d5efc"
            strokeWidth={3}
            fill="url(#orbitLineFill)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}