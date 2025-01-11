import NextAuth, { CredentialsSignin } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { z } from "zod";

class InvalidLoginError extends CredentialsSignin {
    code = "Invalid username or password";
}
class IncorrectPasswordError extends CredentialsSignin {
    code = "Wrong password";
}

class InternalServerError extends CredentialsSignin {
    code = "Internal server error";
}

const prisma = new PrismaClient();

const signInSchema = z.object({
    username: z.string(),
    password: z.string().min(6, { message: "Password must be at least 6 characters long" })
});

const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            authorize: async (credentials) => {
                try {
                    // Validate the input using Zod schema
                    const { username, password } = signInSchema.parse(credentials);

                    // Find the user in the database
                    const user = await prisma.user.findUnique({
                        where: { username }
                    });

                    // Check if the user exists and the password is correct
                    if (user) {
                        const isPasswordValid = await bcrypt.compare(password, user.password);
                        if (isPasswordValid) {
                            return { id: user.id, username: user.username, name: user.name, role: user.role };
                        } else {
                            throw new IncorrectPasswordError();
                        }
                    } else {
                        throw new InvalidLoginError();
                    }
                } catch (error) {
                    if (error instanceof z.ZodError) {
                        console.error("Validation error:", error.errors);
                        const errorMessage = error.errors[0].message;
                        if (errorMessage === "Password must be at least 6 characters long") {
                            throw new IncorrectPasswordError();
                        }
                    } else if (error instanceof IncorrectPasswordError) {
                        throw new IncorrectPasswordError();
                    } else if (error instanceof InvalidLoginError) {
                        throw new InvalidLoginError();
                    } else {
                        console.error("Error in authorize function:", error);
                        throw new InternalServerError();
                    }
                }

            }
        })
    ],
    session: {
        jwt: true,
        maxAge: 3 * 60 * 60, // 3 hours
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.id = token.id;
                session.role = token.role;
            }
            return session;
        }
    },
    pages: {
        signIn: '/login',  // Custom sign-in page
        error: '/login'    // Error page
    },
    database: process.env.DATABASE_URL,
    secret: process.env.NEXTAUTH_SECRET
};

export const { auth, handlers, signIn, signOut } = NextAuth(authOptions);
