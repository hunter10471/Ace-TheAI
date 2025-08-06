"use client";

import type React from "react";
import { useState, useEffect, useRef, useCallback, useMemo, memo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useOptimizedSession } from "@/lib/auth-utils";
import { useUnifiedLoading } from "@/lib/use-unified-loading";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
    AlertTriangle,
    X,
    Send,
    Star,
    User,
    Timer,
    MessageSquare,
} from "lucide-react";
import InterviewResultModal from "@/components/medium/InterviewResultModal/InterviewResultModal";
import EndInterviewModal from "@/components/medium/EndInterviewModal/EndInterviewModal";
import ReportIssueModal from "@/components/medium/ReportIssueModal/ReportIssueModal";
import toast from "react-hot-toast";
import Image from "next/image";

interface Message {
    id: string;
    text: string;
    sender: "user" | "ai";
    timestamp: Date;
    isQuestion?: boolean;
    rating?: number;
    feedback?: string;
    isTyping?: boolean;
}

interface InterviewSession {
    id: string;
    interview_type: string;
    difficulty: string;
    duration: number;
    job_title: string;
    status: string;
    current_question_index: number;
    questions_asked: string[];
    user_responses: string[];
    question_ratings: number[];
    response_times: number[];
}

interface InterviewResults {
    score: number;
    maxScore: number;
    rating: number;
    avgResponseTime: number;
    strengths: string[];
    weaknesses: string[];
}

const TypingIndicator = memo(() => (
    <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-600 max-w-[220px]">
        <Avatar className="w-8 h-8 ring-2 ring-gray-200 dark:ring-gray-600">
            <AvatarImage src="/assets/logo_robot.png" alt="AI" />
            <AvatarFallback className="bg-gray-600 text-white">
                <Image
                    src="/assets/logo_robot.png"
                    alt="AI"
                    width={16}
                    height={16}
                />
            </AvatarFallback>
        </Avatar>
        <div className="flex space-x-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            <div
                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
            ></div>
            <div
                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
            ></div>
        </div>
        <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
            ACE is thinking...
        </span>
    </div>
));

TypingIndicator.displayName = "TypingIndicator";

