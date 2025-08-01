"use client";

import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from "react-icons/fa";

interface DateRangePickerProps {
    startDate: Date | null;
    endDate: Date | null;
    onDateRangeChange: (startDate: Date | null, endDate: Date | null) => void;
    placeholder?: string;
    className?: string;
}

export default function DateRangePicker({
    startDate,
    endDate,
    onDateRangeChange,
    placeholder = "Select date range",
    className = "",
}: DateRangePickerProps) {
    const [isOpen, setIsOpen] = useState(false);

    const handleStartDateChange = (date: Date | null) => {
        onDateRangeChange(date, endDate);
    };

    const handleEndDateChange = (date: Date | null) => {
        onDateRangeChange(startDate, date);
    };

    const formatDateRange = () => {
        if (!startDate && !endDate) return placeholder;

        const formatDate = (date: Date) => {
            return date.toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
            });
        };

        if (startDate && endDate) {
            return `${formatDate(startDate)} - ${formatDate(endDate)}`;
        }
        if (startDate) {
            return `${formatDate(startDate)} - Select end date`;
        }
        if (endDate) {
            return `Select start date - ${formatDate(endDate)}`;
        }

        return placeholder;
    };

    return (
        <div className={`relative ${className}`}>
            <div
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white cursor-pointer flex items-center justify-between"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span
                    className={
                        startDate || endDate ? "text-gray-900" : "text-gray-500"
                    }
                >
                    {formatDateRange()}
                </span>
                <FaCalendarAlt className="text-gray-400" />
            </div>

            {isOpen && (
                <div className="absolute z-10 top-full left-0 mt-2 bg-white border border-gray-300 rounded-md shadow-lg p-4 min-w-[300px]">
                    <div className="flex gap-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-2">
                                Start Date
                            </label>
                            <DatePicker
                                selected={startDate}
                                onChange={handleStartDateChange}
                                selectsStart
                                startDate={startDate as Date | undefined}
                                endDate={endDate as Date | undefined}
                                maxDate={endDate ?? new Date()}
                                dateFormat="dd/MM/yyyy"
                                placeholderText="Start date"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                popperPlacement="bottom-start"
                                isClearable
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-2">
                                End Date
                            </label>
                            <DatePicker
                                selected={endDate}
                                onChange={handleEndDateChange}
                                selectsEnd
                                startDate={startDate as Date | undefined}
                                endDate={endDate as Date | undefined}
                                minDate={startDate as Date | undefined}
                                maxDate={new Date()}
                                dateFormat="dd/MM/yyyy"
                                placeholderText="End date"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                popperPlacement="bottom-start"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end mt-4 gap-2">
                        <button
                            type="button"
                            onClick={() => {
                                onDateRangeChange(null, null);
                                setIsOpen(false);
                            }}
                            className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                        >
                            Clear
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="px-3 py-1 text-sm bg-primary text-white rounded hover:bg-primary/80"
                        >
                            Apply
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
