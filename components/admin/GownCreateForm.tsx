import React, { useState } from 'react';
import { useSession } from 'next-auth/react';

const GownCreateForm = () => {
    const { data: session } = useSession();
    const [name, setName] = useState('');
    const [size, setSize] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [customSize, setCustomSize] = useState('');
    const [inStock, setInStock] = useState(true);
    const [images, setImages] = useState<string[]>([]);
    const [type, setType] = useState('Hire');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        try {
            const response = await fetch('/api/gowns', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    size,
                    price: parseFloat(price),
                    category,
                    customSize,
                    inStock,
                    images,
                    type,
                    InstitutionId: session?.user.institutionId,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to create gown');
            }

            setSuccess('Gown created successfully');
            setName('');
            setSize('');
            setPrice('');
            setCategory('');
            setCustomSize('');
            setInStock(true);
            setImages([]);
            setType('Hire');
        } catch (error) {
            setError((error as Error).message);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Create Gown</h3>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {success && <p className="text-green-500 mb-4">{success}</p>}
            <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Name
                </label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                />
            </div>
            <div className="mb-4">
                <label htmlFor="size" className="block text-sm font-medium text-gray-700">
                    Size
                </label>
                <input
                    type="text"
                    id="size"
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                />
            </div>
            <div className="mb-4">
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                    Price
                </label>
                <input
                    type="number"
                    id="price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                />
            </div>
            <div className="mb-4">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                    Category
                </label>
                <input
                    type="text"
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                />
            </div>
            <div className="mb-4">
                <label htmlFor="customSize" className="block text-sm font-medium text-gray-700">
                    Custom Size
                </label>
                <input
                    type="text"
                    id="customSize"
                    value={customSize}
                    onChange={(e) => setCustomSize(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="inStock" className="block text-sm font-medium text-gray-700">
                    In Stock
                </label>
                <input
                    type="checkbox"
                    id="inStock"
                    checked={inStock}
                    onChange={(e) => setInStock(e.target.checked)}
                    className="mt-1"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="images" className="block text-sm font-medium text-gray-700">
                    Images (comma separated URLs)
                </label>
                <input
                    type="text"
                    id="images"
                    value={images.join(', ')}
                    onChange={(e) => setImages(e.target.value.split(',').map((img) => img.trim()))}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                    Type
                </label>
                <select
                    id="type"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                >
                    <option value="Hire">Hire</option>
                    <option value="Buy">Buy</option>
                </select>
            </div>
            <button
                type="submit"
                className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md shadow-sm hover:bg-blue-700"
            >
                Create Gown
            </button>
        </form>
    );
};

export default GownCreateForm;