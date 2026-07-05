import { NextRequest, NextResponse } from "next/server";
import {
    createInterviewFeedback,
    getCurrentUser,
    getInterviewSessionById,
} from "@/lib/interview-operations";

export async function POST(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        const body = await request.json();

        if (!body.session_id) {
            return NextResponse.json(
                { success: false, error: "session_id is required" },
                { status: 400 }
            );
        }

        const session = await getInterviewSessionById(body.session_id);
        if (!session || session.user_id !== user.id) {
            return NextResponse.json(
                { success: false, error: "Session not found" },
                { status: 404 }
            );
        }

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
