"use client";

import { useState } from "react";
import { feedbackHistoryData, FeedbackEntry } from "@/lib/data";
import { FaCheck } from "react-icons/fa";
import { IoIosStar, IoIosStarOutline } from "react-icons/io";
import { LuSettings2, LuCog, LuUsers } from "react-icons/lu";
import { TbUserExclamation } from "react-icons/tb";
import { IoCheckmarkCircle } from "react-icons/io5";
import PageHeader from "@/components/big/PageHeader/PageHeader";
import FeedbackCard from "@/components/medium/FeedbackCard/FeedbackCard";
import DateRangePicker from "@/components/medium/DateRangePicker/DateRangePicker";
import FeedbackDetailModal from "@/components/medium/FeedbackDetailModal/FeedbackDetailModal";

export default function FeedbackHistoryPage() {
    const [selectedRating, setSelectedRating] = useState<number>(4);
    const [selectedCategory, setSelectedCategory] =
        useState<string>("Behavioral");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedFeedback, setSelectedFeedback] =
        useState<FeedbackEntry | null>(null);
    const [startDate, setStartDate] = useState<Date | null>(
        new Date(2024, 6, 27)
    );
    const [endDate, setEndDate] = useState<Date | null>(new Date(2024, 6, 30));

    const feedbackPerPage = 6;
    const totalPages = Math.ceil(feedbackHistoryData.length / feedbackPerPage);
    const startIndex = (currentPage - 1) * feedbackPerPage;
    const endIndex = startIndex + feedbackPerPage;
    const currentFeedback = feedbackHistoryData.slice(startIndex, endIndex);

    const displayFeedback = currentFeedback;

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case "Technical":
                return <LuCog className="w-4 h-4" />;
            case "Behavioral":
                return <LuUsers className="w-4 h-4" />;
            case "Situational":
                return <TbUserExclamation className="w-4 h-4" />;
            case "Mock":
                return <IoCheckmarkCircle className="w-4 h-4" />;
            default:
                return <LuCog className="w-4 h-4" />;
        }
    };

    const handleDateRangeChange = (start: Date | null, end: Date | null) => {
        setStartDate(start);
        setEndDate(end);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <PageHeader
                title="Feedback History"
                subtitle="Review your past interviews and feedback from Ace"
                userName="Rafay Zia"
                userEmail="rafay_zia@mail.com"
            />

            <div className="flex justify-between gap-6">
                <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-6">
                        <LuSettings2 className="w-5 h-5 text-gray-600" />
                        <h2 className="text-lg font-semibold text-gray-900">
                            Filters
                        </h2>
                    </div>
                    <div className="space-y-6">
                        <div>
                            <h3 className="font-medium text-gray-900 mb-3">
                                Date
                            </h3>
                            <DateRangePicker
                                startDate={startDate}
                                endDate={endDate}
                                onDateRangeChange={handleDateRangeChange}
                                placeholder="Select date range"
                            />
                        </div>

                        <div>
                            <h3 className="font-medium text-gray-900 mb-3">
                                Rating
                            </h3>
                            <div className="space-y-1">
                                {[5, 4, 3, 2, 1].map(rating => (
                                    <label
                                        key={rating}
                                        className="flex items-center cursor-pointer"
                                        htmlFor={`rating-${rating}`}
                                    >
                                        <input
                                            type="radio"
                                            name="rating"
                                            id={`rating-${rating}`}
                                            checked={selectedRating === rating}
                                            onChange={() =>
                                                setSelectedRating(rating)
                                            }
                                            className="sr-only"
                                        />
                                        <div className="flex items-center gap-3 py-1 px-2 rounded w-full hover:bg-gray-50">
                                            <div className="flex items-center">
                                                <div className="flex items-center mr-2">
                                                    {Array.from(
                                                        { length: 5 },
                                                        (_, i) =>
                                                            i < rating ? (
                                                                <IoIosStar
                                                                    key={i}
                                                                    className="w-4 h-4 text-[#FFB61D]"
                                                                />
                                                            ) : (
                                                                <IoIosStarOutline
                                                                    key={i}
                                                                    className="w-4 h-4 text-[#2D2D2D] opacity-70"
                                                                />
                                                            )
                                                    )}
                                                </div>
                                                <span
                                                    className={`text-xs ${
                                                        selectedRating ===
                                                        rating
                                                            ? "font-semibold"
                                                            : "font-normal text-gray-600"
                                                    }`}
                                                >
                                                    {rating}
                                                </span>
                                            </div>
                                            {selectedRating === rating && (
                                                <FaCheck className="w-3 h-3 text-primary" />
                                            )}
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="font-medium text-gray-900 mb-3">
                                Categories
                            </h3>
                            <div className="space-y-1">
                                {[
                                    "Technical",
                                    "Behavioral",
                                    "Situational",
                                    "Mock",
                                ].map(category => (
                                    <label
                                        key={category}
                                        className="flex items-center cursor-pointer"
                                        htmlFor={`category-${category}`}
                                    >
                                        <input
                                            type="radio"
                                            name="category"
                                            id={`category-${category}`}
                                            checked={
                                                selectedCategory === category
                                            }
                                            onChange={() =>
                                                setSelectedCategory(category)
                                            }
                                            className="sr-only"
                                        />
                                        <div className="flex items-center gap-3 py-1 px-2 rounded w-full hover:bg-gray-50">
                                            <div className="flex items-center">
                                                <div className="w-4 h-4 mr-2">
                                                    {getCategoryIcon(category)}
                                                </div>
                                                <span
                                                    className={`text-xs ${
                                                        selectedCategory ===
                                                        category
                                                            ? "font-semibold"
                                                            : "font-normal text-gray-600"
                                                    }`}
                                                >
                                                    {category}
                                                </span>
                                            </div>
                                            {selectedCategory === category && (
                                                <FaCheck className="w-3 h-3 text-primary" />
                                            )}
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex-[4] flex flex-col">
                    <div className="grid grid-cols-3 gap-4 flex-1">
                        {displayFeedback.map(feedback => (
                            <FeedbackCard
                                key={feedback.id}
                                feedback={feedback}
                                onExpand={setSelectedFeedback}
                            />
                        ))}
                    </div>

                    <div className="flex justify-center items-center space-x-1 mt-6 pt-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={() =>
                                setCurrentPage(Math.max(1, currentPage - 1))
                            }
                            disabled={currentPage === 1}
                            className="p-1.5 rounded bg-gray-100 text-gray-400 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        >
                            ←
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => {
                            const pageNum = i + 1;
                            return (
                                <button
                                    type="button"
                                    key={pageNum}
                                    onClick={() => setCurrentPage(pageNum)}
                                    className={`px-2.5 py-1.5 rounded text-xs font-medium ${
                                        currentPage === pageNum
                                            ? "bg-white border border-primary text-primary"
                                            : "bg-white text-gray-600 hover:bg-gray-50"
                                    }`}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}

                        <button
                            type="button"
                            onClick={() =>
                                setCurrentPage(
                                    Math.min(totalPages, currentPage + 1)
                                )
                            }
                            disabled={currentPage === totalPages}
                            className="p-1.5 rounded bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        >
                            →
                        </button>
                    </div>
                </div>
            </div>

            <FeedbackDetailModal
                feedback={selectedFeedback}
                isOpen={!!selectedFeedback}
                onClose={() => setSelectedFeedback(null)}
            />
        </div>
    );
}
