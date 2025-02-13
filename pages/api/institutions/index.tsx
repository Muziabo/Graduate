import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { z } from "zod";

// Zod schema for request validation
const institutionSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string(),
    type: z.string().min(1, "Type is required"), // You can customize this with enums too
    category: z.string().min(1, "Category is required"), // You can customize this with enums too
    established_at: z.string().datetime("Invalid date format"), // Expecting ISO string
    is_active: z.boolean(),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        try {
            // Validate the request body
            const validatedData = institutionSchema.parse(req.body);

            // Ensure a default value for the phone field
            const data = {
                ...validatedData,
                phone: validatedData.phone || "N/A", // Provide a default value for phone
            };

            // Create the instAdmin in the database
            const newInstitution = await prisma.institution.create({
                data,
            });

            return res.status(201).json({
                status: "success",
                data: newInstitution,
            });
        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({
                    status: "error",
                    message: "Invalid input",
                    errors: error.errors,
                });
            }
            console.error("Error creating instAdmin:", error);
            return res.status(500).json({ status: "error", message: "Something went wrong." });
        }
    } else if (req.method === "GET") {
        try {
            // Fetch all institutions from the database
            const institutions = await prisma.institution.findMany({
                orderBy: { name: "asc" }, // Optional: Sort by name
            });

            return res.status(200).json({
                status: "success",
                data: institutions,
            });
        } catch (error) {
            console.error("Error fetching institutions:", error);
            return res.status(500).json({
                status: "error",
                message: "Unable to fetch institutions",
            });
        }
    } else {
        res.setHeader("Allow", ["POST", "GET"]).status(405).json({
            status: "error",
            message: `Method ${req.method} Not Allowed`,
        });
    }
}