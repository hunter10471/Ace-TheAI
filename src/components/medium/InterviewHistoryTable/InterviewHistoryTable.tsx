"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { ChevronUp, ChevronDown } from "lucide-react";
import { useState, useMemo } from "react";
import TagPill from "@/components/small/TagPill/TagPill";
import { useThemeStore } from "@/lib/store";
import { InterviewHistory } from "@/lib/performance-operations";
import Link from "next/link";

interface InterviewHistoryTableProps {
    data: InterviewHistory[];
}

export default function InterviewHistoryTable({
    data,
}: InterviewHistoryTableProps) {
    const { isDarkMode } = useThemeStore();
    const [sortConfig, setSortConfig] = useState<{
        key: string;
        direction: "asc" | "desc";
    } | null>(null);

    const handleSort = (key: string) => {
        let direction: "asc" | "desc" = "asc";
        if (
            sortConfig &&
            sortConfig.key === key &&
            sortConfig.direction === "asc"
        ) {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    const SortIcon = ({ column }: { column: string }) => {
        const inactiveColor = isDarkMode ? "text-gray-500" : "text-gray-400";
        const activeColor = isDarkMode ? "text-gray-300" : "text-gray-600";

        if (!sortConfig || sortConfig.key !== column) {
            return <ChevronUp className={`ml-1 h-4 w-4 ${inactiveColor}`} />;
        }
        return sortConfig.direction === "asc" ? (
            <ChevronUp className={`ml-1 h-4 w-4 ${activeColor}`} />
        ) : (
            <ChevronDown className={`ml-1 h-4 w-4 ${activeColor}`} />
        );
    };

    const sortedData = useMemo(() => {
        if (!sortConfig) return data.slice(0, 10);

        const sorted = [...data].sort((a, b) => {
            const { key, direction } = sortConfig;
            let aValue: any = a[key as keyof InterviewHistory];
            let bValue: any = b[key as keyof InterviewHistory];

            if (key === "date") {
                aValue = new Date(aValue);
                bValue = new Date(bValue);
            }

            if (aValue < bValue) {
                return direction === "asc" ? -1 : 1;
            }
            if (aValue > bValue) {
                return direction === "asc" ? 1 : -1;
            }
            return 0;
        });

        return sorted.slice(0, 10);
    }, [data, sortConfig]);

    const titleColor = isDarkMode ? "text-gray-100" : "text-gray-900";
    const hoverColor = isDarkMode ? "hover:bg-gray-600" : "hover:bg-gray-50";
    const headTextColor = isDarkMode ? "text-gray-300" : "text-gray-700";
    const cellTextColor = isDarkMode ? "text-gray-200" : "text-gray-900";
    const feedbackTextColor = isDarkMode ? "text-gray-400" : "text-gray-600";
    const linkColor = isDarkMode
        ? "text-gray-400 hover:text-gray-300"
        : "text-gray-600 hover:text-gray-800";

    return (
        <div className="w-[80%] max-w-[700px]">
            <h2 className={`text-lg font-semibold ${titleColor} mb-6`}>
                Interview History
            </h2>
            <div className={` rounded-lg max-h-[300px] overflow-y-auto`}>
                <Table>
                    <TableHeader>
                        <TableRow className="border-b">
                            <TableHead
                                className={`cursor-pointer ${hoverColor} font-medium ${headTextColor} h-8 px-2`}
                                onClick={() => handleSort("date")}
                            >
                                <div className="flex items-center">
                                    Date
                                    <SortIcon column="date" />
                                </div>
                            </TableHead>
                            <TableHead
                                className={`cursor-pointer ${hoverColor} font-medium ${headTextColor} h-8 px-2`}
                                onClick={() => handleSort("jobTitle")}
                            >
                                <div className="flex items-center">
                                    Job Title
                                    <SortIcon column="jobTitle" />
                                </div>
                            </TableHead>
                            <TableHead
                                className={`cursor-pointer ${hoverColor} font-medium ${headTextColor} h-8 px-2`}
                                onClick={() => handleSort("category")}
                            >
                                <div className="flex items-center">
                                    Category
                                    <SortIcon column="category" />
                                </div>
                            </TableHead>
                            <TableHead
                                className={`cursor-pointer ${hoverColor} font-medium ${headTextColor} h-8 px-2`}
                                onClick={() => handleSort("difficulty")}
                            >
                                <div className="flex items-center">
                                    Difficulty
                                    <SortIcon column="difficulty" />
                                </div>
                            </TableHead>
                            <TableHead
                                className={`cursor-pointer ${hoverColor} font-medium ${headTextColor} h-8 px-2`}
                                onClick={() => handleSort("rating")}
                            >
                                <div className="flex items-center">
                                    Rating
                                    <SortIcon column="rating" />
                                </div>
                            </TableHead>
                            <TableHead
                                className={`font-medium ${headTextColor} h-8 px-2`}
                            >
                                Feedback
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sortedData.map((interview, index) => (
                            <TableRow
                                key={index}
                                className={`border-b last:border-b-0 h-10`}
                            >
                                <TableCell
                                    className={`font-medium ${cellTextColor} px-2 py-1`}
                                >
                                    {interview.date}
                                </TableCell>
                                <TableCell
                                    className={`font-medium ${cellTextColor} px-2 py-1`}
                                >
                                    {interview.jobTitle}
                                </TableCell>
                                <TableCell className="px-2 py-1">
                                    <TagPill
                                        type="category"
                                        value={interview.category}
                                    />
                                </TableCell>
                                <TableCell className="px-2 py-1">
                                    <TagPill
                                        type="difficulty"
                                        value={interview.difficulty}
                                    />
                                </TableCell>
                                <TableCell
                                    className={`font-medium ${cellTextColor} px-2 py-1`}
                                >
                                    {interview.rating}
                                </TableCell>
                                <TableCell
                                    className={`${feedbackTextColor} max-w-xs px-2 py-1`}
                                >
                                    {interview.feedback}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                <Link
                    href="/dashboard/feedback-history"
                    className={`text-xs ${linkColor} transition-colors duration-200 font-medium`}
                >
                    View all interview details →
                </Link>
            </div>
        </div>
    );
}
