"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Layout from "../components/Layout";

const benefits = [
    {
        title: "Best Price Guarantee",
        description: "Hire or purchase your graduation attire for just £34 for a full set. All items are made to the highest quality standards and are fully appropriate for use at your ceremony.",
        image: "/images/best.jpg",
    },
    {
        title: "Convenient Home Delivery",
        description: "All items get sent straight to your door and you can keep them for five days so you avoid the queues, save time and get photos without stressing on the day.",
        image: "/images/delivery.jpg",
    },
    {
        title: "Save The Environment",
        description: "Our gowns are manufactured from 70% recycled plastic yet look the same as any other gown. We even offset the carbon emissions from importing our stock!",
        image: "/images/asian-in-black.jpg",
    },
];

export default function HomePage() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredInstitutions, setFilteredInstitutions] = useState<{ id: number; name: string }[]>([]);
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>("");

    useEffect(() => {
        if (searchTerm.trim().length === 0) {
            setFilteredInstitutions([]);
            setIsDropdownVisible(false);
            return;
        }
        
        const fetchInstitutions = async () => {
            setIsLoading(true);
            setErrorMessage("");
            try {
                const apiUrl = process.env.NEXT_PUBLIC_POSTGREST_API_URL || "http://localhost:3000/api";
                const response = await fetch(`${apiUrl}/institutions?query=${searchTerm}`);
                const json = await response.json();
                
                if (!response.ok || json.status === "error") {
                    setErrorMessage(json.message || "No institutions found.");
                    setFilteredInstitutions([]);
                    setIsDropdownVisible(false);
                    return;
                }
                setFilteredInstitutions(json.data);
                setIsDropdownVisible(json.data.length > 0);
            } catch (error) {
                setErrorMessage("Could not fetch institutions. Please try again.");
                setFilteredInstitutions([]);
                setIsDropdownVisible(false);
            } finally {
                setIsLoading(false);
            }
        };

        const debounce = setTimeout(fetchInstitutions, 300);
        return () => clearTimeout(debounce);
    }, [searchTerm]);

    return (
        <Layout>
            <div className="relative flex flex-col md:flex-row items-center justify-center bg-cover h-[90vh] md:h-[90vh] bg-center shadow-sm overflow-hidden px-4 md:px-0" style={{ backgroundImage: "url('/images/whites-in-gowns.jpg')" }}>
                <div className="flex flex-col justify-center px-6 py-10 md:w-1/2 h-auto shadow-lg rounded-xl md:rounded-none bg-white bg-opacity-70">
                    <div className="max-w-lg mx-auto text-left">
                        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 items-center">Your Graduation Package</h1>
                        <p className="text-sm md:text-base text-gray-700 mb-6">Start by searching for your institution.</p>
                        <input
                            type="text"
                            placeholder="Type your institution name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-3 shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base"
                        />
                        {isLoading && <p className="text-blue-600 mt-2">Searching...</p>}
                        {isDropdownVisible && (
                            <ul className="mt-2 w-full bg-white text-gray-800 border border-gray-300 rounded-lg shadow-lg max-h-56 overflow-y-auto">
                                {filteredInstitutions.map((institution) => (
                                    <li
                                        key={institution.id}
                                        onClick={() => router.push(`/student/login?institution=${encodeURIComponent(institution.name)}`)}
                                        className="cursor-pointer p-3 hover:bg-gray-100 text-sm md:text-base"
                                    >
                                        {institution.name}
                                    </li>
                                ))}
                            </ul>
                        )}
                        {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
                    </div>
                </div>
            </div>
            <div className="py-10 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
                        Why Students Choose Us For Their Graduation
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {benefits.map((benefit, index) => (
                            <div key={index} className="bg-white p-6 rounded-lg shadow-lg text-center">
                                <img src={benefit.image} alt={benefit.title} className="w-20 h-20 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">{benefit.title}</h3>
                                <p className="text-gray-600">{benefit.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    );
}