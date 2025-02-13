import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;

    // Convert id to a number and validate it
    const gownId = Number(id);
    if (isNaN(gownId)) {
        return res.status(400).json({ error: "Invalid ID" });
    }

    try {
        const session = await getSession({ req });

        if (!session || !session.user || !session.user.institutionId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const institutionId = Number(session.user.institutionId);

        if (req.method === 'GET') {
            // Fetch the gown only if it belongs to the institution
            const gown = await prisma.gown.findUnique({
                where: { 
                    id: gownId,
                    InstitutionId: institutionId
                },
                include: { images: true, Institution: true, orders: true }, // Include orders relationship
            });

            if (!gown) {
                return res.status(404).json({ error: 'Gown not found' });
            }

            return res.status(200).json(gown);
        } else {
            return res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error) {
        console.error("[ERROR] API Error:", error);
        return res.status(500).json({ error: 'Internal server error', details: error instanceof Error ? error.message : String(error) });
    }
}