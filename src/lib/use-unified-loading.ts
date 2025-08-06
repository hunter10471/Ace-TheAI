import { useLoading } from "@/components/providers/LoadingProvider";
import { useCallback } from "react";

export const useUnifiedLoading = () => {
    const { showLoading, hideLoading, isLoading } = useLoading();

    const startLoading = useCallback(
        (message?: string) => {
            showLoading(message);
        },
        [showLoading]
    );

    const stopLoading = useCallback(() => {
        hideLoading();
    }, [hideLoading]);

    const withLoading = useCallback(
        async <T>(asyncFn: () => Promise<T>, message?: string): Promise<T> => {
            try {
                startLoading(message);
                const result = await asyncFn();
                return result;
            } finally {
                stopLoading();
            }
        },
        [startLoading, stopLoading]
    );

    return {
        isLoading,
        startLoading,
        stopLoading,
        withLoading,
    };
};
