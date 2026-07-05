import NextAuth from "next-auth";
import { verifyPassword } from "./lib/auth-server";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { createClient } from "@/lib/supabase/server";
import { authConfig } from "./auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code",
                },
            },
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
    callbacks: {
        ...authConfig.callbacks,
        async signIn({ user, account, profile }) {
            if (account?.provider === "google") {
                try {
                    const supabase = await createClient();

                    // First check if user exists by email
                    const { data: existingUser, error: selectError } =
                        await supabase
                            .from("users")
                            .select("*")
                            .eq("email", user.email)
                            .single();

                    if (selectError && selectError.code !== "PGRST116") {
                        console.error(
                            "Error checking existing user:",
                            selectError
                        );
                        return false;
                    }

                    if (!existingUser) {
                        const { error: insertError } = await supabase
                            .from("users")
                            .insert([
                                {
                                    id: user.id,
                                    name: user.name || "User",
                                    email: user.email,
                                    password: null,
                                    provider: "google",
                                    provider_id: profile?.sub,
                                    image: user.image ?? null,
                                },
                            ]);

                        if (insertError) {
                            console.error(
                                "Error creating Google user:",
                                insertError
                            );
                            // A session without a matching users row breaks
                            // every downstream query, so fail the sign-in.
                            return false;
                        }
                    } else {
                        // Keep the JWT id in sync with the existing DB row
                        // (the user may have registered with credentials first)
                        user.id = existingUser.id;

                        const { error: updateError } = await supabase
                            .from("users")
                            .update({
                                name: user.name || existingUser.name,
                                provider_id:
                                    profile?.sub || existingUser.provider_id,
                                image: user.image || existingUser.image,
                            })
                            .eq("id", existingUser.id);

                        if (updateError) {
                            console.error("Error updating user:", updateError);
                        }
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
    debug: false,
});
