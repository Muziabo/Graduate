import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        const students = await prisma.student.findMany();
        return res.status(200).json(students);
    }

    if (req.method === "POST") {
        const { name, email, phone, institutionId } = req.body;
        const newStudent = await prisma.student.create({
            data: { name, email, phone, InstitutionId: institutionId, studentId: "someUniqueId", Institution: { connect: { id: institutionId } } },
        });
        return res.status(201).json(newStudent);
    }

    res.status(405).json({ error: "Method not allowed" });
}
