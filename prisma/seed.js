const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
    const operatorPassword = await bcrypt.hash('operator123', 10);
    const adminPassword = await bcrypt.hash('admin123', 10);

    const operator = await prisma.user.upsert({
        where: { username: 'operator' },
        update: {},
        create: {
            username: 'operator',
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
            password: adminPassword,
            name: 'Admin User',
            role: 'ADMIN', // Set the role to ADMIN
        },
    });

    console.log({ operator, admin });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });