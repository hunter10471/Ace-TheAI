import { createClient } from "@/lib/supabase/server";
import { GeneratedQuestion } from "./gemini";

export interface TechnicalTerm {
    term: string;
    definition: string;
}

export interface Question {
    id: string;
    user_id: string;
    text: string;
    category: "Technical" | "Behavioral" | "Situational";
    difficulty: "Novice" | "Advanced" | "Hard";
    explanation: string;
    example: string;
    technical_terms: TechnicalTerm[];
    generated_date: string;
    is_active: boolean;
    created_at: string;
    is_bookmarked?: boolean;
}

export interface UserBookmark {
    id: string;
    user_id: string;
    question_id: string;
    created_at: string;
}

export interface GenerationJob {
    id: string;
    user_id: string;
    status: "pending" | "processing" | "completed" | "failed";
    result?: {
        questionsGenerated: number;
        duplicatesSkipped: number;
        existingDuplicatesCleaned: number;
        message: string;
    };
    error?: string;
    created_at: string;
    completed_at?: string;
}

// Check for duplicate questions
async function checkForDuplicates(
    userId: string,
    questions: GeneratedQuestion[]
): Promise<{ duplicates: string[]; unique: GeneratedQuestion[] }> {
    const supabase = await createClient();

    // Get all existing question texts for this user
    const { data: existingQuestions } = await supabase
        .from("questions")
        .select("text")
        .eq("user_id", userId)
        .eq("is_active", true);

    const existingTexts = new Set(
        existingQuestions?.map(q => q.text.toLowerCase().trim()) || []
    );

    const duplicates: string[] = [];
    const unique: GeneratedQuestion[] = [];

    questions.forEach(question => {
        const normalizedText = question.text.toLowerCase().trim();
        if (existingTexts.has(normalizedText)) {
            duplicates.push(question.text);
        } else {
            unique.push(question);
        }
    });

    return { duplicates, unique };
}

export async function saveQuestionsToDatabase(
    userId: string,
    questions: GeneratedQuestion[],
    duplicateStrategy: "skip" | "replace" = "skip"
): Promise<{ saved: number; skipped: number; replaced: number }> {
    const supabase = await createClient();

    if (duplicateStrategy === "skip") {
        // Check for duplicates and only save unique questions
        const { duplicates, unique } = await checkForDuplicates(
            userId,
            questions
        );

        if (unique.length === 0) {
            return { saved: 0, skipped: duplicates.length, replaced: 0 };
        }

        const questionsToInsert = unique.map(q => ({
            user_id: userId,
            text: q.text,
            category: q.category,
            difficulty: q.difficulty,
            explanation: q.explanation,
            example: q.example,
            technical_terms: q.technical_terms,
            generated_date: new Date().toISOString().split("T")[0],
            is_active: true,
        }));

        const { error } = await supabase
            .from("questions")
            .insert(questionsToInsert);

        if (error) {
            console.error("Error saving questions to database:", error);
            throw new Error("Failed to save questions to database");
        }

        return {
            saved: unique.length,
            skipped: duplicates.length,
            replaced: 0,
        };
    } else {
        // Replace strategy: delete existing duplicates and insert new ones
        const { duplicates, unique } = await checkForDuplicates(
            userId,
            questions
        );

        // Delete existing duplicate questions
        if (duplicates.length > 0) {
            const duplicateTexts = duplicates.map(text =>
                text.toLowerCase().trim()
            );
            const { error: deleteError } = await supabase
                .from("questions")
                .delete()
                .eq("user_id", userId)
                .eq("is_active", true)
                .in("text", duplicateTexts);

            if (deleteError) {
                console.error(
                    "Error deleting duplicate questions:",
                    deleteError
                );
                throw new Error("Failed to delete duplicate questions");
            }
        }

        // Insert all questions (including the ones that were duplicates)
        const questionsToInsert = questions.map(q => ({
            user_id: userId,
            text: q.text,
            category: q.category,
            difficulty: q.difficulty,
            explanation: q.explanation,
            example: q.example,
            technical_terms: q.technical_terms,
            generated_date: new Date().toISOString().split("T")[0],
            is_active: true,
        }));

        const { error } = await supabase
            .from("questions")
            .insert(questionsToInsert);

        if (error) {
            console.error("Error saving questions to database:", error);
            throw new Error("Failed to save questions to database");
        }

        return {
            saved: questions.length,
            skipped: 0,
            replaced: duplicates.length,
        };
    }
}

