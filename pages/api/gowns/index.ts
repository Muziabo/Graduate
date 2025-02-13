import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const session = await getSession({ req });

        if (!session || !session.user || !session.user.institutionId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const institutionId = Number(session.user.institutionId);

        if (req.method === "POST") {
            const { name, customSize, inStock, images, type, size, price, category } = req.body;

            const newGown = await prisma.gown.create({
                data: {
                    name,
                    customSize,
                    inStock,
                    images: {
                        create: images.map((image: { url: string }) => ({ url: image.url })),
                    },
                    type,
                    size,
                    price,
                    category,
                    Institution: {
                        connect: { id: institutionId }
                    }
                },
            });

            return res.status(201).json({ data: newGown });
        }

        if (req.method === "GET") {
            const gowns = await prisma.gown.findMany({
                where: { InstitutionId: institutionId },
                include: { images: true, orders: true }, // Include orders relationship
            });

            return res.status(200).json({ data: gowns });
        }

        res.setHeader("Allow", ["POST", "GET"]);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    } catch (error) {
        console.error("[ERROR] API Error:", error);
        return res.status(500).json({ error: "Internal Server Error", details: error instanceof Error ? error.message : String(error) });
    }
}