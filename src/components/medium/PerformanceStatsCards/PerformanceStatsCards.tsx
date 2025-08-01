"use client";

import React from "react";
import { RiSpeakLine } from "react-icons/ri";
import { IoIosStarOutline } from "react-icons/io";
import { RiShapesLine } from "react-icons/ri";
import { GoClock } from "react-icons/go";
import { useThemeStore } from "@/lib/store";

interface StatCard {
    icon: React.ReactNode;
    title: string;
    value: string;
}

export default function PerformanceStatsCards() {
    const { isDarkMode } = useThemeStore();

    const stats: StatCard[] = [
        {
            icon: <RiSpeakLine size={50} className="text-primary" />,
            title: "Total Interviews Completed",
            value: "247",
        },
        {
            icon: <IoIosStarOutline size={50} className="text-primary" />,
            title: "Average Score",
            value: "4.5",
        },
        {
            icon: <RiShapesLine size={50} className="text-primary" />,
            title: "Strongest Category",
            value: "Technical",
        },
        {
            icon: <GoClock size={50} className="text-primary" />,
            title: "Total Time Practiced",
            value: "120 hrs",
        },
    ];

    const textColor = "text-white";
    const subtitleColor = "text-gray-300";

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
                <div
                    key={index}
                    className={`bg-[#2D2D2D] rounded-3xl px-6 py-4 ${textColor}`}
                >
                    <div className="flex items-center justify-between mb-4">
                        <div>{stat.icon}</div>
                    </div>
                    <div className="space-y-2">
                        <p className={`${subtitleColor} text-xs font-light`}>
                            {stat.title}
                        </p>
                        <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
