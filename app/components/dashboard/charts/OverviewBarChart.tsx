"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
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

export default function OverviewBarChart({
  data,
}: OverviewBarChartProps) {
  return (
    <div className="h-[260px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barSize={22}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e7eaf3" />
          <XAxis dataKey="name" tick={{ fill: "#667085", fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "#667085", fontSize: 12 }} axisLine={false} tickLine={false} />
          <Tooltip
            cursor={{ fill: "rgba(109,94,252,0.06)" }}
            contentStyle={{
              borderRadius: 16,
              border: "1px solid #e7eaf3",
              boxShadow: "0 10px 24px rgba(15,23,42,0.08)",
            }}
          />
          <Bar dataKey="value" fill="#6d5efc" radius={[10, 10, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}