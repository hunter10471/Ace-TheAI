"use server";

import { auth } from "@/auth";
import { createClient } from "@/lib/supabase/server";

export interface UserSettings {
    preferred_language: string;
    data_sharing: {
        shareWithThirdParties: boolean;
        useForResearch: boolean;
    };
}

const DEFAULT_SETTINGS: UserSettings = {
    preferred_language: "en",
    data_sharing: {
        shareWithThirdParties: false,
        useForResearch: true,
    },
};

export async function getSettings(): Promise<UserSettings> {
    const session = await auth();
    if (!session?.user?.id) {
        return DEFAULT_SETTINGS;
    }

    const supabase = await createClient();
    const { data, error } = await supabase
        .from("users")
        .select("preferred_language, data_sharing")
        .eq("id", session.user.id)
        .single();

    if (error || !data) {
        return DEFAULT_SETTINGS;
    }

    return {
        preferred_language:
            data.preferred_language || DEFAULT_SETTINGS.preferred_language,
        data_sharing: {
            ...DEFAULT_SETTINGS.data_sharing,
            ...(data.data_sharing || {}),
        },
    };
}

export async function updateSettings(
    updates: Partial<UserSettings>
): Promise<{ success: boolean; error?: string }> {
    const session = await auth();
    if (!session?.user?.id) {
        return { success: false, error: "Not authenticated" };
    }

    const payload: Record<string, unknown> = {};
    if (updates.preferred_language !== undefined) {
        payload.preferred_language = updates.preferred_language;
    }
    if (updates.data_sharing !== undefined) {
        payload.data_sharing = updates.data_sharing;
    }

    if (Object.keys(payload).length === 0) {
        return { success: true };
    }

    const supabase = await createClient();
    const { error } = await supabase
        .from("users")
        .update(payload)
        .eq("id", session.user.id);

    if (error) {
        console.error("Error updating settings:", error);
        return { success: false, error: "Failed to save settings" };
    }

    return { success: true };
}

export async function reportIssue(
    email: string,
    message: string
): Promise<{ success: boolean; error?: string }> {
    if (!email?.trim() || !message?.trim()) {
        return { success: false, error: "Email and message are required" };
    }

    const session = await auth();
    const supabase = await createClient();

    const { error } = await supabase.from("feedback_reports").insert([
        {
            user_id: session?.user?.id ?? null,
            email: email.trim(),
            message: message.trim(),
        },
    ]);

    if (error) {
        console.error("Error saving issue report:", error);
        return { success: false, error: "Failed to submit report" };
    }

    return { success: true };
}
