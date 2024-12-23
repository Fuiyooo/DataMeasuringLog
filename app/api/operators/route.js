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
        const { action, userData } = await req.json(); // Extract action and user data
        if (isAdmin) {
            switch (action) {
                case "read":
                    // Fetch users with 'OPERATOR' role
                    const operators = await prisma.user.findMany({
                        where: {
                            role: 'OPERATOR', // Filter by the 'OPERATOR' role
                        },
                        select: {
                            id: true,
                            name: true,
                            username: true,
                        },
                    });
                    return new NextResponse(JSON.stringify(operators), { status: 200 });

                case "create":
                    // Create a new user
                    if (!userData || !userData.name || !userData.username || !userData.password) {
                        return new NextResponse(
                            JSON.stringify({ error: "Missing user data" }),
                            { status: 400 }
                        );
                    }

                    // Hash the password
                    const hashedPassword = await bcrypt.hash(userData.password, 10);

                    const newUser = await prisma.user.create({
                        data: {
                            name: userData.name,
                            username: userData.username,
                            password: hashedPassword,
                            role: "OPERATOR", // Set the role to 'OPERATOR'
                        },
                    });

                    return new NextResponse(JSON.stringify(newUser), { status: 201 });

                case "update":
                    // Update an existing user
                    if (!userData || !userData.id || !userData.name || !userData.username) {
                        return new NextResponse(
                            JSON.stringify({ error: "Missing user data or ID" }),
                            { status: 400 }
                        );
                    }

                    // Fetch the current user data to keep the old password if no new password is provided
                    const currentUser = await prisma.user.findUnique({
                        where: { id: userData.id },
                        select: { password: true },
                    });

                    let updatedPassword = currentUser.password; // Default to the old password

                    if (userData.password && userData.password !== "") {
                        // Hash the new password if provided
                        updatedPassword = await bcrypt.hash(userData.password, 10);
                    }

                    const updatedUser = await prisma.user.update({
                        where: { id: userData.id },
                        data: {
                            name: userData.name,
                            username: userData.username,
                            password: updatedPassword, // Use the updated password (either new or old)
                            role: "OPERATOR", // Ensure role is set as 'OPERATOR'
                        },
                    });

                    return new NextResponse(JSON.stringify(updatedUser), { status: 200 });

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

                    return new NextResponse(JSON.stringify({ message: "User deleted successfully" }), { status: 200 });

                default:
                    return new NextResponse(
                        JSON.stringify({ error: "Invalid action" }),
                        { status: 400 }
                    );
            }
        } else {
            switch (action) {
                case "read":
                    // Fetch users with 'OPERATOR' role
                    const operators = await prisma.user.findMany({
                        where: {
                            role: 'OPERATOR', // Filter by the 'OPERATOR' role
                        },
                        select: {
                            id: true,
                            name: true,
                            username: true,
                        },
                    });
                    return new NextResponse(JSON.stringify(operators), { status: 200 });

                case "create":
                    // Create a new user
                    if (!userData || !userData.name || !userData.username) {
                        return new NextResponse(
                            JSON.stringify({ error: "Missing user data" }),
                            { status: 400 }
                        );
                    }

                    // Hash the password
                    const hashedPassword = await bcrypt.hash(userData.password, 10);

                    const newUser = await prisma.user.create({
                        data: {
                            name: userData.name,
                            username: userData.username,
                            password: hashedPassword,
                            role: "OPERATOR", // Set the role to 'OPERATOR'
                        },
                    });

                    return new NextResponse(JSON.stringify(newUser), { status: 201 });

                // case "update":
                //     // Update an existing user
                //     if (!userData || !userData.id || !userData.name || !userData.username) {
                //         return new NextResponse(
                //             JSON.stringify({ error: "Missing user data or ID" }),
                //             { status: 400 }
                //         );
                //     }

                //     const updatedUser = await prisma.user.update({
                //         where: { id: userData.id },
                //         data: {
                //             name: userData.name,
                //             username: userData.username,
                //             role: "OPERATOR",
                //         },
                //     });

                //     return new NextResponse(JSON.stringify(updatedUser), { status: 200 });

                // case "delete":
                //     // Delete a user
                //     if (!userData || !userData.id) {
                //         return new NextResponse(
                //             JSON.stringify({ error: "Missing user ID" }),
                //             { status: 400 }
                //         );
                //     }

                //     await prisma.user.delete({
                //         where: { id: userData.id },
                //     });

                //     return new NextResponse(JSON.stringify({ message: "User deleted successfully" }), { status: 200 });

                default:
                    return new NextResponse(
                        JSON.stringify({ error: "Invalid action" }),
                        { status: 400 }
                    );
            }
        }
    } catch (error) {
        console.error("Error:", error);
        return new NextResponse(
            JSON.stringify({ error: "Internal server error" }),
            { status: 500 }
        );
    }
}
