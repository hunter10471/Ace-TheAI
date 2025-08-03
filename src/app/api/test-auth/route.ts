import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET(request: NextRequest) {
    try {
        const session = await auth();

        return NextResponse.json({
            authenticated: !!session?.user,
            user: session?.user
                ? {
                      id: session.user.id,
                      email: session.user.email,
                      name: session.user.name,
                      provider: session.user.provider,
                  }
                : null,
            session: session,
        });
    } catch (error) {
        console.error("Auth test error:", error);
        return NextResponse.json(
            { error: "Authentication test failed", details: error },
            { status: 500 }
        );
    }
}