export async function getUserQuestions(
    userId: string,
    filters?: {
        category?: string;
        difficulty?: string;
        showBookmarkedOnly?: boolean;
        sortOrder?: "newest" | "oldest";
        search?: string;
        page?: number;
        limit?: number;
    }
): Promise<{
    questions: Question[];
    total: number;
    page: number;
    totalPages: number;
}> {
    const supabase = await createClient();

    let query;

    if (filters?.showBookmarkedOnly) {
        // For bookmarked questions, use inner join to only get questions that have bookmarks
        query = supabase
            .from("questions")
            .select(
                `
                *,
                user_bookmarks!inner(user_id)
            `
            )
            .eq("user_id", userId)
            .eq("is_active", true)
            .eq("user_bookmarks.user_id", userId);
    } else {
        // For all questions, use left join to get all questions with bookmark status
        query = supabase
            .from("questions")
            .select(
                `
                *,
                user_bookmarks(user_id)
            `
            )
            .eq("user_id", userId)
            .eq("is_active", true);
    }

    if (filters?.category) {
        query = query.eq("category", filters.category);
    }

    if (filters?.difficulty) {
        query = query.eq("difficulty", filters.difficulty);
    }

    // Apply search filter
    if (filters?.search) {
        query = query.ilike("text", `%${filters.search}%`);
    }

    // Get total count for pagination - simplified approach
    let countQuery = supabase
        .from("questions")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("is_active", true);

    if (filters?.category) {
        countQuery = countQuery.eq("category", filters.category);
    }

    if (filters?.difficulty) {
        countQuery = countQuery.eq("difficulty", filters.difficulty);
    }

    if (filters?.search) {
        countQuery = countQuery.ilike("text", `%${filters.search}%`);
    }

    // For bookmarked questions, we need to check if they have bookmarks
    if (filters?.showBookmarkedOnly) {
        countQuery = countQuery.not("user_bookmarks.user_id", "is", null);
    }

    const { count, error: countError } = await countQuery;
    if (countError) {
        console.error("Error counting questions:", countError);
        throw new Error("Failed to count questions");
    }
    const total = count || 0;

    // Apply pagination
    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const offset = (page - 1) * limit;

    // Apply sort order and pagination
    const ascending = filters?.sortOrder === "oldest";
    const { data, error } = await query
        .order("created_at", { ascending })
        .range(offset, offset + limit - 1);

    if (error) {
        console.error("Error fetching user questions:", error);
        throw new Error("Failed to fetch questions");
    }

    // Process results to add bookmark status
    const questions = (data || []).map((question: any) => ({
        ...question,
        is_bookmarked:
            question.user_bookmarks && question.user_bookmarks.length > 0,
    }));

    const totalPages = Math.ceil(total / limit);

    return {
        questions,
        total,
        page,
        totalPages,
    };
}

export async function toggleBookmark(
    userId: string,
    questionId: string
): Promise<boolean> {
    const supabase = await createClient();

    // Check if bookmark exists
    const { data: existingBookmark } = await supabase
        .from("user_bookmarks")
        .select("id")
        .eq("user_id", userId)
        .eq("question_id", questionId)
        .single();

    if (existingBookmark) {
        // Remove bookmark
        const { error } = await supabase
            .from("user_bookmarks")
            .delete()
            .eq("user_id", userId)
            .eq("question_id", questionId);

        if (error) {
            console.error("Error removing bookmark:", error);
            throw new Error("Failed to remove bookmark");
        }

        return false; // Bookmark removed
    } else {
        // Add bookmark
        const { error } = await supabase.from("user_bookmarks").insert({
            user_id: userId,
            question_id: questionId,
        });

        if (error) {
            console.error("Error adding bookmark:", error);
            throw new Error("Failed to add bookmark");
        }

        return true; // Bookmark added
    }
}

