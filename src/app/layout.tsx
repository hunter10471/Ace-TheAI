import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/providers/ThemeProvider";
import { LoadingProvider } from "@/components/providers/LoadingProvider";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import SessionDebug from "@/components/small/SessionDebug/SessionDebug";
import { Toaster } from "react-hot-toast";

const inter = Inter({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
    title: "Ace The AI - AI-Powered Interview Preparation",
    description:
        "Ace is an AI-driven interview preparation coach that helps job seekers excel in their interviews. With personalized question prompts, real-time feedback, and tailored strategies, Ace empowers you to confidently navigate any interview. Master behavioral, technical, and situational questions across industries with insights from advanced AI coaching. Ready to ace your next interview? Start prepping with Ace today!",
};

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    return (
        <html lang="en">
            <body
                className={`${inter.className} text-text dark:text-gray-100 dark:bg-gray-900 bg-white transition-colors duration-200 antialiased`}
            >
                <SessionProvider session={session}>
                    <ThemeProvider>
                        <LoadingProvider>
                            {children}
                            <SessionDebug />
                            <Toaster
                                position="top-right"
                                toastOptions={{
                                    duration: 4000,
                                    style: {
                                        background: "var(--toast-bg, #363636)",
                                        color: "var(--toast-color, #fff)",
                                    },
                                    success: {
                                        iconTheme: {
                                            primary: "#10b981",
                                            secondary: "#fff",
                                        },
                                    },
                                    error: {
                                        iconTheme: {
                                            primary: "#ef4444",
                                            secondary: "#fff",
                                        },
                                    },
                                }}
                            />
                        </LoadingProvider>
                    </ThemeProvider>
                </SessionProvider>
            </body>
        </html>
    );
}
