"use client";

import React, { useState } from "react";
import moment from "moment";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

interface CalendarProps {
    highlightDates?: number[];
    onDateSelect?: (date: Date) => void;
}

const Calendar: React.FC<CalendarProps> = ({
    highlightDates = [],
    onDateSelect,
}) => {
    const [currentDate, setCurrentDate] = useState(moment());

    const daysOfWeek = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"];

    const goToPreviousMonth = () => {
        setCurrentDate(moment(currentDate).subtract(1, "month"));
    };

    const goToNextMonth = () => {
        setCurrentDate(moment(currentDate).add(1, "month"));
    };

    const renderCalendarDays = () => {
        const monthStart = moment(currentDate).startOf("month");
        const monthEnd = moment(currentDate).endOf("month");
        const startDate = moment(monthStart).startOf("isoWeek");
        const endDate = moment(monthEnd).endOf("isoWeek");

        const days = [];
        let day = startDate;

        while (day <= endDate) {
            const cloneDay = moment(day);
            const formattedDate = cloneDay.format("D");
            const isCurrentMonth = cloneDay.month() === currentDate.month();
            const isToday = cloneDay.isSame(moment(), "day");
            const isHighlighted =
                highlightDates.includes(parseInt(formattedDate)) &&
                isCurrentMonth;

            let dayClasses =
                "w-8 h-8 flex items-center justify-center rounded-md text-sm cursor-pointer transition-colors";

            if (!isCurrentMonth) {
                dayClasses += " text-gray-400 dark:text-gray-600";
            } else if (isToday) {
                dayClasses += " bg-primary text-white font-semibold";
            } else if (isHighlighted) {
                dayClasses +=
                    " bg-primary/20 dark:bg-primary/30 text-primary font-medium";
            } else {
                dayClasses +=
                    " text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100";
            }

            days.push(
                <div
                    key={cloneDay.format("YYYY-MM-DD")}
                    className={dayClasses}
                    onClick={() =>
                        onDateSelect && onDateSelect(cloneDay.toDate())
                    }
                >
                    {formattedDate}
                </div>
            );
            day = moment(day).add(1, "day");
        }

        return days;
    };

    return (
        <div className="mt-8 w-[280px] bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-4">
                <button
                    onClick={goToPreviousMonth}
                    className="p-2 rounded-full bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 transition-colors"
                >
                    <IoIosArrowBack size={16} />
                </button>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {currentDate.format("MMMM YYYY")}
                </h2>
                <button
                    onClick={goToNextMonth}
                    className="p-2 rounded-full bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 transition-colors"
                >
                    <IoIosArrowForward size={16} />
                </button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-3">
                {daysOfWeek.map(day => (
                    <div
                        key={day}
                        className="text-xs text-gray-500 dark:text-gray-400 font-semibold text-center py-2"
                    >
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-1">{renderCalendarDays()}</div>
        </div>
    );
};

export default Calendar;
