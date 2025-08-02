"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { signIn, signOut, auth } from "@/auth";
import { createClient } from "@/lib/supabase/server";
import { hashPassword } from "@/lib/auth-utils";

const FormSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

const SignupSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
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

        // Check if the result is successful (either ok: true or no error)
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
