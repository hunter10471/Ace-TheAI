"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import LoadingScreen from "@/components/small/LoadingScreen/LoadingScreen";

interface LoadingContextType {
    isLoading: boolean;
    loadingMessage: string;
    showLoading: (message?: string) => void;
    hideLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const useLoading = () => {
    const context = useContext(LoadingContext);
    if (context === undefined) {
        throw new Error("useLoading must be used within a LoadingProvider");
    }
    return context;
};

interface LoadingProviderProps {
    children: ReactNode;
}

export const LoadingProvider: React.FC<LoadingProviderProps> = ({
    children,
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState("Loading...");

    const showLoading = (message: string = "Loading...") => {
        setLoadingMessage(message);
        setIsLoading(true);
    };

    const hideLoading = () => {
        setIsLoading(false);
        setLoadingMessage("Loading...");
    };

    const value = {
        isLoading,
        loadingMessage,
        showLoading,
        hideLoading,
    };

    return (
        <LoadingContext.Provider value={value}>
            {children}
            {isLoading && <LoadingScreen message={loadingMessage} />}
        </LoadingContext.Provider>
    );
};
