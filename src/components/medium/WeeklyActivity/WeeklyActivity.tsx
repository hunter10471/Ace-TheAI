"use client";

import type React from "react";

interface WeeklyActivityDay {
    day: string;
    hours: number;
}

type WeeklyActivityProps = {
    data: WeeklyActivityDay[];
};

function barColors(hours: number) {
    if (hours >= 5) {
        return { bgColor: "bg-[#C9E2FF]", borderColor: "border-[#63A8FD]" };
    }
    if (hours >= 3) {
        return { bgColor: "bg-[#FFFEAD]", borderColor: "border-[#CBC956]" };
    }
    return { bgColor: "bg-[#FFD9D1]", borderColor: "border-[#FEA997]" };
}

const WeeklyActivity: React.FC<WeeklyActivityProps> = ({ data }) => {
    const maxHours = Math.max(6, ...data.map(d => d.hours));

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-5 w-[300px] dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-6 text-gray-900 dark:text-gray-100">
                Weekly Activity
            </h3>

            <div className="relative">
                <div className="ml-6">
                    {/* Y-axis labels */}
                    <div className="absolute left-0 top-0 h-36 flex flex-col justify-between text-xs text-gray-400 dark:text-gray-500 ">
                        <span className="leading-none">6h</span>
                        <span className="leading-none">5h</span>
                        <span className="leading-none">4h</span>
                        <span className="leading-none">3h</span>
                        <span className="leading-none">2h</span>
                        <span className="leading-none">1h</span>
                    </div>

                    {/* Bar chart */}
                    <div className="flex items-end justify-center h-36 mb-4 gap-[1px]">
                        {data.map((entry, index) => {
                            const { bgColor, borderColor } = barColors(
                                entry.hours
                            );
                            return (
                                <div
                                    key={index}
                                    className="flex flex-col items-center"
                                >
                                    <div
                                        title={`${entry.day}: ${entry.hours}h`}
                                        className={`w-8 rounded-sm border ${borderColor} ${bgColor} transition-all duration-300 hover:opacity-80`}
                                        style={{
                                            height: `${Math.max(
                                                (entry.hours / maxHours) * 144,
                                                12
                                            )}px`,
                                        }}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Day labels */}
            <div className="flex justify-center text-xs text-gray-500 dark:text-gray-400 mt-3 gap-1 ml-6">
                {data.map((entry, index) => (
                    <span key={index} className="text-center w-8">
                        {entry.day}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default WeeklyActivity;
