import prisma from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    const { userId } = req.query;

    try {
        const orders = await prisma.order.findMany({
            where: { studentId: parseInt(userId as string, 10) },
            include: { Gown: true }, // Include the related gown (if the relationship exists)
        });
        return res.status(200).json(orders);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to fetch order history" });
    }
}