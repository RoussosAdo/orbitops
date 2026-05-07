"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type OverviewBarChartProps = {
  data: {
    name: string;
    value: number;
  }[];
};

const BAR_COLORS = [
  "#c7d2fe",
  "#8b80ff",
  "#7c6fff",
  "#6d5efc",
  "#5b4cf6",
  "#7c6fff",
  "#a5b4fc",
];

export default function OverviewBarChart({
  data,
}: OverviewBarChartProps) {
  return (
    <div className="h-[220px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barCategoryGap={28}>
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
            cursor={{ fill: "rgba(109,94,252,0.06)" }}
            contentStyle={{
              borderRadius: 16,
              border: "1px solid #e7eaf3",
              boxShadow: "0 10px 24px rgba(15,23,42,0.08)",
              background: "#fff",
            }}
          />
          <Bar
            dataKey="value"
            radius={[10, 10, 10, 10]}
            animationDuration={1100}
            animationBegin={120}
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={BAR_COLORS[index % BAR_COLORS.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}