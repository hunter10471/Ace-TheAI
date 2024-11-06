import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Container from "../components/big/Container/Container";
import Navbar from "../components/big/Navbar/Navbar";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Ace:The AI",
  description:
    "Ace is an AI-driven interview preparation coach that helps job seekers excel in their interviews. With personalized question prompts, real-time feedback, and tailored strategies, Ace empowers you to confidently navigate any interview. Master behavioral, technical, and situational questions across industries with insights from advanced AI coaching. Ready to ace your next interview? Start prepping with Ace today!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} text-text antialiased border-b-[8px] border-primary`}
      >
        <Navbar />
        <Container>{children}</Container>
      </body>
    </html>
  );
}
