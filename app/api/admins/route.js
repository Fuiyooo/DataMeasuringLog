import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { cookies } from "next/headers"; // Import cookies API
import prisma from "@/app/lib/prisma";

// GET Api for fetching 'ADMIN' role
export async function GET(req) {
    // Verify user authentication
    const session = await auth();
    if (!session.id || !session.role) {
        return new NextResponse(
            JSON.stringify({ error: "Unauthorized" }),
            { status: 401 }
        );
    }

    const { searchParams } = new URL(req.url);

    // Extract the 'action' parameter
    const action = searchParams.get('action');

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

    try {
        switch (action) {
            case "read":
                // Fetch users with 'ADMIN' role
                const admins = await prisma.user.findMany({
                    where: {
                        role: 'ADMIN', // Filter by the 'ADMIN' role
                    },
                    select: {
                        id: true,
                        id_employee: true,
                        name: true,
                        username: true,
                        password: true,
                    },
                });
                return new NextResponse(JSON.stringify(admins), { status: 200 });

            default:
                return new NextResponse(
                    JSON.stringify({ error: "Invalid action" }),
                    { status: 400 }
                );
        }
    } catch (error) {
        return new NextResponse(
            JSON.stringify({ error: "Internal server error" }),
            { status: 500 }
        );
    }

}

// POST method for fetching users with 'ADMIN' role
export async function POST(req) {
    // Verify user authentication
    const session = await auth();
    if (!session.id || !session.role) {
        return new NextResponse(
            JSON.stringify({ error: "Unauthorized" }),
            { status: 401 }
        );
    }

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

    try {
        // Parse request body
        const { action, userData } = await req.json(); // Extract action and user data

        switch (action) {
            case "create":
                // Create a new user
                if (!userData || !userData.id_employee || !userData.name || !userData.username || !userData.password) {
                    return new NextResponse(
                        JSON.stringify({ error: "Missing user data" }),
                        { status: 400 }
                    );
                }

                try {
                    const newUser = await prisma.user.create({
                        data: {
                            name: userData.name,
                            username: userData.username,
                            id_employee: userData.id_employee,
                            password: userData.password,
                            role: "ADMIN", // Set the role to 'ADMIN'
                        },
                    });
                    return new NextResponse(JSON.stringify({ success: "Successfuly Add an Admin" }), { status: 201 });

                } catch (error) {
                    if (error.code === "P2002" || error.code === "P2003") {
                        return new NextResponse(
                            JSON.stringify({ error: "The username or employee ID already exists" }),
                            { status: 400 }
                        );
                    }
                }

            case "update":
                // Update an existing user
                if (!userData || !userData.id || !userData.name || !userData.username) {
                    return new NextResponse(
                        JSON.stringify({ error: "Missing user data or ID" }),
                        { status: 400 }
                    );
                }

                try {
                    // Fetch the current user data to keep the old password if no new password is provided
                    const currentUser = await prisma.user.findUnique({
                        where: { id: userData.id },
                        select: { password: true },
                    });

                    let updatedPassword = currentUser.password; // Default to the old password

                    if (userData.password && userData.password !== "") {
                        updatedPassword = userData.password;
                    }

                    const updatedUser = await prisma.user.update({
                        where: { id: userData.id },
                        data: {
                            name: userData.name,
                            username: userData.username,
                            id_employee: userData.id_employee,
                            password: updatedPassword, // Use the updated password (either new or old)
                            role: "ADMIN", // Ensure role is set as 'ADMIN'
                        },
                    });

                    return new NextResponse(JSON.stringify({ success: "Successfuly Update an Admin" }), { status: 200 });
                } catch (error) {
                    if (error.code === "P2002" || error.code === "P2003") {
                        return new NextResponse(
                            JSON.stringify({ error: "The username or employee ID already exists" }),
                            { status: 400 }
                        );
                    }
                }

            case "delete":
                // Delete a user
                if (!userData || !userData.id) {
                    return new NextResponse(
                        JSON.stringify({ error: "Missing user ID" }),
                        { status: 400 }
                    );
                }

                await prisma.user.delete({
                    where: { id: userData.id },
                });

                return new NextResponse(JSON.stringify({ success: "Successfuly Delete an Admin" }), { status: 200 });

            default:
                return new NextResponse(
                    JSON.stringify({ error: "Invalid action" }),
                    { status: 400 }
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
