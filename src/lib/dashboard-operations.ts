import { getInterviewSessions } from "./interview-operations";
import { getPerformanceStats } from "./performance-operations";

export interface WeeklyActivityDay {
    day: string;
    hours: number;
}

export interface DashboardData {
    sessionsThisWeek: number;
    weeklyGoal: number;
    successRate: number;
    successRateChart: { date: string; score: number; name: string }[];
    totalInterviews: number;
    averageScore: number;
    totalTimePracticedHours: number;
    highlightDates: number[];
    weeklyActivity: WeeklyActivityDay[];
}

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const WEEKLY_GOAL = 10;

function startOfWeek(now: Date): Date {
    const start = new Date(now);
    const day = (start.getDay() + 6) % 7; // Monday = 0
    start.setDate(start.getDate() - day);
    start.setHours(0, 0, 0, 0);
    return start;
}

export async function getDashboardData(userId: string): Promise<DashboardData> {
    const [sessions, stats] = await Promise.all([
        getInterviewSessions(userId),
        getPerformanceStats(userId),
    ]);

    const now = new Date();
    const weekStart = startOfWeek(now);

    const sessionsThisWeek = sessions.filter(
        s => new Date(s.created_at) >= weekStart
    );

    // Hours practiced per weekday of the current week
    const weeklyActivity: WeeklyActivityDay[] = DAY_LABELS.map(day => ({
        day,
        hours: 0,
    }));
    for (const session of sessionsThisWeek) {
        const created = new Date(session.created_at);
        const dayIndex = (created.getDay() + 6) % 7;
        weeklyActivity[dayIndex].hours += (session.duration || 0) / 60;
    }
    weeklyActivity.forEach(d => {
        d.hours = Math.round(d.hours * 10) / 10;
    });

    // Days of the current month with at least one session (calendar highlights)
    const highlightDates = Array.from(
        new Set(
            sessions
                .filter(s => {
                    const d = new Date(s.created_at);
                    return (
                        d.getMonth() === now.getMonth() &&
                        d.getFullYear() === now.getFullYear()
                    );
                })
                .map(s => new Date(s.created_at).getDate())
        )
    );

    // Success rate over the last 10 completed interviews (rating → percent)
    const completedWithFeedback = sessions
        .filter(
            s =>
                s.status === "completed" &&
                s.interview_feedback &&
                s.interview_feedback.length > 0
        )
        .slice(0, 10)
        .reverse();

    const successRateChart = completedWithFeedback.map((s: any) => ({
        date: new Date(s.created_at).toISOString().slice(0, 10),
        score: Math.round((s.interview_feedback[0].overall_rating / 5) * 100),
        name: `${s.interview_type} Interview`,
    }));

    const successRate =
        successRateChart.length > 0
            ? Math.round(
                  successRateChart.reduce((sum, s) => sum + s.score, 0) /
                      successRateChart.length
              )
            : 0;

    return {
        sessionsThisWeek: sessionsThisWeek.length,
        weeklyGoal: WEEKLY_GOAL,
        successRate,
        successRateChart,
        totalInterviews: stats.totalInterviews,
        averageScore: stats.averageScore,
        totalTimePracticedHours: stats.totalTimePracticed,
        highlightDates,
        weeklyActivity,
    };
}
