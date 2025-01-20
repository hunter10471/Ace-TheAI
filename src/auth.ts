import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { verifyPassword } from "./lib/utils";
import { createClient } from "./lib/supabase/server";
import { User } from "./lib/types";
import { LoginValidationSchema } from "./lib/validation-schemas";

export const {signOut, signIn, auth, handlers} = NextAuth({
    providers:[
        Credentials({
            credentials: {
                email: {label: "Email", type: "email"},
                password: {label: "Password", type: "password"}
            },
            authorize: async(credentials) => {
                try {
                let user: User | null = null;
                const {email, password} = await LoginValidationSchema.validate(credentials);
                const supabase = await createClient();
                const response = await supabase.from("users").select().eq("email", email)
                const users: User[] = response.data as User[] || [];
                if(response.error){
                    throw new Error(response.error.message);
                }
                if(users){
                    if(users.length === 0){   
                        return null;
                    }
                    user = users[0];
                    const hashedPass = await verifyPassword(password as string, user.password as string);
                    if(!hashedPass){
                        return null;
                    }
                }
                return user;
            } catch (error) {
                return null;
            }
            }
        })
    ]
});