import { NextRequest, NextResponse } from "next/server";
import { getFeedbackHistory, getCurrentUser } from "@/lib/interview-operations";

export async function GET(request: NextRequest) {
    try {
        const user = await getCurrentUser();

        const { searchParams } = new URL(request.url);
        const category = searchParams.get("category");
        const rating = searchParams.get("rating");
        const startDate = searchParams.get("startDate");
        const endDate = searchParams.get("endDate");

        const filters: any = {};

        if (category) {
            filters.category = category;
        }

        if (rating) {
            filters.rating = parseInt(rating);
        }

        if (startDate) {
            filters.startDate = new Date(startDate);
        }

        if (endDate) {
            filters.endDate = new Date(endDate);
        }

        const feedbackHistory = await getFeedbackHistory(user.id, filters);

        return NextResponse.json({
            success: true,
            data: feedbackHistory,
        });
    } catch (error: any) {
        console.error("Error fetching feedback history:", error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || "Failed to fetch feedback history",
            },
            { status: 500 }
        );
    }
}
