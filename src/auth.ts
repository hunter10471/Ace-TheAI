import NextAuth from "next-auth";
import { verifyPassword } from "./lib/auth-utils";
import CredentialsProvider from "next-auth/providers/credentials";
import { createClient } from "@/lib/supabase/server";

export const { handlers, auth, signIn, signOut } = NextAuth({
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    console.log("Missing credentials");
                    return null;
                }

                try {
                    // Check if environment variables are set
                    if (
                        !process.env.NEXT_PUBLIC_SUPABASE_URL ||
                        !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
                    ) {
                        console.error("Missing Supabase environment variables");
                        return null;
                    }

                    const supabase = await createClient();

                    const { data, error } = await supabase
                        .from("users")
                        .select("*")
                        .eq("email", credentials.email)
                        .single();

                    if (error) {
                        console.log("Supabase error:", error);
                        return null;
                    }

                    if (!data) {
                        console.log("User not found");
                        return null;
                    }

                    const password = credentials.password;
                    const hashedPass = await verifyPassword(
                        password as string,
                        data.password as string
                    );

                    if (!hashedPass) {
                        console.log("Password verification failed");
                        return null;
                    }

                    console.log("Authentication successful for:", data.email);
                    return {
                        id: data.id,
                        email: data.email,
                        name: data.name,
                    };
                } catch (error) {
                    console.error("Authorization error:", error);
                    return null;
                }
            },
        }),
    ],
    pages: {
        signIn: "/",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                console.log("JWT callback - user:", user);
            }
            console.log("JWT callback - token:", token);
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id as string;
                console.log("Session callback - session:", session);
            }
            return session;
        },
    },
});
