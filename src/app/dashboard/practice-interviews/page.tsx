"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Button from "@/components/small/Button/Button";
import { HiOutlineCubeTransparent } from "react-icons/hi2";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { BsClock } from "react-icons/bs";
import { jobTitles } from "@/lib/data";
import { PiUserCircleDashedLight } from "react-icons/pi";
import { LuMessageSquareDashed } from "react-icons/lu";

interface InterviewArea {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
}

interface DifficultyLevel {
    id: string;
    title: string;
    description: string;
    image: string;
}

const PracticeInterviewsPage = () => {
    const router = useRouter();
    const { data: session } = useSession();
    const [selectedArea, setSelectedArea] = useState<string>("technical");
    const [selectedDifficulty, setSelectedDifficulty] =
        useState<string>("advanced");
    const [selectedTime, setSelectedTime] = useState<string>("5");
    const [targetJobTitle, setTargetJobTitle] = useState<string>("");

    const interviewAreas: InterviewArea[] = [
        {
            id: "technical",
            title: "Technical Skills Assessment",
            description:
                "Tests technical knowledge and problem-solving abilities. i.e Coding challenges, system design, troubleshooting scenarios.",
            icon: <HiOutlineCubeTransparent size={60} />,
        },
        {
            id: "behavioral",
            title: "Behavioral Interviews",
            description:
                'Evaluates past behavior to predict future performance. i.e "Tell me about a time when...", "How do you handle conflict?"',
            icon: <PiUserCircleDashedLight size={60} />,
        },
        {
            id: "situational",
            title: "Situational Interviews",
            description:
                'Assesses how candidates would handle hypothetical situations. i.e "What would you do if...", "How would you approach..."',
            icon: <LuMessageSquareDashed size={60} />,
        },
        {
            id: "mock-interview",
            title: "Mock Interview",
            description:
                "Simulate a real interview experience, covering all aspects of a real interview. Perfect for comprehensive preparation.",
            icon: <IoIosCheckmarkCircleOutline size={60} />,
        },
    ];

    const difficultyLevels: DifficultyLevel[] = [
        {
            id: "novice",
            title: "Novice",
            description:
                "Covers fundamental concepts and easy questions to help you get started.",
            image: "/assets/novice.png",
        },
        {
            id: "advanced",
            title: "Advanced",
            description:
                "Includes moderately challenging questions to build on your skills.",
            image: "/assets/advanced.png",
        },
        {
            id: "hard",
            title: "Hard",
            description:
                "Features complex and in-depth questions to test your expertise.",
            image: "/assets/hard.png",
        },
    ];

    const timeOptions = ["5", "10", "15", "20", "25"];

    const handleStartInterview = () => {
        const params = new URLSearchParams({
            area: selectedArea,
            difficulty: selectedDifficulty,
            time: selectedTime,
            jobTitle: targetJobTitle,
        });

        router.push(
            `/dashboard/practice-interviews/interview?${params.toString()}`
        );
    };

    return (
        <div className="max-w-7xl mx-auto p-6 relative">
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Practice Interviews
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Prepare for your interviews with our interactive
                        practice sessions.
                    </p>
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
                            src={session?.user?.image || "/assets/avatar.jpg"}
                            alt="Profile Avatar"
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            </div>

            <div className="w-full space-y-8">
                <div className="flex items-center gap-8 justify-between">
                    <div className="bg-[#2D2D2D] text-white rounded-2xl p-6 flex items-center justify-between">
                        <div className="flex-1">
                            <h2 className="text-xl font-light mb-2">
                                Welcome to Practice Interviews! Select your{" "}
                                <span className="text-primary font-semibold">
                                    area
                                </span>
                                ,{" "}
                                <span className="text-primary font-semibold">
                                    difficulty
                                </span>
                                ,{" "}
                                <span className="text-primary font-semibold">
                                    desired job title
                                </span>{" "}
                                and press the{" "}
                                <span className="text-primary font-semibold">
                                    Start
                                </span>{" "}
                                button whenever you're ready.
                            </h2>
                        </div>
                        <div className="ml-6">
                            <Image
                                src="/assets/welcome-cat.svg"
                                alt="Welcome Character"
                                width={120}
                                height={120}
                                className="object-contain"
                            />
                        </div>
                    </div>
                    <div className="max-w-[250px]">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center">
                                <BsClock className="text-primary" size={24} />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Pro Tip
                            </h3>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Remember, ACE is tracking your response times. Make
                            sure to answer within the allotted time, or ACE will
                            assume you're unsure of the answer.
                        </p>
                    </div>
                </div>
                {/* Three Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-[60%_20%_20%] gap-6">
                    {/* Interview Areas */}
                    <div className="">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                            Choose the Interview Area You'd Like To Practice
                        </h3>
                        <div className="space-y-4">
                            {interviewAreas.map(area => (
                                <div
                                    key={area.id}
                                    onClick={() => setSelectedArea(area.id)}
                                    className={`
                    p-4 rounded-lg border-2 cursor-pointer transition-all
                    ${
                        selectedArea === area.id
                            ? "border-primary bg-primary/10 dark:bg-primary/20 dark:border-primary"
                            : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600"
                    }
                  `}
                                >
                                    <div className="flex items-start gap-3">
                                        <div
                                            className={`rounded-xl p-1 mt-1 ${
                                                selectedArea === area.id
                                                    ? "text-primary bg-white"
                                                    : "text-white bg-primary"
                                            }`}
                                        >
                                            {area.icon}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                                                {area.title}
                                            </h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {area.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Difficulty */}
                    <div className="flex flex-col items-center">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                            Choose Difficulty
                        </h3>
                        <div className="space-y-4">
                            {difficultyLevels.map(level => (
                                <div
                                    key={level.id}
                                    onClick={() =>
                                        setSelectedDifficulty(level.id)
                                    }
                                    className={`
                    w-[180px] h-[150px] rounded-lg cursor-pointer transition-all relative overflow-hidden border-2
                    ${
                        selectedDifficulty === level.id
                            ? "border-primary bg-primary/10 dark:bg-primary/20"
                            : "border-gray-200 dark:border-gray-700 bg-[#2D2D2D] hover:border-gray-300 dark:hover:border-gray-600"
                    }
                  `}
                                >
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-2">
                                        <div className="relative w-[35px] h-[45px] flex-shrink-0 mb-1 flex items-center justify-center">
                                            <Image
                                                src={level.image}
                                                alt={level.title}
                                                fill
                                                className="object-contain"
                                            />
                                        </div>
                                        <h4
                                            className={`font-semibold text-lg ${
                                                selectedDifficulty === level.id
                                                    ? "text-gray-900 dark:text-white"
                                                    : "text-white"
                                            }`}
                                        >
                                            {level.title}
                                        </h4>
                                        <p
                                            className={`text-xs leading-tight ${
                                                selectedDifficulty === level.id
                                                    ? "text-gray-700 dark:text-gray-300"
                                                    : "text-gray-300"
                                            }`}
                                        >
                                            {level.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Time Selection */}
                    <div className="flex flex-col items-center">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                            Choose Time
                        </h3>
                        <div className="space-y-2">
                            {timeOptions.map(time => (
                                <div
                                    key={time}
                                    onClick={() => setSelectedTime(time)}
                                    className={`
                    w-[90px] aspect-square rounded-full border-2 cursor-pointer transition-all flex items-center justify-center
                    ${
                        selectedTime === time
                            ? "border-primary bg-primary/10 dark:bg-primary/20 dark:border-primary"
                            : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-500"
                    }
                  `}
                                >
                                    <div className="text-center">
                                        <div className="text-lg font-bold text-gray-900 dark:text-white">
                                            {time} min
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Target Job Title */}
                <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                        Target Job Title
                    </h3>
                    <select
                        value={targetJobTitle}
                        onChange={e => setTargetJobTitle(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:text-white"
                    >
                        <option value="">Enter your desired job title</option>
                        {jobTitles.map(title => (
                            <option key={title} value={title}>
                                {title}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Start Button */}
                <div className="flex justify-center">
                    <Button
                        text="Start Interview"
                        type="primary"
                        htmlButtonType="button"
                        action={handleStartInterview}
                        className="px-8 py-3 text-lg"
                    />
                </div>

                {/* Pro Tip for Mobile */}
                <div className="lg:hidden">
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                                <BsClock
                                    className="text-orange-500 dark:text-orange-400"
                                    size={24}
                                />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Pro Tip
                            </h3>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                            Remember, ACE is tracking your response times. Make
                            sure to answer within the allotted time, or ACE will
                            assume you're unsure of the answer.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PracticeInterviewsPage;
