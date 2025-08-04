import { NextRequest, NextResponse } from "next/server";
import {
    createInterviewSession,
    updateInterviewSession,
    getCurrentUser,
} from "@/lib/interview-operations";

export async function POST(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        const body = await request.json();

        const sessionData = {
            ...body,
            user_id: user.id,
        };

        const session = await createInterviewSession(sessionData);

        return NextResponse.json({
            success: true,
            data: session,
        });
    } catch (error: any) {
        console.error("Error creating interview session:", error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || "Failed to create interview session",
            },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { sessionId, updates } = body;

        const session = await updateInterviewSession(sessionId, updates);

        return NextResponse.json({
            success: true,
            data: session,
        });
    } catch (error: any) {
        console.error("Error updating interview session:", error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || "Failed to update interview session",
            },
            { status: 500 }
        );
    }
}
