import { createClient } from "./supabase/server";

export interface PerformanceStats {
    totalInterviews: number;
    averageScore: number;
    strongestCategory: string;
    totalTimePracticed: number;
}

export interface RatingInsight {
    month: string;
    rating: number;
}

export interface DifficultySuccessRate {
    name: string;
    value: number;
    color: string;
}

export interface InterviewHistory {
    date: string;
    jobTitle: string;
    category: string;
    difficulty: string;
    rating: number;
    feedback: string;
}

export interface PerformanceCategory {
    category: string;
    fullLabel: string;
    percentage: number;
    color: string;
    stroke: string;
}

export async function getPerformanceStats(
    userId: string
): Promise<PerformanceStats> {
    const supabase = await createClient();

    const { data: sessions, error: sessionsError } = await supabase
        .from("interview_sessions")
        .select("*")
        .eq("user_id", userId)
        .eq("status", "completed");

    if (sessionsError) {
        console.error("Error fetching interview sessions:", sessionsError);
        return {
            totalInterviews: 0,
            averageScore: 0,
            strongestCategory: "N/A",
            totalTimePracticed: 0,
        };
    }

    const { data: feedback, error: feedbackError } = await supabase
        .from("interview_feedback")
        .select("*")
        .in("session_id", sessions?.map(s => s.id) || []);

    if (feedbackError) {
        console.error("Error fetching feedback:", feedbackError);
        return {
            totalInterviews: sessions?.length || 0,
            averageScore: 0,
            strongestCategory: "N/A",
            totalTimePracticed:
                sessions?.reduce(
                    (total, session) => total + (session.duration || 0),
                    0
                ) || 0,
        };
    }

    const totalInterviews = sessions?.length || 0;
    const averageScore =
        feedback && feedback.length > 0
            ? feedback.reduce((sum, f) => sum + (f.overall_rating || 0), 0) /
              feedback.length
            : 0;

    const totalTimePracticed =
        sessions?.reduce(
            (total, session) => total + (session.duration || 0),
            0
        ) || 0;

    const strongestCategory = "Technical";

    return {
        totalInterviews,
        averageScore: Math.round(averageScore * 10) / 10,
        strongestCategory,
        totalTimePracticed: Math.round(totalTimePracticed / 60),
    };
}

export async function getRatingInsights(
    userId: string
): Promise<RatingInsight[]> {
    const supabase = await createClient();

    const { data: sessions, error: sessionsError } = await supabase
        .from("interview_sessions")
        .select("id")
        .eq("user_id", userId);

    if (sessionsError) {
        console.error("Error fetching sessions:", sessionsError);
        return [];
    }

    const { data: feedback, error } = await supabase
        .from("interview_feedback")
        .select("overall_rating, created_at")
        .in("session_id", sessions?.map(s => s.id) || [])
        .gte(
            "created_at",
            new Date(new Date().getFullYear(), 0, 1).toISOString()
        )
        .order("created_at");

    if (error) {
        console.error("Error fetching rating insights:", error);
        return [];
    }

    const monthlyRatings: { [key: string]: number[] } = {};

    feedback?.forEach(f => {
        const date = new Date(f.created_at);
        const month = date.toLocaleString("default", { month: "short" });
        if (!monthlyRatings[month]) {
            monthlyRatings[month] = [];
        }
        monthlyRatings[month].push(f.overall_rating || 0);
    });

    const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];

    return months.map(month => ({
        month,
        rating: monthlyRatings[month]
            ? Math.round(
                  (monthlyRatings[month].reduce((sum, r) => sum + r, 0) /
                      monthlyRatings[month].length) *
                      10
              ) / 10
            : 0,
    }));
}

export async function getDifficultySuccessRate(
    userId: string
): Promise<DifficultySuccessRate[]> {
    const supabase = await createClient();

    const { data: sessions, error } = await supabase
        .from("interview_sessions")
        .select("difficulty, id")
        .eq("user_id", userId)
        .eq("status", "completed");

    if (error) {
        console.error("Error fetching difficulty success rate:", error);
        return [
            { name: "Novice", value: 0, color: "#86EFAC" },
            { name: "Advanced", value: 0, color: "#C4B5FD" },
            { name: "Hard", value: 0, color: "#FDA4AF" },
        ];
    }

    const sessionIds = sessions?.map(s => s.id) || [];
    const { data: feedback, error: feedbackError } = await supabase
        .from("interview_feedback")
        .select("session_id, overall_rating")
        .in("session_id", sessionIds);

    if (feedbackError) {
        console.error("Error fetching feedback:", feedbackError);
    }

    const difficultyStats: {
        [key: string]: { total: number; successful: number };
    } = {};
    const feedbackMap = new Map(
        feedback?.map(f => [f.session_id, f.overall_rating]) || []
    );

    sessions?.forEach(session => {
        const difficulty = session.difficulty;
        if (!difficultyStats[difficulty]) {
            difficultyStats[difficulty] = { total: 0, successful: 0 };
        }
        difficultyStats[difficulty].total++;

        const rating = feedbackMap.get(session.id) || 0;
        if (rating >= 3) {
            difficultyStats[difficulty].successful++;
        }
    });

    const colors = {
        Novice: "#86EFAC",
        Advanced: "#C4B5FD",
        Hard: "#FDA4AF",
    };

    return Object.entries(difficultyStats).map(([difficulty, stats]) => ({
        name: difficulty,
        value:
            stats.total > 0
                ? Math.round((stats.successful / stats.total) * 100)
                : 0,
        color: colors[difficulty as keyof typeof colors] || "#86EFAC",
    }));
}