export async function getBookmarkedQuestions(
    userId: string
): Promise<Question[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("questions")
        .select(
            `
            *,
            user_bookmarks(user_id)
        `
        )
        .eq("user_id", userId)
        .eq("is_active", true)
        .not("user_bookmarks.user_id", "is", null)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching bookmarked questions:", error);
        throw new Error("Failed to fetch bookmarked questions");
    }

    // Process results to add bookmark status
    const questions = (data || []).map((question: any) => ({
        ...question,
        is_bookmarked: true, // All questions returned by this function are bookmarked
    }));

    return questions;
}

export async function checkDailyGenerationStatus(
    userId: string
): Promise<boolean> {
    // Remove daily generation limit - allow unlimited generations
    return false;
}

// Clean up existing duplicates in the database
export async function cleanupDuplicateQuestions(
    userId: string
): Promise<{ removed: number }> {
    const supabase = await createClient();

    // Get all questions for this user
    const { data: questions } = await supabase
        .from("questions")
        .select("id, text")
        .eq("user_id", userId)
        .eq("is_active", true)
        .order("created_at", { ascending: true });

    if (!questions || questions.length === 0) {
        return { removed: 0 };
    }

    const seenTexts = new Set<string>();
    const duplicatesToRemove: string[] = [];

    questions.forEach(question => {
        const normalizedText = question.text.toLowerCase().trim();
        if (seenTexts.has(normalizedText)) {
            duplicatesToRemove.push(question.id);
        } else {
            seenTexts.add(normalizedText);
        }
    });

    if (duplicatesToRemove.length > 0) {
        const { error } = await supabase
            .from("questions")
            .delete()
            .in("id", duplicatesToRemove);

        if (error) {
            console.error("Error removing duplicate questions:", error);
            throw new Error("Failed to remove duplicate questions");
        }
    }

    return { removed: duplicatesToRemove.length };
}

export async function getUserProfile(userId: string): Promise<{
    job_title: string;
    years_of_experience: string;
    key_skills: string[];
    professional_goal: string;
} | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("users")
        .select("job_title, years_of_experience, key_skills, professional_goal")
        .eq("id", userId)
        .single();

    if (error) {
        console.error("Error fetching user profile:", error);
        return null;
    }

    return data;
}

// Generation job management functions
export async function createGenerationJob(userId: string): Promise<string> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("generation_jobs")
        .insert({
            user_id: userId,
            status: "pending",
        })
        .select("id")
        .single();

    if (error) {
        console.error("Error creating generation job:", error);
        throw new Error("Failed to create generation job");
    }

    return data.id;
}

export async function updateGenerationJobStatus(
    jobId: string,
    status: "processing" | "completed" | "failed",
    result?: GenerationJob["result"],
    error?: string
): Promise<void> {
    const supabase = await createClient();

    const updateData: any = { status };

    if (status === "completed" || status === "failed") {
        updateData.completed_at = new Date().toISOString();
    }

    if (result) {
        updateData.result = result;
    }

    if (error) {
        updateData.error = error;
    }

    const { error: updateError } = await supabase
        .from("generation_jobs")
        .update(updateData)
        .eq("id", jobId);

    if (updateError) {
        console.error("Error updating generation job:", updateError);
        throw new Error("Failed to update generation job");
    }
}

export async function getLatestGenerationJob(
    userId: string
): Promise<GenerationJob | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("generation_jobs")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

    if (error) {
        if (error.code === "PGRST116") {
            // No rows returned
            return null;
        }
        console.error("Error fetching generation job:", error);
        return null;
    }

    return data;
}

export async function cleanupOldGenerationJobs(): Promise<void> {
    const supabase = await createClient();

    // Delete jobs older than 24 hours
    const twentyFourHoursAgo = new Date(
        Date.now() - 24 * 60 * 60 * 1000
    ).toISOString();

    const { error } = await supabase
        .from("generation_jobs")
        .delete()
        .lt("created_at", twentyFourHoursAgo);

    if (error) {
        console.error("Error cleaning up old generation jobs:", error);
    }
}
