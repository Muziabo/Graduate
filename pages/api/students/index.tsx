import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma"; // Ensure the Prisma client is properly set up
import { z } from "zod";

// Validate only the fields allowed by your schema
const studentSchema = z.object({
    studentId: z.string().min(1, "Student ID is required"),
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().optional(), // Optional phone field
    institutionId: z.number().min(1, "Institution ID is required"),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        try {
            // Fetch all students from the database
            const students = await prisma.student.findMany();

            return res.status(200).json({
                status: "success",
                data: students,
            });
        } catch (error) {
            console.error("Error fetching students:", error);
            return res.status(500).json({
                status: "error",
                message: "Unable to fetch students",
            });
        }
    } else if (req.method === "POST") {
        try {
            // Parse and validate the incoming request body
            const validatedData = studentSchema.parse(req.body);

            // Check if the instAdmin exists in the database
            const institutionExists = await prisma.institution.findUnique({
                where: { id: validatedData.institutionId },
            });

            if (!institutionExists) {
                return res.status(400).json({
                    status: "error",
                    message: `Institution with ID ${validatedData.institutionId} does not exist.`,
                });
            }

            // Create a new Student record
            const newStudent = await prisma.student.create({
                data: {
                    studentId: validatedData.studentId,
                    name: validatedData.name,
                    email: validatedData.email,
                    phone: validatedData.phone || null, // Optional phone field, ensure null for empty inputs
                    InstitutionId: validatedData.institutionId,
                },
            });

            // Return the created student as the response
            return res.status(201).json({
                status: "success",
                data: newStudent,
            });
        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({
                    status: "error",
                    message: "Invalid input.",
                    errors: error.errors,
                });
            }
            console.error("Unexpected error:", error);
            return res.status(500).json({
                status: "error",
                message: "An unexpected error occurred.",
            });
        }
    } else {
        res.setHeader("Allow", ["GET", "POST"]);
        return res.status(405).json({
            status: "error",
            message: `Method ${req.method} Not Allowed`,
        });
    }
}
