"use client";
import { useSession } from "next-auth/react";

interface PageHeaderProps {
    title: string;
    subtitle: string;
    userName?: string | null;
    userEmail?: string | null;
    userAvatar?: string | null;
}

export default function PageHeader({
    title,
    subtitle,
    userName,
    userEmail,
    userAvatar,
}: PageHeaderProps) {
    const { data: session } = useSession();

    // Use session data if available, otherwise fall back to props or defaults
    const displayName = userName || session?.user?.name || "User";
    const displayEmail = userEmail || session?.user?.email || "";
    const displayAvatar =
        userAvatar || session?.user?.image || "/assets/avatar.jpg";

    return (
        <div className="flex justify-between items-center mb-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    {title}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                    {subtitle}
                </p>
            </div>
            <div className="flex items-center space-x-3">
                <div className="text-right">
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                        {displayName}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        {displayEmail}
                    </p>
                </div>
                <img
                    src={displayAvatar}
                    alt="User"
                    className="w-12 h-12 rounded-full object-cover"
                />
            </div>
        </div>
    );
}
