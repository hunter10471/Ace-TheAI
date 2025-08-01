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

const data = [
    { month: "Jan", rating: 2.1 },
    { month: "Feb", rating: 2.3 },
    { month: "Mar", rating: 2.8 },
    { month: "Apr", rating: 3.1 },
    { month: "May", rating: 3.4 },
    { month: "Jun", rating: 3.7 },
    { month: "Jul", rating: 3.5 },
    { month: "Aug", rating: 3.2 },
    { month: "Sep", rating: 2.8 },
    { month: "Oct", rating: 2.5 },
    { month: "Nov", rating: 2.3 },
    { month: "Dec", rating: 2.0 },
];

export default function RatingInsightsChart() {
    const { isDarkMode } = useThemeStore();

    const findHighestRatingIndex = () => {
        let maxIndex = 0;
        let maxRating = data[0].rating;
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

    return (
        <div className={`w-full max-w-[1000px]`}>
            <h2 className={`text-lg font-semibold ${titleColor} mb-6`}>
                Rating Insights
            </h2>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
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
                                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
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
        </div>
    );
}
