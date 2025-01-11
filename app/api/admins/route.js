import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { cookies } from "next/headers"; // Import cookies API
import prisma from "@/app/lib/prisma";
const bcrypt = require('bcrypt');

// POST method for fetching users with 'OPERATOR' role
export async function POST(req) {
    try {

        // Retrieve the CSRF token from the request headers
        const csrfTokenFromHeader = req.headers.get('csrf-token');

        // Retrieve CSRF token from cookies
        const allCookies = await cookies(); // Await cookies API
        const cookieVals = allCookies
            .getAll()
            .find((item) => item.name.includes('authjs.csrf-token'));

        // Safely extract CSRF token
        const csrfCookie = cookieVals?.value?.split("|")[0];
        const csrfTokenFromCookie = csrfCookie || null;

        // Validate CSRF token
        if (!csrfTokenFromCookie || csrfTokenFromHeader !== csrfTokenFromCookie) {
            return new NextResponse(
                JSON.stringify({ error: "Invalid CSRF token" }),
                { status: 403 }
            );
        }

        // Verify user authentication
        const session = await auth();

        let isAdmin = false;

        if (!session || !session.user || session.role !== 'ADMIN') {
            isAdmin = false;
        } else if (session.role === 'ADMIN') {
            isAdmin = true;
        }

        // Parse request body
        const { action, oldPasswordInput, newPasswordInput } = await req.json(); // Extract action and user data
        if (isAdmin) {
            switch (action) {
                case "check":
                    // check old password with stored password return true or false
                    if (!session.user || session.role != 'ADMIN') {
                        return new NextResponse(
                            JSON.stringify({ error: "Unauthorized" }),
                            { status: 403 }
                        );
                    }
                    const userId = parseInt(session.id, 10);

                    // Fetch the current user data to keep the old password if no new password is provided
                    const currentUserCheck = await prisma.user.findUnique({
                        where: { id: userId },
                        select: { password: true },
                    });

                    const isPasswordValid = await bcrypt.compare(oldPasswordInput, currentUserCheck.password);
                    return new NextResponse(String(isPasswordValid), { status: 200 });

                case "update":
                    // Update an existing user
                    if (!session.user || session.role != 'ADMIN') {
                        return new NextResponse(
                            JSON.stringify({ error: "Unauthorized" }),
                            { status: 403 }
                        );
                    }

                    const userID = parseInt(session.id, 10);

                    let updatedPassword = newPasswordInput;

                    if (session.id && session.role === 'ADMIN') {
                        // Hash the new password if provided
                        updatedPassword = await bcrypt.hash(newPasswordInput, 10);
                    }

                    const updatedUser = await prisma.user.update({
                        where: { id: userID },
                        data: {
                            password: updatedPassword, // Use the updated password (either new or old)
                        },
                    });

                    // return true or false based on the result
                    return new NextResponse(String(!!updatedUser), { status: 200 });

                default:
                    return new NextResponse(
                        JSON.stringify({ error: "Invalid action" }),
                        { status: 400 }
                    );
            }
        } else {
            return new NextResponse(
                JSON.stringify({ error: "Unauthorized" }),
                { status: 403 }
            );
        }
    } catch (error) {
        console.error("Error:", error);
        return new NextResponse(
            JSON.stringify({ error: "Internal server error" }),
            { status: 500 }
        );
    }
}
