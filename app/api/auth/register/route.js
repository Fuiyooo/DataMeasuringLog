import { PrismaClient } from "@prisma/client";
import { hashPassword } from "@/utils/password";

const prisma = new PrismaClient();

export async function POST(req) {
    const { email, password, name } = await req.json();

    const hashedPassword = hashPassword(password);

    try {
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name
            }
        });
        return new Response(JSON.stringify(user), { status: 201 });
    } catch (error) {
        return new Response(JSON.stringify({ error: "User already exists" }), { status: 500 });
    }
}