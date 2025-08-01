import PageHeader from "@/components/big/PageHeader/PageHeader";
import { getUser } from "../../actions/actions";
import PerformanceStatsCards from "@/components/medium/PerformanceStatsCards/PerformanceStatsCards";
import RatingInsightsChart from "@/components/medium/RatingInsightsChart/RatingInsightsChart";
import DifficultySuccessRate from "@/components/medium/DifficultySuccessRate/DifficultySuccessRate";
import InterviewHistoryTable from "@/components/medium/InterviewHistoryTable/InterviewHistoryTable";
import PerformanceCategoryChart from "@/components/medium/PerformanceCategoryChart/PerformanceCategoryChart";

export const dynamic = "force-dynamic";

export default async function PerformancePage() {
    const user = await getUser();

    return (
        <div className="space-y-6">
            <PageHeader
                title="Performance"
                subtitle="Track your interview performance and see detailed metrics"
                userName={user.name}
                userEmail={user.email}
            />
            <PerformanceStatsCards />
            <div className="flex gap-6">
                <RatingInsightsChart />
                <DifficultySuccessRate />
            </div>
            <div className="flex gap-6">
                <InterviewHistoryTable />
                <PerformanceCategoryChart />
            </div>
        </div>
    );
}
