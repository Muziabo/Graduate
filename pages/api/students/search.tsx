import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma"; // Make sure your Prisma client is properly set up
import redis from "@/lib/redis"; // Redis client

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { query, institutionId, limit, offset } = req.query;

    if (!query || typeof query !== "string" || query.trim().length < 2) {
        return res.status(400).json({ status: "error", message: "Search query must be at least 2 characters long." });
    }

    // Create a unique cache key
    const cacheKey = `search:students:${query.toLowerCase()}:${institutionId || "all"}:${limit || 10}:${offset || 0}`;

    try {
        // Step 1: Check cache
        const cachedResults = await redis.get(cacheKey);
        if (cachedResults) {
            // If found in cache, return cached data
            return res.status(200).json({
                status: "success",
                data: JSON.parse(cachedResults),
                cached: true, // Indicate the results are cached
            });
        }

        // Step 2: Build filters for Prisma query
        const filters: any = {
            OR: [
                { name: { startsWith: query, mode: "insensitive" } },
                { name: { contains: query, mode: "insensitive" } },
                { email: { contains: query, mode: "insensitive" } },
            ],
        };

        if (institutionId) {
            filters.AND = [
                ...(filters.AND || []),
                { institutionId: { equals: Number(institutionId) } },
            ];
        }

        // Step 3: Query the database via Prisma
        const students = await prisma.student.findMany({
            where: filters,
            orderBy: { name: "asc" },
            take: parseInt(limit as string) || 10,
            skip: parseInt(offset as string) || 0,
        });

        if (students.length === 0) {
            return res.status(404).json({ status: "error", message: "No students found for the given search term!" });
        }

        // Step 4: Store the results in Redis Cache
        await redis.set(cacheKey, JSON.stringify(students), {
            EX: 3600, // Cache for 1 hour (3600 seconds)
        });

        // Return data from the database
        return res.status(200).json({
            status: "success",
            data: students,
            cached: false, // Indicate this is from the database
        });
    } catch (error) {
        console.error("Error occurred:", error);
        return res.status(500).json({ status: "error", message: "Something went wrong." });
    }
}
