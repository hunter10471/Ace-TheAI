"use client";

import { useState } from "react";
import { questionBankData, Question } from "@/lib/data";
import { FaBookmark, FaExternalLinkAlt, FaCheck } from "react-icons/fa";
import {
    LuSettings2,
    LuLeaf,
    LuWrench,
    LuTrophy,
    LuCog,
    LuUsers,
} from "react-icons/lu";
import { TbUserExclamation } from "react-icons/tb";
import PageHeader from "@/components/big/PageHeader/PageHeader";
import TagPill from "@/components/small/TagPill/TagPill";

export default function QuestionBankPage() {
    const [selectedQuestion, setSelectedQuestion] = useState<Question>(
        questionBankData[0]
    );
    const [selectedDifficulty, setSelectedDifficulty] =
        useState<string>("Advanced");
    const [selectedCategory, setSelectedCategory] =
        useState<string>("Behavioral");
    const [currentPage, setCurrentPage] = useState(1);
    const [bookmarkedQuestions, setBookmarkedQuestions] = useState<number[]>([
        1,
    ]);

    const questionsPerPage = 5;
    const totalPages = Math.ceil(questionBankData.length / questionsPerPage);
    const startIndex = (currentPage - 1) * questionsPerPage;
    const endIndex = startIndex + questionsPerPage;
    const currentQuestions = questionBankData.slice(startIndex, endIndex);

    const toggleBookmark = (questionId: number) => {
        setBookmarkedQuestions(prev =>
            prev.includes(questionId)
                ? prev.filter(id => id !== questionId)
                : [...prev, questionId]
        );
    };

    const getDifficultyIcon = (difficulty: string) => {
        switch (difficulty) {
            case "Novice":
                return <LuLeaf className="w-4 h-4" />;
            case "Advanced":
                return <LuWrench className="w-4 h-4" />;
            case "Hard":
                return <LuTrophy className="w-4 h-4" />;
            default:
                return <LuLeaf className="w-4 h-4" />;
        }
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case "Technical":
                return <LuCog className="w-4 h-4" />;
            case "Behavioral":
                return <LuUsers className="w-4 h-4" />;
            case "Situational":
                return <TbUserExclamation className="w-4 h-4" />;
            default:
                return <LuCog className="w-4 h-4" />;
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <PageHeader
                title="Question Bank"
                subtitle="Prepare for your interviews with our question bank personalized for you."
            />

            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-2">
                    <div className="flex items-center space-x-2 mb-6">
                        <LuSettings2 className="w-5 h-5 text-gray-600" />
                        <h2 className="text-lg font-semibold text-gray-900">
                            Filters
                        </h2>
                    </div>
                    <div className="space-y-6">
                        <div>
                            <h3 className="font-medium text-gray-900 mb-3">
                                Difficulty
                            </h3>
                            <div className="space-y-1">
                                {["Novice", "Advanced", "Hard"].map(
                                    difficulty => (
                                        <label
                                            key={difficulty}
                                            className="flex items-center cursor-pointer"
                                        >
                                            <input
                                                type="radio"
                                                name="difficulty"
                                                checked={
                                                    selectedDifficulty ===
                                                    difficulty
                                                }
                                                onChange={() =>
                                                    setSelectedDifficulty(
                                                        difficulty
                                                    )
                                                }
                                                className="sr-only"
                                            />
                                            <div className="flex items-center justify-between py-1 px-2 rounded w-full hover:bg-gray-50">
                                                <div className="flex items-center">
                                                    <div className="w-4 h-4 mr-2">
                                                        {getDifficultyIcon(
                                                            difficulty
                                                        )}
                                                    </div>
                                                    <span
                                                        className={`text-xs ${
                                                            selectedDifficulty ===
                                                            difficulty
                                                                ? "font-semibold"
                                                                : "font-normal text-gray-600"
                                                        }`}
                                                    >
                                                        {difficulty}
                                                    </span>
                                                </div>
                                                {selectedDifficulty ===
                                                    difficulty && (
                                                    <FaCheck className="w-3 h-3 text-primary" />
                                                )}
                                            </div>
                                        </label>
                                    )
                                )}
                            </div>
                        </div>

                        <div>
                            <h3 className="font-medium text-gray-900 mb-3">
                                Categories
                            </h3>
                            <div className="space-y-1">
                                {["Technical", "Behavioral", "Situational"].map(
                                    category => (
                                        <label
                                            key={category}
                                            className="flex items-center cursor-pointer"
                                        >
                                            <input
                                                type="radio"
                                                name="category"
                                                checked={
                                                    selectedCategory ===
                                                    category
                                                }
                                                onChange={() =>
                                                    setSelectedCategory(
                                                        category
                                                    )
                                                }
                                                className="sr-only"
                                            />
                                            <div className="flex items-center justify-between py-1 px-2 rounded w-full hover:bg-gray-50">
                                                <div className="flex items-center">
                                                    <div className="w-4 h-4 mr-2">
                                                        {getCategoryIcon(
                                                            category
                                                        )}
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
                                                {selectedCategory ===
                                                    category && (
                                                    <FaCheck className="w-3 h-3 text-primary" />
                                                )}
                                            </div>
                                        </label>
                                    )
                                )}
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-200">
                            <button type="button" className="flex items-center space-x-2 text-gray-700 hover:text-primary transition-colors">
                                <FaBookmark className="w-4 h-4" />
                                <span className="text-xs text-left">
                                    Saved Questions
                                </span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="col-span-6">
                    <div className="bg-white rounded-lg shadow-sm h-[calc(100vh-300px)] flex flex-col">
                        <div className="p-4 flex-1 overflow-y-auto">
                            <div className="space-y-3">
                                {currentQuestions.map((question, index) => (
                                    <div
                                        key={question.id}
                                        className={`pb-3 ${
                                            index !==
                                            currentQuestions.length - 1
                                                ? "border-b border-gray-200"
                                                : ""
                                        }`}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <h3 className=" text-gray-900 mb-1.5 text-sm leading-relaxed">
                                                    {startIndex + index + 1}.{" "}
                                                    {question.text}
                                                </h3>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-2">
                                                        <TagPill
                                                            type="category"
                                                            value={
                                                                question.category
                                                            }
                                                            className="text-xs px-1.5 py-0.5"
                                                        />
                                                        <TagPill
                                                            type="difficulty"
                                                            value={
                                                                question.difficulty
                                                            }
                                                            className="text-xs px-1.5 py-0.5"
                                                        />
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setSelectedQuestion(
                                                                question
                                                            )
                                                        }
                                                        className="flex items-center space-x-1"
                                                    >
                                                        <span className="text-sm font-bold">
                                                            View Explanation
                                                        </span>
                                                        <FaExternalLinkAlt className="w-2.5 h-2.5" />
                                                    </button>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    toggleBookmark(question.id)
                                                }
                                                className={`ml-3 ${
                                                    bookmarkedQuestions.includes(
                                                        question.id
                                                    )
                                                        ? "text-primary"
                                                        : "text-gray-400"
                                                } hover:text-primary transition-colors`}
                                            >
                                                <FaBookmark
                                                    className={`w-4 h-4 ${
                                                        bookmarkedQuestions.includes(
                                                            question.id
                                                        )
                                                            ? "fill-current"
                                                            : ""
                                                    }`}
                                                />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-3 border-t border-gray-200">
                            <div className="flex justify-center items-center space-x-1">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setCurrentPage(
                                            Math.max(1, currentPage - 1)
                                        )
                                    }
                                    disabled={currentPage === 1}
                                    className="p-1.5 rounded bg-gray-100 text-gray-400 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                >
                                    ←
                                </button>

                                {Array.from(
                                    { length: Math.min(5, totalPages) },
                                    (_, i) => {
                                        const pageNum = i + 1;
                                        if (
                                            pageNum === 1 ||
                                            pageNum === totalPages ||
                                            (pageNum >= currentPage - 1 &&
                                                pageNum <= currentPage + 1)
                                        ) {
                                            return (
                                                <button
                                                    type="button"
                                                    key={pageNum}
                                                    onClick={() =>
                                                        setCurrentPage(pageNum)
                                                    }
                                                    className={`px-2.5 py-1.5 rounded text-xs font-medium ${
                                                        currentPage === pageNum
                                                            ? "bg-white border border-primary text-primary"
                                                            : "bg-white text-gray-600 hover:bg-gray-50"
                                                    }`}
                                                >
                                                    {pageNum}
                                                </button>
                                            );
                                        }
                                        if (
                                            pageNum === currentPage - 2 ||
                                            pageNum === currentPage + 2
                                        ) {
                                            return (
                                                <span
                                                    key={pageNum}
                                                    className="px-1.5 text-gray-500 text-xs"
                                                >
                                                    ...
                                                </span>
                                            );
                                        }
                                        return null;
                                    }
                                )}

                                <button
                                    type="button"
                                    onClick={() =>
                                        setCurrentPage(
                                            Math.min(
                                                totalPages,
                                                currentPage + 1
                                            )
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
                </div>

                <div className="col-span-4">
                    <div className="bg-[#2D2D2D] rounded-lg p-4 text-white">
                        <div className="flex items-center justify-center space-x-2 mb-4">
                            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                <FaCheck className="w-3 h-3 text-white" />
                            </div>
                            <h2 className="text-base font-semibold">Answer</h2>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <h3 className="font-semibold mb-2 text-sm">
                                    Explanation
                                </h3>
                                <p className="text-gray-300 leading-relaxed text-xs">
                                    {selectedQuestion.explanation}
                                </p>
                            </div>

                            <div>
                                <h3 className="font-semibold mb-2 text-sm">
                                    Example
                                </h3>
                                <p className="text-gray-300 leading-relaxed text-xs">
                                    {selectedQuestion.example}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
