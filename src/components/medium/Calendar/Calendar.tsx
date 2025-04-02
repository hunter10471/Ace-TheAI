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

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = moment(day);
        const formattedDate = cloneDay.format("D");
        const isCurrentMonth = cloneDay.month() === currentDate.month();
        const isToday = cloneDay.isSame(moment(), "day");
        const isHighlighted =
          highlightDates.includes(parseInt(formattedDate)) && isCurrentMonth;

        days.push(
          <div
            key={cloneDay.format("YYYY-MM-DD")}
            className={`
              w-8 h-8 flex items-center justify-center rounded-md text-sm cursor-pointer
              ${!isCurrentMonth ? "text-gray-300" : ""}
              ${isToday ? "bg-primary text-white" : ""}
              ${isHighlighted && !isToday ? "bg-primary/20 text-primary" : ""}
              ${
                isCurrentMonth && !isToday && !isHighlighted
                  ? "hover:bg-gray-100"
                  : ""
              }
            `}
            onClick={() => onDateSelect && onDateSelect(cloneDay.toDate())}
          >
            {formattedDate}
          </div>
        );
        day = moment(day).add(1, "day");
      }
      rows.push(
        <div
          key={day.format("YYYY-MM-DD") + "row"}
          className="grid grid-cols-7 gap-1"
        >
          {days}
        </div>
      );
      days = [];
    }

    return rows;
  };

  return (
    <div className="h-[300px] mt-8 w-[280px]">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={goToPreviousMonth}
          className="p-2 rounded-full bg-white hover:bg-white/80"
        >
          <IoIosArrowBack size={20} />
        </button>
        <h2 className="text-lg font-medium">
          {currentDate.format("MMMM YYYY")}
        </h2>
        <button
          onClick={goToNextMonth}
          className="p-2 rounded-full bg-white hover:bg-white/80"
        >
          <IoIosArrowForward size={20} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {daysOfWeek.map((day) => (
          <div
            key={day}
            className="text-xs text-gray-500 font-medium text-center"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="space-y-1">{renderCalendarDays()}</div>
    </div>
  );
};

export default Calendar;
