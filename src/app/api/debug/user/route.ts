import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const supabase = await createClient();

        // Check if user exists in users table
        const { data: user, error: userError } = await supabase
            .from("users")
            .select("*")
            .eq("id", session.user.id)
            .single();

        if (userError) {
            return NextResponse.json({
                sessionUserId: session.user.id,
                sessionUserEmail: session.user.email,
                userExists: false,
                error: userError.message,
                errorCode: userError.code,
            });
        }

        return NextResponse.json({
            sessionUserId: session.user.id,
            sessionUserEmail: session.user.email,
            userExists: true,
            userData: user,
        });
    } catch (error) {
        console.error("Debug error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
