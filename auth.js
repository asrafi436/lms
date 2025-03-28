import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcryptjs';
import { authConfig } from "./auth.config";

export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut,
} = NextAuth({
    ...authConfig,
    providers: [
        CredentialsProvider({
            async authorize(credentials) {
                if (!credentials) return null;

                try {
                    // Fetch the users from the API
                    const response = await fetch('http://localhost:3000/api/users');
                    const data = await response.json();

                    // Find the user by email
                    const user = data.users.find((user) => user.email === credentials.email);

                    if (user) {
                        // Compare the password
                        const isMatch = await bcrypt.compare(credentials.password, user.password);
                        
                        if (isMatch) {
                            return user; // Return the user if password matches
                        } else {
                            console.error("Password mismatch");
                            throw new Error("Invalid password");
                        }
                    } else {
                        console.error("User not found");
                        throw new Error("User not found");
                    }

                } catch (err) {
                    console.error(err);
                    throw new Error("Error during authorization");
                }
            }
        })
    ]
});
