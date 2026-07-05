import { createClient } from "./supabase/server";

/**
 * Fixed-window rate limiter backed by the `check_rate_limit` Postgres
 * function (see database_setup.sql). Fails open if the function is
 * missing or errors, so a broken limiter never takes down the API.
 */
export async function checkRateLimit(
    userId: string,
    route: string,
    limit: number,
    windowSeconds: number
): Promise<boolean> {
    try {
        const supabase = await createClient();
        const { data, error } = await supabase.rpc("check_rate_limit", {
            p_user_id: userId,
            p_route: route,
            p_limit: limit,
            p_window_seconds: windowSeconds,
        });

        if (error) {
            console.error("Rate limit check failed:", error);
            return true;
        }

        return data === true;
    } catch (error) {
        console.error("Rate limit check failed:", error);
        return true;
    }
}
