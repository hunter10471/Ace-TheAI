"use client";

import { useState } from "react";
import { FeedbackEntry } from "@/lib/types";
import {
    FaCalendarAlt,
    FaChevronUp,
    FaChevronDown,
    FaTimes,
    FaLightbulb,
    FaCheckCircle,
    FaComments,
} from "react-icons/fa";
import { IoIosStar, IoIosStarOutline } from "react-icons/io";
import { LuMessageSquare, LuCheckCircle2 } from "react-icons/lu";
import Modal from "../Modal/Modal";
import TagPill from "@/components/small/TagPill/TagPill";

interface FeedbackDetailModalProps {
    feedback: FeedbackEntry | null;
    isOpen: boolean;
    onClose: () => void;
}

interface Question {
    id: number;
    question: string;
    answer: string;
    feedback: string;
}

const mockQuestions: Question[] = [
    {
        id: 1,
        question: "What is Object-Oriented Programming (OOP)?",
        answer: "Object-Oriented Programming (OOP) is a programming paradigm based on the concept of objects, which contain data in the form of fields and code in the form of procedures or methods.",
        feedback:
            "Good explanation. You could enhance your answer by mentioning the four main principles of OOP: encapsulation, inheritance, polymorphism, and abstraction.",
    },
    {
        id: 2,
        question: "What is a REST API?",
        answer: "REST (Representational State Transfer) is an architectural style for designing networked applications. It uses standard HTTP methods like GET, POST, PUT, DELETE to perform operations on resources.",
        feedback:
            "Solid understanding of REST principles. Consider mentioning statelessness and the importance of proper HTTP status codes in your response.",
    },
    {
        id: 3,
        question: "Explain the difference between SQL and NoSQL databases.",
        answer: "SQL databases are relational databases that use structured query language and have predefined schemas. NoSQL databases are non-relational and can store unstructured data with flexible schemas.",
        feedback:
            "Good comparison. You could elaborate on specific use cases for each type and mention popular examples like MySQL vs MongoDB.",
    },
    {
        id: 4,
        question: "What is version control, and why is it important?",
        answer: "Version control is a system that tracks changes to files over time, allowing you to recall specific versions later. It's important for collaboration, tracking changes, and maintaining project history.",
        feedback:
            "Excellent explanation. You might want to mention specific tools like Git and how branching strategies work in team environments.",
    },
];

export default function FeedbackDetailModal({
    feedback,
    isOpen,
    onClose,
}: FeedbackDetailModalProps) {
    const [expandedQuestions, setExpandedQuestions] = useState<number[]>([1]);

    const toggleQuestion = (questionId: number) => {
        setExpandedQuestions(prev =>
            prev.includes(questionId)
                ? prev.filter(id => id !== questionId)
                : [...prev, questionId]
        );
    };

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) =>
            i < rating ? (
                <IoIosStar key={i} className="w-5 h-5 text-[#FFB61D]" />
            ) : (
                <IoIosStarOutline
                    key={i}
                    className="w-5 h-5 text-[#2D2D2D] opacity-70"
                />
            )
        );
    };

    if (!feedback) return null;

    return (
        <Modal
            isModalOpen={isOpen}
            closeModal={onClose}
            modalBody={
                <div>
                    <div className="flex items-center space-x-2">
                        <FaCalendarAlt className="text-gray-500" />
                        <span className="text-gray-600">{feedback.date}</span>
                    </div>
                    <div className="text-center mb-2 mt-5">
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">
                            {feedback.title}
                        </h2>
                        <div className="flex items-center gap-2 justify-center mb-5">
                            {renderStars(feedback.rating)}
                        </div>
                        <TagPill
                            className="px-4 py-2 text-[15px]"
                            type="category"
                            value={feedback.category}
                        />
                    </div>
                    <div className="px-6 pb-6 overflow-y-auto h-[400px] custom-scrollbar">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-4">
                                <LuMessageSquare className="w-5 h-5 text-primary" />
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Interview Questions & Feedback
                                </h3>
                            </div>

                            {mockQuestions.map(question => (
                                <div
                                    key={question.id}
                                    className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <button
                                        onClick={() =>
                                            toggleQuestion(question.id)
                                        }
                                        className="w-full p-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors rounded-t-lg"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="flex-shrink-0 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                                                <span className="text-xs font-semibold text-primary">
                                                    {question.id}
                                                </span>
                                            </div>
                                            <span className="font-semibold text-gray-900 text-sm leading-relaxed">
                                                {question.question}
                                            </span>
                                        </div>
                                        {expandedQuestions.includes(
                                            question.id
                                        ) ? (
                                            <FaChevronUp className="text-gray-500 w-4 h-4 flex-shrink-0" />
                                        ) : (
                                            <FaChevronDown className="text-gray-500 w-4 h-4 flex-shrink-0" />
                                        )}
                                    </button>

                                    {expandedQuestions.includes(
                                        question.id
                                    ) && (
                                        <div className="px-4 pb-4 space-y-4 border-t border-gray-100">
                                            <div className="pt-4">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <LuCheckCircle2 className="w-4 h-4 text-green-600" />
                                                    <h4 className="font-semibold text-gray-900 text-sm">
                                                        Your Answer
                                                    </h4>
                                                </div>
                                                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                                    <p className="text-gray-700 text-sm leading-relaxed">
                                                        {question.answer}
                                                    </p>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <FaLightbulb className="w-4 h-4 text-amber-600" />
                                                    <h4 className="font-semibold text-gray-900 text-sm">
                                                        Feedback & Suggestions
                                                    </h4>
                                                </div>
                                                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                                                    <p className="text-gray-700 text-sm leading-relaxed">
                                                        {question.feedback}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            }
        />
    );
}
