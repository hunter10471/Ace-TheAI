"use client";

import {
    Line,
    XAxis,
    YAxis,
    ResponsiveContainer,
    ComposedChart,
    Bar,
    Tooltip,
} from "recharts";
import { ChartContainer } from "@/components/ui/chart";
import { useState } from "react";
import { useThemeStore } from "@/lib/store";
import { RatingInsight } from "@/lib/performance-operations";
import { PiStudentLight } from "react-icons/pi";

interface RatingInsightsChartProps {
    data: RatingInsight[];
    totalInterviews: number;
}

export default function RatingInsightsChart({
    data,
    totalInterviews,
}: RatingInsightsChartProps) {
    const { isDarkMode } = useThemeStore();

    const findHighestRatingIndex = () => {
        let maxIndex = 0;
        let maxRating = data[0]?.rating || 0;
        data.forEach((item, index) => {
            if (item.rating > maxRating) {
                maxRating = item.rating;
                maxIndex = index;
            }
        });
        return maxIndex;
    };

    const defaultActiveIndex = findHighestRatingIndex();
    const [activeIndex, setActiveIndex] = useState<number | null>(
        defaultActiveIndex
    );
    const [isHovering, setIsHovering] = useState(false);

    const dataWithHighlight = data.map((item, index) => ({
        ...item,
        highlight: activeIndex === index ? item.rating : 0,
    }));

    const chartConfig = {
        rating: {
            label: "Average",
            color: "#FF6F61",
        },
    };

    const textColor = isDarkMode ? "#E5E7EB" : "#6B7280";
    const bgColor = isDarkMode ? "bg-gray-800" : "bg-gray-50";
    const titleColor = isDarkMode ? "text-gray-100" : "text-gray-900";

    const hasInsufficientData = totalInterviews < 3;

    return (
        <div className={`w-full max-w-[1000px] relative`}>
            <h2 className={`text-lg font-semibold ${titleColor} mb-6`}>
                Rating Insights
            </h2>
            <div className="relative">
                <ChartContainer
                    config={chartConfig}
                    className="h-[300px] w-full"
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart
                            data={dataWithHighlight}
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
                                setActiveIndex(defaultActiveIndex);
                            }}
                        >
                            <XAxis
                                dataKey="month"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12, fill: textColor }}
                                dy={10}
                            />
                            <YAxis
                                domain={[0, 5]}
                                ticks={[0, 1, 2, 3, 4, 5]}
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12, fill: textColor }}
                                dx={-10}
                            />
                            <Tooltip
                                contentStyle={{
                                    background: isDarkMode
                                        ? "rgba(31, 41, 55, 0.95)"
                                        : "rgba(255,255,255,0.95)",
                                    border: isDarkMode
                                        ? "1px solid #4B5563"
                                        : "1px solid #E5E7EB",
                                    borderRadius: "8px",
                                    boxShadow:
                                        "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                                    fontSize: "12px",
                                    padding: "8px 12px",
                                }}
                                labelStyle={{
                                    color: isDarkMode ? "#e5e7eb" : "#374151",
                                    fontWeight: "600",
                                    marginBottom: "4px",
                                }}
                                itemStyle={{
                                    fontWeight: "bold",
                                    color: isDarkMode ? "#fff" : "#374151",
                                }}
                                formatter={(value, name) => {
                                    if (name === "rating") {
                                        return [`Average ${value}`, "Rating"];
                                    }
                                    return [value, name];
                                }}
                                labelFormatter={label => `${label}`}
                                cursor={{
                                    stroke: "#FF6F61",
                                    strokeWidth: 1,
                                    strokeDasharray: "3 3",
                                }}
                                active={isHovering || activeIndex !== null}
                            />
                            <Bar
                                dataKey="highlight"
                                fill="hsla(0, 84%, 60%, 0.2)"
                                radius={0}
                                barSize={30}
                            />
                            <Line
                                type="monotone"
                                dataKey="rating"
                                stroke="#FF6F61"
                                strokeWidth={4}
                                dot={{
                                    fill: "#FF6F61",
                                    strokeWidth: 2,
                                    stroke: isDarkMode ? "#1F2937" : "#FFFFFF",
                                    r: 5,
                                    strokeDasharray: "0",
                                }}
                                activeDot={{
                                    r: 8,
                                    fill: "#FF6F61",
                                    strokeWidth: 3,
                                    stroke: isDarkMode ? "#1F2937" : "#FFFFFF",
                                    strokeDasharray: "0",
                                }}
                                connectNulls={true}
                            />
                        </ComposedChart>
                    </ResponsiveContainer>
                </ChartContainer>
                {hasInsufficientData && (
                    <div className="absolute inset-0 bg-white/30 dark:bg-gray-900/30 backdrop-blur-md flex items-center justify-center rounded-lg">
                        <div className="text-center p-6">
                            <div className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                <PiStudentLight
                                    size={50}
                                    className="inline-block"
                                />{" "}
                                More Practice Needed
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                Complete at least 3 interviews to unlock
                                detailed chart insights
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
