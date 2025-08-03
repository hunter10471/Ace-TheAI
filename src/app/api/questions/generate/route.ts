import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { generatePersonalizedQuestions } from "@/lib/gemini";
import {
    saveQuestionsToDatabase,
    getUserProfile,
    checkDailyGenerationStatus,
    cleanupDuplicateQuestions,
    createGenerationJob,
    updateGenerationJobStatus,
    getLatestGenerationJob,
} from "@/lib/question-operations";

export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { background = false } = await request.json();

        // Check if there's already a pending or processing job
        const existingJob = await getLatestGenerationJob(session.user.id);
        if (
            existingJob &&
            (existingJob.status === "pending" ||
                existingJob.status === "processing")
        ) {
            return NextResponse.json(
                {
                    error: "Question generation already in progress",
                    jobId: existingJob.id,
                    status: existingJob.status,
                },
                { status: 409 }
            );
        }

        if (background) {
            // Start background generation
            const jobId = await createGenerationJob(session.user.id);

            // Start the background process (don't await it)
            processGenerationInBackground(session.user.id, jobId);

            return NextResponse.json({
                success: true,
                message: "Question generation started in background",
                jobId,
                status: "pending",
            });
        } else {
            // Synchronous generation (existing behavior)
            return await performGeneration(session.user.id);
        }
    } catch (error) {
        console.error("Error in question generation:", error);
        return NextResponse.json(
            { error: "Failed to generate questions" },
            { status: 500 }
        );
    }
}

async function performGeneration(userId: string) {
    // Get user profile for personalization
    const userProfile = await getUserProfile(userId);
    if (!userProfile) {
        return NextResponse.json(
            {
                error: "User profile not found. Please complete your profile first.",
            },
            { status: 400 }
        );
    }

    // Generate questions using Gemini
    const questions = await generatePersonalizedQuestions(userProfile, 20);

    // First, clean up any existing duplicates in the database
    const cleanupResult = await cleanupDuplicateQuestions(userId);

    // Save questions to database with duplicate handling (skip duplicates by default)
    const result = await saveQuestionsToDatabase(userId, questions, "skip");

    let message = "";
    if (result.saved > 0 && result.skipped > 0) {
        message = `${result.saved} new questions added, ${result.skipped} duplicates skipped`;
    } else if (result.saved > 0) {
        message = `${result.saved} new questions added to your collection`;
    } else if (result.skipped > 0) {
        message = `All ${result.skipped} questions were duplicates and skipped`;
    } else {
        message = "No new questions were added";
    }

    // Add cleanup info to message if duplicates were removed
    if (cleanupResult.removed > 0) {
        message += ` (${cleanupResult.removed} existing duplicates cleaned up)`;
    }

    return NextResponse.json({
        success: true,
        message,
        questionsGenerated: result.saved,
        duplicatesSkipped: result.skipped,
        existingDuplicatesCleaned: cleanupResult.removed,
    });
}

async function processGenerationInBackground(userId: string, jobId: string) {
    try {
        // Update status to processing
        await updateGenerationJobStatus(jobId, "processing");

        // Perform the generation
        const userProfile = await getUserProfile(userId);
        if (!userProfile) {
            await updateGenerationJobStatus(
                jobId,
                "failed",
                undefined,
                "User profile not found"
            );
            return;
        }

        // Generate questions using Gemini
        const questions = await generatePersonalizedQuestions(userProfile, 20);

        // Clean up existing duplicates
        const cleanupResult = await cleanupDuplicateQuestions(userId);

        // Save questions to database
        const result = await saveQuestionsToDatabase(userId, questions, "skip");

        let message = "";
        if (result.saved > 0 && result.skipped > 0) {
            message = `${result.saved} new questions added, ${result.skipped} duplicates skipped`;
        } else if (result.saved > 0) {
            message = `${result.saved} new questions added to your collection`;
        } else if (result.skipped > 0) {
            message = `All ${result.skipped} questions were duplicates and skipped`;
        } else {
            message = "No new questions were added";
        }

        if (cleanupResult.removed > 0) {
            message += ` (${cleanupResult.removed} existing duplicates cleaned up)`;
        }

        // Update job as completed
        await updateGenerationJobStatus(jobId, "completed", {
            questionsGenerated: result.saved,
            duplicatesSkipped: result.skipped,
            existingDuplicatesCleaned: cleanupResult.removed,
            message,
        });
    } catch (error) {
        console.error("Error in background generation:", error);
        await updateGenerationJobStatus(
            jobId,
            "failed",
            undefined,
            error instanceof Error ? error.message : "Unknown error"
        );
    }
}
