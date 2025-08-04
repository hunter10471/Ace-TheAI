"use client";

import {
    Bar,
    XAxis,
    YAxis,
    ResponsiveContainer,
    BarChart,
    Tooltip,
    Cell,
} from "recharts";
import { ChartContainer } from "@/components/ui/chart";
import { useState } from "react";
import { useThemeStore } from "@/lib/store";
import { PerformanceCategory } from "@/lib/performance-operations";
import { PiStudentLight } from "react-icons/pi";

interface PerformanceCategoryChartProps {
    data: PerformanceCategory[];
    totalInterviews: number;
}

export default function PerformanceCategoryChart({
    data,
    totalInterviews,
}: PerformanceCategoryChartProps) {
    const { isDarkMode } = useThemeStore();
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [isHovering, setIsHovering] = useState(false);

    const chartConfig = {
        percentage: {
            label: "Percentage",
            color: "hsl(var(--primary))",
        },
    };

    const textColor = isDarkMode ? "#E5E7EB" : "#6B7280";
    const titleColor = isDarkMode ? "text-gray-100" : "text-gray-900";

    const hasInsufficientData = totalInterviews < 3;

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div
                    className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg"
                    style={{
                        background: isDarkMode
                            ? "rgba(31, 41, 55, 0.95)"
                            : "rgba(255,255,255,0.95)",
                        border: isDarkMode
                            ? "1px solid #4B5563"
                            : "1px solid #E5E7EB",
                    }}
                >
                    <p
                        className={`text-sm font-semibold ${
                            isDarkMode ? "text-gray-100" : "text-gray-900"
                        }`}
                    >
                        {data.fullLabel}
                    </p>
                    <p
                        className={`text-sm ${
                            isDarkMode ? "text-gray-300" : "text-gray-600"
                        }`}
                    >
                        Performance: {data.percentage}%
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className={`w-full max-w-[500px] relative`}>
            <h2 className={`text-lg font-semibold ${titleColor} mb-4`}>
                Performance by Category
            </h2>
            <div className="relative">
                <ChartContainer
                    config={chartConfig}
                    className="h-[150px] w-full"
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={data}
                            layout="vertical"
                            barGap={0}
                            onMouseMove={state => {
                                if (
                                    state &&
                                    state.activeTooltipIndex !== undefined
                                ) {
                                    setActiveIndex(state.activeTooltipIndex);
                                    setIsHovering(true);
                                }
                            }}
                            onMouseLeave={() => {
                                setIsHovering(false);
                                setActiveIndex(null);
                            }}
                        >
                            <XAxis
                                type="number"
                                domain={[0, 100]}
                                ticks={[0, 25, 50, 75, 100]}
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12, fill: textColor }}
                                tickFormatter={value => `${value}%`}
                            />
                            <YAxis
                                type="category"
                                dataKey="category"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12, fill: textColor }}
                                width={50}
                            />
                            <Tooltip
                                content={<CustomTooltip />}
                                cursor={{
                                    fill: isDarkMode
                                        ? "rgba(255, 255, 255, 0.1)"
                                        : "rgba(0, 0, 0, 0.05)",
                                }}
                            />
                            <Bar
                                dataKey="percentage"
                                radius={[0, 4, 4, 0]}
                                barSize={60}
                            >
                                {data.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={entry.color}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </ChartContainer>
                {hasInsufficientData && (
                    <div className="absolute inset-0 bg-white/30 dark:bg-gray-900/30 backdrop-blur-md flex items-center justify-center rounded-lg">
                        <div className="text-center p-4">
                            <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                <PiStudentLight
                                    size={50}
                                    className="inline-block"
                                />{" "}
                                More Practice Needed
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">
                                Complete at least 3 interviews to unlock
                                detailed insights
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
