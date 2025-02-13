import prisma from "@/lib/prisma"; // Import the centralized Prisma instance
import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        res.setHeader("Allow", ["POST"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const { email, password, role } = req.body;

    // Basic validation
    if (!email || !password || !role) {
        return res.status(400).json({ error: "Missing required fields (email, password, role)." });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { email, password: hashedPassword, role, name: "Default Name" },
        });

        return res.status(201).json({ message: "User created successfully.", user });
    } catch (error: any) {
        console.error("Error creating user:", error);
        return res.status(500).json({ error: "Internal server error." });
    }
}