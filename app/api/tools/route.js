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

        if (isAdmin) {
            const { action, data, toolData } = await req.json(); // Extract action and data

            const userID = parseInt(session.id, 10);

            switch (action) {

                case "get-tools":
                    try {
                        const tools = await prisma.tools.findMany({
                            select: {
                                id: true,
                                name: true,
                            },
                        });

                        return new NextResponse(
                            JSON.stringify(tools),
                            { status: 200 }
                        );
                    } catch (error) {
                        console.error("Error getting tools:", error);
                        return new NextResponse(
                            JSON.stringify({ error: "Failed to get tools" }),
                            { status: 500 }
                        );
                    }

                case "add-tool":
                    try {
                        const tool = await prisma.tools.create({
                            data: {
                                name: toolData.name,
                            },
                        });

                        return new NextResponse(JSON.stringify(tool), { status: 200 });
                    } catch (error) {
                        console.error("Error adding tool:", error);
                        return new NextResponse(
                            JSON.stringify({ error: "Failed to add tool" }),
                            { status: 500 }
                        );
                    }

                case "edit-tool":
                    try {
                        const tool = await prisma.tools.update({
                            where: {
                                id: toolData.id,
                            },
                            data: {
                                name: toolData.name,
                            },
                        });

                        return new NextResponse(JSON.stringify(tool), { status: 200 });
                    } catch (error) {
                        console.error("Error editing tool:", error);
                        return new NextResponse(
                            JSON.stringify({ error: "Failed to edit tool" }),
                            { status: 500 }
                        );
                    }

                case "delete-tool":
                    const toolID = parseInt(toolData.id, 10);

                    try {
                        const tool = await prisma.tools.delete({
                            where: {
                                id: toolID,
                            },
                        });
                        return new NextResponse(
                            JSON.stringify({ message: "Tool deleted" }, { status: 200 }),
                            { status: 200 }
                        );
                    } catch (error) {
                        console.error("Error deleting tool:", error);
                        return new NextResponse(
                            JSON.stringify({ error: "Failed to delete tool" }),
                            { status: 500 }
                        );
                    }



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
