import { NextApiRequest, NextApiResponse } from 'next';

interface Photography {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
}

// Mock database
let photographyServices: Photography[] = [
    {
        id: '1',
        name: 'Graduation Photography',
        description: 'Graduation photography session',
        price: 100,
        category: 'Graduation',
    },
    {
        id: '2',
        name: 'Event Photography',
        description: 'Event photography session',
        price: 150,
        category: 'Event',
    },
    // Add more photography services as needed
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        // Get all photography services
        res.status(200).json(photographyServices);
    } else if (req.method === 'POST') {
        // Create a new photography service
        const { name, description, price, category } = req.body;
        const newService: Photography = {
            id: (photographyServices.length + 1).toString(),
            name,
            description,
            price,
            category,
        };
        photographyServices.push(newService);
        res.status(201).json(newService);
    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}