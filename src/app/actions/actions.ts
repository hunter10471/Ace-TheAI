'use server';
import { createClient } from "@/lib/supabase/server";
import { SignupValidationSchema } from "@/lib/validation-schemas";
import { hashPassword } from "@/lib/utils";
import * as Yup from "yup";
import { UserFormData } from "@/lib/types";
import { signIn } from "@/auth";

export const signup = async (formData: UserFormData) => {
    try {
        const {name, email, password} = await SignupValidationSchema.validate(formData);
        const supabase = await createClient();
        const hashedPass = await hashPassword(password as string);
        const {data, error} = await supabase.from("users").insert({name, email, password: hashedPass});
        if(error){
            throw new Error(error.details);
        }
        return data;
    } catch (error: any) {
        if(error instanceof Yup.ValidationError){
            throw new Error(error.message);
        }
        if(error.message.includes("Key (email)")){
            throw new Error("User with this email already exists!");
        }
        throw new Error("There was an error signing up!");
    }
}

export async function authenticate(email: string, password: string) {
    try {
        const response = await signIn("credentials", {
            email,
            password,
            redirect: false,
        })
        return response;
    } catch (error: any) {
        const splitError = error.message.split(".");
        if (splitError[0] === "invalid_credentials") {
            return {error: "Incorrect username or password"}
        } else {
            throw Error(splitError[0])
        }
    }
}
