import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient(); // Initialize Prisma Client

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Extract gown ID from query parameters

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

        if (req.method === 'GET') { // Handle GET request
            console.log(`Fetching gown with ID: ${gownId} for institution: ${institutionId}`); // Log fetching details
            
            const gown = await prisma.gown.findUnique({ // Query gown from database
                where: { 
                    id: gownId, // Match gown ID
                    InstitutionId: institutionId // Match institution ID
                },
                include: { images: true, Institution: true, orders: true }, // Include related data
            });

            if (!gown) { // Check if gown exists
                console.error(`Gown not found - ID: ${gownId}, Institution: ${institutionId}`); // Log error
                return res.status(404).json({ 
                    error: 'Gown not found', // Return not found error
                    details: `Gown ID: ${gownId} not found for institution ${institutionId}` // Provide details
                });
            }

            return res.status(200).json(gown); // Return gown data
        } else {
            return res.status(405).json({ error: 'Method not allowed' }); // Handle unsupported methods
        }

    } catch (error) { // Catch any errors
        console.error("[ERROR] API Error:", error); // Log error
        return res.status(500).json({ error: 'Internal server error', details: error instanceof Error ? error.message : String(error) }); // Return error response
    }
} // End of handler function
