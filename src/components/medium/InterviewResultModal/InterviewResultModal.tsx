import React from "react";
import Modal from "../Modal/Modal";
import Button from "../../small/Button/Button";
import { FaCheck, FaTimes } from "react-icons/fa";
import { RxStopwatch } from "react-icons/rx";
import { IoMdStar } from "react-icons/io";

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
  return (
    <Modal
      isModalOpen={isOpen}
      closeModal={onClose}
      modalBody={
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Interview Results
          </h2>

          <div className="relative w-[140px] h-[140px] mx-auto mb-2">
            <svg className="absolute inset-0" width="140" height="140">
              <circle
                cx="70"
                cy="70"
                r="60"
                stroke="#FFE3E0"
                strokeWidth="14"
                fill="none"
              />
            </svg>
            <svg className="absolute inset-0" width="140" height="140">
              <circle
                cx="70"
                cy="70"
                r="60"
                stroke="#FF6F61"
                strokeWidth="14"
                fill="none"
                strokeDasharray={2 * Math.PI * 40}
                strokeDashoffset={(1 - score / maxScore) * 2 * Math.PI * 40}
                strokeLinecap="round"
                style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[2rem] font-bold text-[#2D2D2D] dark:text-white leading-none">{score}</span>
              <span className="text-base text-gray-400 font-semibold mt-2">/{maxScore}</span>
            </div>
          </div>

          <div className="flex justify-center gap-1 mb-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <IoMdStar
                key={star}
                size={25}
                className={`${star <= rating ? "text-[#FFB61D]" : "text-gray-300 dark:text-gray-600"}`}
              />
            ))}
          </div>
          
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-gray-600 dark:text-gray-400">Rating:</span>
            <span className="w-7 h-7 border-primary border text-primary rounded-full flex items-center justify-center text-sm font-semibold">
              {rating}
            </span>
          </div>

          <div className="bg-[#2D2D2D] text-white rounded-lg p-4 mb-4">
            <div className="flex items-center gap-3">
              <RxStopwatch size={50} className="text-primary flex-shrink-0" />
              <div className="text-left">
                <div className="font-semibold">Response Time</div>
                <div className="text-white/80 text-sm font-thin">
                  Your average response time was <span className="text-[#56F56F] font-semibold">{avgResponseTime} seconds</span> per question.
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex flex-col items-center">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 underline">Strengths</h3>
              <div className="space-y-1">
                {strengths.map((strength, idx) => (
                  <div className="flex items-start gap-2 w-[180px]" key={idx}>
                    <FaCheck className="text-green-500 w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-600 dark:text-gray-400 text-left">{strength}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col items-center">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 underline">Weaknesses</h3>
              <div className="space-y-1">
                {weaknesses.map((weakness, idx) => (
                  <div className="flex items-start gap-2 w-[180px]" key={idx}>
                    <FaTimes className="text-red-500 w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-600 dark:text-gray-400 text-left">{weakness}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              text="Return to Dashboard"
              type="outline"
              htmlButtonType="button"
              action={onReturn}
              className="flex-1 text-sm"
            />
            <Button
              text="View detailed report"
              type="primary"
              htmlButtonType="button"
              action={onViewReport}
              className="flex-1 text-sm"
            />
          </div>
        </div>
      }
    />
  );
};

export default InterviewResultModal; 