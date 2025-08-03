import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { toggleBookmark } from "@/lib/question-operations";

export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { questionId } = await request.json();

        if (!questionId) {
            return NextResponse.json(
                { error: "Question ID is required" },
                { status: 400 }
            );
        }

        const isBookmarked = await toggleBookmark(session.user.id, questionId);

        return NextResponse.json({
            success: true,
            isBookmarked,
        });
    } catch (error) {
        console.error("Error toggling bookmark:", error);
        return NextResponse.json(
            { error: "Failed to toggle bookmark" },
            { status: 500 }
        );
    }
}
