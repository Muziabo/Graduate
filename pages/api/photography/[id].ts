import { NextApiRequest, NextApiResponse } from 'next';

type Photography = {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
};

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
    const { id } = req.query;

    const service = photographyServices.find((s) => s.id === id);

    if (!service) {
        return res.status(404).json({ message: 'Service not found' });
    }

    if (req.method === 'GET') {
        // Get a specific photography service by ID
        res.status(200).json(service);
    } else if (req.method === 'PUT') {
        // Update a specific photography service by ID
        const { name, description, price, category } = req.body;
        service.name = name;
        service.description = description;
        service.price = price;
        service.category = category;
        res.status(200).json(service);
    } else if (req.method === 'DELETE') {
        // Delete a specific photography service by ID
        photographyServices = photographyServices.filter((s) => s.id !== id);
        res.status(204).end();
    } else {
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}