export async function getInterviewHistory(
    userId: string
): Promise<InterviewHistory[]> {
    const supabase = await createClient();

    const { data: sessions, error } = await supabase
        .from("interview_sessions")
        .select("*")
        .eq("user_id", userId)
        .eq("status", "completed")
        .order("created_at", { ascending: false })
        .limit(10);

    if (error) {
        console.error("Error fetching interview history:", error);
        return [];
    }

    const sessionIds = sessions?.map(s => s.id) || [];
    const { data: feedback, error: feedbackError } = await supabase
        .from("interview_feedback")
        .select("*")
        .in("session_id", sessionIds);

    if (feedbackError) {
        console.error("Error fetching feedback for history:", feedbackError);
    }

    const feedbackMap = new Map(feedback?.map(f => [f.session_id, f]) || []);

    return (
        sessions?.map(session => {
            const feedback = feedbackMap.get(session.id);

            return {
                date: new Date(session.created_at).toISOString().split("T")[0],
                jobTitle: session.job_title,
                category: session.interview_type,
                difficulty: session.difficulty,
                rating: feedback?.overall_rating || 0,
                feedback:
                    feedback?.detailed_feedback || "No feedback available",
            };
        }) || []
    );
}

export async function getPerformanceByCategory(
    userId: string
): Promise<PerformanceCategory[]> {
    const supabase = await createClient();

    const { data: sessions, error } = await supabase
        .from("interview_sessions")
        .select("interview_type, id")
        .eq("user_id", userId)
        .eq("status", "completed");

    if (error) {
        console.error("Error fetching performance by category:", error);
        return [
            {
                category: "Tech.",
                fullLabel: "Technical",
                percentage: 0,
                color: "#FFF1D4",
                stroke: "#F3CD7D",
            },
            {
                category: "Behav.",
                fullLabel: "Behavioral",
                percentage: 0,
                color: "#C1DCFB",
                stroke: "#92C3FA",
            },
            {
                category: "Situat.",
                fullLabel: "Situational",
                percentage: 0,
                color: "#FBCFAE",
                stroke: "#F3AF7D",
            },
        ];
    }

    const sessionIds = sessions?.map(s => s.id) || [];
    const { data: feedback, error: feedbackError } = await supabase
        .from("interview_feedback")
        .select("session_id, overall_rating")
        .in("session_id", sessionIds);

    if (feedbackError) {
        console.error("Error fetching feedback for categories:", feedbackError);
    }

    const categoryStats: {
        [key: string]: { total: number; totalRating: number };
    } = {};
    const feedbackMap = new Map(
        feedback?.map(f => [f.session_id, f.overall_rating]) || []
    );

    sessions?.forEach(session => {
        const category = session.interview_type;
        if (!categoryStats[category]) {
            categoryStats[category] = { total: 0, totalRating: 0 };
        }
        categoryStats[category].total++;

        const rating = feedbackMap.get(session.id) || 0;
        categoryStats[category].totalRating += rating;
    });

    const colors = {
        Technical: { color: "#FFF1D4", stroke: "#F3CD7D" },
        Behavioral: { color: "#C1DCFB", stroke: "#92C3FA" },
        Situational: { color: "#FBCFAE", stroke: "#F3AF7D" },
    };

    const labels = {
        Technical: "Tech.",
        Behavioral: "Behav.",
        Situational: "Situat.",
    };

    return Object.entries(categoryStats).map(([category, stats]) => ({
        category: labels[category as keyof typeof labels] || category,
        fullLabel: category,
        percentage:
            stats.total > 0
                ? Math.round((stats.totalRating / stats.total) * 20)
                : 0,
        color: colors[category as keyof typeof colors]?.color || "#FFF1D4",
        stroke: colors[category as keyof typeof colors]?.stroke || "#F3CD7D",
    }));
}
