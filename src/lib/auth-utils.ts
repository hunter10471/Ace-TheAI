import { useSession } from "next-auth/react";
import { useMemo } from "react";

export const useOptimizedSession = () => {
    const { data: session, status, update } = useSession();

    const memoizedSession = useMemo(() => session, [session]);

    return {
        session: memoizedSession,
        status,
        update,
        isAuthenticated: status === "authenticated",
        isLoading: status === "loading",
        isUnauthenticated: status === "unauthenticated",
    };
};

export const useSessionUser = () => {
    const { session } = useOptimizedSession();

    return useMemo(
        () => ({
            user: session?.user,
            name: session?.user?.name,
            email: session?.user?.email,
            image: session?.user?.image,
        }),
        [session?.user]
    );
};
