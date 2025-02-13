"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Layout from "../../components/Layout";

const HeroPage = () => {
    const { data: session } = useSession();
    const [institutionName, setInstitutionName] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        if (session) {
            setInstitutionName(session.user.institutionName);
        }
    }, [session]);

    const handleRedirect = (path: string) => {
        router.push(path);
    };

    return (
        <>
            <div className="relative flex flex-col items-center justify-center min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('/images/blackGown.jpg')" }}>
                <div className="absolute inset-0 bg-black opacity-50"></div>
                <div className="relative z-10 flex flex-col items-center justify-center px-6 py-12">
                    <h1 className="text-5xl font-extrabold text-white text-center mb-4">
                        {institutionName || "Welcome"}
                    </h1>
                    {loading ? (
                        <p className="text-2xl font-medium text-gray-300 text-center mb-8">Loading institution...</p>
                    ) : error ? (
                        <p className="text-red-500 text-sm text-center mb-8">{error}</p>
                    ) : (
                        institutionName && (
                            
                            <p className="text-2xl font-medium text-gray-300 text-center mb-8">
                                Graduands for {institutionName}
                            </p>
                        )
                    )}
                    <p className="text-lg text-gray-300 text-center mb-12 max-w-3xl">
                        Explore the categories below to find graduation options tailored to your institution.
                        Click on any category to view more details.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-4xl">
                        {[
                            { title: "Gowns", description: "Rental options for graduation gowns.", image: "/images/ms-gown.png", path: "/student/gowns" },
                            { title: "Photography", description: "Capture your graduation day memories.", image: "/images/photo.jpg", path: "/student/photography" },
                        ].map((item, index) => (
                            <div key={index} className="group relative bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-transform transform hover:-translate-y-2 cursor-pointer" onClick={() => handleRedirect(item.path)}>
                                <img src={item.image} alt={item.title} className="w-full h-60 object-cover rounded-lg group-hover:scale-105 transition-transform" />
                                <h3 className="text-2xl font-bold text-gray-800 mt-4 group-hover:text-purple-600 transition">{item.title}</h3>
                                <p className="text-gray-500 mt-2">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default HeroPage;