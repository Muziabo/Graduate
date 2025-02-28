import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            // Fetch distinct frame color, thickness, and material
            const frameColors = await prisma.frame.findMany({
                select: {
                    color: true,
                },
                distinct: ['color'],
            });

            const frameThicknesses = await prisma.frame.findMany({
                select: {
                    thickness: true,
                },
                distinct: ['thickness'],
            });

            const frameMaterials = await prisma.frame.findMany({
                select: {
                    material: true,
                },
                distinct: ['material'],
            });

            // Respond with distinct frame properties
            res.status(200).json({
                frameColors: frameColors.map((frame) => frame.color),
                frameThicknesses: frameThicknesses.map((frame) => frame.thickness),
                frameMaterials: frameMaterials.map((frame) => frame.material),
            });
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch frame options' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
