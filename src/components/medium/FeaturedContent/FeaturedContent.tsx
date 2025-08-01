"use client";

import React from "react";
import { IoEyeOutline } from "react-icons/io5";
import { PiBookOpenTextFill } from "react-icons/pi";
import { MdOutlineSchool } from "react-icons/md";
import { BsFileEarmarkText } from "react-icons/bs";

interface FeaturedContentCardProps {
    title: string;
    description: string;
    views: string;
    author: string;
    icon: React.ReactNode;
}

const FeaturedContentCard: React.FC<FeaturedContentCardProps> = ({
    title,
    description,
    views,
    author,
    icon,
}) => {
    return (
        <div className="bg-[#2D2D2D] rounded-2xl p-4 w-[180px] h-[160px] flex flex-col justify-between transition-all hover:shadow-lg cursor-pointer border border-gray-800 dark:border-gray-700">
            <div>
                <h3 className="text-white font-medium text-base mb-2 leading-tight">
                    {title}
                </h3>
                <p className="text-gray-300 dark:text-gray-400 text-xs leading-relaxed">
                    {description}
                </p>
            </div>

            <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-1 text-gray-400 dark:text-gray-500">
                    <IoEyeOutline size={14} />
                    <span className="text-xs">{views}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400 dark:text-gray-500">
                    <span className="text-xs">By</span>
                    <div className="text-primary">{icon}</div>
                </div>
            </div>
        </div>
    );
};

const FeaturedContent: React.FC = () => {
    const featuredItems = [
        {
            title: "Guide to Interview Questions",
            description: "Here is a guide that contains a list of...",
            views: "100k+",
            author: "Ace AI",
            icon: <PiBookOpenTextFill size={20} />,
        },
        {
            title: "Interview Etiquette 101",
            description: "Watch this video to understand the do's...",
            views: "20k+",
            author: "Ace AI",
            icon: <MdOutlineSchool size={20} />,
        },
        {
            title: "Ultimate Resume Guide",
            description: "Discover how to create a standout resume...",
            views: "120k+",
            author: "Ace AI",
            icon: <BsFileEarmarkText size={20} />,
        },
    ];

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
                Featured Content
            </h2>
            <div className="flex gap-4">
                {featuredItems.map((item, index) => (
                    <FeaturedContentCard
                        key={index}
                        title={item.title}
                        description={item.description}
                        views={item.views}
                        author={item.author}
                        icon={item.icon}
                    />
                ))}
            </div>
        </div>
    );
};

export default FeaturedContent;
