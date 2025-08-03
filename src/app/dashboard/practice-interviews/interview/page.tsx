"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { IoClose } from "react-icons/io5";
import { MdOutlineReportProblem } from "react-icons/md";
import { useSession } from "next-auth/react";
import EndInterviewModal from "@/components/medium/EndInterviewModal/EndInterviewModal";
import ReportIssueModal from "@/components/medium/ReportIssueModal/ReportIssueModal";

interface Message {
    id: number;
    text: string;
    sender: "user" | "ai";
    timestamp: Date;
}

const InterviewPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { data: session } = useSession();
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            text: "Hello! I'm ACE, your AI interview assistant. I'll be conducting your interview today. Are you ready to begin?",
            sender: "ai",
            timestamp: new Date(),
        },
    ]);
    const [inputMessage, setInputMessage] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [showEndInterviewModal, setShowEndInterviewModal] = useState(false);
    const [showReportIssueModal, setShowReportIssueModal] = useState(false);

    const counters = {
        counter1: 1,
        counter2: 5,
        counter3: 10,
        counter4: 15,
    };

    const area = searchParams.get("area");
    const difficulty = searchParams.get("difficulty");
    const jobTitle = searchParams.get("jobTitle");

    const handleSendMessage = () => {
        if (!inputMessage.trim()) return;

        const newMessage: Message = {
            id: messages.length + 1,
            text: inputMessage,
            sender: "user",
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, newMessage]);
        setInputMessage("");
        setIsTyping(true);

        // Simulate AI response
        setTimeout(() => {
            const aiResponse: Message = {
                id: messages.length + 2,
                text: "Thank you for your response. That's a great answer! Let me ask you another question...",
                sender: "ai",
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, aiResponse]);
            setIsTyping(false);
        }, 2000);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleEndInterview = () => {
        setShowEndInterviewModal(false);
        router.push("/dashboard/practice-interviews");
    };

    const handleReportIssue = (email: string, message: string) => {
        console.log("Reporting issue:", { email, message });
        setShowReportIssueModal(false);
    };

    return (
        <div className="h-screen flex flex-col bg-white dark:bg-gray-900">
            <div className="border-b border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.back()}
                            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                        >
                            <IoClose size={20} />
                            <span>Back to Practice Interviews</span>
                        </button>
                        <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                            {area} • {difficulty} • {jobTitle}
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="font-semibold text-gray-900 dark:text-white">
                                {session?.user?.name || "User"}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {session?.user?.email || ""}
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-full overflow-hidden">
                            <Image
                                src={
                                    session?.user?.image || "/assets/avatar.jpg"
                                }
                                alt="Profile Avatar"
                                width={48}
                                height={48}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative flex-1 flex flex-col">
                <div className="border-b border-gray-200 dark:border-gray-700 p-4 sticky top-0 bg-[#F5F5F5] dark:bg-gray-800">
                    <div className="grid grid-cols-3">
                        <div className="flex items-end gap-4">
                            <div className="relative w-[90px] h-[40px]">
                                <Image
                                    src="/assets/logo_dark.png"
                                    alt="ACE AI"
                                    fill
                                    className="object-cover dark:hidden"
                                />
                                <Image
                                    src="/assets/logo_light.png"
                                    alt="ACE AI"
                                    fill
                                    className="object-cover hidden dark:block"
                                />
                            </div>
                            {isTyping && (
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    is typing...
                                </p>
                            )}
                        </div>
                        <div className="flex items-center gap-4 justify-center">
                            <div className="w-10 h-10 bg-[#2D2D2D] dark:bg-gray-700 rounded-lg flex items-center justify-center">
                                <span className="text-sm font-medium text-white">
                                    {counters.counter1}
                                </span>
                            </div>
                            <div className="w-10 h-10 bg-[#2D2D2D] dark:bg-gray-700 rounded-lg flex items-center justify-center">
                                <span className="text-sm font-medium text-white">
                                    {counters.counter2}
                                </span>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                            </div>
                            <div className="w-10 h-10 bg-[#2D2D2D] dark:bg-gray-700 rounded-lg flex items-center justify-center">
                                <span className="text-sm font-medium text-white">
                                    {counters.counter3}
                                </span>
                            </div>
                            <div className="w-10 h-10 bg-[#2D2D2D] dark:bg-gray-700 rounded-lg flex items-center justify-center">
                                <span className="text-sm font-medium text-white">
                                    {counters.counter4}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 justify-end">
                            <button
                                onClick={() => setShowReportIssueModal(true)}
                                className="flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                            >
                                <MdOutlineReportProblem size={16} />
                                <span className="text-sm">Report an issue</span>
                            </button>
                            <button
                                onClick={() => setShowEndInterviewModal(true)}
                                className="flex items-center gap-1 text-red-600 hover:text-red-800"
                            >
                                <IoClose size={16} />
                                <span className="text-sm">End Interview</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="relative flex-1 p-6 overflow-y-auto">
                    <div className="absolute top-0 left-0 w-full h-full">
                        <Image
                            src="/assets/practice-interview-bg.png"
                            alt="ACE AI"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div className="relative z-10 space-y-4">
                        {messages.map(message => (
                            <div
                                key={message.id}
                                className={`flex ${
                                    message.sender === "user"
                                        ? "justify-end"
                                        : "justify-start"
                                }`}
                            >
                                <div className="flex items-center gap-3 max-w-[80%]">
                                    {message.sender === "ai" && (
                                        <div className="w-12 h-12 bg-[#2D2D2D] dark:bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                                            <Image
                                                src="/assets/logo_robot.png"
                                                alt="ACE AI"
                                                width={34}
                                                height={34}
                                                className="object-contain"
                                            />
                                        </div>
                                    )}
                                    <div
                                        className={`px-4 py-2 rounded-lg ${
                                            message.sender === "user"
                                                ? "bg-blue-500 text-white"
                                                : "bg-[#E6E5EB] dark:bg-gray-700 text-gray-900 dark:text-white"
                                        }`}
                                    >
                                        <p className="text-sm">
                                            {message.text}
                                        </p>
                                    </div>
                                    {message.sender === "user" && (
                                        <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                                            <Image
                                                src={
                                                    session?.user?.image ||
                                                    "/assets/avatar.jpg"
                                                }
                                                alt="User Avatar"
                                                width={34}
                                                height={34}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                    <div className="flex items-center gap-2 bg-white dark:bg-gray-700 rounded-lg p-2">
                        <textarea
                            rows={1}
                            value={inputMessage}
                            onChange={e => setInputMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Enter your response"
                            className="flex-1 bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 px-2 py-1"
                        />
                        <button
                            onClick={handleSendMessage}
                            className="bg-primary hover:bg-primary/80 text-white rounded-lg px-10 py-2 flex items-center gap-2 transition-colors"
                        >
                            <span className="text-sm font-medium">Send</span>
                            <IoClose size={21} />
                        </button>
                    </div>
                </div>
            </div>

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

            {/* InterviewResultModal removed as per new_code */}
        </div>
    );
};

export default InterviewPage;
