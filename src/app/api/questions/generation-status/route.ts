import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getLatestGenerationJob } from "@/lib/question-operations";

export async function GET(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const job = await getLatestGenerationJob(session.user.id);

        if (!job) {
            return NextResponse.json({
                status: "none",
                message: "No generation jobs found",
            });
        }

        return NextResponse.json({
            status: job.status,
            jobId: job.id,
            result: job.result,
            error: job.error,
            created_at: job.created_at,
            completed_at: job.completed_at,
        });
    } catch (error) {
        console.error("Error checking generation status:", error);
        return NextResponse.json(
            { error: "Failed to check generation status" },
            { status: 500 }
        );
    }
}
