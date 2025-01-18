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

        let isValid = false;

        if (!session || !session.user || (session.role !== 'ADMIN' && session.role !== 'DEVELOPER' && session.role !== 'OPERATOR')) {
            isValid = false;
        } else if (session.role === 'ADMIN' || session.role === 'DEVELOPER' || session.role === 'OPERATOR') {
            isValid = true;
        }

        if (isValid) {
            const { action, data } = await req.json(); // Extract action and data

            const id_employee = parseInt(session.id_employee, 10);

            switch (action) {
                case "get-item":
                    try {
                        const parameters = await prisma.parameter.findMany({
                            include: {
                                measurementItem: true,
                            },
                        });

                        return new NextResponse(
                            JSON.stringify(parameters),
                            { status: 200 }
                        );
                    }
                    catch (error) {
                        console.error("Error getting parameters:", error);
                        return new NextResponse(
                            JSON.stringify({ error: "Failed to get parameters" }),
                            { status: 500 }
                        );
                    }

                case "check-item":
                    try {
                        const id_item = data.barcodeId;

                        const item = await prisma.measurementItem.findUnique({
                            where: { id_item: id_item },
                        });

                        if (item) {
                            return new NextResponse(
                                JSON.stringify({ message: "Item Parameters already exists" }),
                                { status: 200 }
                            );
                        }

                        return new NextResponse(
                            JSON.stringify({ message: "Item Parameters does not exists" }),
                            { status: 200 }
                        );
                    } catch (error) {
                        console.error("Error checking parameter:", error);
                        return new NextResponse(
                            JSON.stringify({ error: "Failed to check parameter" }),
                            { status: 500 }
                        );
                    }

                case "add-item":
                    if (!session.user || (session.role !== 'ADMIN' && session.role !== 'DEVELOPER')) {
                        return new NextResponse(
                            JSON.stringify({ error: "Unauthorized" }),
                            { status: 403 }
                        );
                    }

                    try {
                        // check if theres already an item with the same id
                        const id_item = data.barcodeId

                        const item = await prisma.measurementItem.findUnique({
                            where: { id_item: id_item },
                        });

                        if (item) {
                            return new NextResponse("Item Parameters already exists", { status: 400 });
                        }

                        // add measurementItem first
                        const measurementItem = await prisma.measurementItem.create({
                            data: {
                                id_item: id_item,
                                name: data.namaBarang,
                                type: data.typeBarang,
                                image: data.imageUrl,
                            },
                        });

                        // then add parameters

                        const parameters = data.parameters;


                        for (const parameter of parameters) {
                            const minValue = parseFloat(parameter.minValue);
                            const maxValue = parseFloat(parameter.maxValue);
                            await prisma.parameter.create({
                                data: {
                                    id_item: measurementItem.id_item,
                                    id_tool: parameter.id_tool,
                                    unit: parameter.unit,
                                    minValue: minValue,
                                    maxValue: maxValue,
                                },
                            });
                        }

                        return new NextResponse(
                            JSON.stringify({ message: "Success" }),
                            { status: 200 }
                        );
                    } catch (error) {
                        console.error("Error adding parameter:", error);
                        return new NextResponse(JSON.stringify({ error: "Failed to add parameter" }, { status: 500 }));
                    }

                case "update-item":
                    try {
                        const id_item = data.barcodeId;

                        // Check if the measurement item exists
                        const item = await prisma.measurementItem.findUnique({
                            where: { id_item: id_item },
                        });

                        if (!item) {
                            return new NextResponse("Item Parameters does not exist", { status: 400 });
                        }

                        // Step 1: Delete existing parameters for this id_item
                        await prisma.parameter.deleteMany({
                            where: { id_item: id_item },
                        });

                        // Step 2: Add updated parameters
                        const parameters = data.parameters;

                        for (const parameter of parameters) {
                            const minValue = parseFloat(parameter.minValue);
                            const maxValue = parseFloat(parameter.maxValue);
                            await prisma.parameter.create({
                                data: {
                                    id_item: id_item,
                                    id_tool: parameter.id_tool,
                                    unit: parameter.unit,
                                    minValue: minValue,
                                    maxValue: maxValue,
                                },
                            });
                        }

                        // Step 3: Update measurementItem details
                        await prisma.measurementItem.update({
                            where: { id_item: id_item },
                            data: {
                                name: data.namaBarang,
                                type: data.typeBarang,
                                image: data.imageUrl,
                            },
                        });

                        return new NextResponse(
                            JSON.stringify({ message: "Success" }),
                            { status: 200 }
                        );
                    } catch (error) {
                        console.error("Error updating parameter:", error);
                        return new NextResponse(
                            JSON.stringify({ error: "Failed to update parameter" }),
                            { status: 500 }
                        );
                    }


                case "delete-item":
                    try {
                        const id_item = data.barcodeId;

                        const item = await prisma.measurementItem.findUnique({
                            where: { id_item: id_item },
                        });

                        if (!item) {
                            return new NextResponse("Item Parameters does not exists", { status: 400 });
                        }

                        await prisma.measurementItem.delete({
                            where: { id_item: id_item },
                        });

                        return new NextResponse(
                            JSON.stringify({ message: "Success" }),
                            { status: 200 }
                        );

                    } catch (error) {
                        console.error("Error deleting parameter:", error);
                        return new NextResponse(
                            JSON.stringify({ error: "Failed to delete parameter" }),
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
