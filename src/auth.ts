import NextAuth from "next-auth";
import { verifyPassword } from "./lib/auth-utils";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { createClient } from "@/lib/supabase/server";

export const { handlers, auth, signIn, signOut } = NextAuth({
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                try {
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
                        return null;
                    }

                    if (!data) {
                        return null;
                    }

                    const password = credentials.password;
                    const hashedPass = await verifyPassword(
                        password as string,
                        data.password as string
                    );

                    if (!hashedPass) {
                        return null;
                    }

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
        async signIn({ user, account, profile }) {
            if (account?.provider === "google") {
                try {
                    const supabase = await createClient();

                    const { data: existingUser } = await supabase
                        .from("users")
                        .select("*")
                        .eq("email", user.email)
                        .single();

                    if (!existingUser) {
                        const { error } = await supabase.from("users").insert([
                            {
                                id: user.id,
                                name: user.name,
                                email: user.email,
                                password: null,
                                provider: "google",
                                provider_id: profile?.sub,
                            },
                        ]);

                        if (error) {
                            console.error("Error creating Google user:", error);
                            return false;
                        }
                    } else {
                    }
                } catch (error) {
                    console.error("Error in signIn callback:", error);
                    return false;
                }
            }
            return true;
        },
        async jwt({ token, user, account }) {
            if (user) {
                token.id = user.id;
                token.provider = account?.provider;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id as string;
                session.user.provider = token.provider as string;

                // Fetch latest user data from database to ensure session has updated info
                try {
                    const supabase = await createClient();
                    const { data: userData } = await supabase
                        .from("users")
                        .select("name, email, image")
                        .eq("id", token.id)
                        .single();

                    if (userData) {
                        session.user.name = userData.name;
                        session.user.email = userData.email;
                        // Only update image if it exists (for Google users)
                        if (userData.image) {
                            session.user.image = userData.image;
                        }
                    }
                } catch (error) {
                    console.error(
                        "Error fetching user data for session:",
                        error
                    );
                }
            }
            return session;
        },
    },
    debug: process.env.NODE_ENV === "development",
});
