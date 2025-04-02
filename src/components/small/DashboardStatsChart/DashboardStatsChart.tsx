"use client";
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import React from "react";
import { interviewSuccessRateChartData } from "@/lib/data";

interface DashboardStatsChartProps {
  strokeColor: string;
  chartData?: { date: string; score: number; name: string }[];
}

const DashboardStatsChart: React.FC<DashboardStatsChartProps> = ({
  strokeColor,
  chartData = interviewSuccessRateChartData,
}) => {
  return (
    <ResponsiveContainer width="100%" height={50}>
      <AreaChart
        data={chartData}
        margin={{
          top: 5,
          right: 0,
          left: 0,
          bottom: 5,
        }}
      >
        <defs>
          <linearGradient
            id={`colorGradient-${strokeColor.replace("#", "")}`}
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop offset="5%" stopColor={strokeColor} stopOpacity={0.8} />
            <stop offset="95%" stopColor={strokeColor} stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <XAxis dataKey="date" hide={true} />
        <Tooltip
          contentStyle={{
            background: "rgba(255,255,255,0.9)",
            border: "none",
            borderRadius: "8px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            fontSize: "12px",
            padding: "4px 10px"
          }}
          labelStyle={{ color: "#333", fontWeight: "lighter" }}
          itemStyle={{ fontWeight: "bold" }}
        />
        <Area
          type="monotone"
          dataKey="score"
          stroke={strokeColor}
          strokeWidth={2}
          fill={`url(#colorGradient-${strokeColor.replace("#", "")})`}
          fillOpacity={1}
          activeDot={{ r: 4, strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default DashboardStatsChart;
