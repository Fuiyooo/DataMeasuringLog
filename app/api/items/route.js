import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { cookies } from "next/headers"; // Import cookies API
import prisma from "@/app/lib/prisma";
import { broadcast } from '../sse/route';


// GET Api for fetching items and parameters
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
            case "get-params":
                const barcodeId = searchParams.get('barcodeId');

                try {
                    // Fetch item parameter plans
                    const item_information = await prisma.measurementItem.findUnique({
                        where: {
                            id_item: barcodeId,
                        },
                        select: {
                            id: true,
                            id_item: true,
                            name: true,
                            type: true,
                            image: true,
                        },
                    });


                    // Fetch parameters
                    const parameters = await prisma.parameter.findMany({
                        where: {
                            id_item: barcodeId,
                        },
                    });


                    // Fetch tools for each parameter 
                    for (const parameter of parameters) {
                        const tool = await prisma.tools.findUnique({
                            where: {
                                id: parameter.id_tool,
                            },
                            select: {
                                name: true,
                            },
                        });
                        parameter.tool = tool.name;
                    }

                    const parameterPlan = {
                        item_information,
                        parameters,
                    };

                    return new NextResponse(JSON.stringify(parameterPlan), { status: 200 });
                }
                catch (error) {
                    console.error("Error getting parameter plan:", error);
                    return new NextResponse(
                        JSON.stringify({ error: "Failed to get parameter plan" }),
                        { status: 500 }
                    );
                }

            case "get-items":
                try {
                    const items_result = await prisma.item.findMany({
                        select: {
                            id: true,
                            id_barcode: true,
                            name: true,
                            type: true,
                            image: true,
                            id_employee: true,
                            createdAt: true,
                        }
                    });

                    const items_with_details = await Promise.all(
                        items_result.map(async (item) => {
                            item.date = item.createdAt;

                            const operator = await prisma.user.findUnique({
                                where: { id_employee: item.id_employee },
                                select: { name: true },
                            });

                            item.operator = operator.name


                            const item_detail = await prisma.measurementItem.findUnique({
                                where: {
                                    id_item: item.id_barcode,
                                },
                            });



                            item.idBarang = item_detail.id_item
                            item.namaBarang = item_detail.name
                            item.tipeBarang = item_detail.type

                            const parametersValue = await prisma.parameterValue.findMany({
                                where: {
                                    id_item: item.id,
                                },
                            });

                            let status = "OK";
                            for (const parameter of parametersValue) {
                                if (parameter.status === "NG") {
                                    status = "NG";
                                    break;
                                }
                            }

                            item.status = status

                            item.result = status


                            console.log("ITEMS: ", item)

                            return item;
                        })
                    );


                    const formatted_items = items_with_details.map((item) => ({
                        date: item.date.toISOString().split("T")[0], // Format date as YYYY-MM-DD
                        operator: item.operator, // Already fetched in previous step
                        idBarang: item.idBarang, // Mapped from item_detail
                        namaBarang: item.namaBarang, // Mapped from item_detail
                        tipeBarang: item.tipeBarang, // Mapped from item_detail
                        status: item.status, // "OK" or "NG"
                        result: item.result, // Same as status
                    }));

                    console.log("FORMATTED ITEMS: ", formatted_items)

                    return new NextResponse(
                        JSON.stringify(formatted_items),
                        { status: 200 }
                    );
                }
                catch (error) {
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

// POST method for fetching items
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
    const parameterValues = formData.get('paramValues') ? JSON.parse(formData.get('paramValues')) : {};


    const id_employee = session.id_employee;
    try {

        switch (action) {

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
                    return new NextResponse(
                        JSON.stringify({ error: "Failed to check parameter" }),
                        { status: 500 }
                    );
                }

            case "add-item":
                if (!session.user) {
                    return new NextResponse(
                        JSON.stringify({ error: "Unauthorized" }),
                        { status: 403 }
                    );
                }

                try {
                    // add item first
                    const item = await prisma.item.create({
                        data: {
                            id_barcode: data.id_item,
                            name: data.namaBarang,
                            type: data.typeBarang,
                            image: data.image,
                            id_employee: id_employee,
                        },
                    });


                    for (const parameter of parameterValues) {
                        const value = parseFloat(parameter.value);

                        await prisma.parameterValue.create({
                            data: {
                                id_item: item.id,
                                id_parameter: parameter.id,
                                value: value,
                                status: parameter.status,
                            },
                        });
                    }

                    return new NextResponse(
                        JSON.stringify({ message: "Success" }),
                        { status: 200 }
                    );
                } catch (error) {
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
        return new NextResponse(
            JSON.stringify({ error: "Internal server error" }),
            { status: 500 }
        );
    }
}
