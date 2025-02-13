import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    try {
        const { userId, gownId, type } = req.body;

        // Validation
        if (!userId || !gownId || !type) {
            return res.status(400).json({ error: "Missing required fields: userId, gownId, type" });
        }

        if (typeof userId !== "number" || typeof gownId !== "number") {
            return res.status(400).json({ error: "userId and gownId must be numbers" });
        }

        if (!["rental", "purchase"].includes(type.toLowerCase())) {
            return res.status(400).json({ error: "Invalid type. Only 'rental' or 'purchase' allowed." });
        }

        // Simulate order creation
        const order = {
            id: Math.floor(Math.random() * 10000),
            userId,
            gownId,
            type,
            status: "pending",
        };

        return res.status(201).json({
            order,
            message: "Order created successfully",
        });
    } catch (err) {
        console.error("Error in API handler:", err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}