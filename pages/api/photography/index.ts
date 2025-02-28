import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma'; // Import Prisma client

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        // Get all photography services
        try {
            const photographyServices = await prisma.photography.findMany({
                include: {
                    images: true, // Include images in the response
                },
            });
            res.status(200).json(photographyServices);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch photography services' });
        }
    } else if (req.method === 'POST') {
        // Create a new photography service
        const { name, description, price, category, institutionId } = req.body;
        try {
            const newService = await prisma.photography.create({
                data: {
                    name,
                    description,
                    price,
                    category,
                    Institution: { connect: { id: institutionId } },
                },
            });
            res.status(201).json(newService);
        } catch (error) {
            res.status(500).json({ error: 'Failed to create photography service' });
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}