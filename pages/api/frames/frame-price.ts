import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { name } = req.query;

    if (typeof name !== 'string') {
        return res.status(400).json({ error: 'Invalid frame name' });
    }

    try {
        const frame = await prisma.frame.findFirst({
            where: { name },
        });

        if (frame) {
            res.status(200).json({ price: frame.price });
        } else {
            res.status(404).json({ error: 'Frame not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch price' });
    } finally {
        await prisma.$disconnect();
    }
}