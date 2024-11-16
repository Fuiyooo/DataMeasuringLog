import NextAuth, { CredentialsSignin } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { z } from "zod";


class InvalidLoginError extends CredentialsSignin {
    code = "Invalid email or password";
}
class IncorrectPasswordError extends CredentialsSignin {
    code = "Wrong password";
}

class InvalidPasswordError extends CredentialsSignin {
    code = "Password must be at least 6 characters long";
}

class InvalidEmailError extends CredentialsSignin {
    code = "Invalid Email";
}

class InternalServerError extends CredentialsSignin {
    code = "Internal server error";
}

const prisma = new PrismaClient();

const signInSchema = z.object({
    email: z.string().email({ message: "Invalid email" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters long" })
});

const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            authorize: async (credentials) => {
                try {
                    // Validate the input using Zod schema
                    const { email, password } = signInSchema.parse(credentials);

                    // Find the user in the database
                    const user = await prisma.user.findUnique({
                        where: { email }
                    });

                    // Check if the user exists and the password is correct
                    if (user) {
                        const isPasswordValid = bcrypt.compareSync(password, user.password);
                        if (isPasswordValid) {
                            return { id: user.id, email: user.email, name: user.name };
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
                        if (errorMessage === "Invalid email") {
                            throw new InvalidEmailError();
                        } else if (errorMessage === "Password must be at least 6 characters long") {
                            throw new InvalidPasswordError();
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
        jwt: true
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.id = token.id;
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

const { handlers } = NextAuth(authOptions);

export { handlers, authOptions };