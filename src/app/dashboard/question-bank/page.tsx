"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useUnifiedLoading } from "@/lib/use-unified-loading";
import {
    FaBookmark,
    FaExternalLinkAlt,
    FaCheck,
    FaPlus,
    FaSort,
    FaSearch,
} from "react-icons/fa";
import {
    LuSettings2,
    LuLeaf,
    LuWrench,
    LuTrophy,
    LuCog,
    LuUsers,
    LuAlignCenter,
} from "react-icons/lu";
import { TbUserExclamation } from "react-icons/tb";
import PageHeader from "@/components/big/PageHeader/PageHeader";
import TagPill from "@/components/small/TagPill/TagPill";
import toast from "react-hot-toast";
import { highlightTechnicalTerms } from "@/lib/text-highlighter";

interface TechnicalTerm {
    term: string;
    definition: string;
}

interface Question {
    id: string;
    text: string;
    category: "Technical" | "Behavioral" | "Situational";
    difficulty: "Novice" | "Advanced" | "Hard";
    explanation: string;
    example: string;
    technical_terms: TechnicalTerm[];
    generated_date: string;
    created_at: string;
    is_bookmarked?: boolean;
}

export default function QuestionBankPage() {
    const { data: session } = useSession();
    const { withLoading } = useUnifiedLoading();
    const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
        null
    );
    const [selectedDifficulty, setSelectedDifficulty] = useState<string>("All");
    const [selectedCategory, setSelectedCategory] = useState<string>("All");
    const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [questions, setQuestions] = useState<Question[]>([]);
    const [generating, setGenerating] = useState(false);
    const [bookmarkedQuestions, setBookmarkedQuestions] = useState<Set<string>>(
        new Set()
    );
    const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
    const [generationStatus, setGenerationStatus] = useState<
        "none" | "pending" | "processing" | "completed" | "failed"
    >("none");
    const [generationJobId, setGenerationJobId] = useState<string | null>(null);
    const [checkingStatus, setCheckingStatus] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalQuestions, setTotalQuestions] = useState(0);
    const questionsPerPage = 10;
    const answerColumnRef = useRef<HTMLDivElement>(null);

    // Handle question selection and scroll to top
    const handleQuestionSelect = (question: Question) => {
        setSelectedQuestion(question);
        // Scroll to top of answer column
        if (answerColumnRef.current) {
            answerColumnRef.current.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    // Fetch questions from API
    const fetchQuestions = async () => {
        if (!session?.user?.id) return;

        await withLoading(async () => {
            const params = new URLSearchParams();

            if (selectedCategory !== "All") {
                params.append("category", selectedCategory);
            }
            if (selectedDifficulty !== "All") {
                params.append("difficulty", selectedDifficulty);
            }
            if (showBookmarkedOnly) {
                params.append("bookmarked", "true");
            }
            if (searchQuery.trim()) {
                params.append("search", searchQuery.trim());
            }
            params.append("sort", sortOrder);
            params.append("page", currentPage.toString());
            params.append("limit", questionsPerPage.toString());

            const response = await fetch(`/api/questions?${params}`);
            if (!response.ok) {
                throw new Error("Failed to fetch questions");
            }

            const data = await response.json();
            setQuestions(data.questions);
            setTotalQuestions(data.total);
            setTotalPages(Math.ceil(data.total / questionsPerPage));

            // Update bookmarked questions set - only add questions that are actually bookmarked
            const bookmarkedIds = new Set<string>();
            data.questions.forEach((q: Question) => {
                if (q.id && q.is_bookmarked) {
                    bookmarkedIds.add(q.id);
                }
            });
            setBookmarkedQuestions(bookmarkedIds);
        }, "Loading questions...");
    };

    // Generate new questions
    const generateNewQuestions = async () => {
        if (!session?.user?.id) return;

        try {
            setGenerating(true);
            const response = await fetch("/api/questions/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ background: true }), // Use background processing
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 409) {
                    // Generation already in progress
                    setGenerationStatus(data.status);
                    setGenerationJobId(data.jobId);
                    toast.success("Question generation already in progress");
                } else {
                    toast.error(data.error || "Failed to generate questions");
                }
                return;
            }

            // Background generation started
            setGenerationStatus("pending");
            setGenerationJobId(data.jobId);
            toast.success(
                "Question generation started in background. You can leave this page and return later."
            );
        } catch (error) {
            console.error("Error generating questions:", error);
            toast.error("Failed to generate questions");
        } finally {
            setGenerating(false);
        }
    };

    // Check generation status
    const checkGenerationStatus = async () => {
        if (!session?.user?.id || checkingStatus) return;

        try {
            setCheckingStatus(true);
            const response = await fetch("/api/questions/generation-status");
            if (!response.ok) return;

            const data = await response.json();
            const previousStatus = generationStatus;
            setGenerationStatus(data.status);
            setGenerationJobId(data.jobId);

            // Only show toast when status changes to completed or failed
            if (
                data.status === "completed" &&
                data.result &&
                previousStatus !== "completed"
            ) {
                toast.success(data.result.message);
                fetchQuestions(); // Refresh the questions list
                setGenerationStatus("none");
                setGenerationJobId(null);
            } else if (
                data.status === "failed" &&
                data.error &&
                previousStatus !== "failed"
            ) {
                toast.error(`Generation failed: ${data.error}`);
                setGenerationStatus("none");
                setGenerationJobId(null);
            }
        } catch (error) {
            console.error("Error checking generation status:", error);
        } finally {
            setCheckingStatus(false);
        }
    };

    // Toggle bookmark
    const toggleBookmark = async (questionId: string) => {
        if (!session?.user?.id) return;

        try {
            const response = await fetch("/api/questions/bookmark", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ questionId }),
            });

            if (!response.ok) {
                throw new Error("Failed to toggle bookmark");
            }

            const data = await response.json();

            // Update local state
            const newBookmarkedQuestions = new Set(bookmarkedQuestions);
            if (data.isBookmarked) {
                newBookmarkedQuestions.add(questionId);
                toast.success("Question bookmarked!");
            } else {
                newBookmarkedQuestions.delete(questionId);
                toast.success("Bookmark removed!");
            }
            setBookmarkedQuestions(newBookmarkedQuestions);

            // Refresh questions if showing bookmarked only
            if (showBookmarkedOnly) {
                fetchQuestions();
            }
        } catch (error) {
            console.error("Error toggling bookmark:", error);
            toast.error("Failed to update bookmark");
        }
    };

    // Reset to first page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [
        selectedCategory,
        selectedDifficulty,
        showBookmarkedOnly,
        searchQuery,
        sortOrder,
    ]);

    // Fetch questions when filters or page change
    useEffect(() => {
        fetchQuestions();
    }, [
        session?.user?.id,
        selectedCategory,
        selectedDifficulty,
        showBookmarkedOnly,
        searchQuery,
        sortOrder,
        currentPage,
        withLoading,
    ]);

    // Scroll to top when selected question changes
    useEffect(() => {
        if (selectedQuestion && answerColumnRef.current) {
            answerColumnRef.current.scrollTo({ top: 0, behavior: "smooth" });
        }
    }, [selectedQuestion]);

    // Check for existing generation jobs when component mounts
    useEffect(() => {
        if (session?.user?.id) {
            checkGenerationStatus();
        }
    }, [session?.user?.id]);

    // Poll for status updates when generation is in progress
    useEffect(() => {
        let pollInterval: ReturnType<typeof setTimeout> | null = null;

        if (
            generationStatus === "pending" ||
            generationStatus === "processing"
        ) {
            pollInterval = setInterval(async () => {
                await checkGenerationStatus();
            }, 5000); // Check every 5 seconds
        }

        // Clean up interval on component unmount or status change
        return () => {
            if (pollInterval) {
                clearInterval(pollInterval);
            }
        };
    }, [generationStatus, session?.user?.id]);

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

    if (!session?.user) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="text-center">
                    <p className="text-gray-600 dark:text-gray-400">
                        Please log in to access the question bank.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-7xl mx-auto px-2 lg:px-4 py-4 lg:py-8">
            <PageHeader
                title="Question Bank"
                subtitle="Prepare for your interviews with our question bank personalized for you."
            />

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                <div className="flex flex-wrap items-center gap-2 lg:gap-4">
                    <button
                        type="button"
                        onClick={() =>
                            setShowBookmarkedOnly(!showBookmarkedOnly)
                        }
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                            showBookmarkedOnly
                                ? "bg-primary text-white shadow-sm"
                                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                        }`}
                    >
                        <FaBookmark className="w-4 h-4" />
                        <span className="text-sm font-medium">
                            {showBookmarkedOnly
                                ? "Showing Saved"
                                : "Saved Questions"}
                        </span>
                    </button>

                    <button
                        type="button"
                        onClick={generateNewQuestions}
                        disabled={
                            generating ||
                            generationStatus === "pending" ||
                            generationStatus === "processing"
                        }
                        className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                    >
                        <FaPlus className="w-4 h-4" />
                        <span className="text-sm font-medium">
                            {generating
                                ? "Starting..."
                                : generationStatus === "pending"
                                ? "Queued..."
                                : generationStatus === "processing"
                                ? "Generating..."
                                : "Generate New Questions"}
                        </span>
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            setSortOrder(
                                sortOrder === "newest" ? "oldest" : "newest"
                            )
                        }
                        className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                        <FaSort className="w-4 h-4" />
                        <span className="text-sm font-medium">
                            Sort:{" "}
                            {sortOrder === "newest"
                                ? "Newest First"
                                : "Oldest First"}
                        </span>
                    </button>
                </div>

                <div className="text-sm text-gray-500 dark:text-gray-400">
                    {totalQuestions > 0 && (
                        <span>{totalQuestions} questions available</span>
                    )}
                </div>
            </div>

            <div className="mb-6">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaSearch className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search questions..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
                <div className="lg:col-span-2">
                    <div className="flex items-center space-x-2 mb-6">
                        <LuSettings2 className="w-5 h-5 text-gray-400 dark:text-gray-300" />
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Filters
                        </h2>
                    </div>
                    <div className="space-y-6">
                        <div>
                            <h3 className="font-medium text-gray-900 dark:text-white mb-3">
                                Difficulty
                            </h3>
                            <div className="space-y-1">
                                {["All", "Novice", "Advanced", "Hard"].map(
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
                                            <div className="flex items-center justify-between py-1 px-2 rounded w-full hover:bg-gray-50 dark:hover:bg-gray-700">
                                                <div className="flex items-center">
                                                    <div className="w-4 h-4 mr-2">
                                                        {difficulty ===
                                                        "All" ? (
                                                            <LuAlignCenter className="w-4 h-4" />
                                                        ) : (
                                                            getDifficultyIcon(
                                                                difficulty
                                                            )
                                                        )}
                                                    </div>
                                                    <span
                                                        className={`text-xs ${
                                                            selectedDifficulty ===
                                                            difficulty
                                                                ? "font-semibold text-gray-900 dark:text-white"
                                                                : "font-normal text-gray-600 dark:text-gray-300"
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
                            <h3 className="font-medium text-gray-900 dark:text-white mb-3">
                                Categories
                            </h3>
                            <div className="space-y-1">
                                {[
                                    "All",
                                    "Technical",
                                    "Behavioral",
                                    "Situational",
                                ].map(category => (
                                    <label
                                        key={category}
                                        className="flex items-center cursor-pointer"
                                    >
                                        <input
                                            type="radio"
                                            name="category"
                                            checked={
                                                selectedCategory === category
                                            }
                                            onChange={() =>
                                                setSelectedCategory(category)
                                            }
                                            className="sr-only"
                                        />
                                        <div className="flex items-center justify-between py-1 px-2 rounded w-full hover:bg-gray-50 dark:hover:bg-gray-700">
                                            <div className="flex items-center">
                                                <div className="w-4 h-4 mr-2">
                                                    {category === "All" ? (
                                                        <LuAlignCenter className="w-4 h-4" />
                                                    ) : (
                                                        getCategoryIcon(
                                                            category
                                                        )
                                                    )}
                                                </div>
                                                <span
                                                    className={`text-xs ${
                                                        selectedCategory ===
                                                        category
                                                            ? "font-semibold text-gray-900 dark:text-white"
                                                            : "font-normal text-gray-600 dark:text-gray-300"
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

                <div className="lg:col-span-6">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm h-[calc(100vh-400px)] lg:h-[calc(100vh-300px)] flex flex-col">
                        <div className="p-4 flex-1 overflow-y-auto">
                            {questions.length === 0 ? (
                                <div className="flex items-center justify-center h-full">
                                    <div className="text-center">
                                        <p className="text-gray-500 dark:text-gray-400 mb-4">
                                            {showBookmarkedOnly
                                                ? "No bookmarked questions found."
                                                : "No questions available. Generate some questions to get started!"}
                                        </p>
                                        {!showBookmarkedOnly && (
                                            <button
                                                onClick={generateNewQuestions}
                                                disabled={generating}
                                                className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 disabled:opacity-50"
                                            >
                                                {generating
                                                    ? "Generating..."
                                                    : "Generate Questions"}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {questions.map((question, index) => (
                                        <div
                                            key={question.id}
                                            className={`pb-3 ${
                                                index !== questions.length - 1
                                                    ? "border-b border-gray-200 dark:border-gray-700"
                                                    : ""
                                            }`}
                                        >
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <h3 className="text-gray-900 dark:text-white mb-1.5 text-sm leading-relaxed">
                                                        {index + 1}.{" "}
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
                                                                handleQuestionSelect(
                                                                    question
                                                                )
                                                            }
                                                            className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-primary transition-colors"
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
                                                        toggleBookmark(
                                                            question.id
                                                        )
                                                    }
                                                    className={`ml-3 ${
                                                        bookmarkedQuestions.has(
                                                            question.id
                                                        )
                                                            ? "text-primary"
                                                            : "text-gray-400 dark:text-gray-500"
                                                    } hover:text-primary transition-colors`}
                                                >
                                                    <FaBookmark
                                                        className={`w-4 h-4 ${
                                                            bookmarkedQuestions.has(
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
                            )}
                        </div>
                    </div>

                    {/* Pagination Controls - Outside the question list container */}
                    {totalPages > 1 && (
                        <div className="mt-4">
                            <div className="flex flex-col-reverse gap-2 items-center justify-between">
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    Showing{" "}
                                    {(currentPage - 1) * questionsPerPage + 1}{" "}
                                    to{" "}
                                    {Math.min(
                                        currentPage * questionsPerPage,
                                        totalQuestions
                                    )}{" "}
                                    of {totalQuestions} questions
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() =>
                                            setCurrentPage(prev =>
                                                Math.max(1, prev - 1)
                                            )
                                        }
                                        disabled={currentPage === 1}
                                        className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        Previous
                                    </button>

                                    <div className="flex items-center space-x-1">
                                        {Array.from(
                                            { length: Math.min(5, totalPages) },
                                            (_, i) => {
                                                let pageNum;
                                                if (totalPages <= 5) {
                                                    pageNum = i + 1;
                                                } else if (currentPage <= 3) {
                                                    pageNum = i + 1;
                                                } else if (
                                                    currentPage >=
                                                    totalPages - 2
                                                ) {
                                                    pageNum =
                                                        totalPages - 4 + i;
                                                } else {
                                                    pageNum =
                                                        currentPage - 2 + i;
                                                }

                                                return (
                                                    <button
                                                        key={pageNum}
                                                        onClick={() =>
                                                            setCurrentPage(
                                                                pageNum
                                                            )
                                                        }
                                                        className={`px-3 py-1 text-sm rounded-md transition-colors ${
                                                            currentPage ===
                                                            pageNum
                                                                ? "bg-primary text-white"
                                                                : "border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                                                        }`}
                                                    >
                                                        {pageNum}
                                                    </button>
                                                );
                                            }
                                        )}
                                    </div>

                                    <button
                                        onClick={() =>
                                            setCurrentPage(prev =>
                                                Math.min(totalPages, prev + 1)
                                            )
                                        }
                                        disabled={currentPage === totalPages}
                                        className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="lg:col-span-4">
                    <div
                        ref={answerColumnRef}
                        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm h-[calc(100vh-400px)] lg:h-[calc(100vh-300px)] overflow-y-auto overflow-x-visible"
                    >
                        <div className="flex items-center justify-center space-x-2 mb-6">
                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                <FaCheck className="w-4 h-4 text-white" />
                            </div>
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                                Answer
                            </h2>
                        </div>

                        {selectedQuestion ? (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="font-bold mb-3 text-sm text-gray-900 dark:text-white uppercase tracking-wide">
                                        Explanation
                                    </h3>
                                    <div className="text-gray-700 dark:text-gray-200 leading-relaxed text-sm bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                                        {highlightTechnicalTerms(
                                            selectedQuestion.explanation,
                                            selectedQuestion.technical_terms
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-bold mb-3 text-sm text-gray-900 dark:text-white uppercase tracking-wide">
                                        Example
                                    </h3>
                                    <div className="text-gray-700 dark:text-gray-200 leading-relaxed text-sm bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                                        {highlightTechnicalTerms(
                                            selectedQuestion.example,
                                            selectedQuestion.technical_terms
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FaCheck className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                                </div>
                                <p className="text-gray-500 dark:text-gray-400 text-sm">
                                    Select a question to view its explanation
                                    and example.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
