import { NextRequest, NextResponse } from "next/server";
import { createInterviewFeedback } from "@/lib/interview-operations";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const feedback = await createInterviewFeedback(body);

        return NextResponse.json({
            success: true,
            data: feedback,
        });
    } catch (error: any) {
        console.error("Error creating interview feedback:", error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || "Failed to create interview feedback",
            },
            { status: 500 }
        );
    }
}
