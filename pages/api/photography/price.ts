import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { name } = req.query;

  if (typeof name !== 'string') {
    return res.status(400).json({ error: 'Invalid photography name' });
  }

  try {
    const photography = await prisma.photography.findFirst({
      where: { name },
    });

    if (photography) {
      res.status(200).json({ price: photography.price });
    } else {
      res.status(404).json({ error: 'Photography not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch price' });
  } finally {
    await prisma.$disconnect();
  }
}
