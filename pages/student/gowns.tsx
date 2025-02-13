import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';

interface Gown {
    id: number;
    name: string;
    size: string;
    color: string;
    price: number;
    inStock: number;
    type: string;
    images?: { url: string }[];
}

const Gowns: React.FC = () => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [gowns, setGowns] = useState<Gown[]>([]);
    const [loadingGowns, setLoadingGowns] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (session) {
            fetchGowns();
        }
    }, [session]);

    const fetchGowns = async () => {
        try {
            const response = await fetch('/api/gowns');
            if (!response.ok) {
                throw new Error(`Error fetching gowns: ${response.statusText}`);
            }
            const data = await response.json();
            setGowns(data.data || []);
        } catch (err) {
            setError('Failed to load gowns. Please try again.');
        } finally {
            setLoadingGowns(false);
        }
    };

    if (status === 'loading') {
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

    const gownTypes = ['PHD', 'MASTERS', 'BACHELORS', 'DIPLOMA'];

    const handleRedirect = (type: string, imageUrl: string) => {
        router.push({
            pathname: `/student/gowns/gownOpt`,
            query: { type, imageUrl }
        });
    };

    return (
        <Layout>
            <div className="min-h-screen flex flex-col items-center bg-gray-50 p-6">
                <div className="max-w-4xl w-full bg-white shadow-lg rounded-lg p-6 mb-8 text-center">
                    <h1 className="text-3xl font-bold text-[#01689c] mb-4">
                        {session.user.institution}
                    </h1>
                    <p className="mt-4 text-gray-700">
                        <span className="font-semibold">Select Your Package:</span> Choose your gown package for the graduation event on 21st March 2025. Items will be delivered to your chosen address before the event.
                    </p>
                </div>

                <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {gownTypes.map((type) => {
                        const filteredGowns = gowns.filter((gown) => gown.type === type);
                        return (
                            <div
                                key={type}
                                className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center cursor-pointer hover:shadow-xl transition-all w-full h-full"
                                onClick={() => {
                                    if (filteredGowns[0] && filteredGowns[0].images && filteredGowns[0].images[0]) {
                                        handleRedirect(type, filteredGowns[0].images[0].url);
                                    }
                                }}
                            >
                                {loadingGowns ? (
                                    <p className="text-gray-600">Loading gowns...</p>
                                ) : error ? (
                                    <p className="text-red-500">{error}</p>
                                ) : filteredGowns.length > 0 ? (
                                    <>
                                        {filteredGowns[0].images && filteredGowns[0].images[0] && (
                                            <img
                                                src={filteredGowns[0].images[0].url}
                                                alt={`${type} Gown`}
                                                className="w-full h-full object-cover rounded-lg"
                                            />
                                        )}
                                        <h3 className="text-lg font-semibold text-gray-800 mt-4">{type}</h3>
                                    </>
                                ) : (
                                    <p className="text-gray-600">No {type} gowns found.</p>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </Layout>
    );
};

export default Gowns;