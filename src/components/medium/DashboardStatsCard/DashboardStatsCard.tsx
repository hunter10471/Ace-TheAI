"use client";

import DashboardStatsChart from "@/components/small/DashboardStatsChart/DashboardStatsChart";
import { DashboardStatsCardType } from "@/lib/types";
import Image from "next/image";
import React from "react";
import moment from "moment";

interface DashboardStatsCardProps {
    title: string;
    imageSrc: string;
    stats: string;
    color: string;
    darkColor: string;
    lightColor?: string;
    type: DashboardStatsCardType;
    percentage?: number;
    progress?: number;
    chartData?: { date: string; score: number; name: string }[];
    calendarDays?: number[];
}

const DashboardStatsCard: React.FC<DashboardStatsCardProps> = ({
    title,
    imageSrc,
    stats,
    color,
    darkColor,
    lightColor,
    type,
    percentage,
    progress,
    chartData,
    calendarDays,
}: DashboardStatsCardProps) => {
    const renderCardBottom = () => {
        switch (type) {
            case DashboardStatsCardType.PracticeSessions:
                return (
                    <div className="mx-3 mt-3">
                        <div
                            style={{ backgroundColor: lightColor }}
                            className={`w-full h-[10px] rounded-full`}
                        >
                            <div
                                style={{
                                    backgroundColor: darkColor,
                                    width: `${progress}%`,
                                }}
                                className="h-full rounded-full"
                            ></div>
                        </div>
                        <div className="flex items-center justify-between text-sm font-light mt-2">
                            <span className="text-white">Completed:</span>
                            <span className="text-white/70">{progress}%</span>
                        </div>
                    </div>
                );
            case DashboardStatsCardType.InterviewSuccess:
                return <DashboardStatsChart strokeColor={darkColor} />;
            case DashboardStatsCardType.InterviewThisWeek:
                return (
                    <div className="mx-3 mt-1.5 text-white font-light">
                        <div className="grid grid-cols-7 gap-1 text-center mb-2">
                            {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map(
                                (day, index) => (
                                    <div key={index} className="text-xs">
                                        {day}
                                    </div>
                                )
                            )}
                        </div>

                        <div className="grid grid-cols-7 gap-1 text-center">
                            {(() => {
                                const today = moment();
                                const startOfWeek = moment().startOf("isoWeek");
                                const days = [];

                                for (let i = 0; i < 7; i++) {
                                    const currentDay = moment(startOfWeek).add(
                                        i,
                                        "days"
                                    );
                                    const isToday = currentDay.isSame(
                                        today,
                                        "day"
                                    );
                                    const hasInterview = calendarDays?.includes(
                                        currentDay.date()
                                    );
                                    days.push(
                                        <div
                                            style={{
                                                backgroundColor:
                                                    hasInterview || isToday
                                                        ? darkColor
                                                        : "transparent",
                                            }}
                                            key={i}
                                            className={`
                        text-xs rounded-full w-5 h-5 mx-auto flex items-center justify-center`}
                                        >
                                            {currentDay.date()}
                                        </div>
                                    );
                                }

                                return days;
                            })()}
                        </div>
                    </div>
                );
        }
    };
    return (
        <div
            style={{ backgroundColor: color }}
            className={`rounded-2xl py-2 w-[200px] h-[270px] overflow-hidden`}
        >
            <div className="bg-white rounded-2xl w-fit mx-auto">
                <div className="relative w-[180px] h-[120px]">
                    <Image
                        src={imageSrc}
                        alt="Dashboard Stats Card"
                        fill
                        className="object-contain"
                    />
                </div>
            </div>
            <p className="text-white leading-tight mt-2 mb-0 text-base max-w-[200px] px-3">
                {title}
            </p>
            <div className="flex items-center justify-between w-full my-1 px-3 text-sm">
                <span className="font-light text-white/80">{stats}</span>
                {percentage && (
                    <span
                        className={`bg-white/20 p-1 rounded-xl ${
                            percentage > 0 ? "text-[#58FF49]" : "text-[#FF0000]"
                        }`}
                    >
                        {percentage >= 0 ? "+" : ""}
                        {percentage}%
                    </span>
                )}
            </div>
            {renderCardBottom()}
        </div>
    );
};

export default DashboardStatsCard;
