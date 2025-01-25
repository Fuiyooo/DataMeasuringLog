import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { cookies } from "next/headers"; // Import cookies API
import prisma from "@/app/lib/prisma";

// GET Api for fetching tools
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
            case "get-tools":
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

// POST method for fetching tools
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
        const { action, toolData } = await req.json(); // Extract action and data
        const toolID = parseInt(toolData.id, 10);
        switch (action) {
            case "add-tool":
                try {
                    const tool = await prisma.tools.create({
                        data: {
                            name: toolData.name,
                        },
                    });

                    return new NextResponse(JSON.stringify({ success: "Successfuly Add Tool" }), { status: 200 });
                } catch (error) {
                    return new NextResponse(
                        JSON.stringify({ error: "Failed to add tool" }),
                        { status: 500 }
                    );
                }

            case "edit-tool":
                try {
                    const tool = await prisma.tools.update({
                        where: {
                            id: toolID,
                        },
                        data: {
                            name: toolData.name,
                        },
                    });
                    return new NextResponse(
                        JSON.stringify({ success: "Successfully Update Tool" }),
                        { status: 200 }
                    );
                } catch (error) {
                    if (error.code === 'P2002' || error.code === 'P2003' || error.code === 'P2020') {
                        return new NextResponse(
                            JSON.stringify({ error: "Cannot modify tool - it is being used in measurements" }),
                            { status: 409 }
                        );
                    }

                    return new NextResponse(
                        JSON.stringify({ error: "Failed to edit tool" }),
                        { status: 500 }
                    );
                }

            case "delete-tool":
                try {
                    const tool = await prisma.tools.delete({
                        where: {
                            id: toolID,
                        },
                    });
                    return new NextResponse(
                        JSON.stringify({ success: "Successfuly Delete Tool" }, { status: 200 }),
                        { status: 200 }
                    );
                } catch (error) {
                    console.log(error.code)
                    if (error.code === 'P2002' || error.code === 'P2003' || error.code === 'P2020') {
                        return new NextResponse(
                            JSON.stringify({ error: "Cannot delete tool - it is being used in measurements" }),
                            { status: 409 }
                        );
                    }

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

    } catch (error) {
        console.error("Error:", error);
        return new NextResponse(
            JSON.stringify({ error: "Internal server error" }),
            { status: 500 }
        );
    }
}
