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
    <div className="h-[220px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="orbitLineFillV7" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6d5efc" stopOpacity={0.28} />
              <stop offset="60%" stopColor="#6d5efc" stopOpacity={0.1} />
              <stop offset="95%" stopColor="#6d5efc" stopOpacity={0.02} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="4 4"
            vertical={false}
            stroke="#e7eaf3"
          />
          <XAxis
            dataKey="name"
            tick={{ fill: "#98a2b3", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#98a2b3", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={24}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 16,
              border: "1px solid #e7eaf3",
              boxShadow: "0 10px 24px rgba(15,23,42,0.08)",
              background: "#fff",
            }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#6d5efc"
            strokeWidth={3}
            fill="url(#orbitLineFillV7)"
            animationDuration={1300}
            animationBegin={150}
            dot={false}
            activeDot={{
              r: 5,
              fill: "#6d5efc",
              stroke: "#ffffff",
              strokeWidth: 2,
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}