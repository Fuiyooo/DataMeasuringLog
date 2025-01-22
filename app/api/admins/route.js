import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { cookies } from "next/headers"; // Import cookies API
import prisma from "@/app/lib/prisma";

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

        if (!session || !session.user || (session.role !== 'ADMIN' && session.role !== 'DEVELOPER')) {
            isAdmin = false;
        } else if (session.role === 'ADMIN' || session.role === 'DEVELOPER') {
            isAdmin = true;
        }
        // Parse request body
        const { action, oldPasswordInput, newPasswordInput, userData } = await req.json(); // Extract action and user data
        if (isAdmin) {
            const userID = parseInt(session.id, 10);

            switch (action) {
                case "check":
                    // check old password with stored password return true or false
                    if (!session.user || (session.role !== 'ADMIN' && session.role !== 'DEVELOPER')) {
                        return new NextResponse(
                            JSON.stringify({ error: "Unauthorized" }),
                            { status: 403 }
                        );
                    }

                    // Fetch the current user data to keep the old password if no new password is provided
                    const currentUserCheck = await prisma.user.findUnique({
                        where: { id: userID },
                        select: { password: true },
                    });

                    const isPasswordValid = oldPasswordInput === currentUserCheck.password;
                    return new NextResponse(String(isPasswordValid), { status: 200 });

                // case "update":
                //     // Update an existing user
                //     if (!session.user || (session.role !== 'ADMIN' && session.role !== 'DEVELOPER')) {
                //         return new NextResponse(
                //             JSON.stringify({ error: "Unauthorized" }),
                //             { status: 403 }
                //         );
                //     }


                //     let updatedPassword = newPasswordInput;

                //     if (session.id && session.role === 'ADMIN' || session.role === 'DEVELOPER') {
                //         // Hash the new password if provided
                //         updatedPassword = newPasswordInput;
                //     }

                //     const updatedUser = await prisma.user.update({
                //         where: { id: userID },
                //         data: {
                //             password: updatedPassword, // Use the updated password (either new or old)
                //         },
                //     });

                //     // return true or false based on the result
                //     return new NextResponse(String(!!updatedUser), { status: 200 });

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

                case "create":
                    // Create a new user
                    if (!userData || !userData.id_employee || !userData.name || !userData.username || !userData.password) {
                        return new NextResponse(
                            JSON.stringify({ error: "Missing user data" }),
                            { status: 400 }
                        );
                    }

                    const newPassword = userData.password;

                    const newUser = await prisma.user.create({
                        data: {
                            name: userData.name,
                            username: userData.username,
                            id_employee: userData.id_employee,
                            password: newPassword,
                            role: "ADMIN", // Set the role to 'ADMIN'
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
