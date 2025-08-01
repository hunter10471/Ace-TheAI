"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { signIn, signOut } from "@/auth";

const FormSchema = z.object({
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
    await signIn("credentials", { email, password });
  } catch (error) {
    if (error instanceof Error) {
      return error.message;
    }
    return "Something went wrong.";
  }

  revalidatePath("/");
  redirect("/dashboard");
}

export async function logout() {
  try {
    await signOut();
  } catch (error) {
    if (error instanceof Error) {
      return error.message;
    }
    return "Something went wrong.";
  }

  revalidatePath("/");
  redirect("/");
}
