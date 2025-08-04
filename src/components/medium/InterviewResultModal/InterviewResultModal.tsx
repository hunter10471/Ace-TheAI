import React from "react";
import Modal from "../Modal/Modal";
import Button from "../../small/Button/Button";
import { FaCheck, FaTimes } from "react-icons/fa";
import { RxStopwatch } from "react-icons/rx";
import { IoIosStar, IoIosStarOutline } from "react-icons/io";
import { IoCheckmarkCircle } from "react-icons/io5";

interface InterviewResultModalProps {
    isOpen: boolean;
    onClose: () => void;
    score: number;
    maxScore: number;
    rating: number;
    avgResponseTime: number; // in seconds
    strengths: string[];
    weaknesses: string[];
    onReturn: () => void;
    onViewReport: () => void;
}

const InterviewResultModal: React.FC<InterviewResultModalProps> = ({
    isOpen,
    onClose,
    score,
    maxScore,
    rating,
    avgResponseTime,
    strengths,
    weaknesses,
    onReturn,
    onViewReport,
}) => {
    const percentage = (score / maxScore) * 100;
    const getScoreColor = (percentage: number) => {
        if (percentage >= 80) return "#10B981"; // green
        if (percentage >= 60) return "#F59E0B"; // amber
        return "#EF4444"; // red
    };

    return (
        <Modal
            isModalOpen={isOpen}
            closeModal={onClose}
            modalBody={
                <div className="text-center p-6">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <IoCheckmarkCircle
                            size={32}
                            className="text-green-500"
                        />
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                        Interview Complete!
                    </h2>

                    {/* Score Circle */}
                    <div className="relative w-[140px] h-[140px] mx-auto mb-6">
                        <svg
                            className="absolute inset-0"
                            width="140"
                            height="140"
                        >
                            <circle
                                cx="70"
                                cy="70"
                                r="60"
                                stroke="#E5E7EB"
                                strokeWidth="14"
                                fill="none"
                            />
                        </svg>
                        <svg
                            className="absolute inset-0"
                            width="140"
                            height="140"
                        >
                            <circle
                                cx="70"
                                cy="70"
                                r="60"
                                stroke={getScoreColor(percentage)}
                                strokeWidth="14"
                                fill="none"
                                strokeDasharray={2 * Math.PI * 60}
                                strokeDashoffset={
                                    (1 - percentage / 100) * 2 * Math.PI * 60
                                }
                                strokeLinecap="round"
                                style={{
                                    transform: "rotate(-90deg)",
                                    transformOrigin: "50% 50%",
                                }}
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-[2rem] font-bold text-gray-900 dark:text-white leading-none">
                                {score}
                            </span>
                            <span className="text-base text-gray-500 font-medium">
                                /{maxScore}
                            </span>
                            <span className="text-sm text-gray-400 mt-1">
                                {percentage.toFixed(0)}%
                            </span>
                        </div>
                    </div>

                    {/* Rating Stars */}
                    <div className="flex justify-center gap-1 mb-4">
                        {[1, 2, 3, 4, 5].map(star =>
                            star <= rating ? (
                                <IoIosStar
                                    key={star}
                                    size={28}
                                    className="text-yellow-400"
                                />
                            ) : (
                                <IoIosStarOutline
                                    key={star}
                                    size={28}
                                    className="text-gray-300"
                                />
                            )
                        )}
                    </div>

                    <div className="flex items-center justify-center gap-2 mb-6">
                        <span className="text-gray-600 dark:text-gray-400 font-medium">
                            Overall Rating:
                        </span>
                        <span className="w-8 h-8 bg-primary border-2 border-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                            {rating}
                        </span>
                        <span className="text-gray-500 text-sm">/5</span>
                    </div>

                    {/* Response Time Card */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                                <RxStopwatch
                                    size={24}
                                    className="text-blue-600"
                                />
                            </div>
                            <div className="text-left">
                                <div className="font-semibold text-gray-900 dark:text-white">
                                    Average Response Time
                                </div>
                                <div className="text-gray-600 dark:text-gray-400 text-sm">
                                    You answered questions in{" "}
                                    <span className="font-semibold text-blue-600">
                                        {avgResponseTime} seconds
                                    </span>{" "}
                                    on average
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Strengths and Weaknesses */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        {/* Strengths */}
                        <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-xl p-4">
                            <h3 className="font-semibold text-green-800 dark:text-green-400 mb-3 flex items-center gap-2">
                                <FaCheck className="text-green-600" />
                                Your Strengths
                            </h3>
                            <div className="space-y-2">
                                {strengths.map((strength, idx) => (
                                    <div
                                        className="flex items-start gap-2"
                                        key={idx}
                                    >
                                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                        <span className="text-sm text-green-700 dark:text-green-300 text-left">
                                            {strength}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Weaknesses */}
                        <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-xl p-4">
                            <h3 className="font-semibold text-red-800 dark:text-red-400 mb-3 flex items-center gap-2">
                                <FaTimes className="text-red-600" />
                                Areas for Improvement
                            </h3>
                            <div className="space-y-2">
                                {weaknesses.map((weakness, idx) => (
                                    <div
                                        className="flex items-start gap-2"
                                        key={idx}
                                    >
                                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                                        <span className="text-sm text-red-700 dark:text-red-300 text-left">
                                            {weakness}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                        <Button
                            text="Return to Dashboard"
                            type="outline"
                            htmlButtonType="button"
                            action={onReturn}
                            className="flex-1 py-3"
                        />
                        <Button
                            text="View Detailed Report"
                            type="primary"
                            htmlButtonType="button"
                            action={onViewReport}
                            className="flex-1 py-3"
                        />
                    </div>
                </div>
            }
        />
    );
};

export default InterviewResultModal;
