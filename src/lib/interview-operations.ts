import { createClient } from "./supabase/server";
import { InterviewSession, InterviewFeedback, FeedbackEntry } from "./types";
import { auth } from "@/auth";

export async function getInterviewSessions(userId: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("interview_sessions")
        .select(
            `
            *,
            interview_feedback (*)
        `
        )
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching interview sessions:", error);
        throw new Error("Failed to fetch interview sessions");
    }

    return data;
}

export async function getInterviewSessionById(sessionId: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("interview_sessions")
        .select(
            `
            *,
            interview_feedback (*)
        `
        )
        .eq("id", sessionId)
        .single();

    if (error) {
        console.error("Error fetching interview session:", error);
        throw new Error("Failed to fetch interview session");
    }

    return data;
}

export async function createInterviewSession(
    sessionData: Omit<InterviewSession, "id" | "created_at">
) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("interview_sessions")
        .insert(sessionData)
        .select()
        .single();

    if (error) {
        console.error("Error creating interview session:", error);
        throw new Error("Failed to create interview session");
    }

    return data;
}

export async function updateInterviewSession(
    sessionId: string,
    updates: Partial<InterviewSession>
) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("interview_sessions")
        .update(updates)
        .eq("id", sessionId)
        .select()
        .single();

    if (error) {
        console.error("Error updating interview session:", error);
        throw new Error("Failed to update interview session");
    }

    return data;
}

export async function createInterviewFeedback(
    feedbackData: Omit<InterviewFeedback, "id" | "created_at">
) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("interview_feedback")
        .insert(feedbackData)
        .select()
        .single();

    if (error) {
        console.error("Error creating interview feedback:", error);
        throw new Error("Failed to create interview feedback");
    }

    return data;
}

export async function getFeedbackHistory(
    userId: string,
    filters?: {
        category?: string;
        rating?: number;
        startDate?: Date;
        endDate?: Date;
    }
) {
    const supabase = await createClient();

    let query = supabase
        .from("interview_sessions")
        .select(
            `
            *,
            interview_feedback (*)
        `
        )
        .eq("user_id", userId)
        .eq("status", "completed")
        .order("created_at", { ascending: false });

    if (filters?.category) {
        query = query.eq("interview_type", filters.category);
    }

    if (filters?.startDate) {
        query = query.gte("created_at", filters.startDate.toISOString());
    }

    if (filters?.endDate) {
        query = query.lte("created_at", filters.endDate.toISOString());
    }

    const { data, error } = await query;

    if (error) {
        console.error("Error fetching feedback history:", error);
        throw new Error("Failed to fetch feedback history");
    }

    let feedbackEntries: FeedbackEntry[] = [];

    if (data) {
        feedbackEntries = data
            .filter(
                session =>
                    session.interview_feedback &&
                    session.interview_feedback.length > 0
            )
            .map(session => {
                const feedback = session.interview_feedback[0];
                return {
                    id: session.id,
                    date: new Date(session.created_at).toLocaleDateString(
                        "en-US",
                        {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                        }
                    ),
                    title: `${session.interview_type} Interview - ${session.job_title}`,
                    category: session.interview_type,
                    rating: feedback.overall_rating,
                    summary: feedback.detailed_feedback,
                    explanation: feedback.detailed_feedback,
                    example: feedback.suggestions.join(", "),
                    session: session,
                    feedback: feedback,
                };
            });

        if (filters?.rating) {
            feedbackEntries = feedbackEntries.filter(
                entry => entry.rating === filters.rating
            );
        }
    }

    return feedbackEntries;
}

export async function getCurrentUser() {
    const session = await auth();
    if (!session?.user?.email) {
        throw new Error("User not authenticated");
    }

    const supabase = await createClient();
    const { data: user, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", session.user.email)
        .single();

    if (error || !user) {
        throw new Error("User not found");
    }

    return user;
}
