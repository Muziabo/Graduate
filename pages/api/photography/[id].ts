import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma'; // Import Prisma client

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;

    if (req.method === 'GET') {
        // Get a specific photography service by ID
        try {
            const service = await prisma.photography.findUnique({
                where: { id: Number(id) },
            });
            if (!service) {
                return res.status(404).json({ message: 'Service not found' });
            }
            res.status(200).json(service);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch photography service' });
        }
    } else if (req.method === 'PUT') {
        // Update a specific photography service by ID
        const { name, description, price, category } = req.body;
        try {
            const updatedService = await prisma.photography.update({
                where: { id: Number(id) },
                data: { name, description, price, category },
            });
            res.status(200).json(updatedService);
        } catch (error) {
            res.status(500).json({ error: 'Failed to update photography service' });
        }
    } else if (req.method === 'DELETE') {
        // Delete a specific photography service by ID
        try {
            await prisma.photography.delete({
                where: { id: Number(id) },
            });
            res.status(204).end();
        } catch (error) {
            res.status(500).json({ error: 'Failed to delete photography service' });
        }
    } else {
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}