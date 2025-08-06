"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { signIn, signOut, auth } from "@/auth";
import { createClient } from "@/lib/supabase/server";
import { hashPassword, verifyPassword } from "@/lib/auth-server";

const FormSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

const SignupSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
});

const ChangePasswordSchema = z
    .object({
        currentPassword: z.string().min(1, "Current password is required"),
        newPassword: z
            .string()
            .min(8, "New password must be at least 8 characters"),
        confirmPassword: z.string().min(1, "Confirm password is required"),
    })
    .refine(data => data.newPassword === data.confirmPassword, {
        message: "New passwords don't match",
        path: ["confirmPassword"],
    });

const UpdateProfileSchema = z.object({
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    dateOfBirth: z.string().optional(),
    phoneNumber: z.string().optional(),
    country: z.string().optional(),
    jobTitle: z.string().optional(),
    yearsOfExperience: z.string().optional(),
    keySkills: z.array(z.string()).optional(),
    professionalGoal: z.string().optional(),
});

export async function authenticate(
    prevState: string | undefined,
    formData: FormData
) {
    const validatedFields = FormSchema.safeParse({
        email: formData.get("email"),
        password: formData.get("password"),
    });

    if (!validatedFields.success) {
        return "Missing Fields.";
    }

    const { email, password } = validatedFields.data;

    try {
        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        console.log("SignIn result:", result);

        if (result?.error) {
            console.error("SignIn error:", result.error);
            return "Invalid credentials. Please check your email and password.";
        }

        if (result?.ok || !result?.error) {
            revalidatePath("/");
            return "success";
        }

        return "Login failed. Please try again.";
    } catch (error) {
        console.error("Authentication error:", error);
        return "Something went wrong. Please try again.";
    }
}

export async function signup(formData: FormData) {
    const validatedFields = SignupSchema.safeParse({
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
    });

    if (!validatedFields.success) {
        return "Missing Fields.";
    }

    const { name, email, password } = validatedFields.data;

    try {
        const supabase = await createClient();

        const hashedPassword = await hashPassword(password);

        const { error } = await supabase.from("users").insert([
            {
                name,
                email,
                password: hashedPassword,
                provider: "credentials",
            },
        ]);

        if (error) {
            if (error.code === "23505") {
                return "User already exists.";
            }
            return "Something went wrong.";
        }

        revalidatePath("/");
        return "success";
    } catch (error) {
        return "Something went wrong.";
    }
}

export async function changePassword(formData: FormData) {
    const validatedFields = ChangePasswordSchema.safeParse({
        currentPassword: formData.get("currentPassword"),
        newPassword: formData.get("newPassword"),
        confirmPassword: formData.get("confirmPassword"),
    });

    if (!validatedFields.success) {
        return "Invalid input. Please check your passwords.";
    }

    const { currentPassword, newPassword } = validatedFields.data;

    try {
        const session = await auth();
        if (!session?.user?.email) {
            return "You must be logged in to change your password.";
        }

        const supabase = await createClient();

        // Get current user data
        const { data: user, error: fetchError } = await supabase
            .from("users")
            .select("password, provider")
            .eq("email", session.user.email)
            .single();

        if (fetchError || !user) {
            return "User not found.";
        }

        // Check if user is using Google OAuth (no password)
        if (user.provider === "google") {
            return "Google users cannot change password through this form. Please use your Google account settings.";
        }

        // Verify current password
        if (!user.password) {
            return "Current password verification failed.";
        }

        const isCurrentPasswordValid = await verifyPassword(
            currentPassword,
            user.password
        );
        if (!isCurrentPasswordValid) {
            return "Current password is incorrect.";
        }

        // Hash new password
        const hashedNewPassword = await hashPassword(newPassword);

        // Update password in database
        const { error: updateError } = await supabase
            .from("users")
            .update({ password: hashedNewPassword })
            .eq("email", session.user.email);

        if (updateError) {
            console.error("Password update error:", updateError);
            return "Failed to update password. Please try again.";
        }

        revalidatePath("/dashboard/settings");
        return "success";
    } catch (error) {
        console.error("Change password error:", error);
        return "Something went wrong. Please try again.";
    }
}

export async function updateProfile(formData: FormData) {
    const validatedFields = UpdateProfileSchema.safeParse({
        fullName: formData.get("fullName"),
        dateOfBirth: formData.get("dateOfBirth"),
        phoneNumber: formData.get("phoneNumber"),
        country: formData.get("country"),
        jobTitle: formData.get("jobTitle"),
        yearsOfExperience: formData.get("yearsOfExperience"),
        keySkills: formData.get("keySkills")
            ? JSON.parse(formData.get("keySkills") as string)
            : [],
        professionalGoal: formData.get("professionalGoal"),
    });

    if (!validatedFields.success) {
        return "Invalid input. Please check your profile data.";
    }

    const profileData = validatedFields.data;

    try {
        const session = await auth();
        if (!session?.user?.email) {
            return "You must be logged in to update your profile.";
        }

        const supabase = await createClient();

        // Update profile in database
        const { error: updateError } = await supabase
            .from("users")
            .update({
                name: profileData.fullName,
                date_of_birth: profileData.dateOfBirth || null,
                phone_number: profileData.phoneNumber || null,
                country: profileData.country || null,
                job_title: profileData.jobTitle || null,
                years_of_experience: profileData.yearsOfExperience || null,
                key_skills: profileData.keySkills || [],
                professional_goal: profileData.professionalGoal || null,
            })
            .eq("email", session.user.email);

        if (updateError) {
            console.error("Profile update error:", updateError);
            return "Failed to update profile. Please try again.";
        }

        revalidatePath("/dashboard/profile");
        return "success";
    } catch (error) {
        console.error("Update profile error:", error);
        return "Something went wrong. Please try again.";
    }
}

export async function logout() {
    try {
        await signOut();
    } catch (error) {
        return "Something went wrong.";
    }

    revalidatePath("/");
    redirect("/");
}

export async function getUser() {
    try {
        const session = await auth();
        return session?.user || null;
    } catch (error) {
        return null;
    }
}

export async function getUserProfile() {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return null;
        }

        const supabase = await createClient();

        const { data: user, error } = await supabase
            .from("users")
            .select("*")
            .eq("email", session.user.email)
            .single();

        if (error) {
            console.error("Error fetching user profile:", error);
            return null;
        }

        return user;
    } catch (error) {
        console.error("Error in getUserProfile:", error);
        return null;
    }
}

export async function getGoogleAuthUrl() {
    try {
        const result = await signIn("google", {
            redirect: false,
        });
        return result?.url || null;
    } catch (error) {
        console.error("Error getting Google auth URL:", error);
        return null;
    }
}
