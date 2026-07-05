import DashboardStatsCard from "@/components/medium/DashboardStatsCard/DashboardStatsCard";
import ActionCard from "@/components/medium/ActionCard/ActionCard";
import Calendar from "@/components/medium/Calendar/Calendar";
import FeaturedContent from "@/components/medium/FeaturedContent/FeaturedContent";
import WeeklyActivity from "@/components/medium/WeeklyActivity/WeeklyActivity";
import { DashboardStatsCardType } from "@/lib/types";
import React from "react";
import { MdOutlineEdit } from "react-icons/md";
import { BsChatSquareQuote } from "react-icons/bs";
import { BsPatchQuestion } from "react-icons/bs";
import { IoTimeOutline, IoStatsChartOutline } from "react-icons/io5";
import { LuPieChart } from "react-icons/lu";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import ActivityStats from "@/components/medium/ActivityStats/ActivityStats";
import PageHeader from "@/components/big/PageHeader/PageHeader";
import { getDashboardData } from "@/lib/dashboard-operations";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function page() {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/");
    }

    const data = await getDashboardData(session.user.id);

    const activityStats = [
        {
            value: data.totalTimePracticedHours,
            label: "Hours practiced",
            icon: <IoTimeOutline size={22} />,
            color: "bg-[#009EFA]",
        },
        {
            value: `${data.averageScore}/5`,
            label: "Average interview rating",
            icon: <IoStatsChartOutline size={22} />,
            color: "bg-[#00C9A7]",
        },
        {
            value: data.totalInterviews,
            label: "Interviews completed",
            icon: <LuPieChart size={22} />,
            color: "bg-[#C197FF]",
        },
    ];

    return (
        <div>
            <PageHeader
                title={`Welcome back, ${
                    session.user.name?.split(" ")[0] || "User"
                }`}
                subtitle="Prepare, Practice, Perform!"
                userName={session.user.name || undefined}
                userEmail={session.user.email || undefined}
            />
            {data.totalInterviews === 0 && (
                <div className="my-6 rounded-xl border border-primary/30 bg-primary/5 p-5 flex items-center justify-between gap-4">
                    <div>
                        <h2 className="font-semibold text-lg">
                            No interviews yet
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                            Complete your first practice interview and your
                            stats will show up here.
                        </p>
                    </div>
                    <Link
                        href="/dashboard/practice-interviews"
                        className="bg-primary text-white px-4 py-2 rounded-lg text-sm whitespace-nowrap"
                    >
                        Start practicing
                    </Link>
                </div>
            )}
            <div className="flex justify-between">
                <div className="flex my-6 gap-4">
                    <DashboardStatsCard
                        color="#3C77C6"
                        darkColor="#00367E"
                        lightColor="#96C3FF"
                        title="Practice Sessions This Week"
                        imageSrc="/assets/practice-this-week.png"
                        stats={`${data.sessionsThisWeek}/${data.weeklyGoal}`}
                        progress={Math.min(
                            100,
                            Math.round(
                                (data.sessionsThisWeek / data.weeklyGoal) * 100
                            )
                        )}
                        type={DashboardStatsCardType.PracticeSessions}
                    />
                    <DashboardStatsCard
                        color="#E76A84"
                        darkColor="#E42B51"
                        lightColor="#96C3FF"
                        title="Interview Success Rate"
                        imageSrc="/assets/interview-success-rate.png"
                        stats={`${data.successRate}%`}
                        type={DashboardStatsCardType.InterviewSuccess}
                        chartData={data.successRateChart}
                    />
                    <DashboardStatsCard
                        color="#9570C9"
                        darkColor="#7533D2"
                        title="Practice Days This Month"
                        imageSrc="/assets/interviews-coming-up.png"
                        stats={`${data.highlightDates.length}`}
                        type={DashboardStatsCardType.InterviewThisWeek}
                        calendarDays={data.highlightDates}
                    />
                </div>
                <Calendar highlightDates={data.highlightDates} />
            </div>
            <h1 className="text-2xl mb-4 text-gray-900 dark:text-gray-100">
                What's Next?
            </h1>
            <div className="flex gap-4 justify-between">
                <div className="flex gap-4 mb-8">
                    <ActionCard
                        title="Practice Today"
                        description="Begin a new practice interview to sharpen your skills."
                        buttonText="Start Practice"
                        icon={
                            <MdOutlineEdit size={30} className="text-primary" />
                        }
                    />
                    <ActionCard
                        title="View Feedback"
                        description="Check out the latest feedback to improve your performance."
                        buttonText="View Feedback"
                        icon={
                            <BsChatSquareQuote
                                size={30}
                                className="text-primary"
                            />
                        }
                    />
                    <ActionCard
                        title="New Questions"
                        description="Discover new questions added to the question bank."
                        buttonText="Explore Questions"
                        icon={
                            <BsPatchQuestion
                                size={30}
                                className="text-primary"
                            />
                        }
                    />
                </div>
                <ActivityStats stats={activityStats} />
            </div>
            <div className="flex gap-6 justify-between">
                <FeaturedContent />
                <WeeklyActivity data={data.weeklyActivity} />
            </div>
        </div>
    );
}
