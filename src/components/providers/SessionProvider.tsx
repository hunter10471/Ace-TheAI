"use client";

import React, { createContext, useContext, useMemo } from "react";
import { useSession } from "next-auth/react";

interface SessionContextType {
    session: any;
    status: "loading" | "authenticated" | "unauthenticated";
    isAuthenticated: boolean;
    isLoading: boolean;
    isUnauthenticated: boolean;
    user: any;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const { data: session, status } = useSession();

    const value = useMemo(
        () => ({
            session,
            status,
            isAuthenticated: status === "authenticated",
            isLoading: status === "loading",
            isUnauthenticated: status === "unauthenticated",
            user: session?.user,
        }),
        [session, status]
    );

    return (
        <SessionContext.Provider value={value}>
            {children}
        </SessionContext.Provider>
    );
};

export const useSessionContext = () => {
    const context = useContext(SessionContext);
    if (context === undefined) {
        throw new Error(
            "useSessionContext must be used within a SessionProvider"
        );
    }
    return context;
};
