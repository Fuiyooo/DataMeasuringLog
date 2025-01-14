import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const operatorPassword = 'operator123';
    const adminPassword = 'admin123';
    const devPassword = 'dev123';

    const operator = await prisma.user.upsert({
        where: { username: 'operator' },
        update: {},
        create: {
            username: 'operator',
            employee_id: 'O001',
            password: operatorPassword,
            name: 'Operator User',
            role: 'OPERATOR', // Set the role to OPERATOR
        },
    });

    const admin = await prisma.user.upsert({
        where: { username: 'admin' },
        update: {},
        create: {
            username: 'admin',
            employee_id: 'A001',
            password: adminPassword,
            name: 'Admin User',
            role: 'ADMIN', // Set the role to ADMIN
        },
    });

    const dev = await prisma.user.upsert({
        where: { username: 'dev' },
        update: {},
        create: {
            username: 'dev',
            employee_id: 'D001',
            password: devPassword,
            name: 'Developer',
            role: 'DEVELOPER', // Set the role to ADMIN
        },
    });

    console.log({ operator, admin, dev });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });