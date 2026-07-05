import type { NextAuthConfig } from "next-auth";
import { NextResponse } from "next/server";

/**
 * Edge-safe NextAuth config shared between the middleware and the full
 * server config in `src/auth.ts`. Must not import bcrypt/Supabase or any
 * other Node-only dependency.
 */
export const authConfig = {
    secret: process.env.NEXTAUTH_SECRET,
    basePath: "/api/auth",
    pages: {
        signIn: "/",
        error: "/",
    },
    session: {
        strategy: "jwt",
    },
    useSecureCookies: process.env.NODE_ENV === "production",
    trustHost: true,
    providers: [],
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            if (isLoggedIn) return true;

            if (nextUrl.pathname.startsWith("/api")) {
                return NextResponse.json(
                    { success: false, error: "Unauthorized" },
                    { status: 401 }
                );
            }

            // Redirects to the sign-in page defined above
            return false;
        },
    },
} satisfies NextAuthConfig;
