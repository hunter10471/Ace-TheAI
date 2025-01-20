import NextAuth, { AuthError } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { verifyPassword } from "./lib/utils";
import { createClient } from "./lib/supabase/server";
import { User } from "./lib/types";
import { LoginValidationSchema } from "./lib/validation-schemas";

export class InvalidLoginError extends AuthError {
    code = 'invalid_credentials'
    constructor(message: string) {
        super(message)
        this.code = message
    }
}
export const {signOut, signIn, auth, handlers} = NextAuth({
    providers:[
        Credentials({
            credentials: {
                email: {label: "Email", type: "email"},
                password: {label: "Password", type: "password"}
            },
            authorize: async(credentials): Promise<User> => {
                try {
                let user: User | null = null;
                const {email, password} = await LoginValidationSchema.validate(credentials);
                const supabase = await createClient();
                const response = await supabase.from("users").select().eq("email", email);
                const users: User[] = response.data as User[] || [];
                if(response.error){
                    throw new InvalidLoginError("There was an error logging in!");
                }
                if(users.length === 0){   
                    throw new InvalidLoginError("User not found with this email.");
                }
                user = users[0];
                const hashedPass = await verifyPassword(password as string, user.password as string);
                if(!hashedPass){
                    throw new InvalidLoginError("invalid_credentials");
                }
                return user;    
            } catch (error: any) {
                throw new InvalidLoginError(error.message || "There was an error logging in!");
            }
            }
        })
    ]
});