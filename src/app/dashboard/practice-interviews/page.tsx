"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Button from "@/components/small/Button/Button";
import { BsClock } from "react-icons/bs";
import { useSession } from "next-auth/react";
import {
    FaCode,
    FaDatabase,
    FaServer,
    FaMobile,
    FaCloud,
    FaShieldAlt,
    FaChartLine,
    FaCogs,
} from "react-icons/fa";

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
    const [selectedArea, setSelectedArea] = useState<string>("");
    const [selectedDifficulty, setSelectedDifficulty] = useState<string>("");
    const [selectedJobTitle, setSelectedJobTitle] = useState<string>("");

    const interviewAreas: InterviewArea[] = [
        {
            id: "frontend",
            title: "Frontend Development",
            description: "HTML, CSS, JavaScript, React, Vue, Angular",
            icon: <FaCode className="text-blue-500" size={24} />,
        },
        {
            id: "backend",
            title: "Backend Development",
            description: "Node.js, Python, Java, C#, APIs, Databases",
            icon: <FaServer className="text-green-500" size={24} />,
        },
        {
            id: "fullstack",
            title: "Full Stack Development",
            description: "Complete web application development",
            icon: <FaCogs className="text-purple-500" size={24} />,
        },
        {
            id: "database",
            title: "Database & Data Engineering",
            description: "SQL, NoSQL, Data Modeling, ETL",
            icon: <FaDatabase className="text-orange-500" size={24} />,
        },
        {
            id: "mobile",
            title: "Mobile Development",
            description: "React Native, Flutter, iOS, Android",
            icon: <FaMobile className="text-pink-500" size={24} />,
        },
        {
            id: "cloud",
            title: "Cloud & DevOps",
            description: "AWS, Azure, Docker, Kubernetes",
            icon: <FaCloud className="text-cyan-500" size={24} />,
        },
        {
            id: "security",
            title: "Cybersecurity",
            description: "Network Security, Application Security",
            icon: <FaShieldAlt className="text-red-500" size={24} />,
        },
        {
            id: "data",
            title: "Data Science & Analytics",
            description: "Machine Learning, Statistics, BI",
            icon: <FaChartLine className="text-indigo-500" size={24} />,
        },
    ];

    const difficultyLevels: DifficultyLevel[] = [
        {
            id: "novice",
            title: "Novice",
            description: "Entry-level questions for beginners",
            image: "/assets/novice.png",
        },
        {
            id: "intermediate",
            title: "Intermediate",
            description: "Mid-level questions for experienced developers",
            image: "/assets/advanced.png",
        },
        {
            id: "advanced",
            title: "Advanced",
            description: "Expert-level questions for senior developers",
            image: "/assets/hard.png",
        },
    ];

    const jobTitles = [
        "Software Engineer",
        "Frontend Developer",
        "Backend Developer",
        "Full Stack Developer",
        "DevOps Engineer",
        "Data Engineer",
        "Mobile Developer",
        "QA Engineer",
        "Product Manager",
        "UI/UX Designer",
    ];

    const handleStartInterview = () => {
        if (!selectedArea || !selectedDifficulty || !selectedJobTitle) {
            alert("Please select all required fields");
            return;
        }

        const queryParams = new URLSearchParams({
            area: selectedArea,
            difficulty: selectedDifficulty,
            jobTitle: selectedJobTitle,
        });

        router.push(`/dashboard/practice-interviews/interview?${queryParams}`);
    };

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="flex items-center justify-between mb-8">
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
                            {/* This section was removed as per the new_code, as time selection is no longer present in the UI */}
                        </div>
                    </div>
                </div>

                {/* Target Job Title */}
                <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                        Target Job Title
                    </h3>
                    <select
                        value={selectedJobTitle}
                        onChange={e => setSelectedJobTitle(e.target.value)}
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
