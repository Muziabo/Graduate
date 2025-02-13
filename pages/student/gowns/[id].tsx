import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";

export default function GownDetails() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const { id } = router.query;
    const { addToCart } = useCart();

    interface Gown {
        id: number;
        name: string;
        size: string;
        price: number;
        inStock: boolean;
        type: string;
        category: string;
        images?: string[];
        Institution: {
            name: string;
        };
        availableSizes?: string[]; // Make availableSizes optional
    }

    const [gown, setGown] = useState<Gown | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedSize, setSelectedSize] = useState("");

    useEffect(() => {
        if (id && session) {
            fetchGownDetails();
        }
    }, [id, session]);

    const fetchGownDetails = async () => {
        try {
            const response = await fetch(`/api/gowns/${id}`);
            if (!response.ok) {
                throw new Error(`Error fetching gown details: ${response.statusText}`);
            }
            const data = await response.json();
            setGown(data);
            setSelectedSize(data.size); // Set the default selected size
            setLoading(false);
        } catch (err) {
            console.error("Error fetching gown details:", err);
            setError("Failed to load gown details. Please try again.");
            setLoading(false);
        }
    };

    const handleAddToCart = () => {
        if (gown) {
            addToCart({
                id: gown.id,
                name: gown.name,
                size: selectedSize,
                price: gown.price,
                quantity: 1,
            });
            alert(`Added to cart! Size: ${selectedSize}`);
        }
    };

    if (status === "loading" || loading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-gray-50">
                <div className="text-lg font-medium text-gray-600">Loading...</div>
            </div>
        );
    }

    if (!session) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-gray-50">
                <div className="text-lg font-medium text-gray-600">Redirecting...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-gray-50">
                <div className="text-lg font-medium text-red-500">{error}</div>
            </div>
        );
    }

    return (
        <Layout>
            <div className="min-h-screen flex flex-col items-center bg-gray-50 p-6">
                {gown && (
                    <div className="max-w-4xl w-full bg-white shadow-sm rounded-lg p-6 mb-8">
                        <div className="flex flex-col md:flex-row">
                            <div className="flex-shrink-0">
                                {gown.images && gown.images.length > 0 && (
                                    <img src={gown.images[0]} alt={gown.name} className="w-96 h-96 object-cover rounded-md" />
                                )}
                            </div>
                            <div className="mt-4 md:mt-0 md:ml-4">
                                <h1 className="text-3xl font-bold text-[#01689c] mb-4">{gown.Institution.name}</h1>
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">{gown.name}</h2>
                                <p className="text-gray-600">Price: ZMK{gown.price}</p>
                                <p className="text-gray-600">{gown.inStock ? 'In Stock' : 'Out of Stock'}</p>
                                <label htmlFor="size" className="block text-gray-600 mt-4">Select Size:</label>
                                <select
                                    id="size"
                                    value={selectedSize}
                                    onChange={(e) => setSelectedSize(e.target.value)}
                                    className="mt-2 p-2 border rounded-md"
                                >
                                    {gown.availableSizes ? (
                                        gown.availableSizes.map((size) => (
                                            <option key={size} value={size}>
                                                {size}
                                            </option>
                                        ))
                                    ) : (
                                        <option value={gown.size}>{gown.size}</option>
                                    )}
                                </select>
                                <br />
                                <button
                                    onClick={handleAddToCart}
                                    className="mt-4 bg-blue-900 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                                >
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}