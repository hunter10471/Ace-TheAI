import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getUserQuestions } from "@/lib/question-operations";

export async function GET(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const category = searchParams.get("category");
        const difficulty = searchParams.get("difficulty");
        const showBookmarkedOnly = searchParams.get("bookmarked") === "true";
        const sortOrder = searchParams.get("sort") || "newest";
        const search = searchParams.get("search");
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");

        const filters = {
            category: category || undefined,
            difficulty: difficulty || undefined,
            showBookmarkedOnly,
            sortOrder: sortOrder as "newest" | "oldest",
            search: search || undefined,
            page,
            limit,
        };

        const result = await getUserQuestions(session.user.id, filters);

        return NextResponse.json({
            questions: result.questions,
            total: result.total,
            page: result.page,
            totalPages: result.totalPages,
        });
    } catch (error) {
        console.error("Error fetching questions:", error);
        return NextResponse.json(
            { error: "Failed to fetch questions" },
            { status: 500 }
        );
    }
}
