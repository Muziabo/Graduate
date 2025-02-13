import prisma from "../lib/prisma";

async function main() {
    try {
        await prisma.$connect();
        console.log("Connected to the database successfully!");
    } catch (error) {
        console.error("Database connection failed:", error);
    } finally {
        await prisma.$disconnect();
    }
}

main();