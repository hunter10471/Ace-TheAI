import PageHeader from "@/components/big/PageHeader/PageHeader";
import { getUser } from "../../actions/actions";
import PerformanceStatsCards from "@/components/medium/PerformanceStatsCards/PerformanceStatsCards";
import RatingInsightsChart from "@/components/medium/RatingInsightsChart/RatingInsightsChart";
import DifficultySuccessRate from "@/components/medium/DifficultySuccessRate/DifficultySuccessRate";
import InterviewHistoryTable from "@/components/medium/InterviewHistoryTable/InterviewHistoryTable";
import PerformanceCategoryChart from "@/components/medium/PerformanceCategoryChart/PerformanceCategoryChart";
import {
    getPerformanceStats,
    getRatingInsights,
    getDifficultySuccessRate,
    getInterviewHistory,
    getPerformanceByCategory,
} from "@/lib/performance-operations";

export const dynamic = "force-dynamic";

export default async function PerformancePage() {
    const user = await getUser();

    if (!user?.id) {
        return (
            <div className="space-y-6">
                <PageHeader
                    title="Performance"
                    subtitle="Track your interview performance and see detailed metrics"
                    userName={user?.name || undefined}
                    userEmail={user?.email || undefined}
                />
                <div className="text-center text-gray-500">
                    Please log in to view your performance data.
                </div>
            </div>
        );
    }

    const [
        performanceStats,
        ratingInsights,
        difficultySuccessRate,
        interviewHistory,
        performanceByCategory,
    ] = await Promise.all([
        getPerformanceStats(user.id),
        getRatingInsights(user.id),
        getDifficultySuccessRate(user.id),
        getInterviewHistory(user.id),
        getPerformanceByCategory(user.id),
    ]);

    const totalInterviews = performanceStats.totalInterviews;

    return (
        <div className="space-y-6">
            <PageHeader
                title="Performance"
                subtitle="Track your interview performance and see detailed metrics"
                userName={user?.name || undefined}
                userEmail={user?.email || undefined}
            />
            <PerformanceStatsCards stats={performanceStats} />
            <div className="flex gap-6">
                <RatingInsightsChart
                    data={ratingInsights}
                    totalInterviews={totalInterviews}
                />
                <DifficultySuccessRate
                    data={difficultySuccessRate}
                    totalInterviews={totalInterviews}
                />
            </div>
            <div className="flex gap-6">
                <InterviewHistoryTable data={interviewHistory} />
                <PerformanceCategoryChart
                    data={performanceByCategory}
                    totalInterviews={totalInterviews}
                />
            </div>
        </div>
    );
}
