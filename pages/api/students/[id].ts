import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { z } from "zod";

// Zod schema for updating a student
const studentUpdateSchema = z.object({
    name: z.string().optional(),
    email: z.string().email("Invalid email address").optional(),
    phone: z.string().optional(),
    institutionId: z.number().optional(),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;

    if (!id || isNaN(Number(id))) {
        return res.status(400).json({
            status: "error",
            message: "Invalid student ID",
        });
    }

    if (req.method === "GET") {
        try {
            // Fetch a student by ID
            const student = await prisma.student.findUnique({
                where: { id: Number(id) },
            });

            if (!student) {
                return res.status(404).json({
                    status: "error",
                    message: "Student not found",
                });
            }

            return res.status(200).json({
                status: "success",
                data: student,
            });
        } catch (error) {
            console.error("Error fetching student:", error);
            return res.status(500).json({
                status: "error",
                message: "Unable to fetch student",
            });
        }
    } else if (req.method === "PUT") {
        try {
            // Validate the incoming data for update
            const validatedData = studentUpdateSchema.parse(req.body);

            // Update the student in the database
            const updatedStudent = await prisma.student.update({
                where: { id: Number(id) },
                data: validatedData,
            });

            return res.status(200).json({
                status: "success",
                data: updatedStudent,
            });
        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({
                    status: "error",
                    message: "Invalid input",
                    errors: error.errors,
                });
            }
            console.error("Error updating student:", error);
            return res.status(500).json({
                status: "error",
                message: "Unable to update student",
            });
        }
    } else if (req.method === "DELETE") {
        try {
            // Delete the student by ID
            await prisma.student.delete({
                where: { id: Number(id) },
            });

            return res.status(204).end(); // No content
        } catch (error) {
            console.error("Error deleting student:", error);
            return res.status(500).json({
                status: "error",
                message: "Unable to delete student",
            });
        }
    } else {
        res.setHeader("Allow", ["GET", "PUT", "DELETE"]).status(405).json({
            status: "error",
            message: `Method ${req.method} Not Allowed`,
        });
    }
}