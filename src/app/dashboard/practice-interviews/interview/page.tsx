"use client";

import type React from "react";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AlertTriangle, X, Send, Star, Bot, User, Timer } from "lucide-react";
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

const InterviewPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { data: session, status } = useSession();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const initializationRef = useRef(false);

    const [messages, setMessages] = useState<Message[]>([]);
    const [inputMessage, setInputMessage] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [showResultsModal, setShowResultsModal] = useState(false);
    const [showEndInterviewModal, setShowEndInterviewModal] = useState(false);
    const [showReportIssueModal, setShowReportIssueModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
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

    const [typingText, setTypingText] = useState("");
    const [isShowingTypingBubble, setIsShowingTypingBubble] = useState(false);

    // Get interview parameters from URL
    const interviewParams = useMemo(
        () => ({
            area: searchParams.get("area"),
            difficulty: searchParams.get("difficulty"),
            time: searchParams.get("time"),
            jobTitle: searchParams.get("jobTitle"),
        }),
        [searchParams]
    );

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Timer effect - countdown timer
    useEffect(() => {
        if (interviewStartTime > 0 && interviewParams.time) {
            const initialTime = Number.parseInt(interviewParams.time) * 60;
            setTimeRemaining(initialTime);

            const timer = setInterval(() => {
                setTimeRemaining(prev => {
                    const newTime = prev - 1;
                    if (newTime <= 0) {
                        clearInterval(timer);
                        completeInterview();
                        return 0;
                    }
                    return newTime;
                });
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [interviewStartTime, interviewParams.time]);

    // Initialize interview once
    useEffect(() => {
        if (status === "loading" || initializationRef.current) return;

        if (status === "unauthenticated") {
            router.push("/");
            return;
        }

        if (status === "authenticated" && !isInterviewStarted) {
            initializationRef.current = true;
            startInterview();
        }
    }, [status, router, isInterviewStarted]);

    const startInterview = useCallback(async () => {
        const { area, difficulty, time, jobTitle } = interviewParams;

        if (!area || !difficulty || !time || !jobTitle) {
            toast.error("Missing interview parameters");
            router.push("/dashboard/practice-interviews");
            return;
        }

        try {
            setIsLoading(true);
            const response = await fetch("/api/interview", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
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
                setIsWaitingForWelcomeResponse(true);

                // Add welcome message with typing animation
                setTimeout(() => {
                    addMessage(
                        {
                            text: `Hello ${
                                session?.user?.name || "there"
                            }! I'm ACE, your AI interview coach. I'll be conducting your ${area} interview today for a ${jobTitle} position. The interview will be ${difficulty} level and should take about ${time} minutes. Are you ready to begin?`,
                            sender: "ai",
                            timestamp: new Date(),
                        },
                        true
                    ); // Enable typing animation
                }, 1000);

                // Store the first question for later use
                setCurrentQuestion(result.data.question);
            } else {
                toast.error(result.error || "Failed to start interview");
                router.push("/dashboard/practice-interviews");
            }
        } catch (error) {
            console.error("Error starting interview:", error);
            toast.error("Failed to start interview");
            router.push("/dashboard/practice-interviews");
        } finally {
            setIsLoading(false);
        }
    }, [interviewParams, session?.user?.name, router]);

    const getPressurePrompt = useCallback((responseTime: number): string => {
        if (responseTime < 10) {
            return "That was a very quick response. Are you sure you've thought through this thoroughly?";
        } else if (responseTime < 30) {
            return "Take your time to provide a comprehensive answer. Don't rush.";
        } else if (responseTime > 120) {
            return "I notice you're taking quite a while to respond. Are you unsure about this topic?";
        } else if (responseTime > 180) {
            return "This is taking longer than expected. Do you need me to clarify the question?";
        }
        return "";
    }, []);

    const addMessage = useCallback(
        (message: Omit<Message, "id">, shouldType = false) => {
            const newMessage: Message = {
                ...message,
                id: `${message.sender}-${Date.now()}-${Math.random()}`,
            };

            if (shouldType && message.sender === "ai") {
                setIsShowingTypingBubble(true);
                setTypingText("");

                let index = 0;
                const typeInterval = setInterval(() => {
                    if (index < message.text.length) {
                        setTypingText(message.text.substring(0, index + 1));
                        index++;
                    } else {
                        clearInterval(typeInterval);
                        setIsShowingTypingBubble(false);
                        setTypingText("");
                        setMessages(prev => [...prev, newMessage]);
                    }
                }, 30); // 30ms delay between characters for smooth typing
            } else {
                setMessages(prev => [...prev, newMessage]);
            }

            return newMessage;
        },
        []
    );

    const handleSendMessage = useCallback(async () => {
        if (!inputMessage.trim() || !interviewSession) return;

        const userMessage = addMessage({
            text: inputMessage,
            sender: "user",
            timestamp: new Date(),
        });

        const currentInput = inputMessage;
        setInputMessage("");

        // Handle welcome response
        if (isWaitingForWelcomeResponse) {
            setIsWaitingForWelcomeResponse(false);
            setIsTyping(true);

            setTimeout(() => {
                addMessage(
                    {
                        text: "Great! Let's begin with your first question.",
                        sender: "ai",
                        timestamp: new Date(),
                    },
                    true
                ); // Enable typing animation

                setTimeout(() => {
                    addMessage(
                        {
                            text: currentQuestion,
                            sender: "ai",
                            timestamp: new Date(),
                            isQuestion: true,
                        },
                        true
                    ); // Enable typing animation
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
            // Evaluate the response
            const evaluationResponse = await fetch("/api/interview", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
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

                // Add evaluation feedback with typing animation
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
                    ); // Enable typing animation

                    // Update session first
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

                    // Add pressure prompt if needed (but delay it to avoid conflicts)
                    const pressurePrompt = getPressurePrompt(responseTime);
                    let pressureDelay = 0;

                    if (pressurePrompt) {
                        pressureDelay = 3000; // 3 second delay for pressure prompt
                        setTimeout(() => {
                            addMessage(
                                {
                                    text: pressurePrompt,
                                    sender: "ai",
                                    timestamp: new Date(),
                                },
                                true
                            ); // Enable typing animation
                        }, pressureDelay);
                    }

                    // Generate next question with proper delay to avoid conflicts
                    setTimeout(
                        async () => {
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
                                        ); // Enable typing animation
                                        setCurrentQuestion(
                                            nextQuestionResult.data.question
                                        );
                                        setCurrentQuestionStartTime(Date.now());
                                        setIsTyping(false);
                                    }, 2000); // Delay next question to ensure proper sequencing
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
                                    }
                                }
                            } catch (error) {
                                console.error(
                                    "Error generating next question:",
                                    error
                                );
                                setIsTyping(false);
                                toast.error("Failed to generate next question");
                            }
                        },
                        pressurePrompt ? pressureDelay + 4000 : 3000 // Wait for pressure prompt to finish if it exists
                    );
                }, 1500);
            } else {
                toast.error("Failed to evaluate response");
                setIsTyping(false);
            }
        } catch (error) {
            console.error("Error sending message:", error);
            toast.error("Failed to send message");
            setIsTyping(false);
        }
    }, [
        inputMessage,
        interviewSession,
        isWaitingForWelcomeResponse,
        currentQuestion,
        currentQuestionStartTime,
        addMessage,
        getPressurePrompt,
    ]);

    const completeInterview = useCallback(async () => {
        if (!interviewSession) return;

        try {
            const response = await fetch("/api/interview", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
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
            }
        } catch (error) {
            console.error("Error completing interview:", error);
            toast.error("Failed to complete interview");
        }
    }, [interviewSession]);

    const handleKeyPress = useCallback(
        (e: React.KeyboardEvent) => {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
            }
        },
        [handleSendMessage]
    );

    const handleEndInterview = useCallback(() => {
        setShowEndInterviewModal(false);
        completeInterview();
    }, [completeInterview]);

    const handleReportIssue = useCallback((email: string, message: string) => {
        console.log("Report submitted:", { email, message });
        setShowReportIssueModal(false);
        toast.success("Issue reported successfully");
    }, []);

    const handleReturnToDashboard = useCallback(() => {
        setShowResultsModal(false);
        router.push("/dashboard");
    }, [router]);

    const handleViewReport = useCallback(() => {
        setShowResultsModal(false);
        router.push("/dashboard/feedback-history");
    }, [router]);

    const formatTime = useCallback((seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs
            .toString()
            .padStart(2, "0")}`;
    }, []);

    const timeColor = useMemo(() => {
        if (timeRemaining <= 60) return "text-red-500";
        if (timeRemaining <= 300) return "text-yellow-500";
        return "text-green-500";
    }, [timeRemaining]);

    if (status === "loading" || isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="flex flex-col items-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    <p className="text-muted-foreground">
                        Loading interview...
                    </p>
                </div>
            </div>
        );
    }

    if (!session?.user) {
        return null;
    }

    return (
        <div className="flex flex-col h-screen bg-gradient-to-br from-background to-muted/20">
            {/* Header */}
            <Card className="rounded-none border-x-0 border-t-0">
                <CardContent className="p-6">
                    <div className="flex justify-between items-center">
                        <div className="space-y-1">
                            <h1 className="text-2xl font-bold">
                                AI Interview Practice
                            </h1>
                            <div className="flex items-center space-x-2">
                                <Badge variant="secondary">
                                    {interviewParams.area}
                                </Badge>
                                <Badge variant="outline">
                                    {interviewParams.difficulty}
                                </Badge>
                                <Badge variant="outline">
                                    {interviewParams.time} min
                                </Badge>
                                <Badge variant="outline">
                                    {interviewParams.jobTitle}
                                </Badge>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="text-right">
                                <p className="font-medium">
                                    {session.user.name}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {session.user.email}
                                </p>
                            </div>
                            <Avatar>
                                <AvatarImage src={session.user.image || ""} />
                                <AvatarFallback>
                                    <User className="h-4 w-4" />
                                </AvatarFallback>
                            </Avatar>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Status Bar */}
            <Card className="rounded-none border-x-0">
                <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <Image
                                    src="/assets/logo_dark.png"
                                    alt="ACE AI"
                                    width={70}
                                    height={70}
                                    className="dark:hidden"
                                />
                                <Image
                                    src="/assets/logo_light.png"
                                    alt="ACE AI"
                                    width={70}
                                    height={70}
                                    className="hidden dark:block"
                                />
                            </div>
                            {isTyping ? (
                                <div className="flex items-center space-x-2 text-muted-foreground">
                                    <div className="flex space-x-1">
                                        <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                                        <div
                                            className="w-2 h-2 bg-current rounded-full animate-bounce"
                                            style={{ animationDelay: "0.1s" }}
                                        ></div>
                                        <div
                                            className="w-2 h-2 bg-current rounded-full animate-bounce"
                                            style={{ animationDelay: "0.2s" }}
                                        ></div>
                                    </div>
                                    <span className="text-sm">
                                        ACE is typing...
                                    </span>
                                </div>
                            ) : (
                                <span className="text-sm text-muted-foreground">
                                    Waiting for your response...
                                </span>
                            )}
                        </div>

                        <div className="flex items-center space-x-6">
                            <div className="flex items-center space-x-2">
                                <Timer className="h-4 w-4" />
                                <span
                                    className={`text-lg font-mono font-bold ${timeColor}`}
                                >
                                    {formatTime(timeRemaining)}
                                </span>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                        setShowReportIssueModal(true)
                                    }
                                    className="text-muted-foreground hover:text-foreground"
                                >
                                    <AlertTriangle className="h-4 w-4 mr-1" />
                                    Report Issue
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                        setShowEndInterviewModal(true)
                                    }
                                    className="text-destructive hover:text-destructive"
                                >
                                    <X className="h-4 w-4 mr-1" />
                                    End Interview
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Chat Area */}
            <div className="flex-1 overflow-hidden">
                <div className="h-full overflow-y-auto p-6 space-y-6">
                    {messages.map((message, index) => (
                        <div
                            key={message.id}
                            className={`flex ${
                                message.sender === "user"
                                    ? "justify-end"
                                    : "justify-start"
                            } animate-in slide-in-from-bottom-2 duration-300`}
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <div
                                className={`flex items-start space-x-3 max-w-[80%] ${
                                    message.sender === "user"
                                        ? "flex-row-reverse space-x-reverse"
                                        : ""
                                }`}
                            >
                                <Avatar className="flex-shrink-0">
                                    {message.sender === "ai" ? (
                                        <Image
                                            src="/assets/logo_robot_white_bg.png"
                                            alt="ACE AI"
                                            width={150}
                                            height={150}
                                        />
                                    ) : (
                                        <>
                                            <AvatarImage
                                                src={session.user.image || ""}
                                            />
                                            <AvatarFallback>
                                                <User className="h-4 w-4" />
                                            </AvatarFallback>
                                        </>
                                    )}
                                </Avatar>

                                <Card
                                    className={`transform transition-all duration-300 ease-out animate-in zoom-in-95 ${
                                        message.sender === "user"
                                            ? "bg-primary text-primary-foreground"
                                            : ""
                                    }`}
                                    style={{
                                        animationDelay: `${index * 150}ms`,
                                    }}
                                >
                                    <CardContent className="px-4 py-2">
                                        <p className="text-sm leading-relaxed">
                                            {message.text}
                                        </p>
                                        {message.rating && (
                                            <div className="mt-3 pt-3 border-t border-border/50">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs text-muted-foreground">
                                                        Rating:
                                                    </span>
                                                    <div className="flex items-center space-x-1">
                                                        {[1, 2, 3, 4, 5].map(
                                                            star => (
                                                                <Star
                                                                    key={star}
                                                                    className={`h-3 w-3 transition-colors duration-200 ${
                                                                        star <=
                                                                        message.rating!
                                                                            ? "fill-yellow-400 text-yellow-400"
                                                                            : "text-muted-foreground"
                                                                    }`}
                                                                />
                                                            )
                                                        )}
                                                        <span className="text-xs ml-2">
                                                            {message.rating}/5
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    ))}

                    {/* Typing Bubble with 3 bouncing dots */}
                    {isShowingTypingBubble && (
                        <div className="flex justify-start animate-in slide-in-from-bottom-2 duration-300">
                            <div className="flex items-start space-x-3 max-w-[80%]">
                                <Avatar className="flex-shrink-0">
                                    <AvatarFallback className="bg-primary text-primary-foreground">
                                        <Bot className="h-4 w-4" />
                                    </AvatarFallback>
                                </Avatar>

                                <Card className="transform transition-all duration-300 ease-out animate-in zoom-in-95">
                                    <CardContent className="p-4">
                                        <div className="flex items-center space-x-1">
                                            <div className="flex space-x-1">
                                                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                                                <div
                                                    className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                                                    style={{
                                                        animationDelay: "0.1s",
                                                    }}
                                                ></div>
                                                <div
                                                    className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                                                    style={{
                                                        animationDelay: "0.2s",
                                                    }}
                                                ></div>
                                            </div>
                                            <p className="text-sm leading-relaxed ml-2">
                                                {typingText}
                                                {typingText && (
                                                    <span className="animate-pulse ml-1 text-primary">
                                                        ●
                                                    </span>
                                                )}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    )}

                    {/* Regular Typing Indicator - only show when not showing typing bubble */}
                    {isTyping && !isShowingTypingBubble && (
                        <div className="flex justify-start animate-in slide-in-from-bottom-2 duration-300">
                            <div className="flex items-start space-x-3 max-w-[80%]">
                                <Avatar className="flex-shrink-0">
                                    <AvatarFallback className="bg-primary text-primary-foreground">
                                        <Bot className="h-4 w-4" />
                                    </AvatarFallback>
                                </Avatar>

                                <Card className="transform transition-all duration-300 ease-out">
                                    <CardContent className="p-4">
                                        <div className="flex space-x-1">
                                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                                            <div
                                                className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                                                style={{
                                                    animationDelay: "0.1s",
                                                }}
                                            ></div>
                                            <div
                                                className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                                                style={{
                                                    animationDelay: "0.2s",
                                                }}
                                            ></div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input Area */}
            <Card className="rounded-none border-x-0 border-b-0">
                <CardContent className="p-4">
                    <div className="flex items-end space-x-3">
                        <div className="flex-1">
                            <Textarea
                                value={inputMessage}
                                onChange={e => setInputMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Type your response here..."
                                className="min-h-[60px] resize-none"
                                disabled={isTyping}
                            />
                        </div>
                        <Button
                            onClick={handleSendMessage}
                            disabled={isTyping || !inputMessage.trim()}
                            size="lg"
                            className="px-6"
                        >
                            <Send className="h-4 w-4 mr-2" />
                            Send
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Modals */}
            <ReportIssueModal
                isOpen={showReportIssueModal}
                onClose={() => setShowReportIssueModal(false)}
                onSubmit={handleReportIssue}
            />

            <EndInterviewModal
                isOpen={showEndInterviewModal}
                onClose={() => setShowEndInterviewModal(false)}
                onConfirm={handleEndInterview}
            />

            {interviewResults && (
                <InterviewResultModal
                    isOpen={showResultsModal}
                    onClose={() => setShowResultsModal(false)}
                    score={interviewResults.score}
                    maxScore={interviewResults.maxScore}
                    rating={interviewResults.rating}
                    avgResponseTime={interviewResults.avgResponseTime}
                    strengths={interviewResults.strengths}
                    weaknesses={interviewResults.weaknesses}
                    onReturn={handleReturnToDashboard}
                    onViewReport={handleViewReport}
                />
            )}
        </div>
    );
};

export default InterviewPage;
