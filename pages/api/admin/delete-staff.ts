import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id } = req.query;
    const userId = parseInt(id as string);

    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    // First, check if the user exists and is a staff member
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        accounts: true,
        sessions: true,
        student: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.role !== 'INSTITUTION_ADMIN') {
      return res.status(400).json({ error: 'User is not a staff member' });
    }

    // Delete related records first
    if (user.accounts.length > 0) {
      await prisma.account.deleteMany({
        where: { userId }
      });
    }

    if (user.sessions.length > 0) {
      await prisma.session.deleteMany({
        where: { userId }
      });
    }

    // If there's a student record, update it to remove the userId
    if (user.student) {
      await prisma.student.update({
        where: { id: user.student.id },
        data: { userId: null }
      });
    }

    // Finally, delete the user
    await prisma.user.delete({
      where: { id: userId }
    });

    return res.status(200).json({ message: 'Staff member deleted successfully' });
  } catch (error) {
    console.error('Error deleting staff member:', error);
    return res.status(500).json({ error: 'Failed to delete staff member' });
  }
}
