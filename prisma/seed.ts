import { faker } from '@faker-js/faker';
import { PrismaClient, UserRole, GownType, OrderType, GownCategory } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    // Step 1: Seed Institutions
    const institutions = Array.from({ length: 10 }).map(() => ({
        name: faker.company.name(),
        description: faker.company.catchPhrase(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        type: faker.helpers.arrayElement(['University', 'Academy']),
        category: faker.helpers.arrayElement(['Private', 'Public']),
        establishedAt: faker.date.past(),
        isActive: faker.datatype.boolean(),
    }));

    for (const institution of institutions) {
        await prisma.institution.upsert({
            where: { email: institution.email },
            update: {},
            create: institution,
        });
    }
    console.log('10 random institutions added or updated!');

    const institutionsList = await prisma.institution.findMany();

    // Step 2: Seed Users (Admins and Institution Admins)
    const hashedPassword = await bcrypt.hash('admin_password', 10);
    const admins = [
        {
            name: "Super Admin",
            email: "admin@example.com",
            password: hashedPassword,
            role: UserRole.ADMIN,
        },
        {
            name: "Institution Admin 1",
            email: "instadmin1@example.com",
            password: hashedPassword,
            role: UserRole.INSTITUTION_ADMIN,
            institutionId: institutionsList[0].id,
        },
        {
            name: "Institution Admin 2",
            email: "instadmin2@example.com",
            password: hashedPassword,
            role: UserRole.INSTITUTION_ADMIN,
            institutionId: institutionsList[1].id,
        },
    ];

    for (const admin of admins) {
        await prisma.user.upsert({
            where: { email: admin.email },
            update: {},
            create: admin,
        });
    }
    console.log('Admin and Institution Admins added or updated!');

    // Step 3: Seed Students for Institutions
    const students = institutionsList.flatMap((institution) =>
        Array.from({ length: 5 }).map(() => ({
            studentId: faker.string.uuid(),
            name: faker.person.fullName(),
            email: faker.internet.email(),
            phone: faker.phone.number(),
            Institution: {
                connect: { id: institution.id }
            }
        }))
    );

    for (const student of students) {
        await prisma.student.upsert({
            where: { email: student.email },
            update: {},
            create: student,
        });
    }
    console.log('Random students added or updated for each institution!');

    const studentsList = await prisma.student.findMany();

    // Step 4: Seed Gowns for Institutions
    const gownCategories: GownCategory[] = [GownCategory.UNDERGRADUATE, GownCategory.POSTGRADUATE, GownCategory.DOCTORAL, GownCategory.CUSTOM];
    const gowns = institutionsList.flatMap((institution) =>
        Array.from({ length: 5 }).map(() => ({
            name: faker.commerce.productName(),
            size: faker.helpers.arrayElement(['S', 'M', 'L', 'XL']),
            price: parseFloat(faker.commerce.price()),
            category: faker.helpers.arrayElement(gownCategories),
            customSize: faker.helpers.arrayElement(['S', 'M', 'L', 'XL']),
            inStock: faker.datatype.boolean(),
            images: {
                create: [{ url: faker.image.url() }],
            },
            type: faker.helpers.arrayElement([GownType.PHD, GownType.MASTERS, GownType.BACHELORS, GownType.DIPLOMA]),
            InstitutionId: institution.id,
            department: faker.helpers.arrayElement(['School of Sciences', 'School of Engineering & Technology', 'School of Education','School of Medicine & Health Sciences','School of Business & Economics', 'School of Arts & Humanities']),
            availableSizes: [
                { size: 'S', stock: faker.number.int({ min: 0, max: 20 }) },
                { size: 'M', stock: faker.number.int({ min: 0, max: 20 }) },
                { size: 'L', stock: faker.number.int({ min: 0, max: 20 }) },
                { size: 'XL', stock: faker.number.int({ min: 0, max: 20 }) },
            ],
        }))
    );

    for (const gown of gowns) {
        await prisma.gown.create({
            data: gown,
        });
    }
    console.log('Random gowns added for each institution!');

    const gownsList = await prisma.gown.findMany();

    // Step 5: Seed Orders for Gowns
    const orders = gownsList.flatMap((gown) =>
        Array.from({ length: 2 }).map(() => ({
            studentId: faker.helpers.arrayElement(studentsList).id,
            gownId: gown.id,
            status: faker.helpers.arrayElement(['PENDING', 'COMPLETED']),
            type: faker.helpers.arrayElement([OrderType.BUY, OrderType.HIRE]),
        }))
    );

    for (const order of orders) {
        await prisma.order.create({
            data: order,
        });
    }
    console.log('Random orders added for each gown!');

    // Step 6: Seed Photography Services
    const photographyServices = institutionsList.flatMap((institution) =>
        Array.from({ length: 10 }).map(() => ({
            name: faker.commerce.productName(),
            description: faker.commerce.productDescription(),
            price: parseFloat(faker.commerce.price()),
            category: faker.helpers.arrayElement(['PORTRAIT', 'GROUP', 'EVENT', 'CANDID']),
            images: {
                create: [{ url: faker.image.url() }],
            },
            Institution: {
                connect: { id: institution.id }
            }
        }))
    );

    for (const service of photographyServices) {
        await prisma.photography.create({
            data: service,
        });
    }
    console.log('Random photography services added!');

    const photographyServicesList = await prisma.photography.findMany();

    // Step 7: Seed Frames for Photography
    if (photographyServicesList.length > 0) {
        const frames = institutionsList.flatMap((institution) =>
            Array.from({ length: 5 }).map(() => ({
                name: faker.commerce.productName(),
                price: parseFloat(faker.commerce.price()),
                color: faker.color.human(),
                thickness: faker.helpers.arrayElement(['2mm', '3mm', '4mm']),
                material: faker.helpers.arrayElement(['Wood', 'Metal', 'Plastic']),
                mountColor: faker.helpers.arrayElement(['Burgundy', 'Green', 'Cream', 'Red', 'Black', 'Brown']),
                photographyId: faker.helpers.arrayElement(photographyServicesList).id,
                images: {
                    create: [{ url: faker.image.url() }],
                },
            }))
        );

        for (const frame of frames) {
            await prisma.frame.create({
                data: frame,
            });
        }
        console.log('Random frames added for each photography service!');
    } else {
        console.log('No photography services found, skipping frame seeding.');
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });