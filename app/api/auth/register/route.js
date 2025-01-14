import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
    const { email, password, name } = await req.json();


    try {
        const user = await prisma.user.create({
            data: {
                email,
                password: password,
                name
            }
        });
        return new Response(JSON.stringify(user), { status: 201 });
    } catch (error) {
        return new Response(JSON.stringify({ error: "User already exists" }), { status: 500 });
    }
}