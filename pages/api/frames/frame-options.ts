import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const defaultFrameImages = [
  '/images/frame.png',
  '/images/Photo-Frames.jpg',
  '/images/withCert.jpg'
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            // Fetch distinct frame color, thickness, and material
            const frameColors = await prisma.frame.findMany({
                select: {
                    color: true,
                },
                distinct: ['color'],
            });

            const frameThicknesses = await prisma.frame.findMany({
                select: {
                    thickness: true,
                },
                distinct: ['thickness'],
            });

            const frameMaterials = await prisma.frame.findMany({
                select: {
                    material: true,
                },
                distinct: ['material'],
            });

            // Fetch frames with their images
            const frames = await prisma.frame.findMany({
                include: {
                    images: true
                }
            });

            // Extract unique image URLs from frame images
            const frameImages = frames.reduce((urls: string[], frame) => {
                const frameUrls = frame.images.map(img => img.url);
                return [...urls, ...frameUrls];
            }, []);

            // Use default images if no frame images are found
            const finalFrameImages = frameImages.length > 0 ? frameImages : defaultFrameImages;

            // Respond with frame properties and images
            res.status(200).json({
                frameColors: frameColors.map((frame) => frame.color).filter(Boolean),
                frameThicknesses: frameThicknesses.map((frame) => frame.thickness).filter(Boolean),
                frameMaterials: frameMaterials.map((frame) => frame.material).filter(Boolean),
                frameImages: finalFrameImages,
                basePrice: 150, // Base price for frames
                frameCost: 50, // Additional cost for frames
            });
        } catch (error) {
            console.error('Error fetching frame options:', error);
            res.status(500).json({ error: 'Failed to fetch frame options' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
