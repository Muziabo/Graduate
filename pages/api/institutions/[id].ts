import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma"; // Ensure this points to your Prisma instance

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { ids } = req.query;  // Extract the 'ids' query parameter

    // Validate if 'ids' is present
    if (!ids) {
        return res.status(400).json({
            status: "error",
            message: "IDs are required.",
        });
    }

    // Ensure 'ids' is an array
    const idsArray = Array.isArray(ids) ? ids : [ids];

    // Convert ids to numbers (assuming they are in the query as strings)
    const idsList = idsArray.map((id) => parseInt(id));

    try {
        // Fetch institutions where id is in the idsList
        const institutions = await prisma.institution.findMany({
            where: {
                id: { in: idsList },  // Prisma's 'in' operator
            },
        });

        if (!institutions.length) {
            return res.status(404).json({
                status: "error",
                message: "Institutions not found.",
            });
        }

        // Return the data in the correct format
        return res.status(200).json({
            status: "success",
            data: institutions,
        });
    } catch (error) {
        console.error("Error fetching institutions:", error);
        return res.status(500).json({
            status: "error",
            message: "Something went wrong while fetching the institutions",
        });
    }
}
