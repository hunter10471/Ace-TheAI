import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/providers/ThemeProvider";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";

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
                    <ThemeProvider>{children}</ThemeProvider>
                </SessionProvider>
            </body>
        </html>
    );
}
