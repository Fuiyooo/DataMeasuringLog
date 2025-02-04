import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/app/lib/prisma";
import path from "path";
import fs from "fs/promises";

export const config = {
    api: {
        bodyParser: false,
    },
};

// GET Api for fetching parameters
export async function GET(req) {
    // Verify user authentication
    const session = await auth();
    if (!session || !session.id || !session.role) {
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
            case "get-parameters":
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


// POST method for fetching parameters
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
    const formData = await req.formData();
    const action = formData.get('action');
    const data = formData.get('data') ? JSON.parse(formData.get('data')) : {};
    const imageFile = formData.get('image') ? formData.get('image') : null;

    try {

        const userID = parseInt(session.id, 10);

        switch (action) {
            case "add-parameter":
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

                    if (!imageFile || !imageFile.stream) {
                        return NextResponse.json({ error: "Invalid image file" }, { status: 400 });
                    }


                    const arrayBuffer = await imageFile.arrayBuffer();
                    const buffer = Buffer.from(arrayBuffer);

                    const uploadsDir = path.join(process.cwd(), 'public/uploads/images');

                    try {
                        await fs.access(uploadsDir);
                    } catch {
                        // Directory does not exist, create it.
                        await fs.mkdir(uploadsDir, { recursive: true });
                    }

                    const fileName = data.barcodeId + '.png';

                    const absoluteFilePath = path.join(uploadsDir, fileName);

                    await fs.writeFile(absoluteFilePath, buffer);

                    const relativePath = path.join('/uploads/images', fileName);


                    // add measurementItem first
                    const measurementItem = await prisma.measurementItem.create({
                        data: {
                            id_item: id_item,
                            name: data.namaBarang,
                            type: data.typeBarang,
                            image: relativePath,
                        },
                    });

                    // then add parameters
                    const parameters = data.parameters;

                    for (const parameter of parameters) {
                        const minValue = parseFloat(parameter.minValue);
                        const maxValue = parseFloat(parameter.maxValue);
                        const id_tool = parseInt(parameter.id_tool, 10);
                        await prisma.parameter.create({
                            data: {
                                id_item: measurementItem.id_item,
                                id_tool: id_tool,
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

            case "update-parameter":
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
                                id_tool: parseInt(parameter.id_tool, 10),
                                unit: parameter.unit,
                                minValue: minValue,
                                maxValue: maxValue,
                            },
                        });
                    }

                    if (!imageFile || !imageFile.stream) {
                        return NextResponse.json({ error: "Invalid image file" }, { status: 400 });
                    }


                    const arrayBuffer = await imageFile.arrayBuffer();
                    const buffer = Buffer.from(arrayBuffer);

                    const uploadsDir = path.join(process.cwd(), 'public/uploads/images');

                    try {
                        await fs.access(uploadsDir);
                    } catch {
                        // Directory does not exist, create it.
                        await fs.mkdir(uploadsDir, { recursive: true });
                    }

                    const fileName = data.barcodeId + '.png';

                    const absoluteFilePath = path.join(uploadsDir, fileName);

                    await fs.writeFile(absoluteFilePath, buffer);

                    const relativePath = path.join('/uploads/images', fileName);

                    // Step 3: Update measurementItem details
                    await prisma.measurementItem.update({
                        where: { id_item: id_item },
                        data: {
                            name: data.namaBarang,
                            type: data.typeBarang,
                            image: relativePath,
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


            case "delete-parameter":
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

    } catch (error) {
        console.error("Error:", error);
        return new NextResponse(
            JSON.stringify({ error: "Internal server error" }),
            { status: 500 }
        );
    }


}