const MessageComponent = memo<{ message: Message; userImage?: string }>(
    ({ message, userImage }) => (
        <div
            className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
            } mb-6`}
        >
            <div
                className={`max-w-[85%] ${
                    message.sender === "user" ? "order-2" : "order-1"
                }`}
            >
                <div
                    className={`flex items-start space-x-3 ${
                        message.sender === "user"
                            ? "flex-row-reverse space-x-reverse"
                            : ""
                    }`}
                >
                    <Avatar
                        className={`w-10 h-10 ring-2 ${
                            message.sender === "user"
                                ? "ring-gray-200 dark:ring-gray-600"
                                : "ring-gray-200 dark:ring-gray-600"
                        } transition-all duration-200 hover:scale-105`}
                    >
                        <AvatarImage
                            src={
                                message.sender === "user"
                                    ? userImage || ""
                                    : "/assets/logo_robot.png"
                            }
                            alt={message.sender === "user" ? "User" : "AI"}
                        />
                        <AvatarFallback
                            className={
                                message.sender === "user"
                                    ? "bg-gray-600 text-white"
                                    : "bg-gray-600 text-white"
                            }
                        >
                            {message.sender === "user" ? (
                                <User className="w-5 h-5" />
                            ) : (
                                <Image
                                    src="/assets/logo_robot.png"
                                    alt="AI"
                                    width={20}
                                    height={20}
                                />
                            )}
                        </AvatarFallback>
                    </Avatar>

                    <div
                        className={`flex-1 ${
                            message.sender === "user"
                                ? "text-right"
                                : "text-left"
                        }`}
                    >
                        <div
                            className={`inline-block rounded-2xl shadow-sm border transition-all duration-200 hover:shadow-md ${
                                message.sender === "user"
                                    ? "bg-gray-800 dark:bg-gray-700 text-white border-gray-700 dark:border-gray-600 p-4"
                                    : message.isQuestion
                                    ? "bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 text-gray-900 dark:text-gray-100 border-amber-200 dark:border-amber-700 p-3"
                                    : "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-600 p-4"
                            }`}
                        >
                            {message.isQuestion && (
                                <div className="flex items-center space-x-2 mb-2">
                                    <MessageSquare className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                                    <span className="text-xs font-semibold text-amber-700 dark:text-amber-300 uppercase tracking-wide">
                                        Interview Question
                                    </span>
                                </div>
                            )}

                            <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                {message.text}
                            </p>

                            {message.rating && (
                                <div className="flex items-center justify-start mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                                    <div className="flex items-center space-x-1">
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <Star
                                                key={star}
                                                className={`w-4 h-4 transition-colors duration-200 ${
                                                    star <= message.rating!
                                                        ? "text-yellow-400 fill-current"
                                                        : "text-gray-300 dark:text-gray-600"
                                                }`}
                                            />
                                        ))}
                                    </div>
                                    <span className="ml-2 text-xs text-gray-600 dark:text-gray-400 font-medium">
                                        Rating: {message.rating}/5
                                    </span>
                                </div>
                            )}
                        </div>

                        <div
                            className={`mt-1 text-xs text-gray-500 dark:text-gray-400 ${
                                message.sender === "user"
                                    ? "text-right"
                                    : "text-left"
                            }`}
                        >
                            {message.timestamp.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
);

MessageComponent.displayName = "MessageComponent";

const InterviewPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { session, status } = useOptimizedSession();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const initializationRef = useRef(false);

    const { isLoading, withLoading } = useUnifiedLoading();
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputMessage, setInputMessage] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [showResultsModal, setShowResultsModal] = useState(false);
    const [showEndInterviewModal, setShowEndInterviewModal] = useState(false);
    const [showReportIssueModal, setShowReportIssueModal] = useState(false);
    const [interviewSession, setInterviewSession] =
        useState<InterviewSession | null>(null);
    const [currentQuestionStartTime, setCurrentQuestionStartTime] =
        useState<number>(0);
    const [isInterviewStarted, setIsInterviewStarted] = useState(false);
    const [interviewStartTime, setInterviewStartTime] = useState<number>(0);
    const [interviewResults, setInterviewResults] =
        useState<InterviewResults | null>(null);
    const [timeRemaining, setTimeRemaining] = useState<number>(0);
    const [currentQuestion, setCurrentQuestion] = useState<string>("");
    const [isWaitingForWelcomeResponse, setIsWaitingForWelcomeResponse] =
        useState(false);
    const [isShowingTypingBubble, setIsShowingTypingBubble] = useState(false);

    const interviewParams = useMemo(
        () => ({
            area: searchParams.get("area"),
            difficulty: searchParams.get("difficulty"),
            time: searchParams.get("time"),
            jobTitle: searchParams.get("jobTitle"),
        }),
        [searchParams]
    );

    const hasValidParams = useMemo(() => {
        return !!(
            interviewParams.area &&
            interviewParams.difficulty &&
            interviewParams.time &&
            interviewParams.jobTitle
        );
    }, [interviewParams]);

    const progressPercentage = useMemo(() => {
        if (!interviewSession || !interviewParams.time) return 0;
        const totalTime = Number.parseInt(interviewParams.time) * 60;
        const elapsed = totalTime - timeRemaining;
        return Math.min((elapsed / totalTime) * 100, 100);
    }, [timeRemaining, interviewParams.time, interviewSession]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        if (!isInterviewStarted || timeRemaining <= 0) return;

        const timer = setInterval(() => {
            setTimeRemaining(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    completeInterview();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isInterviewStarted, timeRemaining]);

    useEffect(() => {
        if (
            status === "loading" ||
            initializationRef.current ||
            !hasValidParams
        )
            return;
        initializationRef.current = true;
        startInterview();
    }, [status, hasValidParams]);

    const startInterview = useCallback(async () => {
        const { area, difficulty, time, jobTitle } = interviewParams;
        if (!area || !difficulty || !time || !jobTitle) {
            toast.error("Missing interview parameters");
            router.push("/dashboard/practice-interviews");
            return;
        }

        await withLoading(async () => {
            const response = await fetch("/api/interview", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "start",
                    interviewType:
                        area === "technical"
                            ? "Technical"
                            : area === "behavioral"
                            ? "Behavioral"
                            : area === "situational"
                            ? "Situational"
                            : "Mock",
                    difficulty:
                        difficulty === "novice"
                            ? "Novice"
                            : difficulty === "advanced"
                            ? "Advanced"
                            : "Hard",
                    duration: Number.parseInt(time),
                    jobTitle,
                }),
            });

            const result = await response.json();
            if (result.success) {
                setInterviewSession(result.data.session);
                setIsInterviewStarted(true);
                setInterviewStartTime(Date.now());
                setTimeRemaining(Number.parseInt(time) * 60);
                setIsWaitingForWelcomeResponse(true);

                setTimeout(() => {
                    addMessage(
                        {
                            text: `Hello ${
                                session?.user?.name || "there"
                            }! 👋 I'm ACE, your AI interview coach. I'll be conducting your ${area} interview today for a ${jobTitle} position. The interview will be ${difficulty} level and should take about ${time} minutes.\n\nAre you ready to begin?`,
                            sender: "ai",
                            timestamp: new Date(),
                        },
                        true
                    );
                }, 1000);

                setCurrentQuestion(result.data.question);
            } else {
                toast.error(result.error || "Failed to start interview");
                router.push("/dashboard/practice-interviews");
            }
        }, "Starting your interview...");
    }, [interviewParams, session?.user?.name, router, withLoading]);

    const addMessage = useCallback(
        (message: Omit<Message, "id">, shouldType = false) => {
            const newMessage: Message = {
                ...message,
                id: `${message.sender}-${Date.now()}-${Math.random()}`,
            };

            if (shouldType && message.sender === "ai") {
                setIsShowingTypingBubble(true);
                setTimeout(() => {
                    setIsShowingTypingBubble(false);
                    setMessages(prev => [...prev, newMessage]);
                }, 1500 + Math.random() * 1000);
            } else {
                setMessages(prev => [...prev, newMessage]);
            }
        },
        []
    );

    const handleSendMessage = useCallback(async () => {
        const currentInput = inputMessage.trim();
        if (!currentInput || isTyping || !interviewSession) return;
        setInputMessage("");
        addMessage({
            text: currentInput,
            sender: "user",
            timestamp: new Date(),
        });
        if (isWaitingForWelcomeResponse) {
            setIsWaitingForWelcomeResponse(false);
            setTimeout(() => {
                addMessage(
                    {
                        text: "Great! Let's begin with your first question.",
                        sender: "ai",
                        timestamp: new Date(),
                    },
                    true
                );
                setTimeout(() => {
                    addMessage(
                        {
                            text: currentQuestion,
                            sender: "ai",
                            timestamp: new Date(),
                            isQuestion: true,
                        },
                        true
                    );
                    setCurrentQuestionStartTime(Date.now());
                    setIsTyping(false);
                }, 2500);
            }, 1000);
            return;
        }
        if (!currentQuestion) return;
        setIsTyping(true);
        const responseTime = Math.round(
            (Date.now() - currentQuestionStartTime) / 1000
        );
        try {
            const evaluationResponse = await fetch("/api/interview", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "evaluate_response",
                    sessionId: interviewSession.id,
                    question: currentQuestion,
                    userResponse: currentInput,
                    currentQuestionIndex:
                        interviewSession.current_question_index,
                }),
            });
            const evaluationResult = await evaluationResponse.json();
            if (evaluationResult.success) {
                const { rating, feedback } = evaluationResult.data;
                setTimeout(() => {
                    addMessage(
                        {
                            text: feedback,
                            sender: "ai",
                            timestamp: new Date(),
                            rating,
                            feedback,
                        },
                        true
                    );
                    const updatedSession = {
                        ...interviewSession,
                        current_question_index:
                            interviewSession.current_question_index + 1,
                        questions_asked: [
                            ...interviewSession.questions_asked,
                            currentQuestion,
                        ],
                        user_responses: [
                            ...interviewSession.user_responses,
                            currentInput,
                        ],
                        question_ratings: [
                            ...interviewSession.question_ratings,
                            rating,
                        ],
                        response_times: [
                            ...interviewSession.response_times,
                            responseTime,
                        ],
                    };
                    setInterviewSession(updatedSession);
                    setTimeout(async () => {
                        try {
                            const nextQuestionResponse = await fetch(
                                "/api/interview",
                                {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({
                                        action: "next_question",
                                        sessionId: interviewSession.id,
                                        currentQuestion: currentQuestion,
                                        userResponse: currentInput,
                                        responseTime,
                                        currentQuestionIndex:
                                            interviewSession.current_question_index,
                                        questionsAsked:
                                            updatedSession.questions_asked,
                                        userResponses:
                                            updatedSession.user_responses,
                                        questionRatings:
                                            updatedSession.question_ratings,
                                        responseTimes:
                                            updatedSession.response_times,
                                        rating,
                                    }),
                                }
                            );
                            const nextQuestionResult =
                                await nextQuestionResponse.json();
                            if (nextQuestionResult.success) {
                                setTimeout(() => {
                                    addMessage(
                                        {
                                            text: nextQuestionResult.data
                                                .question,
                                            sender: "ai",
                                            timestamp: new Date(),
                                            isQuestion: true,
                                        },
                                        true
                                    );
                                    setCurrentQuestion(
                                        nextQuestionResult.data.question
                                    );
                                    setCurrentQuestionStartTime(Date.now());
                                    setIsTyping(false);
                                }, 2000);
                            } else {
                                if (
                                    nextQuestionResult.error?.includes(
                                        "completed"
                                    )
                                ) {
                                    setIsTyping(false);
                                    completeInterview();
                                } else {
                                    setIsTyping(false);
                                    toast.error(
                                        "Failed to generate next question"
                                    );
                                    router.push("/dashboard");
                                }
                            }
                        } catch (error) {
                            console.error(
                                "Error generating next question:",
                                error
                            );
                            setIsTyping(false);
                            toast.error("Failed to generate next question");
                            router.push("/dashboard");
                        }
                    }, 3000);
                }, 1500);
            } else {
                toast.error("Failed to evaluate response");
                setIsTyping(false);
                router.push("/dashboard");
            }
        } catch (error) {
            console.error("Error sending message:", error);
            toast.error("Failed to send message");
            setIsTyping(false);
            router.push("/dashboard");
        }
    }, [
        inputMessage,
        interviewSession,
        isWaitingForWelcomeResponse,
        currentQuestion,
        currentQuestionStartTime,
        addMessage,
        router,
    ]);

    const completeInterview = useCallback(async () => {
        if (!interviewSession) return;

        await withLoading(async () => {
            const response = await fetch("/api/interview", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "complete",
                    sessionId: interviewSession.id,
                    questionRatings: interviewSession.question_ratings,
                    responseTimes: interviewSession.response_times,
                }),
            });
            const result = await response.json();
            if (result.success) {
                const { summary } = result.data;
                const avgRating =
                    interviewSession.question_ratings.length > 0
                        ? interviewSession.question_ratings.reduce(
                              (a, b) => a + b,
                              0
                          ) / interviewSession.question_ratings.length
                        : 3;
                const avgResponseTime =
                    interviewSession.response_times.length > 0
                        ? Math.round(
                              interviewSession.response_times.reduce(
                                  (a, b) => a + b,
                                  0
                              ) / interviewSession.response_times.length
                          )
                        : 30;
                const score = Math.round(avgRating * 4);
                const maxScore = 20;
                setInterviewResults({
                    score,
                    maxScore,
                    rating: Math.round(avgRating),
                    avgResponseTime,
                    strengths: summary.strengths || [
                        "Good understanding of core concepts",
                        "Clear communication style",
                        "Professional approach to problem-solving",
                    ],
                    weaknesses: summary.weaknesses || [
                        "Could provide more specific examples",
                        "Consider improving response structure",
                        "Work on time management during responses",
                    ],
                });
                setShowResultsModal(true);
            } else {
                toast.error(result.error || "Failed to complete interview");
                router.push("/dashboard");
            }
        }, "Completing your interview...");
    }, [interviewSession, router, withLoading]);

    const handleKeyPress = useCallback(
        (e: React.KeyboardEvent) => {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
            }
        },
        [handleSendMessage]
    );

    const formatTime = useCallback((seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    }, []);

    if (status === "loading") {
        return null;
    }

    if (status === "unauthenticated") {
        router.push("/");
        return null;
    }

    return (
        <div className="h-[calc(100vh-150px)]">
            <div className="max-w-7xl mx-auto">
                {/* Minimal Header */}
                <div className="bg-gray-800 dark:bg-gray-900 text-white py-4 px-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center">
                                <Image
                                    src="/assets/logo_robot.png"
                                    alt="AI"
                                    width={28}
                                    height={28}
                                />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold">
                                    AI Interview Session
                                </h1>
                                <p className="text-gray-300 font-medium">
                                    {interviewParams.jobTitle} •{" "}
                                    {interviewParams.area
                                        ? interviewParams.area
                                              .charAt(0)
                                              .toUpperCase() +
                                          interviewParams.area.slice(1)
                                        : ""}{" "}
                                    Interview
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            {timeRemaining > 0 && (
                                <div className="bg-gray-700 rounded-xl px-4 py-2">
                                    <div className="flex items-center space-x-2 mb-1">
                                        <Timer className="w-4 h-4" />
                                        <span className="text-sm font-bold">
                                            {formatTime(timeRemaining)}
                                        </span>
                                    </div>
                                    <Progress
                                        value={progressPercentage}
                                        className="w-24 h-1 bg-gray-600"
                                    />
                                </div>
                            )}

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowReportIssueModal(true)}
                                className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                            >
                                <AlertTriangle className="w-4 h-4 mr-2" />
                                Report Issue
                            </Button>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowEndInterviewModal(true)}
                                className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                            >
                                <X className="w-4 h-4 mr-2" />
                                End Interview
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="h-[calc(100vh-250px)] overflow-y-auto p-6 ">
                    <div className="space-y-1">
                        {messages.map(message => (
                            <MessageComponent
                                key={message.id}
                                message={message}
                                userImage={session?.user?.image || undefined}
                            />
                        ))}

                        {isShowingTypingBubble && (
                            <div className="flex justify-start mb-6">
                                <TypingIndicator />
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>
                </div>

                {/* Enhanced Input Area */}
                <div>
                    <div className="flex items-center space-x-4">
                        <div className="flex-1 relative">
                            <Textarea
                                value={inputMessage}
                                onChange={e => setInputMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Share your thoughts and experiences..."
                                className="resize-none border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-gray-400 focus:ring-2 focus:ring-gray-200 transition-all duration-200 pr-12"
                                rows={3}
                                disabled={isTyping}
                            />
                            <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                                {inputMessage.length}/1000
                            </div>
                        </div>

                        <Button
                            onClick={handleSendMessage}
                            disabled={!inputMessage.trim() || isTyping}
                            className="px-8 py-6 bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Send className="w-5 h-5" />
                        </Button>
                    </div>

                    {isTyping && (
                        <div className="mt-3 flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                            <span>ACE is analyzing your response...</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Modals remain the same */}
            <InterviewResultModal
                isOpen={showResultsModal}
                onClose={() => setShowResultsModal(false)}
                score={interviewResults?.score || 0}
                maxScore={interviewResults?.maxScore || 20}
                rating={interviewResults?.rating || 0}
                avgResponseTime={interviewResults?.avgResponseTime || 0}
                strengths={interviewResults?.strengths || []}
                weaknesses={interviewResults?.weaknesses || []}
                onReturn={() => router.push("/dashboard")}
                onViewReport={() =>
                    router.push("/dashboard/practice-interviews")
                }
            />

            <EndInterviewModal
                isOpen={showEndInterviewModal}
                onClose={() => setShowEndInterviewModal(false)}
                onConfirm={() => completeInterview()}
            />

            <ReportIssueModal
                isOpen={showReportIssueModal}
                onClose={() => setShowReportIssueModal(false)}
                onSubmit={(email: string, message: string) => {
                    console.log("Report submitted:", { email, message });
                    setShowReportIssueModal(false);
                    toast.success("Issue reported successfully");
                }}
            />
        </div>
    );
};

export default InterviewPage;
