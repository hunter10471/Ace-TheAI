'use server';
import { createClient } from "@/lib/supabase/server";
import { SignupValidationSchema } from "@/lib/validation-schemas";
import { hashPassword } from "@/lib/utils";
import * as Yup from "yup";
import { UserFormData } from "@/lib/types";

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
    } catch (error) {
        console.log(error);
        if(error instanceof Yup.ValidationError){
            throw new Error(error.message);
        }
        throw new Error("There was an error signing up!");
    }
} 