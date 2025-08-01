"use client";

import { useEffect } from "react";
import { useThemeStore } from "@/lib/store";

export default function ThemeProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const { setDarkMode } = useThemeStore();

    useEffect(() => {
        if (typeof window !== "undefined") {
            const savedMode = localStorage.getItem("darkMode");
            const prefersDark = window.matchMedia(
                "(prefers-color-scheme: dark)"
            ).matches;
            const isDark =
                savedMode === "true" || (savedMode === null && prefersDark);
            setDarkMode(isDark);
        }
    }, [setDarkMode]);

    return <>{children}</>;
}
