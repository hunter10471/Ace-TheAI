import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const config = {
            hasGoogleClientId: !!process.env.GOOGLE_CLIENT_ID,
            hasGoogleClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
            hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
            hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
            nodeEnv: process.env.NODE_ENV,
            baseUrl:
                process.env.NEXTAUTH_URL || process.env.VERCEL_URL
                    ? `https://${process.env.VERCEL_URL}`
                    : "http://localhost:3000",
        };

        return NextResponse.json(config);
    } catch (error) {
        console.error("Config check error:", error);
        return NextResponse.json(
            { error: "Failed to check configuration" },
            { status: 500 }
        );
    }
}
